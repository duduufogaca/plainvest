import type { SupabaseClient } from '@supabase/supabase-js';

type MemberAccess = {
  premium_status: string | null;
  access_expires_at: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
};

export async function getPremiumAccess(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('member_access')
    .select('premium_status, access_expires_at, stripe_checkout_session_id, stripe_payment_intent_id')
    .eq('user_id', userId)
    .maybeSingle<MemberAccess>();

  if (error) {
    return { isPremium: false, access: null, error };
  }

  const hasStripePaymentProof = Boolean(data?.stripe_payment_intent_id);
  const isPremium = data?.premium_status === 'active' && hasStripePaymentProof;

  return { isPremium, access: data, error: null };
}
