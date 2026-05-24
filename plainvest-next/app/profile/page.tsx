import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { signOut } from '../actions/auth';
import { updateProfile, changePassword } from '../actions/profile';
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

  const { isPremium } = await getPremiumAccess(supabase, user.id);
  const meta = user.user_metadata || {};
  const fullName: string = meta.full_name || '';
  const dateOfBirth: string = meta.date_of_birth || '';
  const memberSince = new Date(user.created_at).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const backHref = isPremium ? '/index.html?member_session=1#member' : '/dashboard';

  return (
    <main className="profile-shell">
      <nav className="profile-topbar">
        <a href={backHref} className="brand">Plainvest</a>
        <div className="profile-topbar-actions">
          <a href={backHref} className="ghost-nav-link">← Back</a>
          <form action={signOut}>
            <SubmitButton className="ghost" pendingText="Logging out...">Logout</SubmitButton>
          </form>
        </div>
      </nav>

      <div className="profile-content">
        <div className="profile-header">
          <p className="eyebrow">Account settings</p>
          <h1>Your profile</h1>
        </div>

        {params.success && <div className="notice notice-success">{params.success}</div>}
        {params.message && <div className="notice">{params.message}</div>}

        <section className="profile-card">
          <p className="eyebrow">Personal info</p>
          <h2>Edit your details</h2>
          <form action={updateProfile}>
            <label>
              Full name
              <input name="full_name" type="text" defaultValue={fullName} placeholder="Your full name" autoComplete="name" />
            </label>
            <label>
              Date of birth
              <input name="date_of_birth" type="date" defaultValue={dateOfBirth} />
            </label>
            <label>
              Email address
              <input type="email" defaultValue={user.email} disabled />
              <span className="field-note">Email cannot be changed here</span>
            </label>
            <SubmitButton pendingText="Saving...">Save changes</SubmitButton>
          </form>
        </section>

        <section className="profile-card" id="security">
          <p className="eyebrow">Security</p>
          <h2>Change password</h2>
          <form action={changePassword}>
            <label>
              New password
              <PasswordInput name="password" minLength={6} required />
            </label>
            <label>
              Confirm new password
              <PasswordInput name="password_confirm" minLength={6} required />
            </label>
            <SubmitButton pendingText="Updating password...">Update password</SubmitButton>
          </form>
        </section>

        <section className="profile-card profile-account-card">
          <p className="eyebrow">Account</p>
          <h2>Member status</h2>
          <div className="profile-info-rows">
            <div className="profile-info-row">
              <span className="profile-info-label">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Member since</span>
              <span>{memberSince}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Access</span>
              <span className={isPremium ? 'badge-premium' : 'badge-free'}>
                {isPremium ? 'Premium' : 'Free'}
              </span>
            </div>
          </div>
          <form action={signOut} style={{ marginTop: '1.5rem' }}>
            <SubmitButton className="ghost-danger" pendingText="Logging out...">Sign out</SubmitButton>
          </form>
        </section>
      </div>
    </main>
  );
}
