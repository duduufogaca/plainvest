import { createClient } from '@/lib/supabase/server';
import { getPostHogClient } from '@/lib/posthog-server';
import { sendWelcomeEmail, sendAdminNewUser } from '@/lib/email/service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const rawNext = requestUrl.searchParams.get('next') || '/dashboard';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard';
  let dest = next;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    const { data: { user } } = await supabase.auth.getUser();
    if (user && next === '/dashboard') {
      const posthog = getPostHogClient();
      posthog.identify({ distinctId: user.id, properties: { email: user.email } });
      posthog.capture({ distinctId: user.id, event: 'email_confirmed' });
      await posthog.shutdown();

      // Send the Welcome email now that the email is confirmed — once, just
      // after sign-up (created within the last 10 minutes).
      const createdAt = user.created_at ? new Date(user.created_at).getTime() : 0;
      const isFreshSignup = createdAt > 0 && (Date.now() - createdAt) < 10 * 60 * 1000;
      if (isFreshSignup) {
        // Flag the landing so the client fires the Google Ads "Sign-up" conversion once.
        dest = '/dashboard?signup=confirmed';
        if (user.email) {
          const name = user.user_metadata?.full_name || '';
          const date = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
          sendWelcomeEmail(user.email, name).catch(() => {});
          // Admin "new user" notification — only for confirmed (real) signups.
          sendAdminNewUser({ name: name || user.email, email: user.email, date }).catch(() => {});
        }
      }
    }
  }

  return NextResponse.redirect(new URL(dest, requestUrl.origin));
}
