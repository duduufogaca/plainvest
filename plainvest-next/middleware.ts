import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

type CookieToSet = {
  name: string;
  value: string;
  options?: Partial<ResponseCookie>;
};

function isMembersHost(host: string | null) {
  return (host || '').split(':')[0].toLowerCase() === 'members.plainvest.app';
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPremiumContent = pathname.startsWith('/files/premium_content/');
  const isProOnly = pathname.startsWith('/portfolio') || pathname === '/profile';

  if (!isPremiumContent && !isProOnly) {
    return NextResponse.next();
  }

  if (isPremiumContent && !isMembersHost(request.headers.get('host'))) {
    const url = new URL(request.url);
    url.protocol = 'https:';
    url.host = 'members.plainvest.app';
    return NextResponse.redirect(url);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/login?mode=manual', request.url));
  }

  const { data, error } = await supabase
    .from('member_access')
    .select('premium_status, plan, stripe_checkout_session_id, stripe_payment_intent_id')
    .eq('user_id', user.id)
    .maybeSingle<{
      premium_status: string | null;
      plan: string | null;
      stripe_checkout_session_id: string | null;
      stripe_payment_intent_id: string | null;
    }>();

  const hasStripePaymentProof = Boolean(data?.stripe_payment_intent_id || data?.stripe_checkout_session_id);
  const isActive = !error && data?.premium_status === 'active' && hasStripePaymentProof;

  // Premium content: both premium and pro plans have access
  if (isPremiumContent) {
    if (!isActive) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  // Pro-only routes: portfolio, profile
  if (isProOnly) {
    const isPro = isActive && data?.plan === 'pro';
    if (!isPro) {
      return NextResponse.redirect(new URL('/dashboard?upgrade=pro', request.url));
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: ['/files/premium_content/:path*', '/portfolio/:path*', '/profile'],
};
