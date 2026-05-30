import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
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

  const cookieStore = await cookies();
  const lang            = (cookieStore.get('pv_lang')?.value || 'en') as 'en' | 'pt';
  const displayCurrency = cookieStore.get('pv_currency')?.value || 'AUD';

  return (
    <main className="portfolio-shell">
      <SidebarClient
        displayCurrency={displayCurrency}
        lang={lang}
        backHref="/home"
        portfolioHref={isPro ? '/portfolio' : undefined}
        profileLabel={lang === 'pt' ? 'Perfil' : 'Profile'}
        logoutLabel={lang === 'pt' ? 'Sair' : 'Logout'}
        userName={firstName}
        userFullName={fullName || firstName}
        plan={plan ?? 'premium'}
        homeActive
      />
      <MemberHomeClient
        firstName={firstName}
        fullName={fullName}
        plan={plan ?? 'premium'}
        isPro={isPro}
        memberSince={memberSince}
        lang={lang}
        displayCurrency={displayCurrency}
      />
    </main>
  );
}
