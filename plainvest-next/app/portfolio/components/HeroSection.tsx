'use client';

import { useState } from 'react';

type Props = {
  firstName: string;
  currentValue: number | null;
  totalInvested: number;
  pnl: number | null;
  pnlPct: number | null;
  currency: string;
  lang: string;
  assetCount: number;
  monthsActive: number;
};

function fmt(n: number, currency: string) {
  const locale = currency === 'BRL' ? 'pt-BR' : currency === 'USD' ? 'en-US' : 'en-AU';
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);
}

export function HeroSection({
  firstName, currentValue, totalInvested, pnl, pnlPct,
  currency, lang, assetCount, monthsActive,
}: Props) {
  const [hidden, setHidden] = useState(false);
  const isEN = lang !== 'pt';

  const displayValue = currentValue ?? totalInvested;
  const hasLivePrices = currentValue !== null;
  const isUp = pnl == null || pnl >= 0;

  const valueLabel = hasLivePrices
    ? (isEN ? 'Total Portfolio Value' : 'Valor Total do Portfólio')
    : (isEN ? 'Total Invested' : 'Total Investido');

  const monthLabel = monthsActive >= 12
    ? `${Math.floor(monthsActive / 12)}${isEN
        ? ` yr${Math.floor(monthsActive / 12) > 1 ? 's' : ''}`
        : ` ano${Math.floor(monthsActive / 12) > 1 ? 's' : ''}`}`
    : `${monthsActive} ${isEN ? (monthsActive !== 1 ? 'mo' : 'mo') : (monthsActive !== 1 ? 'meses' : 'mês')}`;

  return (
    <div className="portfolio-hero">
      <div className="portfolio-hero-top-row">
        <span className="portfolio-hero-greeting">
          {isEN ? 'Welcome back,' : 'Bem-vindo de volta,'}{' '}
          <strong className="portfolio-hero-name">{firstName}</strong>
        </span>
        <button
          className="portfolio-hero-eye"
          onClick={() => setHidden(h => !h)}
          title={hidden
            ? (isEN ? 'Show values' : 'Mostrar valores')
            : (isEN ? 'Hide values' : 'Ocultar valores')}
          aria-label={hidden ? 'Show values' : 'Hide values'}
        >
          {hidden
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          }
        </button>
      </div>

      <div className="portfolio-hero-center">
        <div className={`portfolio-hero-bigval${hidden ? ' hero-obscured' : ''}`}>
          {fmt(displayValue, currency)}
        </div>
        <div className="portfolio-hero-vallabel">{valueLabel}</div>

        {hasLivePrices && pnl != null && pnlPct != null && (
          <div className={`portfolio-hero-return${isUp ? ' hero-return-up' : ' hero-return-down'}${hidden ? ' hero-obscured' : ''}`}>
            <span className="hero-return-arrow">{isUp ? '↑' : '↓'}</span>
            <span>{(pnl >= 0 ? '+' : '') + fmt(pnl, currency)}</span>
            <span className="hero-return-dot">·</span>
            <span>{(pnlPct >= 0 ? '+' : '') + pnlPct.toFixed(2) + '%'}</span>
            <span className="hero-return-suffix">{isEN ? 'total return' : 'retorno total'}</span>
          </div>
        )}
      </div>

      <div className="portfolio-hero-stats">
        <div className="portfolio-hero-stat">
          <span className="hero-stat-label">{isEN ? 'Total Invested' : 'Total Investido'}</span>
          <span className={`hero-stat-val${hidden ? ' hero-obscured' : ''}`}>{fmt(totalInvested, currency)}</span>
        </div>
        <div className="hero-stat-div" />
        <div className="portfolio-hero-stat">
          <span className="hero-stat-label">{isEN ? 'Assets held' : 'Ativos'}</span>
          <span className="hero-stat-val">{assetCount}</span>
        </div>
        <div className="hero-stat-div" />
        <div className="portfolio-hero-stat">
          <span className="hero-stat-label">{isEN ? 'Investing for' : 'Investindo há'}</span>
          <span className="hero-stat-val">{monthLabel}</span>
        </div>
      </div>
    </div>
  );
}
