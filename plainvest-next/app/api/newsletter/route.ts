import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendNewsletterConfirmation, sendNewsletterNotification } from '@/lib/email/service';
import { nextSendAt } from '@/lib/email/newsletter-sequence';

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
  } = body;

  if (!email) {
    return NextResponse.json({ error: 'email is required.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

  // Save subscriber to DB and start sequence (upsert — re-subscribing resets the sequence)
  try {
    const supabase = createAdminClient();
    await supabase.from('newsletter_subscribers').upsert({
      email,
      language,
      source_page: page,
      country: country || null,
      utm_source: utmSource || null,
      status: 'active',
      sequence_step: 1,
      next_send_at: nextSendAt(1).toISOString(),
      subscribed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });
  } catch {
    // DB save is non-critical — still send the confirmation email
  }

  try {
    await Promise.all([
      sendNewsletterConfirmation(email),
      sendNewsletterNotification(email, language, page, { date, country, utmSource }),
    ]);
  } catch (error) {
    console.error('Newsletter email error:', error);
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
