import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { updateCurrentPrice } from '../actions/portfolio';
import { DonutChart, type DonutSegment } from './components/DonutChart';
import { SidebarClient } from './components/SidebarClient';
import { PortfolioLineChart, type ChartPoint } from './components/PortfolioLineChart';
import { AssetLogo } from './components/AssetLogo';
import { ClickableRow } from './components/ClickableRow';
import { KpiCard } from './components/KpiCard';
import { AddPositionModal } from './components/AddPositionModal';
import { ProjectionEngine } from './components/ProjectionEngine';
import { getExchangeRates } from '@/lib/exchange-rates';
import { fetchLivePrices } from '@/lib/live-prices';
import type { LivePrices } from '@/lib/live-prices';
import { T, getLang } from '@/lib/portfolio-i18n';
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
  created_at: string;
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
  '#f7931a', // BTC orange
  '#5c9af5', // royal blue
  '#a78bfa', // violet
  '#34d399', // emerald
  '#e8b84b', // warm gold
  '#e879f9', // fuchsia
  '#60a5fa', // sky
  '#fb923c', // tangerine
  '#c084fc', // lavender
  '#4ade80', // vivid green
  '#38bdf8', // cyan
  '#94a3b8', // slate
];
const TYPE_COLORS: Record<string, string> = {
  crypto: '#f7931a', stock: '#5c9af5', etf: '#a78bfa', other: '#64748b',
};
const TYPE_CHIP: Record<string, string> = {
  crypto: 'chip-crypto', stock: 'chip-stock', etf: 'chip-etf', other: 'chip-other',
};

function getLocale(c: string) {
  return c === 'BRL' ? 'pt-BR' : c === 'USD' ? 'en-US' : 'en-AU';
}
function fmt(n: number, currency = 'AUD') {
  return new Intl.NumberFormat(getLocale(currency), {
    style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n);
}
function fmtShort(n: number, currency = 'AUD') {
  return new Intl.NumberFormat(getLocale(currency), {
    style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0,
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
    // Keep the first non-null price encountered (rows are newest-first)
    if (e.current_price != null && g.currentPrice === null) {
      g.currentPrice = Number(e.current_price);
    }
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

function buildChartData(
  rows: Entry[],
  toDisplay: (amount: number, currency: string) => number,
): ChartPoint[] {
  const byMonth: Record<string, number> = {};
  rows.forEach(e => {
    // Use buy_date if set, fall back to created_at (strip time portion)
    const rawDate = e.buy_date || (e.created_at ? e.created_at.slice(0, 10) : null);
    if (!rawDate) return;
    const d = new Date(rawDate + 'T00:00:00');
    if (isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    byMonth[key] = (byMonth[key] || 0) + toDisplay(Number(e.quantity) * Number(e.buy_price), e.currency);
  });

  const keys = Object.keys(byMonth).sort();
  if (keys.length === 0) return [];

  const result: ChartPoint[] = [];
  let cumulative = 0;
  const first = new Date(keys[0] + '-01');
  const now = new Date();

  const cur = new Date(first);
  while (
    cur.getFullYear() < now.getFullYear() ||
    (cur.getFullYear() === now.getFullYear() && cur.getMonth() <= now.getMonth())
  ) {
    const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}`;
    const added = byMonth[key] || 0;
    cumulative += added;
    if (cumulative > 0) result.push({ label: key, cumulative, added });
    cur.setMonth(cur.getMonth() + 1);
  }
  return result;
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; success?: string; currency?: string; lang?: string }>;
}) {
  const params = await searchParams;

  const displayCurrency: Currency =
    VALID_CURRENCIES.includes(params.currency as Currency)
      ? (params.currency as Currency)
      : 'AUD';
  const lang = getLang(params.lang);
  const tx = T[lang];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { isPremium } = await getPremiumAccess(supabase, user.id);
  if (!isPremium) redirect('/dashboard');

  const fullName: string = user.user_metadata?.full_name || '';
  const firstName = fullName.split(' ')[0] || user.email?.split('@')[0] || '';

  const rates = await getExchangeRates(displayCurrency);
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

  // Fetch live prices (Yahoo Finance, 5-min server cache)
  const livePrices: LivePrices = await fetchLivePrices(
    grouped.map(g => ({ key: g.key, ticker: g.ticker, assetType: g.asset_type, currency: g.currency }))
  );

  // Apply live prices: override currentPrice / currentValue / pnl on grouped assets
  // Formula: nativePrice = (livePrice / rates[lp.priceCurrency]) * rates[g.currency]
  grouped.forEach(g => {
    const lp = livePrices[g.key];
    if (!lp) return;
    const nativePrice = (lp.price / (rates[lp.priceCurrency] ?? 1)) * (rates[g.currency] ?? 1);
    g.currentPrice = nativePrice;
    g.currentValue = g.totalQty * nativePrice;
    g.pnl = g.currentValue - g.totalInvested;
    g.pnlPct = g.totalInvested > 0 ? (g.pnl / g.totalInvested) * 100 : null;
  });

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

  // By-type invested
  const byType: Record<string, number> = {};
  rows.forEach(e => {
    byType[e.asset_type] = (byType[e.asset_type] || 0) +
      toDisplay(Number(e.quantity) * Number(e.buy_price), e.currency);
  });

  // Donut
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
      label: 'Other', value: restTotal,
      pct: totalInvested > 0 ? (restTotal / totalInvested) * 100 : 0,
      color: '#475569',
    }] : []),
  ];

  // Chart data
  const chartData = buildChartData(rows, toDisplay);

  const backHref = '/index.html?member_session=1#member';
  const detailBase = `?currency=${displayCurrency}&lang=${lang}`;

  const unpricedCount = grouped.length - pricedGroups.length;

  // Projection inputs
  const projCurrentValue = pricedGroups.length > 0 ? currentValue : totalInvested;
  const monthsActive = Math.max(chartData.length, 1);
  // Only calculate avg monthly contribution when we have 2+ months of data;
  // a single-month portfolio would produce a nonsensically high number.
  const projMonthlyContrib = monthsActive >= 2 ? totalInvested / monthsActive : 0;

  // CAGR (annualised return since first buy)
  const yearsActive = monthsActive / 12;
  const cagr = (pnl != null && pricedCost > 0 && yearsActive >= 0.1)
    ? (Math.pow(currentValue / pricedCost, 1 / yearsActive) - 1) * 100
    : null;

  return (
    <main className="portfolio-shell">

      {/* ── Sidebar ─────────────────────────────────────── */}
      <SidebarClient
        displayCurrency={displayCurrency}
        lang={lang}
        backHref={backHref}
        profileLabel={tx.profile}
        logoutLabel={tx.logout}
        userName={firstName}
      />

      {/* ── Main ────────────────────────────────────────── */}
      <div className="portfolio-main">
        <header className="portfolio-topbar">
          <div className="topbar-brand-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/LOGO%20TRANSPARENTE%20BACK.png"
              alt="Plainvest"
              className="topbar-logo-img"
            />
            <h1 className="topbar-portfolio-heading">
              {lang === 'pt' ? 'Portfólio' : 'Portfolio'}
            </h1>
          </div>
        </header>

      <div className="portfolio-content portfolio-content-wide">

        {params.success && <div className="notice notice-success">{params.success}</div>}
        {params.message && <div className="notice">{params.message}</div>}

        {/* ── 3 KPI cards ── */}
        <div className="portfolio-kpi-row">
          <KpiCard
            label={tx.kpiInvested}
            value={rows.length > 0 ? fmtShort(totalInvested, displayCurrency) : '—'}
            sub={`${rows.length} ${rows.length !== 1 ? tx.purchases : tx.purchase} · ${grouped.length} ${grouped.length !== 1 ? tx.assets : tx.asset}`}
          />
          <KpiCard
            label={tx.kpiValue}
            value={pricedGroups.length > 0 ? fmtShort(currentValue, displayCurrency) : '—'}
            valueCls={pricedGroups.length === 0 ? 'kpi-muted' : ''}
            sub={pricedGroups.length === 0 ? tx.kpiAddPrices : tx.kpiPriced(pricedGroups.length, grouped.length)}
          />
          <KpiCard
            label={tx.kpiReturn}
            value={pnl == null ? '—' : (pnl >= 0 ? '+' : '') + fmtShort(pnl, displayCurrency)}
            valueCls={pnl == null ? '' : pnl >= 0 ? 'positive' : 'negative'}
            sub={pnlPct == null ? tx.kpiAddPrices : (pnlPct >= 0 ? '▲ +' : '▼ ') + pnlPct.toFixed(2) + '% ' + tx.kpiGainSuffix}
            cardCls={pnl == null ? '' : pnl >= 0 ? 'kpi-positive' : 'kpi-negative'}
          />
        </div>

        {/* Prices notice */}
        {rows.length > 0 && unpricedCount > 0 && (
          <div className="prices-notice">
            <span className="prices-notice-icon">💡</span>
            <span>{tx.pricesNotice(unpricedCount)}</span>
          </div>
        )}

        {rows.length > 0 && (
          <>
            {/* ── 1. Allocation + Performance ── */}
            <div className="portfolio-overview-v2">
              <section className="portfolio-card portfolio-dark-card">
                <div className="card-header-row">
                  <div>
                    <p className="eyebrow">{tx.sectionAlloc}</p>
                    <h2>{tx.sectionBreakdown}</h2>
                  </div>
                  <AddPositionModal lang={lang} />
                </div>
                <DonutChart segments={donutSegments} totalValue={totalInvested} currency={displayCurrency} />
              </section>

              <section className="portfolio-card portfolio-perf-card">
                <p className="eyebrow">{tx.sectionPerf}</p>
                <h2>{tx.sectionHighlights}</h2>

                {performingGroups.length > 0 && best && worst ? (
                  <div className={`perf-grid${best.key === worst.key ? ' perf-grid-single' : ''}`}>
                    <div className="perf-card perf-best">
                      <div className="perf-card-eyebrow">{tx.perfBest}</div>
                      <div className="perf-card-asset">
                        <strong>{best.ticker || best.asset_name}</strong>
                        {best.ticker && <span className="perf-card-name">{best.asset_name}</span>}
                      </div>
                      <div className={`perf-card-return${best.pnlPct! >= 0 ? ' positive' : ' negative'}`}>
                        {fmtPct(best.pnlPct!)}
                      </div>
                      <div className={`perf-card-abs${best.pnl! >= 0 ? ' positive' : ' negative'}`}>
                        {best.pnl! >= 0 ? '+' : ''}{fmt(toDisplay(best.pnl!, best.currency), displayCurrency)}
                      </div>
                    </div>
                    {best.key !== worst.key && (
                      <div className="perf-card perf-worst">
                        <div className="perf-card-eyebrow">{tx.perfWorst}</div>
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
                    )}
                  </div>
                ) : (
                  <p className="muted" style={{ fontSize: '.83rem', marginBottom: '1.5rem' }}>
                    {tx.perfAddPrices}
                  </p>
                )}

                {/* CAGR stat */}
                {cagr !== null && (
                  <div className="cagr-row">
                    <span className="cagr-label">CAGR</span>
                    <span className={`cagr-val${cagr >= 0 ? ' positive' : ' negative'}`}>
                      {cagr >= 0 ? '+' : ''}{cagr.toFixed(2)}%
                    </span>
                    <span className="cagr-sub">
                      {lang === 'pt' ? 'retorno anualizado' : 'annualised return'} · {yearsActive.toFixed(1)}{lang === 'pt' ? ' anos' : ' yrs'}
                    </span>
                  </div>
                )}

                <p className="eyebrow" style={{ marginTop: '1.5rem', marginBottom: '.65rem' }}>{tx.sectionClasses}</p>
                <div className="type-breakdown-v2">
                  {Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([type, val]) => {
                    const pct = totalInvested > 0 ? (val / totalInvested) * 100 : 0;
                    return (
                      <div key={type} className="type-row-v2">
                        <div className="type-row-head">
                          <span className={`portfolio-type-chip ${TYPE_CHIP[type] || 'chip-other'}`}>{type}</span>
                          <span className="type-row-pct">{pct.toFixed(1)}%</span>
                          <span className="type-row-val">{fmtShort(val, displayCurrency)}</span>
                        </div>
                        <div className="type-row-bar-bg">
                          <div className="type-row-bar-fill"
                            style={{ width: `${pct}%`, background: TYPE_COLORS[type] || '#64748b' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* ── 2. Portfolio Evolution ── */}
            <section className="portfolio-card portfolio-chart-card">
              <div className="pchart-header">
                <div>
                  <p className="eyebrow">{tx.chartEyebrow}</p>
                  <h2>{tx.chartTitle}</h2>
                </div>
                {chartData.length > 0 && (
                  <div className="pchart-summary">
                    <span className="pchart-summary-label">{tx.chartSince}</span>
                    <span className="pchart-summary-val">
                      {chartData[0].label.replace('-', '/')}
                    </span>
                  </div>
                )}
              </div>
              <PortfolioLineChart monthly={chartData} currency={displayCurrency} lang={lang} />
            </section>

            {/* ── 3. Holdings ── */}
            <section className="portfolio-card">
              <div className="card-header-row">
                <div>
                  <p className="eyebrow">{tx.sectionHoldings}</p>
                  <h2>{tx.sectionAllPositions}</h2>
                </div>
                <span className="holdings-count-badge">{grouped.length} {grouped.length !== 1 ? tx.assets : tx.asset}</span>
              </div>
              <div className="portfolio-table-wrap">
                <table className="portfolio-table portfolio-table-v2 holdings-table-v3">
                  <thead>
                    <tr>
                      <th>{tx.colAsset}</th>
                      <th>{tx.colType}</th>
                      <th className="num">{tx.colQty}</th>
                      <th className="num">{tx.colAvgBuy}</th>
                      <th className="num">{tx.colInvested}</th>
                      <th className="num">{tx.colPrice}</th>
                      <th className="num">{tx.colValue}</th>
                      <th className="num">{tx.colPnl}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped.map(g => {
                      const investedDisp = toDisplay(g.totalInvested, g.currency);
                      const allocPct = totalInvested > 0 ? (investedDisp / totalInvested) * 100 : 0;
                      const valueDisp = g.currentValue != null
                        ? toDisplay(g.currentValue, g.currency) : null;
                      const pnlDisp = g.pnl != null ? toDisplay(g.pnl, g.currency) : null;
                      const avgDisp = toDisplay(g.avgBuyPrice, g.currency);
                      const initials = (g.ticker || g.asset_name).slice(0, 2).toUpperCase();
                      const typeColor = TYPE_COLORS[g.asset_type] || '#64748b';
                      const detailHref = `/portfolio/asset/${encodeURIComponent(g.key)}${detailBase}`;

                      return (
                        <ClickableRow key={g.key} href={detailHref} className="holdings-row-v3">
                          <td>
                            <div className="holdings-asset-cell">
                              <AssetLogo
                                ticker={g.ticker}
                                assetType={g.asset_type}
                                initials={initials}
                                color={typeColor}
                              />
                              <div className="holdings-asset-info">
                                <span className="portfolio-asset-name">{g.asset_name}</span>
                                {g.ticker && <span className="portfolio-ticker">{g.ticker.toUpperCase()}</span>}
                                <div className="alloc-bar-wrap">
                                  <div className="alloc-bar-fill" style={{ width: `${Math.min(allocPct, 100)}%` }} />
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`portfolio-type-chip ${TYPE_CHIP[g.asset_type] || 'chip-other'}`}>
                              {g.asset_type}
                            </span>
                          </td>
                          <td className="num">
                            <div>{fmtQty(g.totalQty)}</div>
                            {g.entries.length > 1 && (
                              <div className="buys-badge">{tx.nBuys(g.entries.length)}</div>
                            )}
                          </td>
                          <td className="num">{fmt(avgDisp, displayCurrency)}</td>
                          <td className="num muted">{fmt(investedDisp, displayCurrency)}</td>
                          <td className="num">
                            {g.currentPrice != null ? (
                              <div className="price-display-cell">
                                <span className="price-display-val">{fmt(g.currentPrice, g.currency)}</span>
                                {livePrices[g.key]
                                  ? <span className="price-live-badge">{tx.livePrice}</span>
                                  : <span className="price-manual-badge">{tx.manualPrice}</span>}
                              </div>
                            ) : (
                              <form action={updateCurrentPrice} className="price-update-form">
                                <input type="hidden" name="id" value={g.entries[0].id} />
                                <div className="price-input-wrap">
                                  <input
                                    type="number"
                                    name="current_price"
                                    step="any"
                                    placeholder="—"
                                    className="price-input price-input-sm"
                                  />
                                  <button type="submit" className="price-update-btn" title="Update">✓</button>
                                </div>
                                <div className="price-currency-hint">{g.currency}</div>
                              </form>
                            )}
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
                          <td>
                            <a href={detailHref} className="row-arrow-link" aria-label={`View ${g.asset_name}`}>→</a>
                          </td>
                        </ClickableRow>
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
            <h3>{tx.emptyTitle}</h3>
            <p>{tx.emptyText}</p>
            <AddPositionModal lang={lang} />
          </div>
        )}

        {/* ── Future Projection ── */}
        {rows.length > 0 && (
          <ProjectionEngine
            currentValue={projCurrentValue}
            monthlyContribution={projMonthlyContrib}
            currency={displayCurrency}
            lang={lang}
          />
        )}
      </div>
      </div>
    </main>
  );
}
