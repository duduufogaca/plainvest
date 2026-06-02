import { NextRequest, NextResponse } from 'next/server';
import { sendRefundEmail, sendAdminRefund } from '@/lib/email/service';

// Manual refund-email trigger for refunds that happened before the
// charge.refunded webhook existed (or any refund issued outside the flow).
// Secured by HEALTH_SECRET — call with ?token=<HEALTH_SECRET>.
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const token = sp.get('token');
  const secret = process.env.HEALTH_SECRET;

  if (!secret || token !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const email = sp.get('email');
  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  const name = sp.get('name') || '';
  const product = sp.get('product') || 'Plainvest Lifetime';
  const amount = sp.get('amount') || '—';
  const transactionId = sp.get('txid') || 'manual-refund';
  const date = sp.get('date') || new Date().toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  try {
    await sendRefundEmail(email, name, { product, amount, date, transactionId });
    await sendAdminRefund({ customer: name || email, email, amount, transactionId, date });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send refund email.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sentTo: email });
}
