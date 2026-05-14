import Link from 'next/link';
import { signUp } from '../actions/auth';

export default async function SignUp({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams;
  return (
    <main className="auth-shell">
      <form className="auth-card" action={signUp}>
        <p className="eyebrow">Create account</p>
        <h1>Start your member access.</h1>
        <p className="muted">Use the same email you will use for your Plainvest Premium purchase.</p>
        {params.message ? <div className="notice">{params.message}</div> : null}
        <label>Email<input name="email" type="email" required /></label>
        <label>Password<input name="password" type="password" minLength={6} required /></label>
        <button type="submit">Create account</button>
        <p className="switch">Already have an account? <Link href="/login">Login</Link></p>
      </form>
    </main>
  );
}
