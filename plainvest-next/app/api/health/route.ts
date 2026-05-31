import { NextRequest, NextResponse } from 'next/server';

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
  const token = request.nextUrl.searchParams.get('token');
  const secret = process.env.HEALTH_SECRET;

  if (!secret || token !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
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
