import { NextResponse } from 'next/server';
import { sendNewsletterConfirmation, sendNewsletterNotification } from '@/lib/email/service';

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { email, language = 'en', page = '/' } = body;

  if (!email) {
    return NextResponse.json({ error: 'email is required.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  try {
    await Promise.all([
      sendNewsletterConfirmation(email),
      sendNewsletterNotification(email, language, page),
    ]);
  } catch (error) {
    console.error('Newsletter email error:', error);
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
