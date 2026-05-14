import Link from 'next/link';

export default function Home() {
  return (
    <main className="public-shell">
      <section className="hero-card">
        <p className="eyebrow">Plainvest Premium</p>
        <h1>Member learning, account access, and guided investing education.</h1>
        <p>
          This Next.js app is ready for Supabase authentication. Members can create an account,
          log in, and access the dashboard after purchase.
        </p>
        <div className="actions">
          <Link href="/signup">Create account</Link>
          <Link href="/login" className="secondary">Login</Link>
        </div>
      </section>
    </main>
  );
}
