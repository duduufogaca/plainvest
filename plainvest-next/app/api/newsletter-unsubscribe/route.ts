import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing subscriber ID.', { status: 400, headers: { 'Content-Type': 'text/plain' } });
  }

  const supabase = createAdminClient();

  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return new Response('Something went wrong. Please try again.', { status: 500, headers: { 'Content-Type': 'text/plain' } });
  }

  return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Unsubscribed — Plainvest</title>
  <style>
    body { margin:0; padding:0; background:#060d1a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; }
    .card { max-width:420px; text-align:center; padding:40px 32px; background:#0b1929; border-radius:20px; border:1px solid rgba(0,212,170,.1); border-top:3px solid #00d4aa; }
    h1 { margin:0 0 12px; font-size:22px; font-weight:900; color:#fff; }
    p { margin:0 0 24px; font-size:15px; color:rgba(255,255,255,.5); line-height:1.6; }
    a { display:inline-block; background:#00d4aa; color:#04120e; font-size:14px; font-weight:900; padding:12px 28px; border-radius:10px; text-decoration:none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>You've been unsubscribed.</h1>
    <p>You won't receive any more emails from Plainvest Insights. No hard feelings.</p>
    <a href="https://plainvest.app">Back to Plainvest</a>
  </div>
</body>
</html>`, {
    headers: { 'Content-Type': 'text/html' },
  });
}
