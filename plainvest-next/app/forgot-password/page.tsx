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
    <main className="auth-shell--split">
      <div className="auth-card-wrap auth-card-wrap--reset">
        <form className="auth-card--premium" action={requestPasswordReset}>
          <p className="eyebrow">Password reset</p>
          <h1 className="auth-h1--reset">Reset your password.</h1>
          <p className="muted">Enter your member email and we&apos;ll send a secure reset link immediately.</p>
          {params.message ? <div className="notice">{params.message}</div> : null}
          <label>Email<input name="email" type="email" placeholder="you@email.com" required /></label>
          <Link href="/login?mode=manual" className="auth-back-link">&#8592; Back to login</Link>
          <SubmitButton pendingText="Sending...">Send secure reset link</SubmitButton>
          <div className="auth-trust-row">
            <span className="auth-trust-item">Secure account recovery</span>
            <span className="auth-trust-item">No spam</span>
            <span className="auth-trust-item">Beginner-friendly support</span>
          </div>
          <p className="auth-reset-reassurance">
            Your learning progress and Premium access stay safely connected to your account.
          </p>
        </form>
      </div>
    </main>
  );
}
