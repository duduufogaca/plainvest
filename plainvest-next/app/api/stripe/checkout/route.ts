import { createClient } from '@/lib/supabase/server';
import { createStripeClient } from '@/lib/stripe';
import { getPostHogClient } from '@/lib/posthog-server';
import { NextResponse } from 'next/server';

function errorResponse(message: string, status = 500) {
  console.error('Plainvest checkout error:', message);
  return NextResponse.json({ error: 'Checkout is not available right now. Please try again shortly.' }, { status });
}

export async function POST(request: Request) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').trim().replace(/\/$/, '');

  try {
    new URL(siteUrl);
  } catch {
    return errorResponse('NEXT_PUBLIC_SITE_URL is not valid. Use https://members.plainvest.app with no spaces or line breaks.');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', siteUrl), { status: 303 });
  }

  // Determine which plan was selected from the form body
  const body = await request.formData().catch(() => new FormData());
  const planParam = (body.get('plan') as string | null) ?? 'premium';
  const plan = planParam === 'pro' ? 'pro' : 'premium';

  const priceId = plan === 'pro'
    ? process.env.STRIPE_PRO_PRICE_ID?.trim()
    : process.env.STRIPE_PREMIUM_PRICE_ID?.trim();

  if (!priceId || priceId.startsWith('price_replace')) {
    return errorResponse(`Missing Stripe price ID for the ${plan} plan. Add STRIPE_${plan.toUpperCase()}_PRICE_ID to your environment variables.`);
  }

  const stripe = createStripeClient();

  try {
    const price = await stripe.prices.retrieve(priceId);
    const mode = price.recurring ? 'subscription' : 'payment';

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email || undefined,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        email: user.email || '',
        product: 'plainvest_premium_access',
        plan,
      },
      success_url: `${siteUrl}/api/stripe/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/dashboard?payment=cancelled`,
    });

    if (!session.url) {
      return errorResponse('Stripe did not return a Checkout URL.');
    }

    const posthog = getPostHogClient();
    posthog.capture({ distinctId: user.id, event: 'checkout_started', properties: { product: 'plainvest_premium_access', plan, mode } });
    await posthog.shutdown();

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stripe checkout failed.';
    console.error('Plainvest Stripe checkout failed:', message);
    return errorResponse(message);
  }
}
