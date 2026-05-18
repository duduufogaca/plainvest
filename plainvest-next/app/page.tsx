import Link from 'next/link';

export default function Home() {
  return (
    <main className="public-shell">
      <section className="hero-card">
        <p className="eyebrow">Plainvest Premium</p>
        <h1>Your member learning hub starts here.</h1>
        <p>
          Log in to continue your Premium learning path, or create an account before completing
          your one-time Plainvest Premium purchase.
        </p>
        <div className="actions">
          <Link href="/login?mode=manual">Login</Link>
          <Link href="/signup" className="secondary">Create account</Link>
        </div>
        <p className="tiny-links">
          <Link href="/forgot-password">Forgot password?</Link>
          <span>•</span>
          <Link href="/terms">Terms</Link>
          <span>•</span>
          <Link href="/privacy">Privacy</Link>
        </p>
      </section>
    </main>
  );
}
