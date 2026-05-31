import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { deletePortfolioEntry, updateCurrentPrice, updatePortfolioEntry } from '../../../actions/portfolio';
import { SubmitButton } from '../../../components/submit-button';
import { SidebarClient } from '../../components/SidebarClient';
import { AssetLogo } from '../../components/AssetLogo';
import { getExchangeRates } from '@/lib/exchange-rates';
import { fetchLivePrices } from '@/lib/live-prices';
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

const TYPE_COLORS: Record<string, string> = {
  crypto: '#f4c86a', stock: '#61d5b4', etf: '#818cf8', other: '#64748b',
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
  searchParams: Promise<{ currency?: string; lang?: string; edit?: string; success?: string; message?: string }>;
}) {
  const { key: rawKey } = await params;
  const assetKey = decodeURIComponent(rawKey);
  const sp = await searchParams;

  const displayCurrency: Currency =
    VALID_CURRENCIES.includes(sp.currency as Currency)
      ? (sp.currency as Currency)
      : 'USD';
  const lang = getLang(sp.lang);
  const tx = T[lang];
  const editId = sp.edit || null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { isPremium } = await getPremiumAccess(supabase, user.id);
  if (!isPremium) redirect('/dashboard');

  const fullName: string = user.user_metadata?.full_name || '';
  const firstName = fullName.split(' ')[0] || user.email?.split('@')[0] || '';

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

  // Find earliest purchase date for "since" display
  const dates = entries.map(e => e.buy_date).filter(Boolean).sort();
  const sinceDateRaw = dates[0] || null;
  const sinceDate = sinceDateRaw
    ? new Date(sinceDateRaw + 'T00:00:00').toLocaleDateString(getLocale(displayCurrency), { month: 'short', year: 'numeric' })
    : null;

  // Totals
  const totalQty = entries.reduce((s, e) => s + Number(e.quantity), 0);
  const totalInvestedNative = entries.reduce((s, e) => s + Number(e.quantity) * Number(e.buy_price), 0);
  const totalInvestedDisplay = toDisplay(totalInvestedNative, nativeCurrency);
  const avgBuyNative = totalQty > 0 ? totalInvestedNative / totalQty : 0;
  const avgBuyDisplay = toDisplay(avgBuyNative, nativeCurrency);

  // Live price fetch
  const livePrices = await fetchLivePrices([
    { key: assetKey, ticker, assetType, currency: nativeCurrency }
  ]);
  const lp = livePrices[assetKey];
  const isLivePrice = lp != null;

  // Current price — live price wins; fall back to most recent DB value
  const currentPriceNative = (() => {
    if (lp) {
      return (lp.price / (rates[lp.priceCurrency] ?? 1)) * (rates[nativeCurrency] ?? 1);
    }
    for (const e of entries) {
      if (e.current_price != null) return Number(e.current_price);
    }
    return null;
  })();
  const currentValueDisplay = currentPriceNative != null
    ? toDisplay(totalQty * currentPriceNative, nativeCurrency) : null;
  const pnlDisplay = currentValueDisplay != null
    ? currentValueDisplay - totalInvestedDisplay : null;
  const pnlPct = pnlDisplay != null && totalInvestedDisplay > 0
    ? (pnlDisplay / totalInvestedDisplay) * 100 : null;

  const baseHref = `/portfolio/asset/${encodeURIComponent(assetKey)}?currency=${displayCurrency}&lang=${lang}`;
  const backHref = `/portfolio?currency=${displayCurrency}&lang=${lang}`;
  const hubHref = '/index.html?member_session=1#member';

  const initials = (ticker || assetName).slice(0, 2).toUpperCase();
  const typeColor = TYPE_COLORS[assetType] || '#64748b';

  return (
    <main className="portfolio-shell">
      <SidebarClient
        displayCurrency={displayCurrency}
        lang={lang}
        backHref={hubHref}
        portfolioHref={backHref}
        profileLabel={tx.profile}
        logoutLabel={tx.logout}
        userName={firstName}
      />

      <div className="portfolio-main">
      <header className="portfolio-topbar detail-topbar">
        <a href={backHref} className="detail-back-btn">
          ← {lang === 'pt' ? 'Voltar ao portfólio' : 'Back to portfolio'}
        </a>
        <div className="detail-topbar-title">
          <h1 className="portfolio-page-title">{assetName}</h1>
          {ticker && <span className="detail-ticker">{ticker.toUpperCase()}</span>}
        </div>
      </header>
      <div className="portfolio-content portfolio-content-wide">

        {sp.success && <div className="notice notice-success">{sp.success}</div>}
        {sp.message && <div className="notice">{sp.message}</div>}

        {/* ── Asset hero header ── */}
        <div className="asset-hero">
          <AssetLogo ticker={ticker} assetType={assetType} initials={initials} color={typeColor} />
          <div className="asset-hero-body">
            <div className="asset-hero-title">
              <h1>{assetName}</h1>
              {ticker && <span className="detail-ticker">{ticker.toUpperCase()}</span>}
              <span className={`portfolio-type-chip ${TYPE_CHIP[assetType] || 'chip-other'}`}>{assetType}</span>
            </div>
            <div className="asset-hero-meta">
              <span>{entries.length} {entries.length !== 1 ? tx.purchases : tx.purchase}</span>
              {sinceDate && <><span className="asset-hero-sep">·</span><span>{tx.since} {sinceDate}</span></>}
              <span className="asset-hero-sep">·</span>
              <span>{displayCurrency}</span>
            </div>
          </div>
        </div>

        {/* ── KPI grid ── */}
        <div className="detail-kpi-grid">
          {/* Holdings */}
          <div className="detail-kpi-card">
            <div className="detail-kpi-icon">📦</div>
            <span className="detail-kpi-label">{tx.totalQty}</span>
            <strong className="detail-kpi-val">{fmtQty(totalQty)}</strong>
            <span className="detail-kpi-sub">{entries.length} {entries.length !== 1 ? tx.purchases : tx.purchase}</span>
          </div>

          {/* Avg buy price */}
          <div className="detail-kpi-card">
            <div className="detail-kpi-icon">💰</div>
            <span className="detail-kpi-label">{tx.avgBuy}</span>
            <strong className="detail-kpi-val">{fmt(avgBuyDisplay, displayCurrency)}</strong>
            <span className="detail-kpi-sub">{nativeCurrency !== displayCurrency ? `${fmt(avgBuyNative, nativeCurrency)} ${nativeCurrency}` : tx.perUnit}</span>
          </div>

          {/* Cost basis */}
          <div className="detail-kpi-card">
            <div className="detail-kpi-icon">🧾</div>
            <span className="detail-kpi-label">{tx.costBasis}</span>
            <strong className="detail-kpi-val">{fmt(totalInvestedDisplay, displayCurrency)}</strong>
            <span className="detail-kpi-sub">{nativeCurrency !== displayCurrency ? `${fmt(totalInvestedNative, nativeCurrency)} ${nativeCurrency}` : tx.totalPaid}</span>
          </div>

          {/* Market price — live or manual */}
          <div className="detail-kpi-card detail-kpi-price-card">
            <div className="detail-kpi-icon">📈</div>
            <span className="detail-kpi-label">{tx.marketPrice}</span>
            {currentPriceNative != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong className="detail-kpi-val">{fmt(toDisplay(currentPriceNative, nativeCurrency), displayCurrency)}</strong>
                {isLivePrice && <span className="price-live-badge">LIVE</span>}
              </div>
            )}
            {!isLivePrice && (
              <form action={updateCurrentPrice} className="detail-market-form">
                <input type="hidden" name="id" value={entries[0].id} />
                <input type="hidden" name="redirect_to" value={baseHref} />
                <div className="detail-market-input-row">
                  <input
                    type="number"
                    name="current_price"
                    step="any"
                    placeholder={currentPriceNative != null ? tx.updatePrice : tx.enterMarketPrice}
                    defaultValue={currentPriceNative != null ? String(currentPriceNative) : ''}
                    className="detail-market-input"
                  />
                  <SubmitButton pendingText="…" className="detail-market-btn">✓</SubmitButton>
                </div>
              </form>
            )}
            <span className="detail-kpi-sub">{isLivePrice ? (lang === 'pt' ? 'Preço ao vivo via Yahoo Finance' : 'Live price via Yahoo Finance') : tx.marketPriceHint}</span>
          </div>

          {/* Current value */}
          <div className={`detail-kpi-card${currentValueDisplay == null ? ' detail-kpi-muted' : ''}`}>
            <div className="detail-kpi-icon">{currentValueDisplay == null ? '⏳' : '💼'}</div>
            <span className="detail-kpi-label">{tx.kpiValue}</span>
            <strong className="detail-kpi-val" style={currentValueDisplay == null ? { color: 'var(--muted)' } : {}}>
              {currentValueDisplay != null ? fmt(currentValueDisplay, displayCurrency) : '—'}
            </strong>
            <span className="detail-kpi-sub">
              {currentValueDisplay == null ? tx.kpiAddPrices : `${fmtQty(totalQty)} × ${fmt(currentPriceNative!, nativeCurrency)}`}
            </span>
          </div>

          {/* P&L */}
          <div className={`detail-kpi-card${pnlDisplay == null ? ' detail-kpi-muted' : pnlDisplay >= 0 ? ' kpi-positive' : ' kpi-negative'}`}>
            <div className="detail-kpi-icon">{pnlDisplay == null ? '⏳' : pnlDisplay >= 0 ? '🚀' : '📉'}</div>
            <span className="detail-kpi-label">{tx.pnl}</span>
            <strong className={`detail-kpi-val${pnlDisplay == null ? '' : pnlDisplay >= 0 ? ' positive' : ' negative'}`}>
              {pnlDisplay == null ? '—' : (pnlDisplay >= 0 ? '+' : '') + fmt(pnlDisplay, displayCurrency)}
            </strong>
            <span className="detail-kpi-sub">
              {pnlPct == null ? tx.kpiAddPrices : (pnlPct >= 0 ? '▲ +' : '▼ ') + pnlPct.toFixed(2) + '%'}
            </span>
          </div>
        </div>

        {/* ── Purchase history ── */}
        <section className="portfolio-card">
          <div className="detail-history-header">
            <div>
              <p className="eyebrow">{tx.detailEyebrow}</p>
              <h2>{tx.detailTitle}</h2>
            </div>
          </div>

          <div className="portfolio-table-wrap">
            <table className="portfolio-table portfolio-table-v2 detail-table">
              <thead>
                <tr>
                  <th>{tx.colDate}</th>
                  <th className="num">{tx.colQty}</th>
                  <th className="num">{tx.colBuyPrice} ({nativeCurrency})</th>
                  {nativeCurrency !== displayCurrency && (
                    <th className="num">{tx.colBuyPrice} ({displayCurrency})</th>
                  )}
                  <th className="num">{tx.colCost} ({displayCurrency})</th>
                  <th>{tx.colNotes}</th>
                  <th className="detail-actions-col"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => {
                  const buyPriceDisplay = toDisplay(Number(e.buy_price), e.currency);
                  const costDisplay = toDisplay(Number(e.quantity) * Number(e.buy_price), e.currency);
                  const isEditing = editId === e.id;
                  const cancelHref = baseHref;

                  if (isEditing) {
                    return (
                      <tr key={e.id} className="detail-edit-row">
                        <td colSpan={nativeCurrency !== displayCurrency ? 7 : 6}>
                          <form action={updatePortfolioEntry} className="detail-edit-form">
                            <input type="hidden" name="id" value={e.id} />
                            <input type="hidden" name="redirect_to" value={baseHref} />
                            <div className="detail-edit-grid">
                              <label className="detail-edit-label">
                                {tx.colDate}
                                <input
                                  type="date"
                                  name="buy_date"
                                  defaultValue={e.buy_date || ''}
                                  className="detail-edit-input"
                                />
                              </label>
                              <label className="detail-edit-label">
                                {tx.colQty}
                                <input
                                  type="number"
                                  name="quantity"
                                  step="any"
                                  min="0"
                                  required
                                  defaultValue={String(e.quantity)}
                                  className="detail-edit-input"
                                />
                              </label>
                              <label className="detail-edit-label">
                                {tx.colBuyPrice} ({nativeCurrency})
                                <input
                                  type="number"
                                  name="buy_price"
                                  step="any"
                                  min="0"
                                  required
                                  defaultValue={String(e.buy_price)}
                                  className="detail-edit-input"
                                />
                              </label>
                              <label className="detail-edit-label" style={{ gridColumn: '1 / -1' }}>
                                {tx.colNotes}
                                <input
                                  type="text"
                                  name="notes"
                                  defaultValue={e.notes || ''}
                                  placeholder="e.g. DCA buy"
                                  className="detail-edit-input"
                                />
                              </label>
                            </div>
                            <div className="detail-edit-actions">
                              <SubmitButton pendingText="…" className="detail-save-btn">{tx.saveChanges}</SubmitButton>
                              <a href={cancelHref} className="detail-cancel-link">{tx.cancelEdit}</a>
                            </div>
                          </form>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={e.id} className="detail-data-row">
                      <td>
                        <span className="detail-date">
                          {e.buy_date
                            ? new Date(e.buy_date + 'T00:00:00').toLocaleDateString(getLocale(displayCurrency), { day: 'numeric', month: 'short', year: 'numeric' })
                            : <span className="muted">{tx.noDate}</span>}
                        </span>
                      </td>
                      <td className="num"><strong>{fmtQty(Number(e.quantity))}</strong></td>
                      <td className="num muted">{fmt(Number(e.buy_price), e.currency)}</td>
                      {nativeCurrency !== displayCurrency && (
                        <td className="num">{fmt(buyPriceDisplay, displayCurrency)}</td>
                      )}
                      <td className="num"><strong>{fmt(costDisplay, displayCurrency)}</strong></td>
                      <td>
                        {e.notes
                          ? <span className="detail-note">{e.notes}</span>
                          : <span className="muted">—</span>}
                      </td>
                      <td className="detail-actions-col">
                        <div className="detail-row-actions">
                          <a
                            href={`${baseHref}&edit=${e.id}`}
                            className="detail-edit-btn"
                            title={tx.editPurchase}
                          >✎</a>
                          <form action={deletePortfolioEntry}>
                            <input type="hidden" name="id" value={e.id} />
                            <input type="hidden" name="redirect_to" value={
                              entries.length <= 1 ? backHref : baseHref
                            } />
                            <button
                              type="submit"
                              className="delete-btn"
                              title={tx.deletePurchase}
                            >✕</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      </div>
    </main>
  );
}
