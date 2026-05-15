import { signOut } from '../actions/auth';
import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';

const dashboardItems = [
  {
    title: 'Premium welcome guide',
    href: '/files/premium_content/00-premium-member-start-here.html',
    description: 'Start here, understand the Plainvest story, and choose your learning path.',
  },
  {
    title: 'Investment paths',
    href: '/files/premium_content/01-investment-paths-guide.html',
    description: 'Compare investment types, risk, time horizon, and beginner-friendly use cases.',
  },
  {
    title: 'DCA method',
    href: '/files/premium_content/02-dca-method-guide.html',
    description: 'Learn how recurring investing works through different market prices.',
  },
  {
    title: 'Exchange setup',
    href: '/files/premium_content/03-exchange-and-platform-setup-checklist.html',
    description: 'Open accounts more calmly and understand the key platform settings.',
  },
  {
    title: 'Crypto self-custody',
    href: '/files/premium_content/04-crypto-and-self-custody-guide.html',
    description: 'Understand wallets, seed phrases, cold storage, and common security mistakes.',
  },
  {
    title: 'Bitcoin research',
    href: '/files/premium_content/05-bitcoin-research-section.html',
    description: 'White paper, halving, supply, on-chain metrics, and why Bitcoin was created.',
  },
  {
    title: 'Book list',
    href: '/files/premium_content/06-books-and-reading-path.html',
    description: 'A curated reading path for investing, macro, Bitcoin, business, and wealth.',
  },
  {
    title: 'Chart reading tools',
    href: '/files/premium_content/07-chart-reading-and-research-tools.html',
    description: 'Use TradingView-style chart tools, time frames, and basic market structure.',
  },
  {
    title: 'Market cycles',
    href: '/files/premium_content/08-crypto-cycle-lessons.html',
    description: 'Learn cycle psychology, risk, liquidity, euphoria, fear, and discipline.',
  },
  {
    title: 'Support call preparation',
    href: '/files/premium_content/09-zoom-call-preparation.html',
    description: 'Prepare questions and make the most from your included 60-minute call.',
  },
];

export default async function Dashboard() {
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

  const { isPremium, access, error: accessError } = await getPremiumAccess(supabase, user.id);

  if (accessError) {
    return (
      <main className="setup-shell">
        <section className="setup-card">
          <p className="eyebrow">Database setup needed</p>
          <h1>The member access table is not ready yet.</h1>
          <p>Run this SQL file in Supabase SQL Editor, then refresh this page:</p>
          <code>plainvest-next/supabase/member_access.sql</code>
          <p className="muted">Supabase message: {accessError.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">Plainvest</div>
        <nav>
          <a className="active" href="#overview">Member home</a>
          <a href="#guides">Premium guides</a>
          <a href="#booking">Support call</a>
          <a href="#account">Account</a>
        </nav>
        <form action={signOut}>
          <button className="ghost" type="submit">Logout</button>
        </form>
      </aside>
      <section className="dashboard-content">
        <div className="dashboard-hero" id="overview">
          <p className="eyebrow">{isPremium ? 'Premium member home' : 'Member account'}</p>
          <h1>{isPremium ? 'Welcome to your Premium learning area.' : 'Finish your Premium access.'}</h1>
          <p>
            Logged in as {user.email}. {isPremium
              ? `Choose a guide below and continue your learning path. Your access is active until ${access?.access_expires_at ? new Date(access.access_expires_at).toLocaleDateString() : 'your expiry date'}.`
              : 'Your account works. Complete your one-time purchase to unlock the Premium guides and member resources.'}
          </p>
        </div>
        {isPremium ? (
          <>
            <div className="cards" id="guides">
              {dashboardItems.map((item) => (
                <a className="dash-card" key={item.title} href={item.href}>
                  <span>Premium</span>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </a>
              ))}
            </div>
            <section className="support-call-panel" id="booking">
              <div>
                <p className="eyebrow">Extra support call</p>
                <h2>Book another 60-minute support call.</h2>
                <p>Premium includes one 60-minute support call during the access year. If members want more help, they can purchase an extra online call separately for questions, exchange setup, DCA planning, Bitcoin safety, or chart-reading support.</p>
              </div>
              <div className="price-box">
                <strong>AUD $39.90</strong>
                <span>Extra 60-minute call</span>
                <form action="/api/stripe/support-call" method="POST">
                  <button type="submit">Pay for support call</button>
                </form>
              </div>
            </section>
          </>
        ) : (
          <section className="purchase-panel">
            <div>
              <p className="eyebrow">Premium purchase</p>
              <h2>Plainvest Premium Learning Pass</h2>
              <p>Unlock one year of member guides, book list, chart-reading tools, Bitcoin research, DCA method, and one included support call.</p>
            </div>
            <div className="price-box">
              <strong>AUD $89.90</strong>
              <span>One-time purchase</span>
              <form action="/api/stripe/checkout" method="POST">
                <button type="submit">Continue to secure checkout</button>
              </form>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
