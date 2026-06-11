import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Returns the best-effort client IP from the incoming request headers.
 * Vercel sets x-forwarded-for; the first entry is the real client.
 */
export function clientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Atomic per-key rate limit backed by Supabase (public.check_rate_limit).
 * Returns true if the request is ALLOWED, false if it should be blocked.
 * Fails open (returns true) if the limiter infra errors, so a DB hiccup never
 * blocks legitimate users.
 */
export async function checkRateLimit(key: string, max: number, windowSec: number): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_key: key,
      p_max: max,
      p_window_sec: windowSec,
    });
    if (error) return true; // fail-open
    return data === true;
  } catch {
    return true; // fail-open
  }
}
