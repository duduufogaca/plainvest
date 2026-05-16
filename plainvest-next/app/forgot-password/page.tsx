import Link from 'next/link';
import { requestPasswordReset } from '../actions/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ForgotPassword({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams;

  return (
    <main className="auth-shell">
      <form className="auth-card" action={requestPasswordReset}>
        <p className="eyebrow">Password reset</p>
        <h1>Reset your password.</h1>
        <p className="muted">Enter your member email and we will send a secure reset link.</p>
        {params.message ? <div className="notice">{params.message}</div> : null}
        <label>Email<input name="email" type="email" required /></label>
        <button type="submit">Send reset link</button>
        <p className="switch">Remembered it? <Link href="/login?mode=manual">Login</Link></p>
      </form>
    </main>
  );
}
