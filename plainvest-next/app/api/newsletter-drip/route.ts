import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendSequenceStep, SEQUENCE_LENGTH, nextSendAt, NEWSLETTER_SEQUENCE } from '@/lib/email/newsletter-sequence';

// Called daily by Vercel Cron at 9am UTC.
// Finds subscribers whose next_send_at has passed and sends their next sequence email.

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: subscribers, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, sequence_step')
    .eq('status', 'active')
    .lte('next_send_at', new Date().toISOString())
    .gte('sequence_step', 1)
    .lte('sequence_step', SEQUENCE_LENGTH);

  if (error) {
    console.error('Newsletter drip query error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
    try {
      await sendSequenceStep(subscriber.email, subscriber.sequence_step, subscriber.id);

      const currentStep = NEWSLETTER_SEQUENCE[subscriber.sequence_step];
      const isLastStep = !currentStep || currentStep.delayDays === null;
      const nextStep = subscriber.sequence_step + 1;

      await supabase
        .from('newsletter_subscribers')
        .update({
          sequence_step: isLastStep ? SEQUENCE_LENGTH + 1 : nextStep,
          next_send_at: isLastStep ? null : nextSendAt(currentStep!.delayDays!).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriber.id);

      sent++;
    } catch (err) {
      console.error(`Failed to send step ${subscriber.sequence_step} to ${subscriber.email}:`, err);
      failed++;
    }
  }

  return NextResponse.json({ ok: true, sent, failed });
}
