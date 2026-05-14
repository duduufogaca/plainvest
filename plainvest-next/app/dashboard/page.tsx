import { signOut } from '../actions/auth';
import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';

const dashboardItems = [
  'Premium welcome guide',
  'DCA method',
  'Exchange and platform setup',
  'Crypto self-custody',
  'Bitcoin research section',
  'Book list',
  'Chart reading tools',
  'Support call booking',
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
          <a className="active" href="#overview">Overview</a>
          <a href="#guides">Guides</a>
          <a href="#booking">Support call</a>
          <a href="#account">Account</a>
        </nav>
        <form action={signOut}>
          <button className="ghost" type="submit">Logout</button>
        </form>
      </aside>
      <section className="dashboard-content">
        <div className="dashboard-hero" id="overview">
          <p className="eyebrow">{isPremium ? 'Premium member dashboard' : 'Member account'}</p>
          <h1>{isPremium ? 'Your premium learning area is ready.' : 'Finish your Premium access.'}</h1>
          <p>
            Logged in as {user.email}. {isPremium
              ? `Your access is active until ${access?.access_expires_at ? new Date(access.access_expires_at).toLocaleDateString() : 'your expiry date'}.`
              : 'Your account works. Complete annual access to unlock the Premium guides and member resources.'}
          </p>
        </div>
        {isPremium ? (
          <>
            <div className="cards" id="guides">
              {dashboardItems.map((item) => (
                <article className="dash-card" key={item}>
                  <span>Premium</span>
                  <h2>{item}</h2>
                  <p>Connect this card to the matching guide or protected content route.</p>
                </article>
              ))}
            </div>
            <section className="support-call-panel" id="booking">
              <div>
                <p className="eyebrow">Extra support call</p>
                <h2>Book another 60-minute support call.</h2>
                <p>Premium includes one yearly support call. If members want more help, they can purchase an extra online call separately for questions, exchange setup, DCA planning, Bitcoin safety, or chart-reading support.</p>
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
              <p className="eyebrow">Annual access</p>
              <h2>Plainvest Premium Learning Pass</h2>
              <p>Unlock the member guides, book list, chart-reading tools, Bitcoin research, DCA method, and one yearly support call.</p>
            </div>
            <div className="price-box">
              <strong>AUD $89.90</strong>
              <span>One year access</span>
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
