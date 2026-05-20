import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found — Plainvest',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="auth-shell">
      <div className="auth-card" style={{ width: 'min(480px,100%)', borderRadius: '28px', padding: 'clamp(1.5rem,4vw,2.5rem)', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>404</div>
        <p className="eyebrow" style={{ margin: '0 0 0.5rem', color: 'var(--teal)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Page not found
        </p>
        <h1 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)', margin: '0 0 1rem' }}>
          This page does not exist.
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.93rem', lineHeight: 1.6, margin: '0 0 2rem' }}>
          The link may be broken or the page may have moved. Head back to the member hub or the login page.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/dashboard"
            style={{ display: 'inline-block', padding: '0.65rem 1.4rem', borderRadius: '999px', background: 'var(--teal)', color: '#071120', fontWeight: 800, fontSize: '0.88rem' }}
          >
            Go to member hub
          </Link>
          <Link
            href="/login"
            style={{ display: 'inline-block', padding: '0.65rem 1.4rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,.18)', color: 'var(--text)', fontWeight: 700, fontSize: '0.88rem' }}
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
