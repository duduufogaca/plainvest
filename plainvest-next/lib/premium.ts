import type { SupabaseClient } from '@supabase/supabase-js';

type MemberAccess = {
  premium_status: string | null;
  plan: string | null;
  access_expires_at: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
};

export async function getPremiumAccess(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('member_access')
    .select('premium_status, plan, access_expires_at, stripe_checkout_session_id, stripe_payment_intent_id, stripe_subscription_id')
    .eq('user_id', userId)
    .maybeSingle<MemberAccess>();

  if (error) {
    return { hasGuideAccess: false, isPro: false, plan: null, access: null, error };
  }

  const hasStripePaymentProof = Boolean(
    data?.stripe_payment_intent_id || data?.stripe_checkout_session_id || data?.stripe_subscription_id,
  );
  const notExpired = !data?.access_expires_at || new Date(data.access_expires_at) > new Date();
  const isActive = data?.premium_status === 'active' && hasStripePaymentProof && notExpired;
  const plan = data?.plan ?? null;

  // hasGuideAccess: both premium and pro can read guides
  const hasGuideAccess = isActive;
  // isPro: only pro plan gets dashboard (portfolio, profile, etc.)
  const isPro = isActive && plan === 'pro';

  // legacy alias so existing callers don't break
  const isPremium = hasGuideAccess;

  return { hasGuideAccess, isPro, isPremium, plan, access: data, error: null };
}
