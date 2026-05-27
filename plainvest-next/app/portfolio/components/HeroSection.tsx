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
  projCurrentValue: number;
  projMonthlyContrib: number;
};

function fmt(n: number, currency: string) {
  const locale = currency === 'BRL' ? 'pt-BR' : currency === 'USD' ? 'en-US' : 'en-AU';
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);
}

function fv10y(pv: number, monthly: number): number {
  const r = 0.07 / 12;
  const n = 120;
  return pv * Math.pow(1 + r, n) + monthly * (Math.pow(1 + r, n) - 1) / r;
}

export function HeroSection({
  firstName: _firstName, currentValue, totalInvested, pnl, pnlPct,
  currency, lang, assetCount, monthsActive,
  projCurrentValue, projMonthlyContrib,
}: Props) {
  const [hidden, setHidden] = useState(false);
  const isEN = lang !== 'pt';

  const displayValue = currentValue ?? totalInvested;
  const hasReturn = currentValue !== null && pnl != null && pnlPct != null;
  const isPositiveReturn = pnl != null && pnl >= 0;

  const projection10y = fv10y(projCurrentValue, projMonthlyContrib);
  const futureYear = new Date().getFullYear() + 10;

  const monthLabel = monthsActive >= 12
    ? `${Math.floor(monthsActive / 12)}${isEN
        ? ` yr${Math.floor(monthsActive / 12) > 1 ? 's' : ''}`
        : ` ano${Math.floor(monthsActive / 12) > 1 ? 's' : ''}`}`
    : `${monthsActive} ${isEN
        ? (monthsActive !== 1 ? 'mo' : 'mo')
        : (monthsActive !== 1 ? 'meses' : 'mês')}`;

  return (
    <div className="portfolio-hero">
      {/* Privacy toggle — minimal top row, greeting lives in the page banner */}
      <div className="portfolio-hero-top-row">
        <span className="portfolio-hero-vallabel-sm">
          {isEN ? 'Portfolio overview' : 'Visão do portfólio'}
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
        {/* Number — framed by the banner headline above */}
        <div className={`portfolio-hero-bigval${hidden ? ' hero-obscured' : ''}`}>
          {fmt(displayValue, currency)}
        </div>
        <div className="portfolio-hero-vallabel">
          {currentValue !== null
            ? (isEN ? 'Current portfolio value' : 'Valor atual do portfólio')
            : (isEN ? 'Total invested' : 'Total investido')}
        </div>

        {/* Emotional support — dynamic based on journey stage */}
        <div className="portfolio-hero-tagline">
          {monthsActive < 3
            ? (isEN
                ? 'Every great wealth journey starts exactly like this.'
                : 'Toda grande jornada financeira começa exatamente assim.')
            : monthsActive < 12
            ? (isEN
                ? 'Building the habits of long-term financial freedom.'
                : 'Construindo os hábitos da liberdade financeira.')
            : monthsActive < 36
            ? (isEN
                ? 'Your consistency is your greatest financial advantage.'
                : 'Sua consistência é sua maior vantagem financeira.')
            : (isEN
                ? 'Years of consistency — this is how wealth is built.'
                : 'Anos de consistência — é assim que o patrimônio é construído.')}
        </div>

        {/* Return: positive only. Negative → calm reassurance. */}
        {hasReturn && (
          isPositiveReturn ? (
            <div className={`portfolio-hero-return hero-return-up${hidden ? ' hero-obscured' : ''}`}>
              <span className="hero-return-arrow">↑</span>
              <span>+{fmt(pnl!, currency)}</span>
              <span className="hero-return-dot">·</span>
              <span>+{pnlPct!.toFixed(2)}%</span>
              <span className="hero-return-suffix">{isEN ? 'total return' : 'retorno total'}</span>
            </div>
          ) : (
            <div className="portfolio-hero-calm-msg">
              {isEN
                ? 'Long-term investing rewards patience and consistency.'
                : 'Investir a longo prazo recompensa quem é paciente e consistente.'}
            </div>
          )
        )}
      </div>

      {/* Future projection line */}
      <div className={`portfolio-hero-projection${hidden ? ' hero-obscured' : ''}`}>
        <span className="hero-proj-icon">◎</span>
        <span className="hero-proj-text">
          {isEN
            ? `At this pace, your portfolio may reach `
            : `Neste ritmo, seu portfólio pode chegar a `}
          <strong>{fmt(projection10y, currency)}</strong>
          {isEN ? ` by ${futureYear}` : ` em ${futureYear}`}
          {isEN ? ' at 7% annual growth' : ' com 7% de crescimento anual'}
        </span>
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
