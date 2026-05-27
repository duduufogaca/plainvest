'use client';

import { useEffect, useState } from 'react';

type Props = {
  projCurrentValue: number;
  projMonthlyContrib: number;
  currency: string;
  lang: string;
  monthsActive: number;
};

function fmt(n: number, currency: string) {
  const locale = currency === 'BRL' ? 'pt-BR' : currency === 'USD' ? 'en-US' : 'en-AU';
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n);
}

function fv(pv: number, monthly: number, annualRate: number, years: number): number {
  const r = annualRate / 12;
  const n = years * 12;
  if (r < 1e-9) return pv + monthly * n;
  return pv * Math.pow(1 + r, n) + monthly * (Math.pow(1 + r, n) - 1) / r;
}

function yearsToMilestone(pv: number, monthly: number, target: number): number | null {
  if (pv >= target) return 0;
  const r = 0.07 / 12;
  let balance = pv;
  for (let m = 1; m <= 720; m++) {
    balance = balance * (1 + r) + monthly;
    if (balance >= target) return Math.round((m / 12) * 10) / 10;
  }
  return null;
}

const MILESTONES: Record<string, number[]> = {
  AUD: [500_000, 1_000_000],
  USD: [500_000, 1_000_000],
  BRL: [1_000_000, 5_000_000],
};

const MILESTONE_LABELS: Record<string, string[]> = {
  AUD: ['A$500K', 'A$1M'],
  USD: ['$500K', '$1M'],
  BRL: ['R$1M', 'R$5M'],
};

export function FutureSection({ projCurrentValue, projMonthlyContrib, currency, lang, monthsActive }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 160);
    return () => clearTimeout(t);
  }, []);

  const isEN = lang !== 'pt';
  const futureYear = new Date().getFullYear() + 10;

  const projected10y   = fv(projCurrentValue, projMonthlyContrib, 0.07, 10);
  const realAdj10y     = fv(projCurrentValue, projMonthlyContrib, 0.04, 10); // 7% - 3% inflation
  const monthlyPassive = projected10y * 0.04 / 12;

  const purchasingPowerPct = Math.round(Math.pow(1 - 0.03, 10) * 100); // ~74%

  const milestoneTargets = MILESTONES[currency] ?? MILESTONES.AUD;
  const milestoneLabels  = MILESTONE_LABELS[currency] ?? MILESTONE_LABELS.AUD;
  const milestones = milestoneTargets.map((target, i) => ({
    label: milestoneLabels[i],
    target,
    years: yearsToMilestone(projCurrentValue, projMonthlyContrib, target),
  }));

  const ppBarWidth = mounted ? purchasingPowerPct : 100;

  return (
    <section className="portfolio-card future-freedom-card">
      <div className="future-freedom-header">
        <div>
          <p className="eyebrow">{isEN ? 'Future Freedom™' : 'Liberdade Futura™'}</p>
          <h2>{isEN ? 'Your Path to Financial Independence' : 'Seu Caminho para a Independência Financeira'}</h2>
        </div>
        <div className="future-freedom-badge">
          <span className="future-freedom-badge-icon">◎</span>
          <span className="future-freedom-badge-year">{futureYear}</span>
        </div>
      </div>

      <p className="future-freedom-subtitle">
        {isEN
          ? 'At 7% annual growth with your current contribution pace'
          : 'A 7% de crescimento anual com seu ritmo atual de contribuições'}
      </p>

      {/* ── 3 projection stats ── */}
      <div className="future-freedom-stats">
        <div className="future-freedom-stat">
          <div className="future-stat-val future-stat-teal">{fmt(projected10y, currency)}</div>
          <div className="future-stat-label">
            {isEN ? `in 10 years (${futureYear})` : `em 10 anos (${futureYear})`}
          </div>
          <div className="future-stat-sub">
            {isEN ? 'projected portfolio value' : 'valor projetado do portfólio'}
          </div>
        </div>

        <div className="future-freedom-divider" />

        <div className="future-freedom-stat">
          <div className="future-stat-val">{fmt(realAdj10y, currency)}</div>
          <div className="future-stat-label">
            {isEN ? "in today's money" : 'em dinheiro de hoje'}
          </div>
          <div className="future-stat-sub">
            {isEN ? 'inflation-adjusted (4% real rate)' : 'ajustado pela inflação (4% real)'}
          </div>
        </div>

        <div className="future-freedom-divider" />

        <div className="future-freedom-stat">
          <div className="future-stat-val future-stat-gold">
            {fmt(monthlyPassive, currency)}
            <span className="future-stat-unit">{isEN ? '/mo' : '/mês'}</span>
          </div>
          <div className="future-stat-label">
            {isEN ? 'monthly passive income' : 'renda passiva mensal'}
          </div>
          <div className="future-stat-sub">
            {isEN ? '4% safe withdrawal rule' : 'regra dos 4% de retirada'}
          </div>
        </div>
      </div>

      {/* ── Milestones ── */}
      <div className="future-milestones">
        <p className="future-milestones-label">{isEN ? 'Wealth Milestones' : 'Marcos de Patrimônio'}</p>
        <div className="future-milestones-row">
          {milestones.map(({ label, target, years }) => {
            if (projCurrentValue >= target) {
              return (
                <div key={target} className="future-milestone future-milestone-achieved">
                  <span className="future-milestone-icon">✓</span>
                  <div className="future-milestone-info">
                    <span className="future-milestone-target">{label}</span>
                    <span className="future-milestone-status future-ms-achieved">
                      {isEN ? 'Already achieved' : 'Já alcançado'}
                    </span>
                  </div>
                </div>
              );
            }
            if (years === null) {
              return (
                <div key={target} className="future-milestone future-milestone-far">
                  <span className="future-milestone-icon">◎</span>
                  <div className="future-milestone-info">
                    <span className="future-milestone-target">{label}</span>
                    <span className="future-milestone-status">
                      {isEN ? 'Increase contributions to reach' : 'Aumente contribuições para alcançar'}
                    </span>
                  </div>
                </div>
              );
            }
            const reachYear = new Date().getFullYear() + Math.round(years);
            return (
              <div key={target} className="future-milestone">
                <span className="future-milestone-icon">◎</span>
                <div className="future-milestone-info">
                  <span className="future-milestone-target">{label}</span>
                  <span className="future-milestone-years">
                    {isEN ? `in ${years} yr${years !== 1 ? 's' : ''}` : `em ${years} ano${years !== 1 ? 's' : ''}`}
                    <span className="future-milestone-year"> ({reachYear})</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Inflation Impact ── */}
      <div className="future-inflation">
        <div className="future-inflation-header">
          <span className="future-inflation-label">
            {isEN ? 'Purchasing Power (10 years)' : 'Poder de Compra (10 anos)'}
          </span>
          <span className="future-inflation-pct">
            {purchasingPowerPct}% {isEN ? 'preserved' : 'preservado'}
          </span>
        </div>
        <div className="future-inflation-bar-bg">
          <div
            className="future-inflation-bar-fill"
            style={{
              width: `${ppBarWidth}%`,
              transition: mounted ? 'width 1.4s cubic-bezier(.4,0,.2,1)' : 'none',
            }}
          />
        </div>
        <p className="future-inflation-note">
          {isEN
            ? `At 3% annual inflation, your money loses ~${100 - purchasingPowerPct}% of its purchasing power over 10 years. Growth investing is how you stay ahead.`
            : `Com 3% de inflação anual, seu dinheiro perde ~${100 - purchasingPowerPct}% do poder de compra em 10 anos. Investir em crescimento é como você se mantém à frente.`}
        </p>
      </div>

      <p className="future-disclaimer">
        {isEN
          ? 'Projections assume 7% nominal annual return and 3% inflation. For illustrative purposes only — not financial advice.'
          : 'Projeções assumem 7% de retorno nominal anual e 3% de inflação. Apenas para fins ilustrativos — não é consultoria financeira.'}
      </p>
    </section>
  );
}
