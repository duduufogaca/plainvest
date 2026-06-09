'use client';

import { useEffect, useState } from 'react';

type HealthData = {
  score: number;            // 0–10 diversification score
  assetCount: number;
  largestName: string;
  largestPct: number;       // 0–100
  concentration: 'low' | 'moderate' | 'high';
  wellBalanced: boolean;
};

type GroupedAsset = {
  key: string;
  asset_name: string;
  ticker: string | null;
  asset_type: string;
  totalInvestedDisplay: number;
};

type Props = {
  totalInvested: number;
  currency: string;
  lang: string;
  topHoldings: GroupedAsset[];
  projCurrentValue: number;
  projMonthlyContrib: number;
  health: HealthData;
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

export function BottomCards({ totalInvested, currency, lang, topHoldings, projCurrentValue, projMonthlyContrib, health }: Props) {
  const isEN = lang !== 'pt';
  const targets = MILESTONE_TARGETS[currency] ?? MILESTONE_TARGETS.AUD;

  // ── Portfolio Health presentation ──
  const scoreColor = health.score >= 7 ? '#61d5b4' : health.score >= 4.5 ? '#f4c86a' : '#fb7185';
  const concLabel = isEN
    ? { low: 'Low', moderate: 'Moderate', high: 'High' }[health.concentration]
    : { low: 'Baixo', moderate: 'Moderado', high: 'Alto' }[health.concentration];
  const healthInsight = (() => {
    const n = health.assetCount;
    const plural = (en: string) => (n !== 1 ? en : '');
    if (n === 0) return isEN
      ? 'Add your first position to unlock health insights.'
      : 'Adicione sua primeira posição para ver os insights de saúde.';
    if (health.concentration === 'high') return isEN
      ? `Your portfolio is heavily concentrated in ${health.largestName} (${health.largestPct}%). Consider adding more assets to improve diversification.`
      : `Sua carteira está muito concentrada em ${health.largestName} (${health.largestPct}%). Considere adicionar mais ativos para melhorar a diversificação.`;
    if (n < 3) return isEN
      ? `With only ${n} asset${plural('s')}, adding a few more positions would strengthen your diversification.`
      : `Com apenas ${n} ativo${plural('s')}, adicionar mais posições fortaleceria sua diversificação.`;
    if (health.wellBalanced) return isEN
      ? `Nicely diversified across ${n} assets. Keep contributing consistently to stay on track.`
      : `Bem diversificada entre ${n} ativos. Continue aportando com consistência para manter o ritmo.`;
    return isEN
      ? `Your largest position is ${health.largestName} (${health.largestPct}%). Spreading new contributions across other assets will improve balance.`
      : `Sua maior posição é ${health.largestName} (${health.largestPct}%). Distribuir novos aportes entre outros ativos melhorará o equilíbrio.`;
  })();

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

      {/* Portfolio Health */}
      <section className="portfolio-card bottom-card">
        <div className="bottom-card-header">
          <span className="bottom-card-title">{isEN ? 'Portfolio Health' : 'Saúde da Carteira'}</span>
          <span className="bottom-card-sub">{isEN ? 'Diversification & risk' : 'Diversificação & risco'}</span>
        </div>
        <div className="ph-body">
          <div>
            <div className="ph-score-row">
              <span className="ph-score" style={{ color: scoreColor }}>{health.score.toFixed(1)}</span>
              <span className="ph-score-max">/ 10</span>
              <span className={`ph-status ${health.wellBalanced ? 'good' : 'warn'}`}>
                {health.wellBalanced
                  ? (isEN ? 'Well Balanced' : 'Bem Equilibrada')
                  : (isEN ? 'Needs Rebalancing' : 'Precisa Rebalancear')}
              </span>
            </div>
            <div className="ph-bar-bg">
              <div className="ph-bar-fill" style={{ width: `${health.score * 10}%`, background: scoreColor }} />
            </div>
          </div>

          <div className="ph-stats">
            <div className="ph-stat">
              <span className="ph-stat-label">{isEN ? 'Largest Position' : 'Maior Posição'}</span>
              <span className="ph-stat-val">
                {health.largestName ? `${health.largestName} · ${health.largestPct}%` : '—'}
              </span>
            </div>
            <div className="ph-stat">
              <span className="ph-stat-label">{isEN ? 'Concentration Risk' : 'Risco de Concentração'}</span>
              <span className={`ph-chip ${health.concentration}`}>{concLabel}</span>
            </div>
            <div className="ph-stat">
              <span className="ph-stat-label">{isEN ? 'Number of Assets' : 'Número de Ativos'}</span>
              <span className="ph-stat-val">{health.assetCount}</span>
            </div>
            <div className="ph-stat">
              <span className="ph-stat-label">{isEN ? 'Diversification' : 'Diversificação'}</span>
              <span className="ph-stat-val">{health.score.toFixed(1)} / 10</span>
            </div>
          </div>

          <div className="ph-insight">
            <span className="ph-insight-icon">💡</span>
            <span>{healthInsight}</span>
          </div>
        </div>
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
      </section>

    </div>
  );
}
