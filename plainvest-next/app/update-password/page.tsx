import { updatePassword } from '../actions/auth';
import { SubmitButton } from '../components/submit-button';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function UpdatePassword({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams;

  return (
    <main className="auth-shell">
      <form className="auth-card" action={updatePassword}>
        <p className="eyebrow">New password</p>
        <h1>Create a new password.</h1>
        <p className="muted">Use a password you will remember, with at least 6 characters.</p>
        {params.message ? <div className="notice">{params.message}</div> : null}
        <label>New password<input name="password" type="password" minLength={6} required /></label>
        <SubmitButton pendingText="Updating password...">Update password</SubmitButton>
      </form>
    </main>
  );
}
