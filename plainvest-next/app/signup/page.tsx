import Link from 'next/link';
import { signUp } from '../actions/auth';
import { SubmitButton } from '../components/submit-button';
import { PasswordInput } from '../components/password-input';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

const UNLOCKS = [
  '19 structured investment guides',
  'DCA method & investment paths',
  'Chart reading & research tools',
  'Portfolio tracker & simulator',
  'One included Zoom support call',
];

const STEPS = [
  { n: '1', title: 'Create your account', body: 'Takes 30 seconds. Confirm your email to activate.' },
  { n: '2', title: 'Choose your plan', body: 'Premium (one-time) or Pro (monthly). Both built for beginners.' },
  { n: '3', title: 'Open your first guide', body: 'Start the Investment Paths Guide and build real clarity.' },
];

export default async function SignUp({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const params = await searchParams;

  return (
    <main className="auth-shell--split">
      <div className="auth-split-wrap">

        {/* LEFT — signup form */}
        <div className="auth-card-wrap">
          <form className="auth-card--premium login-fade-in" action={signUp}>

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
            <p className="muted">Your account keeps your guides, progress, and membership access in one place — always available when you come back.</p>

            {params.message && <div className="notice">{params.message}</div>}

            <label>Email<input name="email" type="email" placeholder="you@email.com" required /></label>
            <label>Password<PasswordInput name="password" minLength={6} required /></label>

            <SubmitButton pendingText="Creating account…">Start my investing path</SubmitButton>

            <p className="auth-next-hint">After signing up you'll confirm your email, then choose your plan.</p>

            <div className="auth-trust-row">
              <span className="auth-trust-item">Secure &amp; encrypted</span>
              <span className="auth-trust-item">No spam</span>
              <span className="auth-trust-item">Cancel anytime</span>
            </div>

            <p className="switch">Already a member? <Link href="/login?mode=manual">Log in</Link></p>
          </form>
        </div>

        {/* RIGHT — value + journey panel */}
        <div className="auth-value-panel login-fade-in login-fade-in--delayed">

          <div>
            <p className="avp-label">What you unlock</p>
            <h2 className="avp-headline">Everything in one calm investing hub.</h2>
          </div>

          <ul className="avp-list">
            {UNLOCKS.map((item) => (
              <li key={item}>
                <span className="avp-check">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="avp-divider" />

          <div>
            <p className="avp-label">Your first 3 steps</p>
            <div className="avp-steps">
              {STEPS.map(({ n, title, body }) => (
                <div key={n} className="avp-step">
                  <div className="avp-step-num">{n}</div>
                  <div className="avp-step-text">
                    <span className="avp-step-title">{title}</span>
                    <span className="avp-step-body">{body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="avp-reassurance">
            Built for people starting from zero — no jargon, no hype, no financial advice.
          </div>

        </div>

      </div>
    </main>
  );
}
