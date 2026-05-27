'use client';

import { useEffect, useState } from 'react';
import type { DonutSegment } from './DonutChart';
import { DonutChart } from './DonutChart';

type GroupedAsset = {
  key: string;
  asset_name: string;
  ticker: string | null;
  asset_type: string;
  totalInvestedDisplay: number;
};

type Props = {
  donutSegments: DonutSegment[];
  totalInvested: number;
  currency: string;
  lang: string;
  topHoldings: GroupedAsset[];
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

function yearsToTarget(pv: number, monthly: number, target: number): number | null {
  if (pv >= target) return 0;
  const r = 0.07 / 12;
  let balance = pv;
  for (let m = 1; m <= 720; m++) {
    balance = balance * (1 + r) + monthly;
    if (balance >= target) return Math.round((m / 12) * 10) / 10;
  }
  return null;
}

const MILESTONE_TARGETS: Record<string, number[]> = {
  AUD: [500_000, 1_000_000], USD: [500_000, 1_000_000], BRL: [1_000_000, 5_000_000],
};
const MILESTONE_NAMES: string[] = ['Financial Independence', 'Financial Freedom'];
const MILESTONE_NAMES_PT: string[] = ['Independência Financeira', 'Liberdade Financeira'];

// Ring SVG for milestone
function MilestoneRing({ pct, color }: { pct: number; color: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 200); return () => clearTimeout(t); }, []);
  const R = 36; const C = 2 * Math.PI * R;
  const filled = mounted ? (pct / 100) * C : 0;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={R} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8"/>
      <circle cx="48" cy="48" r={R} fill="none"
        stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${filled} ${C}`}
        transform="rotate(-90 48 48)"
        style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(.4,0,.2,1)' }}
      />
      <text x="48" y="52" textAnchor="middle" fontSize="16" fontWeight="900" fill={color}
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">
        {pct}%
      </text>
    </svg>
  );
}

export function BottomCards({ donutSegments, totalInvested, currency, lang, topHoldings, projCurrentValue, projMonthlyContrib }: Props) {
  const isEN = lang !== 'pt';
  const targets = MILESTONE_TARGETS[currency] ?? MILESTONE_TARGETS.AUD;

  // Find the next milestone above current value
  const nextMilestoneIdx = targets.findIndex(t => projCurrentValue < t);
  const milestoneTarget = nextMilestoneIdx >= 0 ? targets[nextMilestoneIdx] : targets[targets.length - 1];
  const milestoneNameEN = nextMilestoneIdx >= 0 ? MILESTONE_NAMES[nextMilestoneIdx] : MILESTONE_NAMES[MILESTONE_NAMES.length - 1];
  const milestoneNamePT = nextMilestoneIdx >= 0 ? MILESTONE_NAMES_PT[nextMilestoneIdx] : MILESTONE_NAMES_PT[MILESTONE_NAMES_PT.length - 1];
  const milestonePct = Math.min(99, Math.round((projCurrentValue / milestoneTarget) * 100));
  const milestoneYears = yearsToTarget(projCurrentValue, projMonthlyContrib, milestoneTarget);
  const milestoneColor = milestonePct >= 75 ? '#61d5b4' : milestonePct >= 40 ? '#f4c86a' : '#5c9af5';

  return (
    <div className="bottom-cards-row">

      {/* Asset Allocation */}
      <section className="portfolio-card bottom-card">
        <div className="bottom-card-header">
          <span className="bottom-card-title">{isEN ? 'Asset Allocation' : 'Alocação de Ativos'}</span>
          <span className="bottom-card-sub">{isEN ? 'By value' : 'Por valor'}</span>
        </div>
        <div className="bottom-alloc-body">
          <DonutChart
            segments={donutSegments}
            totalValue={totalInvested}
            currency={currency}
          />
        </div>
        <a href="#holdings-section" className="bottom-card-link">
          {isEN ? 'View full allocation' : 'Ver alocação completa'} →
        </a>
      </section>

      {/* Top Holdings */}
      <section className="portfolio-card bottom-card">
        <div className="bottom-card-header">
          <span className="bottom-card-title">{isEN ? 'Top Holdings' : 'Principais Ativos'}</span>
          <span className="bottom-card-sub">{isEN ? 'By value' : 'Por valor'}</span>
        </div>
        <div className="bottom-holdings-list">
          {topHoldings.slice(0, 3).map((g) => {
            const inv = g.totalInvestedDisplay;
            const pct = totalInvested > 0 ? Math.round((inv / totalInvested) * 100) : 0;
            const initials = (g.ticker || g.asset_name).slice(0, 2).toUpperCase();
            return (
              <div key={g.key} className="bottom-holding-row">
                <div className="bottom-holding-avatar"
                  style={{ background: `rgba(97,213,180,.12)`, color: '#61d5b4' }}>
                  {initials}
                </div>
                <div className="bottom-holding-info">
                  <span className="bottom-holding-name">{g.asset_name}</span>
                  {g.ticker && <span className="bottom-holding-ticker">{g.ticker.toUpperCase()}</span>}
                </div>
                <div className="bottom-holding-right">
                  <span className="bottom-holding-val">{fmt(inv, currency)}</span>
                  <span className="bottom-holding-pct">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
        <a href="#holdings-section" className="bottom-card-link">
          {isEN ? 'View all holdings' : 'Ver todos os ativos'} →
        </a>
      </section>

      {/* Next Milestone */}
      <section className="portfolio-card bottom-card bottom-card-milestone">
        <div className="bottom-card-header">
          <span className="bottom-card-title">{isEN ? 'Next Milestone' : 'Próximo Marco'}</span>
          <span className="bottom-card-sub">{isEN ? 'On your way to financial freedom' : 'No caminho para a liberdade financeira'}</span>
        </div>
        <div className="bottom-milestone-body">
          <MilestoneRing pct={milestonePct} color={milestoneColor} />
          <div className="bottom-milestone-info">
            <span className="bottom-milestone-name" style={{ color: milestoneColor }}>
              {isEN ? milestoneNameEN : milestoneNamePT}
            </span>
            <span className="bottom-milestone-desc">
              {isEN
                ? `You're ${milestonePct}% closer to your goal`
                : `Você está ${milestonePct}% mais perto do seu objetivo`}
            </span>
            {milestoneYears !== null && milestoneYears > 0 && (
              <span className="bottom-milestone-eta">
                {isEN
                  ? `~${milestoneYears} yr${milestoneYears !== 1 ? 's' : ''} away at 7% growth`
                  : `~${milestoneYears} ano${milestoneYears !== 1 ? 's' : ''} a 7% de crescimento`}
              </span>
            )}
            {milestoneYears === 0 && (
              <span className="bottom-milestone-eta" style={{ color: '#61d5b4' }}>
                {isEN ? '✓ Goal achieved!' : '✓ Meta alcançada!'}
              </span>
            )}
          </div>
        </div>
        <a href="#future-projections" className="bottom-card-link">
          {isEN ? 'See full projection' : 'Ver projeção completa'} →
        </a>
      </section>

    </div>
  );
}
