import Link from 'next/link';
import { requestPasswordReset } from '../actions/auth';
import { SubmitButton } from '../components/submit-button';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

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
        <SubmitButton pendingText="Sending link...">Send reset link</SubmitButton>
        <p className="switch">Remembered it? <Link href="/login?mode=manual">Login</Link></p>
      </form>
    </main>
  );
}
