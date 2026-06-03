import { createAdminClient } from '@/lib/supabase/admin';
import { createStripeClient } from '@/lib/stripe';
import { getPostHogClient } from '@/lib/posthog-server';
import {
  sendSupportCallConfirmationEmail,
  sendPremiumWelcomeEmail,
  sendProWelcomeEmail,
  sendPaymentReceiptEmail,
  sendSubscriptionRenewedEmail,
  sendSubscriptionCancelledEmail,
  sendPaymentFailedEmail,
  sendRefundEmail,
  sendAdminNewProPurchase,
  sendAdminNewLifetimePurchase,
  sendAdminNewZoomBooking,
  sendAdminRefund,
} from '@/lib/email/service';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Plainvest Stripe webhook is installed. This endpoint is for Stripe POST events, so opening it in a browser is only a health check.',
  });
}

export async function POST(request: Request) {
  const stripe = createStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get('stripe-signature');

  if (!webhookSecret || webhookSecret.startsWith('whsec_replace')) {
    return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET.' }, { status: 500 });
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook payload.';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  // ── checkout.session.completed ──────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id || session.client_reference_id;
    const product = session.metadata?.product;

    if (!userId) {
      return NextResponse.json({ error: 'Checkout session missing user ID.' }, { status: 400 });
    }

    let memberName = '';
    try {
      const { data: authData } = await supabaseAdmin.auth.admin.getUserById(userId);
      memberName = authData?.user?.user_metadata?.full_name || '';
    } catch { /* name lookup is non-critical */ }

    if (product === 'plainvest_support_call') {
      const { error } = await supabaseAdmin.from('support_call_purchases').upsert({
        user_id: userId,
        email: session.customer_email || session.metadata?.email || null,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
        status: 'paid',
      }, { onConflict: 'stripe_checkout_session_id' });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      const posthogSC = getPostHogClient();
      posthogSC.capture({ distinctId: userId, event: 'support_call_purchased', properties: { product: 'plainvest_support_call' } });
      await posthogSC.shutdown();

      const scEmail = session.customer_email || session.metadata?.email;
      if (scEmail) {
        await Promise.allSettled([
          sendSupportCallConfirmationEmail(scEmail, memberName),
          sendAdminNewZoomBooking({ customer: memberName || scEmail, email: scEmail }),
        ]);
      }

      return NextResponse.json({ received: true });
    }

    // For subscriptions, get the period end from the subscription object
    let subscriptionId: string | null = null;
    let accessExpiresAt: string | null = null;

    if (session.mode === 'subscription' && typeof session.subscription === 'string') {
      subscriptionId = session.subscription;
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      accessExpiresAt = new Date(sub.current_period_end * 1000).toISOString();
    }

    const now = new Date();

    const plan = session.metadata?.plan === 'pro' ? 'pro' : 'premium';

    const { error } = await supabaseAdmin.from('member_access').upsert({
      user_id: userId,
      email: session.customer_email || session.metadata?.email || null,
      premium_status: 'active',
      plan,
      access_started_at: now.toISOString(),
      access_expires_at: accessExpiresAt,
      stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
      stripe_subscription_id: subscriptionId,
      updated_at: now.toISOString(),
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const posthog = getPostHogClient();
    posthog.capture({ distinctId: userId, event: 'premium_access_activated', properties: { product: 'plainvest_premium_access', mode: session.mode } });
    await posthog.shutdown();

    const purchaseEmail = session.customer_email || session.metadata?.email;
    const purchaseDate = now.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.id;
    const curr = (session.currency || 'aud').toUpperCase();
    const amountTotal = session.amount_total ? `${curr} $${(session.amount_total / 100).toFixed(2)}` : '—';

    if (purchaseEmail) {
      // Await all sends — on serverless the function freezes after the
      // response returns, which would kill any fire-and-forget emails.
      const product = plan === 'pro' ? 'Plainvest Pro' : 'Plainvest Lifetime';
      await Promise.allSettled([
        plan === 'pro'
          ? sendProWelcomeEmail(purchaseEmail, memberName)
          : sendPremiumWelcomeEmail(purchaseEmail, memberName),
        sendPaymentReceiptEmail(purchaseEmail, memberName, { product, price: amountTotal, date: purchaseDate, transactionId: paymentIntentId }),
        plan === 'pro'
          ? sendAdminNewProPurchase({ customer: memberName || purchaseEmail, amount: amountTotal, transactionId: paymentIntentId, date: purchaseDate })
          : sendAdminNewLifetimePurchase({ customer: memberName || purchaseEmail, amount: amountTotal, transactionId: paymentIntentId, date: purchaseDate }),
      ]);
    }
  }

  // ── invoice.paid — subscription renewed ────────────────────────────────────
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : null;

    if (subscriptionId) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const accessExpiresAt = new Date(sub.current_period_end * 1000).toISOString();

      const { data: rows, error } = await supabaseAdmin
        .from('member_access')
        .update({ premium_status: 'active', access_expires_at: accessExpiresAt, updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', subscriptionId)
        .select('email, user_id');

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      const renewEmail = rows?.[0]?.email || invoice.customer_email;
      if (renewEmail && invoice.billing_reason === 'subscription_cycle') {
        let renewName = '';
        try {
          const renewUserId = rows?.[0]?.user_id;
          if (renewUserId) {
            const { data: authData } = await supabaseAdmin.auth.admin.getUserById(renewUserId);
            renewName = authData?.user?.user_metadata?.full_name || '';
          }
        } catch { /* non-critical */ }
        const price = invoice.amount_paid ? `${(invoice.currency || 'aud').toUpperCase()} $${(invoice.amount_paid / 100).toFixed(2)}` : '—';
        const nextRenewal = new Date(sub.current_period_end * 1000).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
        await sendSubscriptionRenewedEmail(renewEmail, renewName, { price, nextRenewal }).catch(() => {});
      }
    }
  }

  // ── invoice.payment_failed ──────────────────────────────────────────────────
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : null;

    if (subscriptionId) {
      const { data: rows, error } = await supabaseAdmin
        .from('member_access')
        .update({ premium_status: 'past_due', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', subscriptionId)
        .select('email, user_id');

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      const failEmail = rows?.[0]?.email || invoice.customer_email;
      if (failEmail) {
        let failName = '';
        try {
          const failUserId = rows?.[0]?.user_id;
          if (failUserId) {
            const { data: authData } = await supabaseAdmin.auth.admin.getUserById(failUserId);
            failName = authData?.user?.user_metadata?.full_name || '';
          }
        } catch { /* non-critical */ }
        await sendPaymentFailedEmail(failEmail, failName).catch(() => {});
      }
    }
  }

  // ── customer.subscription.updated ──────────────────────────────────────────
  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription;
    const status = sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : 'inactive';
    const accessExpiresAt = new Date(sub.current_period_end * 1000).toISOString();

    const { error } = await supabaseAdmin
      .from('member_access')
      .update({ premium_status: status, access_expires_at: accessExpiresAt, updated_at: new Date().toISOString() })
      .eq('stripe_subscription_id', sub.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // ── customer.subscription.deleted — cancelled / expired ────────────────────
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription;

    const { data: rows, error } = await supabaseAdmin
      .from('member_access')
      .update({
        premium_status: 'cancelled',
        access_expires_at: new Date(sub.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', sub.id)
      .select('email, user_id');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const cancelEmail = rows?.[0]?.email;
    if (cancelEmail) {
      let cancelName = '';
      try {
        const cancelUserId = rows?.[0]?.user_id;
        if (cancelUserId) {
          const { data: authData } = await supabaseAdmin.auth.admin.getUserById(cancelUserId);
          cancelName = authData?.user?.user_metadata?.full_name || '';
        }
      } catch { /* non-critical */ }
      await sendSubscriptionCancelledEmail(cancelEmail, cancelName).catch(() => {});
    }
  }

  // ── charge.refunded — refund issued, revoke access + notify ────────────────
  if (event.type === 'charge.refunded') {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
    const customerId = typeof charge.customer === 'string' ? charge.customer : null;

    // Locate the member: prefer payment intent, fall back to customer ID
    let query = supabaseAdmin.from('member_access').select('email, user_id, plan');
    query = paymentIntentId
      ? query.eq('stripe_payment_intent_id', paymentIntentId)
      : query.eq('stripe_customer_id', customerId ?? '__none__');

    const { data: rows } = await query;
    const member = rows?.[0];

    // Revoke access
    if (member) {
      await supabaseAdmin
        .from('member_access')
        .update({ premium_status: 'refunded', updated_at: new Date().toISOString() })
        .eq('user_id', member.user_id);
    }

    const refundEmail = member?.email || charge.billing_details?.email || charge.receipt_email;
    if (refundEmail) {
      let refundName = '';
      try {
        if (member?.user_id) {
          const { data: authData } = await supabaseAdmin.auth.admin.getUserById(member.user_id);
          refundName = authData?.user?.user_metadata?.full_name || '';
        }
      } catch { /* non-critical */ }

      const refundDate = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
      const amount = charge.amount_refunded
        ? `${charge.currency.toUpperCase()} $${(charge.amount_refunded / 100).toFixed(2)}`
        : '—';
      const product = member?.plan === 'pro' ? 'Plainvest Pro' : 'Plainvest Lifetime';
      const txId = paymentIntentId || charge.id;

      await Promise.allSettled([
        sendRefundEmail(refundEmail, refundName, { product, amount, date: refundDate, transactionId: txId }),
        sendAdminRefund({ customer: refundName || refundEmail, email: refundEmail, amount, transactionId: txId, date: refundDate }),
      ]);
    }

    const posthogRefund = getPostHogClient();
    if (member?.user_id) {
      posthogRefund.capture({ distinctId: member.user_id, event: 'refund_processed', properties: { plan: member.plan } });
    }
    await posthogRefund.shutdown();
  }

  return NextResponse.json({ received: true });
}
