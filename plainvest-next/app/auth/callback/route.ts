import { createClient } from '@/lib/supabase/server';
import { getPostHogClient } from '@/lib/posthog-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const rawNext = requestUrl.searchParams.get('next') || '/dashboard';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard';

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    const { data: { user } } = await supabase.auth.getUser();
    if (user && next === '/dashboard') {
      const posthog = getPostHogClient();
      posthog.identify({ distinctId: user.id, properties: { email: user.email } });
      posthog.capture({ distinctId: user.id, event: 'email_confirmed' });
      await posthog.shutdown();
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
