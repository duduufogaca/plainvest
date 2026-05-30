import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { createStripeClient } from '@/lib/stripe';
import { getPostHogClient } from '@/lib/posthog-server';
import { NextResponse } from 'next/server';

function redirectTo(path: string, request: Request) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    return redirectTo('/dashboard?payment=missing-session', request);
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirectTo('/login?message=Log in to finish activating your Premium access.', request);
  }

  try {
    const stripe = createStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const sessionUserId = session.metadata?.user_id || session.client_reference_id;

    if (sessionUserId !== user.id) {
      return redirectTo('/dashboard?payment=user-mismatch', request);
    }

    if (session.status !== 'complete') {
      return redirectTo('/dashboard?payment=incomplete', request);
    }

    if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
      return redirectTo('/dashboard?payment=unpaid', request);
    }

    let subscriptionId: string | null = null;
    let accessExpiresAt: string | null = null;

    if (session.mode === 'subscription' && typeof session.subscription === 'string') {
      subscriptionId = session.subscription;
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      accessExpiresAt = new Date(sub.current_period_end * 1000).toISOString();
    }

    const plan = session.metadata?.plan === 'pro' ? 'pro' : 'premium';
    const now = new Date();

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from('member_access').upsert({
      user_id: user.id,
      email: session.customer_email || session.metadata?.email || user.email || null,
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

    if (error) {
      console.error('Plainvest payment activation database error:', error.message);
      return redirectTo('/dashboard?payment=activation-error', request);
    }

    const posthog = getPostHogClient();
    posthog.capture({ distinctId: user.id, event: 'payment_confirmed', properties: { product: 'plainvest_premium_access', plan } });
    await posthog.shutdown();

    return redirectTo(plan === 'pro' ? '/portfolio' : '/index.html?member_session=1#member', request);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to confirm Stripe payment.';
    console.error('Plainvest Stripe confirmation failed:', message);
    return redirectTo('/dashboard?payment=confirm-error', request);
  }
}
