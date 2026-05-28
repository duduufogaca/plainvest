import Link from 'next/link';
import { signIn } from '../actions/auth';
import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { SubmitButton } from '../components/submit-button';
import { PasswordInput } from '../components/password-input';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Login({ searchParams }: { searchParams: Promise<{ message?: string; mode?: string }> }) {
  const params = await searchParams;
  const missingEnv = [
    ['NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL],
    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
  ].filter(([, value]) => !value).map(([name]) => name);

  if (missingEnv.length > 0) {
    return (
      <main className="setup-shell">
        <section className="setup-card">
          <p className="eyebrow">Setup needed</p>
          <h1>Member login is not connected yet.</h1>
          <p>Add these environment variables in Vercel, then redeploy the project:</p>
          <ul>
            {missingEnv.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </section>
      </main>
    );
  }

  let user = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    return (
      <main className="setup-shell">
        <section className="setup-card">
          <p className="eyebrow">Setup needed</p>
          <h1>Member login is not available right now.</h1>
          <p>Please check the Supabase environment variables in Vercel, redeploy, and try again.</p>
        </section>
      </main>
    );
  }

  if (user && params.mode !== 'manual') {
    const supabase = await createClient();
    const { isPremium } = await getPremiumAccess(supabase, user.id);
    redirect(isPremium ? '/index.html?member_session=1#member' : '/dashboard');
  }

  return (
    <main className="auth-shell--split">
      <div className="auth-split-wrap">

        {/* LEFT — login form */}
        <div className="auth-card-wrap">
          <form className="auth-card--premium" action={signIn}>
            <p className="eyebrow">Member login</p>
            <h1>Welcome back.</h1>
            <p className="muted">Log in to continue your Plainvest investing journey.</p>
            {params.message ? <div className="notice">{params.message}</div> : null}
            <label>Email<input name="email" type="email" placeholder="you@email.com" required /></label>
            <label>Password<PasswordInput name="password" minLength={6} required /></label>
            <SubmitButton pendingText="Logging in...">Return to my hub</SubmitButton>
            <div className="auth-trust-row">
              <span className="auth-trust-item">Secure account</span>
              <span className="auth-trust-item">No spam</span>
              <span className="auth-trust-item">Beginner-friendly support</span>
            </div>
            <p className="switch"><Link href="/forgot-password">Forgot password?</Link></p>
            <p className="switch">New member? <Link href="/signup">Create an account</Link></p>
          </form>
        </div>

        {/* RIGHT — welcome panel */}
        <div className="auth-welcome-panel">
          <p className="awp-label">Your progress is here</p>
          <h2 className="awp-headline">Everything you built is waiting for you.</h2>
          <ul className="awp-list">
            {[
              { icon: '📚', text: 'Your learning paths & reading progress' },
              { icon: '📊', text: 'Portfolio tracking & allocations' },
              { icon: '🔮', text: 'Simulator runs & future projections' },
              { icon: '🎯', text: 'Premium guides & Zoom support access' },
            ].map(({ icon, text }) => (
              <li key={text}>
                <span className="awp-icon">{icon}</span>
                {text}
              </li>
            ))}
          </ul>
          <div className="awp-stat">
            <div className="awp-stat-number">100%</div>
            <div className="awp-stat-label">of your data is saved and ready — pick up exactly where you left off.</div>
          </div>
        </div>

      </div>
    </main>
  );
}
