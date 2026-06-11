import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendNewsletterConfirmRequest, sendNewsletterNotification } from '@/lib/email/service';
import { nextSendAt } from '@/lib/email/newsletter-sequence';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const {
    email,
    language = 'en',
    page = '/',
    country,
    utmSource,
    website,
  } = body;

  // Honeypot: hidden "website" field — filled only by bots → silently accept.
  if (website && website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  // Rate limit: max 5 sign-ups per IP per hour.
  if (!(await checkRateLimit(`newsletter:${clientIp(request)}`, 5, 3600))) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  if (!email) {
    return NextResponse.json({ error: 'email is required.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://members.plainvest.app';

  // Save subscriber as pending (double opt-in — confirmed after email click)
  // Skip if already active — don't interrupt their drip sequence
  let confirmationToken: string | null = null;
  try {
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('status, confirmation_token')
      .eq('email', email)
      .maybeSingle();

    if (existing?.status === 'active') {
      return NextResponse.json({ ok: true });
    }

    if (existing?.status === 'pending') {
      confirmationToken = existing.confirmation_token ?? null;
    } else {
      const { data: inserted } = await supabase
        .from('newsletter_subscribers')
        .upsert({
          email,
          language,
          source_page: page,
          country: country || null,
          utm_source: utmSource || null,
          status: 'pending',
          sequence_step: 0,
          next_send_at: nextSendAt(1).toISOString(),
          subscribed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' })
        .select('confirmation_token')
        .single();
      confirmationToken = inserted?.confirmation_token ?? null;
    }
  } catch {
    // DB save is non-critical — still send the confirmation request
  }

  const confirmUrl = confirmationToken
    ? `${BASE_URL}/api/newsletter-confirm?token=${confirmationToken}`
    : `${BASE_URL}/api/newsletter-confirm`;

  try {
    await Promise.all([
      sendNewsletterConfirmRequest(email, confirmUrl),
      sendNewsletterNotification(email, language, page, { date, country, utmSource }),
    ]);
  } catch (error) {
    console.error('Newsletter email error:', error);
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
