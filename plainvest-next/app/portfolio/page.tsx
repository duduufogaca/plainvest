import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { signOut } from '../actions/auth';
import { deletePortfolioEntry, updateCurrentPrice } from '../actions/portfolio';
import { SubmitButton } from '../components/submit-button';
import { DonutChart, type DonutSegment } from './components/DonutChart';
import { AddPositionForm } from './components/AddPositionForm';
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

type GroupedAsset = {
  key: string;
  asset_name: string;
  ticker: string | null;
  asset_type: string;
  currency: string;
  totalQty: number;
  avgBuyPrice: number;
  totalInvested: number;
  currentPrice: number | null;
  currentValue: number | null;
  pnl: number | null;
  pnlPct: number | null;
  entries: Entry[];
};

const PALETTE = [
  '#61d5b4','#f4c86a','#818cf8','#fb7185',
  '#34d399','#60a5fa','#f97316','#a78bfa',
  '#14b8a6','#f59e0b','#e879f9','#4ade80',
];

const TYPE_COLORS: Record<string, string> = {
  crypto: '#f4c86a',
  stock:  '#61d5b4',
  etf:    '#818cf8',
  other:  '#64748b',
};

const TYPE_CHIP: Record<string, string> = {
  crypto: 'chip-crypto',
  stock:  'chip-stock',
  etf:    'chip-etf',
  other:  'chip-other',
};

function fmt(n: number, currency = 'AUD') {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency', currency,
    minimumFractionDigits: 2, maximumFractionDigits: 2,
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

function groupEntries(rows: Entry[]): GroupedAsset[] {
  const map: Record<string, GroupedAsset> = {};
  rows.forEach(e => {
    const key = (e.ticker || e.asset_name).toLowerCase().trim();
    if (!map[key]) {
      map[key] = {
        key,
        asset_name: e.asset_name,
        ticker: e.ticker,
        asset_type: e.asset_type,
        currency: e.currency,
        totalQty: 0,
        avgBuyPrice: 0,
        totalInvested: 0,
        currentPrice: null,
        currentValue: null,
        pnl: null,
        pnlPct: null,
        entries: [],
      };
    }
    const g = map[key];
    g.totalQty += Number(e.quantity);
    g.totalInvested += Number(e.quantity) * Number(e.buy_price);
    if (e.current_price != null) g.currentPrice = Number(e.current_price);
    g.entries.push(e);
  });
  return Object.values(map).map(g => {
    g.avgBuyPrice = g.totalQty > 0 ? g.totalInvested / g.totalQty : 0;
    g.currentValue = g.currentPrice != null ? g.totalQty * g.currentPrice : null;
    g.pnl = g.currentValue != null ? g.currentValue - g.totalInvested : null;
    g.pnlPct = g.pnl != null && g.totalInvested > 0 ? (g.pnl / g.totalInvested) * 100 : null;
    return g;
  });
}

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
  const grouped = groupEntries(rows);

  const totalInvested = rows.reduce((s, e) => s + Number(e.quantity) * Number(e.buy_price), 0);
  const pricedGroups = grouped.filter(g => g.currentValue != null);
  const currentValue = pricedGroups.reduce((s, g) => s + g.currentValue!, 0);
  const pricedCost = pricedGroups.reduce((s, g) => s + g.totalInvested, 0);
  const pnl = pricedGroups.length > 0 ? currentValue - pricedCost : null;
  const pnlPct = pnl != null && pricedCost > 0 ? (pnl / pricedCost) * 100 : null;

  // Build donut segments (by individual asset, max 8, rest grouped as "Other")
  const sortedGroups = [...grouped].sort((a, b) => b.totalInvested - a.totalInvested);
  const topGroups = sortedGroups.slice(0, 8);
  const otherGroups = sortedGroups.slice(8);
  const otherTotal = otherGroups.reduce((s, g) => s + g.totalInvested, 0);

  const donutSegments: DonutSegment[] = [
    ...topGroups.map((g, i) => ({
      label: g.asset_name,
      ticker: g.ticker || undefined,
      value: g.totalInvested,
      pct: totalInvested > 0 ? (g.totalInvested / totalInvested) * 100 : 0,
      color: PALETTE[i % PALETTE.length],
    })),
    ...(otherTotal > 0 ? [{
      label: 'Other assets',
      value: otherTotal,
      pct: totalInvested > 0 ? (otherTotal / totalInvested) * 100 : 0,
      color: '#475569',
    }] : []),
  ];

  // By-type breakdown
  const byType: Record<string, number> = {};
  rows.forEach(e => {
    byType[e.asset_type] = (byType[e.asset_type] || 0) + Number(e.quantity) * Number(e.buy_price);
  });

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
            Track your investments. Add a current price to any position to see live P&amp;L.
          </p>
        </div>

        {params.success && <div className="notice notice-success">{params.success}</div>}
        {params.message && <div className="notice">{params.message}</div>}

        {/* Summary cards */}
        <div className="portfolio-summary">
          <div className="portfolio-stat-card">
            <span className="portfolio-stat-label">Total Invested</span>
            <strong className="portfolio-stat-value">{fmt(totalInvested)}</strong>
            <span className="portfolio-stat-sub">{rows.length} purchase{rows.length !== 1 ? 's' : ''} · {grouped.length} asset{grouped.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="portfolio-stat-card">
            <span className="portfolio-stat-label">Current Value</span>
            <strong className="portfolio-stat-value" style={pricedGroups.length === 0 ? { color: 'var(--muted)' } : {}}>
              {pricedGroups.length > 0 ? fmt(currentValue) : '—'}
            </strong>
            <span className="portfolio-stat-sub">
              {pricedGroups.length === 0
                ? 'Add current prices below'
                : `${pricedGroups.length} of ${grouped.length} priced`}
            </span>
          </div>
          <div className="portfolio-stat-card">
            <span className="portfolio-stat-label">Total P&amp;L</span>
            <strong className={`portfolio-stat-value${pnl == null ? '' : pnl >= 0 ? ' positive' : ' negative'}`}>
              {pnl == null ? '—' : fmt(pnl)}
            </strong>
            <span className="portfolio-stat-sub">
              {pnlPct == null ? 'Update prices to see P&L' : fmtPct(pnlPct)}
            </span>
          </div>
        </div>

        {/* Donut chart + breakdown */}
        {rows.length > 0 && (
          <div className="portfolio-overview">
            <section className="portfolio-card portfolio-chart-card">
              <p className="eyebrow">Allocation</p>
              <h2>Portfolio breakdown</h2>
              <DonutChart segments={donutSegments} />
            </section>

            <section className="portfolio-card portfolio-breakdown-card">
              <p className="eyebrow">By type</p>
              <h2>Asset classes</h2>
              <div className="type-breakdown">
                {Object.entries(byType).map(([type, val]) => {
                  const pct = totalInvested > 0 ? (val / totalInvested) * 100 : 0;
                  return (
                    <div key={type} className="type-breakdown-row">
                      <div className="type-breakdown-info">
                        <span className={`portfolio-type-chip ${TYPE_CHIP[type] || 'chip-other'}`}>{type}</span>
                        <span className="type-breakdown-val">{fmt(val)}</span>
                      </div>
                      <div className="type-breakdown-bar-wrap">
                        <div
                          className="type-breakdown-bar"
                          style={{ width: `${pct}%`, background: TYPE_COLORS[type] || '#64748b' }}
                        />
                      </div>
                      <span className="type-breakdown-pct">{pct.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>

              <div className="avg-price-section">
                <p className="eyebrow" style={{ marginTop: '1.5rem' }}>Average prices</p>
                <div className="avg-price-list">
                  {grouped.map(g => (
                    <div key={g.key} className="avg-price-row">
                      <div className="avg-price-asset">
                        <strong>{g.ticker || g.asset_name}</strong>
                        {g.ticker && <span className="portfolio-ticker">{g.asset_name}</span>}
                      </div>
                      <div className="avg-price-values">
                        <span className="avg-price-label">avg</span>
                        <span className="avg-price-num">{fmt(g.avgBuyPrice, g.currency)}</span>
                        <span className="avg-price-qty">{fmtQty(g.totalQty)} units</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Holdings table */}
        {rows.length > 0 && (
          <section className="portfolio-card">
            <p className="eyebrow">Holdings</p>
            <h2>All positions</h2>
            <div className="portfolio-table-wrap">
              <table className="portfolio-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Type</th>
                    <th className="num">Qty</th>
                    <th className="num">Avg Buy</th>
                    <th className="num">Invested</th>
                    <th className="num">Current Price</th>
                    <th className="num">P&amp;L</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {grouped.map(g => (
                    <>
                      <tr key={g.key} className="holdings-group-row">
                        <td>
                          <div className="portfolio-asset-name">{g.asset_name}</div>
                          {g.ticker && <div className="portfolio-ticker">{g.ticker.toUpperCase()}</div>}
                        </td>
                        <td>
                          <span className={`portfolio-type-chip ${TYPE_CHIP[g.asset_type] || 'chip-other'}`}>
                            {g.asset_type}
                          </span>
                        </td>
                        <td className="num">{fmtQty(g.totalQty)}</td>
                        <td className="num holdings-avg">
                          {fmt(g.avgBuyPrice, g.currency)}
                          {g.entries.length > 1 && (
                            <span className="avg-badge">{g.entries.length} buys</span>
                          )}
                        </td>
                        <td className="num">{fmt(g.totalInvested, g.currency)}</td>
                        <td className="num">
                          <form action={updateCurrentPrice} className="price-update-form">
                            <input type="hidden" name="id" value={g.entries[0].id} />
                            <input
                              type="number"
                              name="current_price"
                              step="any"
                              placeholder="—"
                              defaultValue={g.currentPrice != null ? String(g.currentPrice) : ''}
                              className="price-input"
                            />
                            <button type="submit" className="price-update-btn" title="Update price">✓</button>
                          </form>
                        </td>
                        <td className={`num${g.pnl == null ? '' : g.pnl >= 0 ? ' positive' : ' negative'}`}>
                          {g.pnl == null ? '—' : (
                            <>
                              <div>{fmt(g.pnl, g.currency)}</div>
                              <div className="pnl-pct">{fmtPct(g.pnlPct!)}</div>
                            </>
                          )}
                        </td>
                        <td></td>
                      </tr>
                      {g.entries.length > 1 && g.entries.map(e => {
                        const inv = Number(e.quantity) * Number(e.buy_price);
                        return (
                          <tr key={e.id} className="holdings-sub-row">
                            <td>
                              <div className="sub-row-date">{e.buy_date || 'No date'}</div>
                              {e.notes && <div className="sub-row-note">{e.notes}</div>}
                            </td>
                            <td></td>
                            <td className="num muted">{fmtQty(Number(e.quantity))}</td>
                            <td className="num muted">{fmt(Number(e.buy_price), e.currency)}</td>
                            <td className="num muted">{fmt(inv, e.currency)}</td>
                            <td></td>
                            <td></td>
                            <td>
                              <form action={deletePortfolioEntry}>
                                <input type="hidden" name="id" value={e.id} />
                                <button type="submit" className="delete-btn" title="Remove">✕</button>
                              </form>
                            </td>
                          </tr>
                        );
                      })}
                      {g.entries.length === 1 && (
                        <tr key={`del-${g.key}`} className="holdings-sub-row">
                          <td>
                            {g.entries[0].buy_date && <div className="sub-row-date">{g.entries[0].buy_date}</div>}
                            {g.entries[0].notes && <div className="sub-row-note">{g.entries[0].notes}</div>}
                          </td>
                          <td colSpan={5}></td>
                          <td></td>
                          <td>
                            <form action={deletePortfolioEntry}>
                              <input type="hidden" name="id" value={g.entries[0].id} />
                              <button type="submit" className="delete-btn" title="Remove">✕</button>
                            </form>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {rows.length === 0 && (
          <div className="portfolio-empty">
            <div className="portfolio-empty-icon">📊</div>
            <h3>No positions yet</h3>
            <p>Add your first investment below to start tracking your portfolio.</p>
          </div>
        )}

        {/* Add position — client component with autocomplete */}
        <AddPositionForm />
      </div>
    </main>
  );
}
