import { createClient } from '@/lib/supabase/server';
import { createStripeClient } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  let priceId = process.env.STRIPE_PRICE_ID;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', siteUrl), { status: 303 });
  }

  const stripe = createStripeClient();

  if (!priceId || priceId.startsWith('price_replace')) {
    const productId = process.env.STRIPE_PRODUCT_ID;

    if (!productId || productId.startsWith('prod_your')) {
      return NextResponse.json(
        { error: 'Missing STRIPE_PRICE_ID or STRIPE_PRODUCT_ID. Add your Stripe annual access price ID or product ID to .env.local.' },
        { status: 500 },
      );
    }

    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 1,
    });

    priceId = prices.data[0]?.id;

    if (!priceId) {
      return NextResponse.json(
        { error: 'No active Stripe price found for the configured product.' },
        { status: 500 },
      );
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email || undefined,
    client_reference_id: user.id,
    metadata: {
      user_id: user.id,
      email: user.email || '',
      product: 'plainvest_premium_annual',
    },
    success_url: `${siteUrl}/dashboard?payment=success`,
    cancel_url: `${siteUrl}/dashboard?payment=cancelled`,
  });

  if (!session.url) {
    return NextResponse.json({ error: 'Stripe did not return a Checkout URL.' }, { status: 500 });
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
