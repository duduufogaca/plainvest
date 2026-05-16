import { signOut } from '../actions/auth';
import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard() {
  const premiumPriceLabel = process.env.NEXT_PUBLIC_PREMIUM_PRICE_LABEL || 'AUD $89.90';
  const supportCallPriceLabel = process.env.NEXT_PUBLIC_SUPPORT_CALL_PRICE_LABEL || 'AUD $39.90';

  const missingEnv = [
    ['NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL],
    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
  ].filter(([, value]) => !value).map(([name]) => name);

  if (missingEnv.length > 0) {
    return (
      <main className="setup-shell">
        <section className="setup-card">
          <p className="eyebrow">Setup needed</p>
          <h1>Supabase is not connected on this deployment yet.</h1>
          <p>Add these environment variables in Vercel, then redeploy the project:</p>
          <ul>
            {missingEnv.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </section>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { isPremium, error: accessError } = await getPremiumAccess(supabase, user.id);

  if (accessError) {
    console.error('Plainvest member access check failed:', accessError.message);
    return (
      <main className="setup-shell">
        <section className="setup-card">
          <p className="eyebrow">Access check</p>
          <h1>We could not confirm your member access.</h1>
          <p>Please refresh the page or try again shortly. If this continues, contact Plainvest support.</p>
        </section>
      </main>
    );
  }

  if (isPremium) {
    redirect('/index.html#member');
  }

  return (
    <main className="payment-shell">
      <nav className="payment-topbar">
        <div className="brand">Plainvest</div>
        <form action={signOut}>
          <button className="ghost" type="submit">Logout</button>
        </form>
      </nav>
      <section className="payment-content">
        <div className="dashboard-hero">
          <p className="eyebrow">Member account</p>
          <h1>Finish your Premium access.</h1>
          <p>
            Logged in as {user.email}. Your account is created. Complete the one-time purchase below to unlock the Premium learning hub and member resources.
          </p>
        </div>
        <section className="purchase-panel">
          <div>
            <p className="eyebrow">Premium purchase</p>
            <h2>Plainvest Premium Learning Pass</h2>
            <p>Unlock the investment paths, book list, chart-reading tools, Bitcoin research, DCA method, and one included support call.</p>
            <p className="muted">Need help later? Extra support calls are available separately for {supportCallPriceLabel}.</p>
            <p className="tiny-links"><a href="/terms">Terms</a><span>•</span><a href="/privacy">Privacy</a></p>
          </div>
          <div className="price-box">
            <strong>{premiumPriceLabel}</strong>
            <span>One-time purchase</span>
            <form action="/api/stripe/checkout" method="POST">
              <button type="submit">Continue to secure checkout</button>
            </form>
          </div>
        </section>
      </section>
    </main>
  );
}
