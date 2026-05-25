import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { signOut } from '../actions/auth';
import { deletePortfolioEntry, updateCurrentPrice } from '../actions/portfolio';
import { SubmitButton } from '../components/submit-button';
import { DonutChart, type DonutSegment } from './components/DonutChart';
import { AddPositionForm } from './components/AddPositionForm';
import { CurrencySwitcher } from './components/CurrencySwitcher';
import { getExchangeRates } from '@/lib/exchange-rates';
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

const VALID_CURRENCIES = ['AUD', 'USD', 'BRL'] as const;
type Currency = typeof VALID_CURRENCIES[number];

const PALETTE = [
  '#61d5b4','#f4c86a','#818cf8','#fb7185',
  '#34d399','#60a5fa','#f97316','#a78bfa',
  '#14b8a6','#f59e0b','#e879f9','#4ade80',
];

const TYPE_COLORS: Record<string, string> = {
  crypto: '#f4c86a', stock: '#61d5b4', etf: '#818cf8', other: '#64748b',
};
const TYPE_CHIP: Record<string, string> = {
  crypto: 'chip-crypto', stock: 'chip-stock', etf: 'chip-etf', other: 'chip-other',
};

function getLocale(currency: string) {
  return currency === 'BRL' ? 'pt-BR' : currency === 'USD' ? 'en-US' : 'en-AU';
}

function fmt(n: number, currency = 'AUD') {
  return new Intl.NumberFormat(getLocale(currency), {
    style: 'currency', currency,
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n);
}

function fmtShort(n: number, currency = 'AUD') {
  return new Intl.NumberFormat(getLocale(currency), {
    style: 'currency', currency,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
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
        key, asset_name: e.asset_name, ticker: e.ticker,
        asset_type: e.asset_type, currency: e.currency,
        totalQty: 0, avgBuyPrice: 0, totalInvested: 0,
        currentPrice: null, currentValue: null, pnl: null, pnlPct: null,
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
  searchParams: Promise<{ message?: string; success?: string; currency?: string }>;
}) {
  const params = await searchParams;

  const displayCurrency: Currency =
    VALID_CURRENCIES.includes(params.currency as Currency)
      ? (params.currency as Currency)
      : 'AUD';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { isPremium } = await getPremiumAccess(supabase, user.id);
  if (!isPremium) redirect('/dashboard');

  const rates = await getExchangeRates(displayCurrency);

  // Convert any currency amount → display currency
  const toDisplay = (amount: number, fromCurrency: string): number => {
    if (fromCurrency === displayCurrency) return amount;
    const rate = rates[fromCurrency];
    return rate ? amount / rate : amount;
  };

  const { data: entries } = await supabase
    .from('portfolio_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const rows: Entry[] = entries || [];
  const grouped = groupEntries(rows);

  // Totals in display currency
  const totalInvested = rows.reduce(
    (s, e) => s + toDisplay(Number(e.quantity) * Number(e.buy_price), e.currency), 0);

  const pricedGroups = grouped.filter(g => g.currentValue != null);
  const currentValue = pricedGroups.reduce(
    (s, g) => s + toDisplay(g.currentValue!, g.currency), 0);
  const pricedCost = pricedGroups.reduce(
    (s, g) => s + toDisplay(g.totalInvested, g.currency), 0);
  const pnl = pricedGroups.length > 0 ? currentValue - pricedCost : null;
  const pnlPct = pnl != null && pricedCost > 0 ? (pnl / pricedCost) * 100 : null;

  // Best / worst performers
  const performingGroups = grouped.filter(g => g.pnlPct != null);
  const best = performingGroups.length > 0
    ? performingGroups.reduce((a, b) => a.pnlPct! > b.pnlPct! ? a : b) : null;
  const worst = performingGroups.length > 0
    ? performingGroups.reduce((a, b) => a.pnlPct! < b.pnlPct! ? a : b) : null;

  // By-type totals in display currency
  const byType: Record<string, number> = {};
  rows.forEach(e => {
    byType[e.asset_type] = (byType[e.asset_type] || 0) +
      toDisplay(Number(e.quantity) * Number(e.buy_price), e.currency);
  });

  // Donut segments (top 8 by invested, rest grouped)
  const sorted = [...grouped].sort(
    (a, b) => toDisplay(b.totalInvested, b.currency) - toDisplay(a.totalInvested, a.currency));
  const top8 = sorted.slice(0, 8);
  const rest = sorted.slice(8);
  const restTotal = rest.reduce((s, g) => s + toDisplay(g.totalInvested, g.currency), 0);

  const donutSegments: DonutSegment[] = [
    ...top8.map((g, i) => ({
      label: g.asset_name,
      ticker: g.ticker || undefined,
      value: toDisplay(g.totalInvested, g.currency),
      pct: totalInvested > 0 ? (toDisplay(g.totalInvested, g.currency) / totalInvested) * 100 : 0,
      color: PALETTE[i % PALETTE.length],
      pnlPct: g.pnlPct,
    })),
    ...(restTotal > 0 ? [{
      label: 'Other assets', value: restTotal,
      pct: totalInvested > 0 ? (restTotal / totalInvested) * 100 : 0,
      color: '#475569',
    }] : []),
  ];

  const backHref = '/index.html?member_session=1#member';

  return (
    <main className="portfolio-shell">
      <nav className="portfolio-topbar">
        <a href={backHref} className="brand">Plainvest</a>
        <div className="portfolio-topbar-actions">
          <CurrencySwitcher current={displayCurrency} />
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
          <p className="muted portfolio-header-sub">
            Track your investments across currencies. Add a current price to see live P&amp;L.
          </p>
        </div>

        {params.success && <div className="notice notice-success">{params.success}</div>}
        {params.message && <div className="notice">{params.message}</div>}

        {/* KPI row */}
        <div className="portfolio-kpi-row">
          <div className="portfolio-kpi-card">
            <span className="portfolio-kpi-label">Total Invested</span>
            <strong className="portfolio-kpi-value">{fmtShort(totalInvested, displayCurrency)}</strong>
            <span className="portfolio-kpi-sub">
              {rows.length} purchase{rows.length !== 1 ? 's' : ''} · {grouped.length} asset{grouped.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="portfolio-kpi-card">
            <span className="portfolio-kpi-label">Current Value</span>
            <strong className="portfolio-kpi-value" style={pricedGroups.length === 0 ? { color: 'var(--muted)' } : {}}>
              {pricedGroups.length > 0 ? fmtShort(currentValue, displayCurrency) : '—'}
            </strong>
            <span className="portfolio-kpi-sub">
              {pricedGroups.length === 0
                ? 'Add prices below'
                : `${pricedGroups.length} of ${grouped.length} priced`}
            </span>
          </div>

          <div className={`portfolio-kpi-card${pnl == null ? '' : pnl >= 0 ? ' kpi-positive' : ' kpi-negative'}`}>
            <span className="portfolio-kpi-label">Total Return</span>
            <strong className={`portfolio-kpi-value${pnl == null ? '' : pnl >= 0 ? ' positive' : ' negative'}`}>
              {pnl == null ? '—' : (pnl >= 0 ? '+' : '') + fmtShort(pnl, displayCurrency)}
            </strong>
            <span className="portfolio-kpi-sub">
              {pnlPct == null
                ? 'Add current prices'
                : (pnlPct >= 0 ? '▲ +' : '▼ ') + pnlPct.toFixed(2) + '% total gain'}
            </span>
          </div>

          <div className="portfolio-kpi-card">
            <span className="portfolio-kpi-label">Positions</span>
            <strong className="portfolio-kpi-value">{grouped.length}</strong>
            <span className="portfolio-kpi-sub">
              {Object.keys(byType).length} asset class{Object.keys(byType).length !== 1 ? 'es' : ''}
            </span>
          </div>
        </div>

        {rows.length > 0 && (
          <>
            {/* Overview: chart + performance */}
            <div className="portfolio-overview-v2">
              <section className="portfolio-card">
                <p className="eyebrow">Allocation</p>
                <h2>Portfolio breakdown</h2>
                <DonutChart
                  segments={donutSegments}
                  totalValue={totalInvested}
                  currency={displayCurrency}
                />
              </section>

              <section className="portfolio-card portfolio-perf-card">
                <p className="eyebrow">Performance</p>
                <h2>Highlights</h2>

                {performingGroups.length > 0 && best && worst ? (
                  <div className="perf-grid">
                    <div className="perf-card perf-best">
                      <div className="perf-card-eyebrow">Best performer</div>
                      <div className="perf-card-asset">
                        <strong>{best.ticker || best.asset_name}</strong>
                        {best.ticker && <span className="perf-card-name">{best.asset_name}</span>}
                      </div>
                      <div className="perf-card-return positive">
                        +{best.pnlPct!.toFixed(2)}%
                      </div>
                      <div className="perf-card-abs positive">
                        +{fmt(toDisplay(best.pnl!, best.currency), displayCurrency)}
                      </div>
                    </div>

                    <div className="perf-card perf-worst">
                      <div className="perf-card-eyebrow">Worst performer</div>
                      <div className="perf-card-asset">
                        <strong>{worst.ticker || worst.asset_name}</strong>
                        {worst.ticker && <span className="perf-card-name">{worst.asset_name}</span>}
                      </div>
                      <div className={`perf-card-return${worst.pnlPct! >= 0 ? ' positive' : ' negative'}`}>
                        {fmtPct(worst.pnlPct!)}
                      </div>
                      <div className={`perf-card-abs${worst.pnl! >= 0 ? ' positive' : ' negative'}`}>
                        {worst.pnl! >= 0 ? '+' : ''}{fmt(toDisplay(worst.pnl!, worst.currency), displayCurrency)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="muted" style={{ fontSize: '.85rem', marginBottom: '1.5rem' }}>
                    Add a current price to any position to see performance highlights.
                  </p>
                )}

                <p className="eyebrow" style={{ marginTop: '1.5rem', marginBottom: '.75rem' }}>Asset classes</p>
                <div className="type-breakdown-v2">
                  {Object.entries(byType)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, val]) => {
                      const pct = totalInvested > 0 ? (val / totalInvested) * 100 : 0;
                      return (
                        <div key={type} className="type-row-v2">
                          <div className="type-row-head">
                            <span className={`portfolio-type-chip ${TYPE_CHIP[type] || 'chip-other'}`}>
                              {type}
                            </span>
                            <span className="type-row-pct">{pct.toFixed(1)}%</span>
                            <span className="type-row-val">{fmtShort(val, displayCurrency)}</span>
                          </div>
                          <div className="type-row-bar-bg">
                            <div
                              className="type-row-bar-fill"
                              style={{ width: `${pct}%`, background: TYPE_COLORS[type] || '#64748b' }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Average buy prices */}
                <p className="eyebrow" style={{ marginTop: '1.75rem', marginBottom: '.75rem' }}>Avg buy prices</p>
                <div className="avg-price-v2">
                  {grouped.map(g => (
                    <div key={g.key} className="avg-price-row-v2">
                      <div className="avg-price-asset-v2">
                        <strong>{g.ticker || g.asset_name}</strong>
                        {g.ticker && <span>{g.asset_name}</span>}
                      </div>
                      <div className="avg-price-right">
                        <span className="avg-price-num-v2">
                          {fmt(toDisplay(g.avgBuyPrice, g.currency), displayCurrency)}
                        </span>
                        <span className="avg-price-qty-v2">{fmtQty(g.totalQty)} units</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Holdings table */}
            <section className="portfolio-card">
              <p className="eyebrow">Holdings</p>
              <h2>All positions</h2>
              <div className="portfolio-table-wrap">
                <table className="portfolio-table portfolio-table-v2">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Type</th>
                      <th className="num">Qty</th>
                      <th className="num">Avg Buy</th>
                      <th className="num">Invested</th>
                      <th className="num">Update Price</th>
                      <th className="num">Current Value</th>
                      <th className="num">P&amp;L</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.map(g => {
                      const investedDisp = toDisplay(g.totalInvested, g.currency);
                      const allocPct = totalInvested > 0 ? (investedDisp / totalInvested) * 100 : 0;
                      const valueDisp = g.currentValue != null
                        ? toDisplay(g.currentValue, g.currency) : null;
                      const pnlDisp = g.pnl != null
                        ? toDisplay(g.pnl, g.currency) : null;
                      const avgDisp = toDisplay(g.avgBuyPrice, g.currency);

                      return (
                        <>
                          <tr key={g.key} className="holdings-group-row">
                            <td>
                              <div className="holdings-asset-block">
                                <div className="portfolio-asset-name">{g.asset_name}</div>
                                {g.ticker && <div className="portfolio-ticker">{g.ticker.toUpperCase()}</div>}
                              </div>
                              <div className="alloc-bar-wrap" title={`${allocPct.toFixed(1)}% of portfolio`}>
                                <div
                                  className="alloc-bar-fill"
                                  style={{ width: `${Math.min(allocPct, 100)}%` }}
                                />
                              </div>
                              <div className="alloc-pct-label">{allocPct.toFixed(1)}% of portfolio</div>
                            </td>
                            <td>
                              <span className={`portfolio-type-chip ${TYPE_CHIP[g.asset_type] || 'chip-other'}`}>
                                {g.asset_type}
                              </span>
                            </td>
                            <td className="num">{fmtQty(g.totalQty)}</td>
                            <td className="num">{fmt(avgDisp, displayCurrency)}</td>
                            <td className="num muted">{fmt(investedDisp, displayCurrency)}</td>
                            <td className="num">
                              <form action={updateCurrentPrice} className="price-update-form">
                                <input type="hidden" name="id" value={g.entries[0].id} />
                                <div className="price-input-wrap">
                                  <input
                                    type="number"
                                    name="current_price"
                                    step="any"
                                    placeholder="—"
                                    defaultValue={g.currentPrice != null ? String(g.currentPrice) : ''}
                                    className="price-input"
                                  />
                                  <button type="submit" className="price-update-btn" title="Update">✓</button>
                                </div>
                                <div className="price-currency-hint">{g.currency}</div>
                              </form>
                            </td>
                            <td className="num">
                              {valueDisp != null
                                ? <strong>{fmt(valueDisp, displayCurrency)}</strong>
                                : <span className="muted">—</span>}
                            </td>
                            <td className={`num${pnlDisp == null ? '' : pnlDisp >= 0 ? ' positive' : ' negative'}`}>
                              {pnlDisp == null ? (
                                <span className="muted">—</span>
                              ) : (
                                <>
                                  <div className="pnl-main">
                                    {pnlDisp >= 0 ? '▲' : '▼'} {pnlDisp >= 0 ? '+' : ''}{fmtShort(pnlDisp, displayCurrency)}
                                  </div>
                                  <div className="pnl-pct">{fmtPct(g.pnlPct!)}</div>
                                </>
                              )}
                            </td>
                            <td></td>
                          </tr>

                          {g.entries.length > 1 && g.entries.map(e => {
                            const inv = toDisplay(Number(e.quantity) * Number(e.buy_price), e.currency);
                            return (
                              <tr key={e.id} className="holdings-sub-row">
                                <td>
                                  <div className="sub-row-date">{e.buy_date || 'No date'}</div>
                                  {e.notes && <div className="sub-row-note">{e.notes}</div>}
                                </td>
                                <td></td>
                                <td className="num muted">{fmtQty(Number(e.quantity))}</td>
                                <td className="num muted">
                                  {fmt(toDisplay(Number(e.buy_price), e.currency), displayCurrency)}
                                </td>
                                <td className="num muted">{fmt(inv, displayCurrency)}</td>
                                <td></td><td></td><td></td>
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
                              <td colSpan={6}></td>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {rows.length === 0 && (
          <div className="portfolio-empty">
            <div className="portfolio-empty-icon">📊</div>
            <h3>No positions yet</h3>
            <p>Add your first investment below to start tracking your portfolio.</p>
          </div>
        )}

        <AddPositionForm />
      </div>
    </main>
  );
}
