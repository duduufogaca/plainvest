import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { signOut } from '../actions/auth';
import { addPortfolioEntry, deletePortfolioEntry, updateCurrentPrice } from '../actions/portfolio';
import { SubmitButton } from '../components/submit-button';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = {
  title: 'Portfolio — Plainvest',
  robots: { index: false, follow: false },
};

type Entry = {
  id: string;
  asset_type: string;
  asset_name: string;
  ticker: string | null;
  quantity: number;
  buy_price: number;
  currency: string;
  buy_date: string | null;
  current_price: number | null;
  notes: string | null;
};

function fmt(n: number, currency = 'AUD') {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtQty(n: number) {
  return n % 1 === 0
    ? n.toLocaleString('en-AU')
    : n.toLocaleString('en-AU', { maximumFractionDigits: 8 });
}

function fmtPct(n: number) {
  return (n >= 0 ? '+' : '') + n.toFixed(2) + '%';
}

const TYPE_CHIP: Record<string, string> = {
  crypto: 'chip-crypto',
  stock: 'chip-stock',
  etf: 'chip-etf',
  other: 'chip-other',
};

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; success?: string }>;
}) {
  const params = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { isPremium } = await getPremiumAccess(supabase, user.id);
  if (!isPremium) redirect('/dashboard');

  const { data: entries } = await supabase
    .from('portfolio_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const rows: Entry[] = entries || [];

  const totalInvested = rows.reduce(
    (sum, e) => sum + Number(e.quantity) * Number(e.buy_price),
    0,
  );

  const pricedRows = rows.filter((e) => e.current_price != null);
  const currentValue = pricedRows.reduce(
    (sum, e) => sum + Number(e.quantity) * Number(e.current_price!),
    0,
  );
  const pricedCost = pricedRows.reduce(
    (sum, e) => sum + Number(e.quantity) * Number(e.buy_price),
    0,
  );
  const pnl = pricedRows.length > 0 ? currentValue - pricedCost : null;
  const pnlPct = pnl != null && pricedCost > 0 ? (pnl / pricedCost) * 100 : null;

  const backHref = '/index.html?member_session=1#member';

  return (
    <main className="portfolio-shell">
      <nav className="portfolio-topbar">
        <a href={backHref} className="brand">Plainvest</a>
        <div className="portfolio-topbar-actions">
          <a href={backHref} className="ghost-nav-link">← Hub</a>
          <a href="/profile" className="ghost-nav-link">Profile</a>
          <form action={signOut}>
            <SubmitButton className="ghost" pendingText="...">Logout</SubmitButton>
          </form>
        </div>
      </nav>

      <div className="portfolio-content">
        <div className="portfolio-header">
          <p className="eyebrow">Investment tracker</p>
          <h1>My Portfolio</h1>
          <p className="muted">
            Log your stock, ETF, and crypto purchases. Add a current price to each position to track P&amp;L.
          </p>
        </div>

        {params.success && (
          <div className="notice notice-success">{params.success}</div>
        )}
        {params.message && (
          <div className="notice">{params.message}</div>
        )}

        {/* Summary */}
        <div className="portfolio-summary">
          <div className="portfolio-stat-card">
            <span className="portfolio-stat-label">Total Invested</span>
            <strong className="portfolio-stat-value">{fmt(totalInvested)}</strong>
            <span className="portfolio-stat-sub">
              {rows.length} position{rows.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="portfolio-stat-card">
            <span className="portfolio-stat-label">Current Value</span>
            <strong
              className="portfolio-stat-value"
              style={pricedRows.length === 0 ? { color: 'var(--muted)' } : {}}
            >
              {pricedRows.length > 0 ? fmt(currentValue) : '—'}
            </strong>
            <span className="portfolio-stat-sub">
              {pricedRows.length === 0
                ? 'Add current prices to track'
                : `${pricedRows.length} of ${rows.length} priced`}
            </span>
          </div>
          <div className="portfolio-stat-card">
            <span className="portfolio-stat-label">P&amp;L</span>
            <strong
              className={`portfolio-stat-value${pnl == null ? '' : pnl >= 0 ? ' positive' : ' negative'}`}
            >
              {pnl == null ? '—' : fmt(pnl)}
            </strong>
            <span className="portfolio-stat-sub">
              {pnlPct == null ? 'Update prices above' : fmtPct(pnlPct)}
            </span>
          </div>
        </div>

        {/* Holdings */}
        {rows.length > 0 && (
          <section className="portfolio-card">
            <p className="eyebrow">Holdings</p>
            <h2>Your positions</h2>
            <div className="portfolio-table-wrap">
              <table className="portfolio-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Type</th>
                    <th className="num">Qty</th>
                    <th className="num">Buy Price</th>
                    <th className="num">Invested</th>
                    <th className="num">Current Price</th>
                    <th className="num">P&amp;L</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((e) => {
                    const invested = Number(e.quantity) * Number(e.buy_price);
                    const curr =
                      e.current_price != null
                        ? Number(e.quantity) * Number(e.current_price)
                        : null;
                    const rowPnl = curr != null ? curr - invested : null;
                    const rowPnlPct =
                      rowPnl != null ? (rowPnl / invested) * 100 : null;
                    return (
                      <tr key={e.id}>
                        <td>
                          <div className="portfolio-asset-name">{e.asset_name}</div>
                          {e.ticker && (
                            <div className="portfolio-ticker">
                              {e.ticker.toUpperCase()}
                            </div>
                          )}
                          {e.buy_date && (
                            <div className="portfolio-date">{e.buy_date}</div>
                          )}
                        </td>
                        <td>
                          <span
                            className={`portfolio-type-chip ${TYPE_CHIP[e.asset_type] || 'chip-other'}`}
                          >
                            {e.asset_type}
                          </span>
                        </td>
                        <td className="num">{fmtQty(Number(e.quantity))}</td>
                        <td className="num">{fmt(Number(e.buy_price), e.currency)}</td>
                        <td className="num">{fmt(invested, e.currency)}</td>
                        <td className="num">
                          <form action={updateCurrentPrice} className="price-update-form">
                            <input type="hidden" name="id" value={e.id} />
                            <input
                              type="number"
                              name="current_price"
                              step="any"
                              placeholder="—"
                              defaultValue={
                                e.current_price != null ? String(e.current_price) : ''
                              }
                              className="price-input"
                            />
                            <button type="submit" className="price-update-btn" title="Update price">
                              ✓
                            </button>
                          </form>
                        </td>
                        <td
                          className={`num${rowPnl == null ? '' : rowPnl >= 0 ? ' positive' : ' negative'}`}
                        >
                          {rowPnl == null ? (
                            '—'
                          ) : (
                            <>
                              <div>{fmt(rowPnl, e.currency)}</div>
                              <div className="pnl-pct">{fmtPct(rowPnlPct!)}</div>
                            </>
                          )}
                        </td>
                        <td>
                          <form action={deletePortfolioEntry}>
                            <input type="hidden" name="id" value={e.id} />
                            <button
                              type="submit"
                              className="delete-btn"
                              title="Remove position"
                            >
                              ✕
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Add position */}
        <section className="portfolio-card">
          <p className="eyebrow">Add position</p>
          <h2>Log a new purchase</h2>
          <form action={addPortfolioEntry} className="portfolio-add-form">
            <div className="portfolio-form-grid">
              <label className="portfolio-label">
                Asset name *
                <input
                  name="asset_name"
                  type="text"
                  required
                  placeholder="e.g. Bitcoin, VAS ETF, Apple"
                />
              </label>
              <label className="portfolio-label">
                Ticker / Symbol
                <input name="ticker" type="text" placeholder="e.g. BTC, VAS, AAPL" />
              </label>
              <label className="portfolio-label">
                Asset type *
                <select name="asset_type" required>
                  <option value="stock">Stock</option>
                  <option value="etf">ETF</option>
                  <option value="crypto">Crypto</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="portfolio-label">
                Currency *
                <select name="currency">
                  <option value="AUD">AUD — Australian Dollar</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="BRL">BRL — Brazilian Real</option>
                </select>
              </label>
              <label className="portfolio-label">
                Quantity *
                <input
                  name="quantity"
                  type="number"
                  step="any"
                  required
                  min="0"
                  placeholder="e.g. 0.05, 10, 100"
                />
              </label>
              <label className="portfolio-label">
                Buy price (per unit) *
                <input
                  name="buy_price"
                  type="number"
                  step="any"
                  required
                  min="0"
                  placeholder="e.g. 42000"
                />
              </label>
              <label className="portfolio-label">
                Current price (optional)
                <input
                  name="current_price"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="Enter to see P&L straight away"
                />
              </label>
              <label className="portfolio-label">
                Buy date
                <input name="buy_date" type="date" />
              </label>
            </div>
            <label className="portfolio-label portfolio-notes-label">
              Notes (optional)
              <input
                name="notes"
                type="text"
                placeholder="e.g. First DCA purchase, long-term hold"
              />
            </label>
            <SubmitButton pendingText="Adding...">Add position</SubmitButton>
          </form>
        </section>

        {rows.length === 0 && (
          <div className="portfolio-empty">
            <div className="portfolio-empty-icon">📊</div>
            <h3>No positions yet</h3>
            <p>Add your first investment above to start tracking your portfolio.</p>
          </div>
        )}
      </div>
    </main>
  );
}
