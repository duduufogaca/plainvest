import { createClient } from '@/lib/supabase/server';
import { createStripeClient } from '@/lib/stripe';
import { NextResponse } from 'next/server';

function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').trim().replace(/\/$/, '');
  let priceId = process.env.STRIPE_PRICE_ID?.trim();

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

  const stripe = createStripeClient();

  if (!priceId || priceId.startsWith('price_replace')) {
    const productId = process.env.STRIPE_PRODUCT_ID;

    if (!productId || productId.startsWith('prod_your')) {
      return errorResponse('Missing STRIPE_PRICE_ID or STRIPE_PRODUCT_ID. Add your Stripe one-time purchase price ID or product ID to .env.local.');
    }

    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 1,
    });

    priceId = prices.data[0]?.id;

    if (!priceId) {
      return errorResponse('No active Stripe price found for the configured product.');
    }
  }

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
      },
      success_url: `${siteUrl}/api/stripe/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/dashboard?payment=cancelled`,
    });

    if (!session.url) {
      return errorResponse('Stripe did not return a Checkout URL.');
    }

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stripe checkout failed.';
    console.error('Plainvest Stripe checkout failed:', message);
    return errorResponse(message);
  }
}
