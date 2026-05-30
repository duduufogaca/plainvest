import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { SidebarClient } from '../portfolio/components/SidebarClient';
import { AccountCenterClient } from './components/AccountCenterClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Account — Plainvest', robots: { index: false, follow: false } };

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; success?: string }>;
}) {
  const params = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { isPremium, isPro, plan } = await getPremiumAccess(supabase, user.id);
  const meta = user.user_metadata || {};
  const fullName: string = meta.full_name || '';
  const firstName = fullName.split(' ')[0] || user.email?.split('@')[0] || '';
  const dateOfBirth: string = meta.date_of_birth || '';
  const gender: string = meta.gender || '';
  const initial = firstName ? firstName[0].toUpperCase() : (user.email?.[0].toUpperCase() ?? '?');

  const cookieStore = await cookies();
  const lang            = (cookieStore.get('pv_lang')?.value || 'en') as 'en' | 'pt';
  const displayCurrency = cookieStore.get('pv_currency')?.value || 'AUD';

  const joinDate = user.created_at;
  const memberSince = new Date(user.created_at).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const memberSinceShort = new Date(user.created_at).toLocaleDateString('en-AU', {
    month: 'long', year: 'numeric',
  });

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
        profileActive
      />
      <AccountCenterClient
        firstName={firstName}
        fullName={fullName}
        email={user.email ?? ''}
        joinDate={joinDate}
        memberSince={memberSince}
        memberSinceShort={memberSinceShort}
        dateOfBirth={dateOfBirth}
        gender={gender}
        isPro={isPro}
        isPremium={isPremium}
        plan={plan ?? 'premium'}
        initial={initial}
        savedLang={lang}
        savedCurrency={displayCurrency as 'AUD' | 'USD' | 'BRL'}
        message={params.message}
        success={params.success}
      />
    </main>
  );
}
