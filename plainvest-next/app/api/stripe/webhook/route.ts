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
  sendAdminNewProPurchase,
  sendAdminNewLifetimePurchase,
  sendAdminNewZoomBooking,
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
        sendSupportCallConfirmationEmail(scEmail, scEmail).catch(() => {});
        sendAdminNewZoomBooking({ customer: scEmail, email: scEmail }).catch(() => {});
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
    const amountTotal = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : '—';

    if (purchaseEmail) {
      if (plan === 'pro') {
        sendProWelcomeEmail(purchaseEmail, purchaseEmail).catch(() => {});
        sendPaymentReceiptEmail(purchaseEmail, purchaseEmail, { product: 'Plainvest Pro', price: amountTotal, date: purchaseDate, transactionId: paymentIntentId }).catch(() => {});
        sendAdminNewProPurchase({ customer: purchaseEmail, amount: amountTotal, transactionId: paymentIntentId, date: purchaseDate }).catch(() => {});
      } else {
        sendPremiumWelcomeEmail(purchaseEmail, purchaseEmail).catch(() => {});
        sendPaymentReceiptEmail(purchaseEmail, purchaseEmail, { product: 'Plainvest Lifetime', price: amountTotal, date: purchaseDate, transactionId: paymentIntentId }).catch(() => {});
        sendAdminNewLifetimePurchase({ customer: purchaseEmail, amount: amountTotal, transactionId: paymentIntentId, date: purchaseDate }).catch(() => {});
      }
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
        .select('email');

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      const renewEmail = rows?.[0]?.email || invoice.customer_email;
      if (renewEmail && invoice.billing_reason === 'subscription_cycle') {
        const price = invoice.amount_paid ? `$${(invoice.amount_paid / 100).toFixed(2)}` : '—';
        const nextRenewal = new Date(sub.current_period_end * 1000).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
        sendSubscriptionRenewedEmail(renewEmail, renewEmail, { price, nextRenewal }).catch(() => {});
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
        .select('email');

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      const failEmail = rows?.[0]?.email || invoice.customer_email;
      if (failEmail) sendPaymentFailedEmail(failEmail, failEmail).catch(() => {});
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
      .select('email');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const cancelEmail = rows?.[0]?.email;
    if (cancelEmail) sendSubscriptionCancelledEmail(cancelEmail, cancelEmail).catch(() => {});
  }

  return NextResponse.json({ received: true });
}
