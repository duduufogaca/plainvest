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
    <main className="auth-shell">
      <form className="auth-card" action={signIn}>
        <p className="eyebrow">Member login</p>
        <h1>Welcome back.</h1>
        <p className="muted">Log in to continue your Plainvest Premium learning path.</p>
        {params.message ? <div className="notice">{params.message}</div> : null}
        <label>Email<input name="email" type="email" required /></label>
        <label>Password<PasswordInput name="password" minLength={6} required /></label>
        <SubmitButton pendingText="Logging in...">Login</SubmitButton>
        <p className="switch"><Link href="/forgot-password">Forgot password?</Link></p>
        <p className="switch">New member? <Link href="/signup">Create an account</Link></p>
      </form>
    </main>
  );
}
