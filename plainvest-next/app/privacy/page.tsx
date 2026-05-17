import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function Privacy() {
  return (
    <main className="public-shell legal-shell">
      <section className="hero-card legal-card">
        <p className="eyebrow">Plainvest</p>
        <h1>Privacy Policy</h1>
        <p>Plainvest collects only the information needed to operate member access, payments, support calls, and product communication.</p>
        <h2>Information we collect</h2>
        <p>Email address, authentication details managed by Supabase, payment status from Stripe, and messages or booking details you choose to send.</p>
        <h2>How we use it</h2>
        <p>To provide access to Premium content, process payments, respond to support requests, improve the product, and keep member access secure.</p>
        <h2>Third-party services</h2>
        <p>Plainvest uses Supabase for authentication and member records, Stripe for payments, and email/form tools for communication.</p>
        <h2>Contact</h2>
        <p>For privacy questions, contact Plainvest through the main website contact form.</p>
        <p className="tiny-links"><Link href="/">Back to member app</Link></p>
      </section>
    </main>
  );
}
