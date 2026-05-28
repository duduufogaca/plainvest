import Link from 'next/link';

export default function Home() {
  return (
    <main className="auth-shell--split">
      <div className="auth-split-wrap">

        {/* LEFT — gateway action */}
        <div className="auth-card-wrap">
          <div className="auth-card--premium auth-gateway">
            <p className="eyebrow">Plainvest Premium</p>
            <h1>Everything in one calm investing hub.</h1>
            <p className="muted">
              Create your account to access your investing roadmap, simulator tools, and Premium learning paths.
            </p>
            <div className="gateway-actions">
              <Link href="/signup" className="gateway-btn-primary">Create account</Link>
              <Link href="/login?mode=manual" className="gateway-btn-secondary">I already have an account</Link>
            </div>
            <div className="auth-trust-row">
              <span className="auth-trust-item">Secure account</span>
              <span className="auth-trust-item">No hidden fees</span>
              <span className="auth-trust-item">Beginner-friendly support</span>
            </div>
            <p className="tiny-links">
              <Link href="/forgot-password">Forgot password?</Link>
              <span>&nbsp;&middot;&nbsp;</span>
              <Link href="/terms">Terms</Link>
              <span>&nbsp;&middot;&nbsp;</span>
              <Link href="/privacy">Privacy</Link>
            </p>
          </div>
        </div>

        {/* RIGHT — value panel */}
        <div className="auth-value-panel">
          <p className="avp-label">What you unlock</p>
          <h2 className="avp-headline">Your entire investing journey in one place.</h2>
          <ul className="avp-list">
            {[
              'Beginner investing roadmap',
              'ETF, Bitcoin & DCA learning paths',
              'Long-term simulator tools',
              'Portfolio tracking',
              'Included Zoom support call',
            ].map((item) => (
              <li key={item}>
                <span className="avp-check">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="avp-reassurance">
            Built for people starting from zero &mdash; no jargon, no hype, no pressure.
          </div>
          <p className="avp-note">
            Designed to help first-time investors feel calm, clear, and confident.
          </p>
        </div>

      </div>
    </main>
  );
}
