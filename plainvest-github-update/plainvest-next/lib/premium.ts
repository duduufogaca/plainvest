import type { SupabaseClient } from '@supabase/supabase-js';

type MemberAccess = {
  premium_status: string | null;
  access_expires_at: string | null;
};

export async function getPremiumAccess(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('member_access')
    .select('premium_status, access_expires_at')
    .eq('user_id', userId)
    .maybeSingle<MemberAccess>();

  if (error) {
    return { isPremium: false, access: null, error };
  }

  const expiresAt = data?.access_expires_at ? new Date(data.access_expires_at).getTime() : 0;
  const isPremium = data?.premium_status === 'active' && expiresAt > Date.now();

  return { isPremium, access: data, error: null };
}
