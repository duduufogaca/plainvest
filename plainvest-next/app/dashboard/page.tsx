import { signOut } from '../actions/auth';
import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { SubmitButton } from '../components/submit-button';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ payment?: string; upgrade?: string }> }) {
  const params = await searchParams;

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

  const { hasGuideAccess, isPro, error: accessError } = await getPremiumAccess(supabase, user.id);

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

  // Pro: full access — redirect to member hub
  if (isPro) {
    redirect('/index.html?member_session=1#member');
  }

  // Premium (guides only): redirect to member hub, portfolio is blocked at middleware
  if (hasGuideAccess) {
    redirect('/index.html?member_session=1#member');
  }

  // Not paid — show pricing wall
  const isUpgradePrompt = params.upgrade === 'pro';

  return (
    <main className="payment-shell">
      <nav className="payment-topbar">
        <div className="brand">Plainvest</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <a href="/profile" className="ghost-nav-link">Profile</a>
          <form action={signOut}>
            <SubmitButton className="ghost" pendingText="Logging out...">Logout</SubmitButton>
          </form>
        </div>
      </nav>

      <section className="payment-content">
        <div className="dashboard-hero">
          <p className="eyebrow">Member account</p>
          <h1>{isUpgradePrompt ? 'Upgrade to Pro to unlock the dashboard.' : 'Choose your investing plan.'}</h1>
          <p>
            {isUpgradePrompt
              ? 'Your Premium access covers the guides. Upgrade to Pro to also unlock portfolio tracking and the full dashboard.'
              : `Logged in as ${user.email}. Pick the plan that fits where you are.`}
          </p>
        </div>

        {params.payment === 'cancelled' && (
          <p className="notice" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            Checkout was cancelled — no charge was made. You can try again below.
          </p>
        )}

        <div className="pricing-grid">

          {/* Premium plan */}
          <section className="purchase-panel">
            <div>
              <p className="eyebrow">Premium</p>
              <h2>Guides &amp; Learning Hub</h2>
              <p>All 19 investment guides, reading paths, chart tools, Bitcoin research, DCA method, and one included Zoom support call.</p>
              <ul className="plan-features">
                <li>✓ 19 premium investment guides</li>
                <li>✓ DCA &amp; investment path tools</li>
                <li>✓ One included Zoom support call</li>
                <li>✗ Portfolio tracker</li>
                <li>✗ Dashboard &amp; simulator</li>
              </ul>
              <p className="tiny-links"><a href="/terms">Terms</a><span>•</span><a href="/privacy">Privacy</a></p>
            </div>
            <div className="price-box">
              <strong>AUD $89.90</strong>
              <span>One-time purchase</span>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="plan" value="premium" />
                <SubmitButton pendingText="Opening checkout...">Get Premium</SubmitButton>
              </form>
            </div>
          </section>

          {/* Pro plan */}
          <section className="purchase-panel purchase-panel--featured">
            <div>
              <p className="eyebrow">Pro <span className="plan-badge">Most complete</span></p>
              <h2>Full Access + Dashboard</h2>
              <p>Everything in Premium plus live portfolio tracking, the investment simulator, and the full member dashboard.</p>
              <ul className="plan-features">
                <li>✓ 19 premium investment guides</li>
                <li>✓ DCA &amp; investment path tools</li>
                <li>✓ One included Zoom support call</li>
                <li>✓ Portfolio tracker</li>
                <li>✓ Dashboard &amp; simulator</li>
              </ul>
              <p className="tiny-links"><a href="/terms">Terms</a><span>•</span><a href="/privacy">Privacy</a></p>
            </div>
            <div className="price-box">
              <strong>AUD $9.90<span className="price-period">/month</span></strong>
              <span>Cancel anytime</span>
              <form action="/api/stripe/checkout" method="POST">
                <input type="hidden" name="plan" value="pro" />
                <SubmitButton pendingText="Opening checkout...">Get Pro</SubmitButton>
              </form>
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}
