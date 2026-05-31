import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendNewsletterConfirmation } from '@/lib/email/service';
import { nextSendAt } from '@/lib/email/newsletter-sequence';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://members.plainvest.app';
  const SITE_URL = 'https://plainvest.app';

  if (!token) {
    return NextResponse.redirect(`${SITE_URL}?confirmed=error`);
  }

  const supabase = createAdminClient();

  const { data: subscriber, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, status')
    .eq('confirmation_token', token)
    .single();

  if (error || !subscriber) {
    return NextResponse.redirect(`${SITE_URL}?confirmed=error`);
  }

  if (subscriber.status === 'active') {
    return NextResponse.redirect(`${SITE_URL}?confirmed=already`);
  }

  await supabase
    .from('newsletter_subscribers')
    .update({
      status: 'active',
      sequence_step: 1,
      next_send_at: nextSendAt(1).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscriber.id);

  const unsubscribeUrl = `${BASE_URL}/api/newsletter-unsubscribe?id=${subscriber.id}`;

  try {
    await sendNewsletterConfirmation(subscriber.email, unsubscribeUrl);
  } catch {
    // Non-critical — subscriber is already activated
  }

  return NextResponse.redirect(`${SITE_URL}?confirmed=1`);
}
