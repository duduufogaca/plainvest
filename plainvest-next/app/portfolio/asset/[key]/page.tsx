import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { signOut } from '../../../actions/auth';
import { deletePortfolioEntry, updateCurrentPrice } from '../../../actions/portfolio';
import { SubmitButton } from '../../../components/submit-button';
import { getExchangeRates } from '@/lib/exchange-rates';
import { T, getLang } from '@/lib/portfolio-i18n';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = {
  title: 'Asset Detail — Plainvest',
  robots: { index: false, follow: false },
};

const VALID_CURRENCIES = ['AUD', 'USD', 'BRL'] as const;
type Currency = typeof VALID_CURRENCIES[number];

const TYPE_CHIP: Record<string, string> = {
  crypto: 'chip-crypto', stock: 'chip-stock', etf: 'chip-etf', other: 'chip-other',
};
const TYPE_COLORS: Record<string, string> = {
  crypto: '#f4c86a', stock: '#61d5b4', etf: '#818cf8', other: '#64748b',
};

function getLocale(c: string) {
  return c === 'BRL' ? 'pt-BR' : c === 'USD' ? 'en-US' : 'en-AU';
}

function fmt(n: number, currency = 'AUD') {
  return new Intl.NumberFormat(getLocale(currency), {
    style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n);
}

function fmtQty(n: number) {
  return n % 1 === 0
    ? n.toLocaleString('en-AU')
    : n.toLocaleString('en-AU', { maximumFractionDigits: 8 });
}

export default async function AssetDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ key: string }>;
  searchParams: Promise<{ currency?: string; lang?: string }>;
}) {
  const { key: rawKey } = await params;
  const assetKey = decodeURIComponent(rawKey);
  const sp = await searchParams;

  const displayCurrency: Currency =
    VALID_CURRENCIES.includes(sp.currency as Currency)
      ? (sp.currency as Currency)
      : 'AUD';
  const lang = getLang(sp.lang);
  const tx = T[lang];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { isPremium } = await getPremiumAccess(supabase, user.id);
  if (!isPremium) redirect('/dashboard');

  const rates = await getExchangeRates(displayCurrency);
  const toDisplay = (amount: number, fromCurrency: string) => {
    if (fromCurrency === displayCurrency) return amount;
    const rate = rates[fromCurrency];
    return rate ? amount / rate : amount;
  };

  const { data: allEntries } = await supabase
    .from('portfolio_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('buy_date', { ascending: false });

  // Filter to this asset
  const entries = (allEntries || []).filter(e => {
    const k = (e.ticker || e.asset_name).toLowerCase().trim();
    return k === assetKey;
  });

  if (entries.length === 0) redirect(`/portfolio?currency=${displayCurrency}&lang=${lang}`);

  const sample = entries[0];
  const assetName = sample.asset_name;
  const ticker = sample.ticker;
  const assetType = sample.asset_type;
  const nativeCurrency = sample.currency;

  // Totals
  const totalQty = entries.reduce((s, e) => s + Number(e.quantity), 0);
  const totalInvestedNative = entries.reduce((s, e) => s + Number(e.quantity) * Number(e.buy_price), 0);
  const totalInvestedDisplay = toDisplay(totalInvestedNative, nativeCurrency);
  const avgBuyNative = totalQty > 0 ? totalInvestedNative / totalQty : 0;
  const avgBuyDisplay = toDisplay(avgBuyNative, nativeCurrency);

  // Current price / P&L
  const currentPriceNative = entries[0].current_price ? Number(entries[0].current_price) : null;
  const currentValueDisplay = currentPriceNative != null
    ? toDisplay(totalQty * currentPriceNative, nativeCurrency) : null;
  const pnlDisplay = currentValueDisplay != null
    ? currentValueDisplay - totalInvestedDisplay : null;
  const pnlPct = pnlDisplay != null && totalInvestedDisplay > 0
    ? (pnlDisplay / totalInvestedDisplay) * 100 : null;

  const backHref = `/portfolio?currency=${displayCurrency}&lang=${lang}`;
  const hubHref = '/index.html?member_session=1#member';

  const initials = (ticker || assetName).slice(0, 2).toUpperCase();
  const typeColor = TYPE_COLORS[assetType] || '#64748b';

  return (
    <main className="portfolio-shell">
      <nav className="portfolio-topbar">
        <a href={hubHref} className="brand">Plainvest</a>
        <div className="portfolio-topbar-actions">
          <a href={backHref} className="ghost-nav-link">{tx.backPortfolio}</a>
          <a href={hubHref} className="ghost-nav-link">{tx.hub}</a>
          <form action={signOut}>
            <SubmitButton className="ghost" pendingText="...">{tx.logout}</SubmitButton>
          </form>
        </div>
      </nav>

      <div className="portfolio-content portfolio-content-wide">
        {/* Header */}
        <div className="detail-header">
          <div className="detail-header-icon" style={{ background: typeColor }}>
            {initials}
          </div>
          <div className="detail-header-text">
            <p className="eyebrow">{tx.detailEyebrow}</p>
            <h1>{assetName}{ticker && <span className="detail-ticker">{ticker.toUpperCase()}</span>}</h1>
            <span className={`portfolio-type-chip ${TYPE_CHIP[assetType] || 'chip-other'}`}>{assetType}</span>
          </div>
        </div>

        {/* KPI row */}
        <div className="portfolio-kpi-row">
          <div className="portfolio-kpi-card">
            <span className="portfolio-kpi-label">{tx.totalQty}</span>
            <strong className="portfolio-kpi-value" style={{ fontSize: '1.4rem' }}>{fmtQty(totalQty)}</strong>
            <span className="portfolio-kpi-sub">{tx.nBuys(entries.length)}</span>
          </div>
          <div className="portfolio-kpi-card">
            <span className="portfolio-kpi-label">{tx.avgBuy}</span>
            <strong className="portfolio-kpi-value" style={{ fontSize: '1.35rem' }}>
              {fmt(avgBuyDisplay, displayCurrency)}
            </strong>
            <span className="portfolio-kpi-sub">{nativeCurrency} → {displayCurrency}</span>
          </div>
          <div className="portfolio-kpi-card">
            <span className="portfolio-kpi-label">{tx.totalInvested}</span>
            <strong className="portfolio-kpi-value" style={{ fontSize: '1.35rem' }}>
              {fmt(totalInvestedDisplay, displayCurrency)}
            </strong>
            <span className="portfolio-kpi-sub">{nativeCurrency}</span>
          </div>
          <div className={`portfolio-kpi-card${pnlDisplay == null ? '' : pnlDisplay >= 0 ? ' kpi-positive' : ' kpi-negative'}`}>
            <span className="portfolio-kpi-label">{tx.pnl}</span>
            <strong className={`portfolio-kpi-value${pnlDisplay == null ? '' : pnlDisplay >= 0 ? ' positive' : ' negative'}`}
              style={{ fontSize: '1.35rem' }}>
              {pnlDisplay == null ? '—' : (pnlDisplay >= 0 ? '+' : '') + fmt(pnlDisplay, displayCurrency)}
            </strong>
            <span className="portfolio-kpi-sub">
              {pnlPct == null ? tx.kpiAddPrices : (pnlPct >= 0 ? '▲ +' : '▼ ') + pnlPct.toFixed(2) + '%'}
            </span>
          </div>
        </div>

        {/* Update current price */}
        <section className="portfolio-card detail-price-card">
          <p className="eyebrow">{tx.colPrice}</p>
          <h2>{tx.updatePrice}</h2>
          <form action={updateCurrentPrice} className="detail-price-form">
            <input type="hidden" name="id" value={entries[0].id} />
            <input
              type="number"
              name="current_price"
              step="any"
              placeholder={`${nativeCurrency} —`}
              defaultValue={currentPriceNative != null ? String(currentPriceNative) : ''}
              className="detail-price-input"
            />
            <SubmitButton pendingText="..." className="detail-price-btn">✓ Update</SubmitButton>
          </form>
          {currentPriceNative != null && (
            <p className="detail-price-hint">
              Current: {fmt(currentPriceNative, nativeCurrency)} {nativeCurrency}
              {nativeCurrency !== displayCurrency && (
                <> → {fmt(toDisplay(currentPriceNative, nativeCurrency), displayCurrency)} {displayCurrency}</>
              )}
            </p>
          )}
        </section>

        {/* Purchase history */}
        <section className="portfolio-card">
          <p className="eyebrow">{tx.detailEyebrow}</p>
          <h2>{tx.detailTitle}</h2>
          <div className="portfolio-table-wrap">
            <table className="portfolio-table portfolio-table-v2 detail-table">
              <thead>
                <tr>
                  <th>{tx.colDate}</th>
                  <th className="num">{tx.colQty}</th>
                  <th className="num">{tx.colBuyPrice} ({nativeCurrency})</th>
                  <th className="num">{tx.colBuyPrice} ({displayCurrency})</th>
                  <th className="num">{tx.colCost} ({displayCurrency})</th>
                  <th>{tx.colNotes}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => {
                  const buyPriceDisplay = toDisplay(Number(e.buy_price), e.currency);
                  const costDisplay = toDisplay(Number(e.quantity) * Number(e.buy_price), e.currency);
                  return (
                    <tr key={e.id}>
                      <td>
                        <span className="detail-date">
                          {e.buy_date || <span className="muted">{tx.noDate}</span>}
                        </span>
                      </td>
                      <td className="num">{fmtQty(Number(e.quantity))}</td>
                      <td className="num muted">{fmt(Number(e.buy_price), e.currency)}</td>
                      <td className="num">{fmt(buyPriceDisplay, displayCurrency)}</td>
                      <td className="num"><strong>{fmt(costDisplay, displayCurrency)}</strong></td>
                      <td>
                        {e.notes
                          ? <span className="detail-note">{e.notes}</span>
                          : <span className="muted">—</span>}
                      </td>
                      <td>
                        <form action={deletePortfolioEntry}>
                          <input type="hidden" name="id" value={e.id} />
                          <button type="submit" className="delete-btn" title="Remove">✕</button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
