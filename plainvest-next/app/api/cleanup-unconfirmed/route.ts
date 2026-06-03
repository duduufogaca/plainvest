import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Called daily by Vercel Cron. Deletes accounts that signed up but never
// confirmed their email and are older than CONFIRM_GRACE_DAYS — abandoned /
// typo signups that never became real users. Confirmed accounts (paid or
// unpaid leads) are never touched.

const CONFIRM_GRACE_DAYS = 7;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const cutoff = Date.now() - CONFIRM_GRACE_DAYS * 24 * 60 * 60 * 1000;

  let deleted = 0;
  let scanned = 0;
  let page = 1;
  const perPage = 1000;

  try {
    // Iterate every page of users
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      const users = data?.users ?? [];
      if (users.length === 0) break;

      for (const u of users) {
        scanned++;
        const confirmed = Boolean(u.email_confirmed_at);
        const created = u.created_at ? new Date(u.created_at).getTime() : Date.now();
        if (!confirmed && created < cutoff) {
          const { error: delErr } = await supabase.auth.admin.deleteUser(u.id);
          if (!delErr) deleted++;
        }
      }

      if (users.length < perPage) break;
      page++;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Cleanup failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, scanned, deleted, graceDays: CONFIRM_GRACE_DAYS });
}
