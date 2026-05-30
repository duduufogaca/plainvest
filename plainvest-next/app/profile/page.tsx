import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { updateProfile, changePassword } from '../actions/profile';
import { signOut } from '../actions/auth';
import { SidebarClient } from '../portfolio/components/SidebarClient';
import { SubmitButton } from '../components/submit-button';
import { PasswordInput } from '../components/password-input';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Profile — Plainvest', robots: { index: false, follow: false } };

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
  const memberSince = new Date(user.created_at).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const initial = firstName ? firstName[0].toUpperCase() : (user.email?.[0].toUpperCase() ?? '?');

  const hubHref = isPremium ? '/index.html?member_session=1#member' : '/dashboard';
  const portfolioHref = isPremium ? '/portfolio' : undefined;

  return (
    <main className="portfolio-shell">
      <SidebarClient
        displayCurrency="AUD"
        lang="en"
        backHref={hubHref}
        portfolioHref={portfolioHref}
        profileLabel="Profile"
        logoutLabel="Logout"
        userName={firstName}
        plan={plan ?? 'premium'}
        profileActive
      />

      <div className="portfolio-main profile-main">

        {/* Profile hero banner */}
        <div className="profile-hero">
          <div className="profile-hero-avatar">{initial}</div>
          <div className="profile-hero-info">
            <p className="profile-hero-eyebrow">Account</p>
            <h1 className="profile-hero-name">{fullName || firstName || user.email}</h1>
            <div className="profile-hero-meta">
              <span className={`profile-hero-badge${isPro ? ' badge-pro' : isPremium ? ' badge-premium' : ''}`}>
                {isPro ? '◈ Pro' : isPremium ? '◈ Premium' : 'Free'}
              </span>
              <span className="profile-hero-sep">·</span>
              <span>Member since {memberSince}</span>
            </div>
          </div>
        </div>

        <div className="profile-body">
          {params.success && <div className="notice notice-success">{params.success}</div>}
          {params.message && <div className="notice">{params.message}</div>}

          {/* Personal info */}
          <section className="portfolio-card profile-card-dark">
            <p className="eyebrow">Personal info</p>
            <h2>Edit your details</h2>
            <form action={updateProfile} className="profile-form">
              <label className="profile-label">
                Full name
                <input name="full_name" type="text" defaultValue={fullName}
                  placeholder="Your full name" autoComplete="name" className="profile-input" />
              </label>
              <div className="profile-form-row">
                <label className="profile-label">
                  Date of birth
                  <input name="date_of_birth" type="date" defaultValue={dateOfBirth} className="profile-input" />
                </label>
                <label className="profile-label">
                  Gender
                  <select name="gender" defaultValue={gender} className="profile-input profile-select">
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </label>
              </div>
              <label className="profile-label">
                Email address
                <input type="email" defaultValue={user.email} disabled className="profile-input profile-input-disabled" />
                <span className="profile-field-note">Email cannot be changed here</span>
              </label>
              <SubmitButton pendingText="Saving…" className="profile-save-btn">Save changes</SubmitButton>
            </form>
          </section>

          {/* Security */}
          <section className="portfolio-card profile-card-dark" id="security">
            <p className="eyebrow">Security</p>
            <h2>Change password</h2>
            <form action={changePassword} className="profile-form">
              <label className="profile-label">
                New password
                <PasswordInput name="password" minLength={6} required />
              </label>
              <label className="profile-label">
                Confirm new password
                <PasswordInput name="password_confirm" minLength={6} required />
              </label>
              <SubmitButton pendingText="Updating…" className="profile-save-btn">Update password</SubmitButton>
            </form>
          </section>

          {/* Account */}
          <section className="portfolio-card profile-card-dark profile-account-section">
            <p className="eyebrow">Account</p>
            <h2>Member status</h2>
            <div className="profile-info-rows">
              <div className="profile-info-row">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-val">{user.email}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Member since</span>
                <span className="profile-info-val">{memberSince}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Access level</span>
                <span className={isPro ? 'badge-pro' : isPremium ? 'badge-premium' : 'badge-free'}>
                  {isPro ? '◈ Pro' : isPremium ? '◈ Premium' : 'Free'}
                </span>
              </div>
            </div>
            <form action={signOut} style={{ marginTop: '1.75rem' }}>
              <SubmitButton className="profile-danger-btn" pendingText="Logging out…">Sign out</SubmitButton>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
