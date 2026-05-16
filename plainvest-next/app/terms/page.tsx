import Link from 'next/link';

export default function Terms() {
  return (
    <main className="public-shell legal-shell">
      <section className="hero-card legal-card">
        <p className="eyebrow">Plainvest</p>
        <h1>Terms of Service</h1>
        <p>Plainvest Premium is an educational product. It is not personal financial advice, legal advice, tax advice, or a promise of investment returns.</p>
        <h2>Educational use</h2>
        <p>Members use Plainvest to learn concepts, compare paths, and prepare better questions. Any investment decision should consider personal goals, risk tolerance, fees, tax, and circumstances.</p>
        <h2>Payments and access</h2>
        <p>Premium access is unlocked after successful payment confirmation through Stripe. Extra support calls are purchased separately when needed.</p>
        <h2>Support calls</h2>
        <p>Support calls are for education, platform guidance, and questions. They do not replace licensed financial advice.</p>
        <h2>Content updates</h2>
        <p>Plainvest may update, improve, add, or remove educational materials over time as the product grows.</p>
        <p className="tiny-links"><Link href="/">Back to member app</Link></p>
      </section>
    </main>
  );
}
