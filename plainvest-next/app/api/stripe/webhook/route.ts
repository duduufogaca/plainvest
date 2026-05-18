import { createAdminClient } from '@/lib/supabase/admin';
import { createStripeClient } from '@/lib/stripe';
import { getPostHogClient } from '@/lib/posthog-server';
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id || session.client_reference_id;
    const product = session.metadata?.product;

    if (!userId) {
      return NextResponse.json({ error: 'Checkout session missing user ID.' }, { status: 400 });
    }

    if (product === 'plainvest_support_call') {
      const supabaseAdmin = createAdminClient();
      const { error } = await supabaseAdmin.from('support_call_purchases').upsert({
        user_id: userId,
        email: session.customer_email || session.metadata?.email || null,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
        status: 'paid',
      }, {
        onConflict: 'stripe_checkout_session_id',
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const posthogSC = getPostHogClient();
      posthogSC.capture({ distinctId: userId, event: 'support_call_purchased', properties: { product: 'plainvest_support_call' } });
      await posthogSC.shutdown();

      return NextResponse.json({ received: true });
    }

    const now = new Date();

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from('member_access').upsert({
      user_id: userId,
      email: session.customer_email || session.metadata?.email || null,
      premium_status: 'active',
      access_started_at: now.toISOString(),
      access_expires_at: null,
      stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
      updated_at: now.toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const posthog = getPostHogClient();
    posthog.capture({ distinctId: userId, event: 'premium_access_activated', properties: { product: 'plainvest_premium_access' } });
    await posthog.shutdown();
  }

  return NextResponse.json({ received: true });
}
