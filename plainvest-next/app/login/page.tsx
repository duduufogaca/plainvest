import Link from 'next/link';
import { signIn } from '../actions/auth';
import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';

export default async function Login({ searchParams }: { searchParams: Promise<{ message?: string; mode?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user && params.mode !== 'manual') {
    const { isPremium } = await getPremiumAccess(supabase, user.id);
    redirect(isPremium ? '/index.html#member' : '/dashboard');
  }

  return (
    <main className="auth-shell">
      <form className="auth-card" action={signIn}>
        <p className="eyebrow">Member login</p>
        <h1>Welcome back.</h1>
        <p className="muted">Log in to continue your Plainvest Premium learning path.</p>
        {params.message ? <div className="notice">{params.message}</div> : null}
        <label>Email<input name="email" type="email" required /></label>
        <label>Password<input name="password" type="password" minLength={6} required /></label>
        <button type="submit">Login</button>
        <p className="switch">New member? <Link href="/signup">Create an account</Link></p>
      </form>
    </main>
  );
}
