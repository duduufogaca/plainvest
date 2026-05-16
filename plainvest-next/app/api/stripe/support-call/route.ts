import { createClient } from '@/lib/supabase/server';
import { createStripeClient } from '@/lib/stripe';
import { NextResponse } from 'next/server';

function errorResponse(message: string, status = 500) {
  console.error('Plainvest support call checkout error:', message);
  return NextResponse.json({ error: 'Support call checkout is not available right now. Please try again shortly.' }, { status });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Plainvest support-call checkout route is installed. Use the dashboard button to POST here and open Stripe Checkout.',
    needs: 'STRIPE_SUPPORT_CALL_PRICE_ID must be set before checkout can open.',
  });
}

export async function POST() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').trim().replace(/\/$/, '');
  const priceId = process.env.STRIPE_SUPPORT_CALL_PRICE_ID;

  try {
    new URL(siteUrl);
  } catch {
    return errorResponse('NEXT_PUBLIC_SITE_URL is not valid. Use https://members.plainvest.app with no spaces or line breaks.');
  }

  if (!priceId || priceId.startsWith('price_replace')) {
    return errorResponse('Missing STRIPE_SUPPORT_CALL_PRICE_ID. Create the AUD $39.90 support call price in Stripe and add its price_ ID to .env.local.');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', siteUrl), { status: 303 });
  }

  try {
    const stripe = createStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email || undefined,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        email: user.email || '',
        product: 'plainvest_support_call',
      },
      success_url: `${siteUrl}/index.html#member`,
      cancel_url: `${siteUrl}/index.html#member`,
    });

    if (!session.url) {
      return errorResponse('Stripe did not return a Checkout URL.');
    }

    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stripe support call checkout failed.';
    return errorResponse(message);
  }
}
