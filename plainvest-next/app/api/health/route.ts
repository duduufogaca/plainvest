import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const REQUIRED_ENV = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PREMIUM_PRICE_ID',
  'STRIPE_PRO_PRICE_ID',
  'STRIPE_SUPPORT_CALL_PRICE_ID',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_SITE_URL',
];

export async function GET(request: NextRequest) {
  // Trim to tolerate stray spaces/newlines from copy-paste in either place.
  const token = (request.nextUrl.searchParams.get('token') || '').trim();
  const secret = (process.env.HEALTH_SECRET || '').trim();

  if (!secret) {
    // Variable missing on THIS deployment → wrong project/env, or not redeployed yet.
    return NextResponse.json(
      { ok: false, reason: 'HEALTH_SECRET is not set on this deployment' },
      { status: 401 },
    );
  }
  if (token !== secret) {
    // Secret exists but the ?token= value differs (typo / whitespace / wrong value).
    return NextResponse.json(
      { ok: false, reason: 'token does not match HEALTH_SECRET' },
      { status: 401 },
    );
  }

  const env = Object.fromEntries(
    REQUIRED_ENV.map((name) => [name, Boolean(process.env[name])]),
  );

  return NextResponse.json({
    ok: true,
    env,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
  });
}
