import { NextResponse } from 'next/server';
import { sendContactNotification, sendContactConfirmation } from '@/lib/email/service';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { name, email, message, topic, company, website, language = 'en', page = '/', formType = 'Contact form' } = body;

  // Honeypot: the hidden "website" field is invisible to humans. If it's filled,
  // silently accept (so the bot believes it worked) but send nothing.
  if (website && website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  // Rate limit: max 5 submissions per IP per hour.
  if (!(await checkRateLimit(`contact:${clientIp(request)}`, 5, 3600))) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'name, email, and message are required.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  try {
    await Promise.all([
      sendContactNotification({ formType, name, email, topic, company, message, language, page }),
      sendContactConfirmation(email, name),
    ]);
  } catch (error) {
    console.error('Contact email error:', error);
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
