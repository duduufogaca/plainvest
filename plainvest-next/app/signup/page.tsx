import Link from 'next/link';
import { signUp } from '../actions/auth';
import { SubmitButton } from '../components/submit-button';
import { PasswordInput } from '../components/password-input';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function SignUp({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams;
  return (
    <main className="auth-shell--split">
      <div className="auth-split-wrap">

        {/* LEFT — signup form */}
        <div className="auth-card-wrap">
          <form className="auth-card--premium" action={signUp}>
            <div className="auth-step">
              <span className="auth-step-pill">Step 1 of 3</span>
              <div className="auth-step-line" />
              <div className="auth-step-dots">
                <span className="auth-step-dot active" />
                <span className="auth-step-dot" />
                <span className="auth-step-dot" />
              </div>
            </div>
            <p className="eyebrow">Create account</p>
            <h1>Start building your investing confidence.</h1>
            <p className="muted">Your account keeps your guides, simulator progress, and Premium access in one place.</p>
            {params.message ? <div className="notice">{params.message}</div> : null}
            <label>Email<input name="email" type="email" placeholder="you@email.com" required /></label>
            <label>Password<PasswordInput name="password" minLength={6} required /></label>
            <SubmitButton pendingText="Creating account...">Start my investing path</SubmitButton>
            <p className="auth-next-hint">Most members start with the simulator and beginner roadmap.</p>
            <div className="auth-trust-row">
              <span className="auth-trust-item">Secure account</span>
              <span className="auth-trust-item">No spam</span>
              <span className="auth-trust-item">Beginner-friendly support</span>
            </div>
            <p className="switch">Already have an account? <Link href="/login?mode=manual">Log in</Link></p>
          </form>
        </div>

        {/* RIGHT — value panel */}
        <div className="auth-value-panel">
          <p className="avp-label">What you unlock</p>
          <h2 className="avp-headline">Everything in one calm investing hub.</h2>
          <ul className="avp-list">
            {[
              'Beginner investing roadmap',
              'ETF, Bitcoin & DCA learning paths',
              'Long-term simulator tools',
              'Portfolio tracking',
              'Included Zoom support call',
            ].map((item) => (
              <li key={item}>
                <span className="avp-check">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="avp-reassurance">
            Built for people starting from zero — no jargon, no hype, no pressure.
          </div>
          <p className="avp-note">
            Designed to help first-time investors feel calm, clear, and confident.
          </p>
        </div>

      </div>
    </main>
  );
}
