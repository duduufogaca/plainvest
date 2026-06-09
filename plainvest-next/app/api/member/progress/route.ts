import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' };

type Progress = {
  read_guides: string[];
  starred: string[];
  last_guide: string | null;
  sim_run: boolean;
  projection_run: boolean;
  portfolio_added: boolean;
};

const EMPTY: Progress = {
  read_guides: [], starred: [], last_guide: null,
  sim_run: false, projection_run: false, portfolio_added: false,
};

function cleanStrings(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.length > 0) : [];
}
function union(a: string[] = [], b: string[] = []): string[] {
  return Array.from(new Set([...a, ...b]));
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, ...EMPTY }, { status: 200, headers: NO_STORE });
  }
  const { data } = await supabase
    .from('member_progress')
    .select('read_guides, starred, last_guide, sim_run, projection_run, portfolio_added')
    .eq('user_id', user.id)
    .maybeSingle();
  return NextResponse.json({ authenticated: true, ...EMPTY, ...(data ?? {}) }, { headers: NO_STORE });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401, headers: NO_STORE });
  }

  const body = await req.json().catch(() => ({} as Record<string, unknown>));

  const { data: existing } = await supabase
    .from('member_progress')
    .select('read_guides, starred, last_guide, sim_run, projection_run, portfolio_added')
    .eq('user_id', user.id)
    .maybeSingle();
  const cur: Progress = { ...EMPTY, ...(existing ?? {}) };

  const bool = (k: keyof Progress) => (typeof body[k] === 'boolean' ? (body[k] as boolean) : (cur[k] as boolean));

  const merged: Progress & { user_id: string; updated_at: string } = {
    user_id: user.id,
    read_guides: union(cur.read_guides, cleanStrings(body.read_guides)),
    starred: 'starred' in body ? cleanStrings(body.starred) : cur.starred,  // stars are a full set (toggle on/off)
    last_guide: typeof body.last_guide === 'string' ? body.last_guide : cur.last_guide,
    sim_run: bool('sim_run'),
    projection_run: bool('projection_run'),
    portfolio_added: bool('portfolio_added'),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('member_progress').upsert(merged, { onConflict: 'user_id' });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500, headers: NO_STORE });
  }
  return NextResponse.json({ ok: true, ...merged }, { headers: NO_STORE });
}
