import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { SidebarClient } from '../portfolio/components/SidebarClient';
import { MemberHomeClient } from './components/MemberHomeClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = {
  title: 'Home — Plainvest',
  robots: { index: false, follow: false },
};

export default async function MemberHomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { isPremium, isPro, plan } = await getPremiumAccess(supabase, user.id);
  if (!isPremium) redirect('/dashboard');

  const meta = user.user_metadata || {};
  const fullName: string = meta.full_name || '';
  const firstName = fullName.split(' ')[0] || user.email?.split('@')[0] || '';
  const memberSince = new Date(user.created_at).toLocaleDateString('en-AU', {
    month: 'long', year: 'numeric',
  });

  return (
    <main className="portfolio-shell">
      <SidebarClient
        displayCurrency="AUD"
        lang="en"
        backHref="/home"
        portfolioHref={isPro ? '/portfolio' : undefined}
        profileLabel="Profile"
        logoutLabel="Logout"
        userName={firstName}
        plan={plan ?? 'premium'}
        homeActive
      />
      <MemberHomeClient
        firstName={firstName}
        plan={plan ?? 'premium'}
        isPro={isPro}
        memberSince={memberSince}
      />
    </main>
  );
}
