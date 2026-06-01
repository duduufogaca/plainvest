import { createClient } from '@/lib/supabase/server';
import { createStripeClient } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').trim().replace(/\/$/, '');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login', siteUrl), { status: 303 });
  }

  const { data: access } = await supabase
    .from('member_access')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single();

  if (!access?.stripe_customer_id) {
    return NextResponse.json({ error: 'No active subscription found.' }, { status: 404 });
  }

  try {
    const stripe = createStripeClient();
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: access.stripe_customer_id,
      return_url: `${siteUrl}/dashboard`,
    });
    return NextResponse.redirect(portalSession.url, { status: 303 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not open billing portal.';
    console.error('Plainvest portal error:', message);
    return NextResponse.json({ error: 'Billing portal is not available right now. Please try again shortly.' }, { status: 500 });
  }
}
