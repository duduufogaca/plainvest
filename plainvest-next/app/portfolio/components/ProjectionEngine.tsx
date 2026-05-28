'use client';

import { useState, useMemo } from 'react';

/* ── Finance helpers ────────────────────────────────────── */
function fv(pv: number, monthlyC: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (Math.abs(r) < 1e-9) return pv + monthlyC * n;
  return pv * Math.pow(1 + r, n) + monthlyC * (Math.pow(1 + r, n) - 1) / r;
}

function yearsTo(pv: number, monthlyC: number, annualRatePct: number, target: number): number {
  if (pv >= target) return 0;
  let lo = 0, hi = 100;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    fv(pv, monthlyC, annualRatePct, mid) < target ? (lo = mid) : (hi = mid);
  }
  return hi;
}

function fmtFull(n: number, currency: string) {
  return new Intl.NumberFormat(
    currency === 'BRL' ? 'pt-BR' : currency === 'USD' ? 'en-US' : 'en-AU',
    { style: 'currency', currency, maximumFractionDigits: 0 },
  ).format(n);
}

function fmtShortLabel(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toFixed(0);
}

/* ── Config ─────────────────────────────────────────────── */
const MILESTONES: Record<string, number[]> = {
  AUD: [100_000, 500_000, 1_000_000, 5_000_000],
  USD: [100_000, 500_000, 1_000_000, 5_000_000],
  BRL: [500_000, 1_000_000, 5_000_000, 10_000_000],
};
const HORIZON = [5, 10, 15, 20, 30];

// Time-horizon color scale: near = amber/warm → far = violet/cool
// Each time-horizon has its own unique color — none repeat elsewhere on the page
const HORIZON_COLORS = ['#e8b84b', '#f0956a', '#2dd4bf', '#5c9af5', '#818cf8'];

/* ── Props ──────────────────────────────────────────────── */
type Props = {
  currentValue: number;
  monthlyContribution: number;
  currency: string;
  lang?: string;
};

/* ── Component ──────────────────────────────────────────── */
export function ProjectionEngine({ currentValue, monthlyContribution, currency, lang = 'en' }: Props) {
  const [rate, setRate]           = useState(7);
  const [inflation, setInflation] = useState(3);
  const [showReal, setShowReal]   = useState(false);

  const isEN = lang !== 'pt';
  const CV   = Math.max(currentValue, 0);
  const MC   = Math.max(monthlyContribution, 0);
  const effectiveRate = showReal ? rate - inflation : rate;

  const projections = useMemo(() =>
    HORIZON.map(y => ({
      years:   y,
      nominal: fv(CV, MC, rate, y),
      real:    fv(CV, MC, rate - inflation, y),
    })), [CV, MC, rate, inflation]);

  const milestones     = MILESTONES[currency] ?? MILESTONES.AUD;
  const milestoneData  = useMemo(() =>
    milestones.map(target => ({
      target,
      years:     yearsTo(CV, MC, effectiveRate, target),
      reachable: fv(CV, MC, effectiveRate, 100) >= target,
      pct:       Math.min((CV / target) * 100, 100),
    })), [CV, MC, effectiveRate, milestones]);

  /* ── SVG projection chart ──────────────────────────── */
  const W = 660, H = 210, PL = 52, PB = 26, PT = 12;

  const chartPts = useMemo(() => {
    const pts = [];
    for (let m = 0; m <= 360; m += 3) {
      const y = m / 12;
      pts.push({ x: y, nom: fv(CV, MC, rate, y), real: fv(CV, MC, rate - inflation, y) });
    }
    return pts;
  }, [CV, MC, rate, inflation]);

  const maxVal = Math.max(...chartPts.map(p => p.nom)) * 1.08;
  const toX = (y: number) => PL + (y / 30) * (W - PL - 8);
  const toY = (v: number) => PT + (1 - v / maxVal) * (H - PB - PT);

  function buildPath(key: 'nom' | 'real') {
    return chartPts.reduce((acc, p, i) => {
      const x = toX(p.x).toFixed(1), y = toY(p[key]).toFixed(1);
      if (i === 0) return `M ${x} ${y}`;
      const prev = chartPts[i - 1];
      const cpx = ((toX(prev.x) + toX(p.x)) / 2).toFixed(1);
      return `${acc} C ${cpx} ${toY(prev[key]).toFixed(1)} ${cpx} ${y} ${x} ${y}`;
    }, '');
  }

  const nomPath  = buildPath('nom');
  const realPath = buildPath('real');
  const nomArea  = `${nomPath} L ${toX(30).toFixed(1)} ${toY(0).toFixed(1)} L ${toX(0).toFixed(1)} ${toY(0).toFixed(1)} Z`;
  const realArea = `${realPath} L ${toX(30).toFixed(1)} ${toY(0).toFixed(1)} L ${toX(0).toFixed(1)} ${toY(0).toFixed(1)} Z`;

  const yLabels = [0, 0.25, 0.5, 0.75, 1].map(pct => ({ val: maxVal * pct, y: toY(maxVal * pct) }));
  const mLines  = milestones.filter(m => m < maxVal * 0.96).map(m => ({ val: m, y: toY(m) }));

  /* ── Render ─────────────────────────────────────────── */
  return (
    <section className="portfolio-card proj-card">
      <div className="proj-header-row">
        <div>
          <p className="eyebrow">{isEN ? 'Future Projection' : 'Projeção Futura'}</p>
          <h2>{isEN ? 'Where is your wealth headed?' : 'Para onde vai seu patrimônio?'}</h2>
        </div>
      </div>

      {/* Controls */}
      <div className="proj-controls">
        <div className="proj-control-group">
          <span className="proj-control-label">{isEN ? 'Annual return' : 'Retorno anual'}</span>
          <div className="proj-slider-row">
            <span className="proj-rate-display proj-rate-amber">{rate}%</span>
            <input type="range" min={1} max={20} step={0.5} value={rate}
              onChange={e => setRate(Number(e.target.value))} className="proj-slider proj-slider-amber" />
          </div>
        </div>
        <div className="proj-control-group">
          <span className="proj-control-label">{isEN ? 'Inflation rate' : 'Taxa de inflação'}</span>
          <div className="proj-slider-row">
            <span className="proj-rate-display proj-rate-violet">{inflation}%</span>
            <input type="range" min={0} max={10} step={0.5} value={inflation}
              onChange={e => setInflation(Number(e.target.value))} className="proj-slider proj-slider-violet" />
          </div>
        </div>
        <button className={`proj-real-btn${showReal ? ' proj-real-active' : ''}`}
          onClick={() => setShowReal(v => !v)}>
          {isEN ? 'Inflation-adjusted view' : 'Ver ajustado à inflação'}
        </button>
      </div>

      {/* Meta row */}
      <div className="proj-meta-row">
        <div className="proj-meta-item">
          <span className="proj-meta-label">{isEN ? 'Starting value' : 'Valor inicial'}</span>
          <span className="proj-meta-val">{fmtFull(CV, currency)}</span>
        </div>
        <div className="proj-meta-item">
          <span className="proj-meta-label">{isEN ? 'Avg monthly contribution' : 'Contribuição mensal média'}</span>
          <span className="proj-meta-val">{fmtFull(MC, currency)}</span>
        </div>
        {showReal && (
          <div className="proj-meta-item">
            <span className="proj-meta-label">{isEN ? 'Real rate' : 'Taxa real'}</span>
            <span className="proj-meta-val proj-real-rate">{(rate - inflation).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {/* SVG Chart */}
      <div className="proj-chart-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
          style={{ width: '100%', height: '240px', display: 'block' }}>
          <defs>
            {/* Nominal — warm amber gradient */}
            <linearGradient id="pg1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8b84b" stopOpacity="0.28" />
              <stop offset="80%" stopColor="#e8b84b" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#e8b84b" stopOpacity="0" />
            </linearGradient>
            {/* Real — violet gradient */}
            <linearGradient id="pg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d946ef" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#d946ef" stopOpacity="0.01" />
            </linearGradient>
            {/* Horizontal time-gradient: amber → mint → blue → indigo (matching horizon card progression) */}
            <linearGradient id="pgLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e8b84b" />
              <stop offset="35%" stopColor="#2dd4bf" />
              <stop offset="65%" stopColor="#5c9af5" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* Y grid + labels */}
          {yLabels.map((l, i) => (
            <g key={i}>
              <line x1={PL} x2={W - 6} y1={l.y} y2={l.y}
                stroke="rgba(255,255,255,.05)" strokeWidth="1" />
              <text x={PL - 5} y={l.y + 3.5} textAnchor="end"
                fontSize="8.5" fill="#4a6880" fontFamily="inherit">
                {fmtShortLabel(l.val)}
              </text>
            </g>
          ))}

          {/* Milestone dashed reference lines — subtle teal */}
          {mLines.map((m, i) => (
            <g key={i}>
              <line x1={PL} x2={W - 6} y1={m.y} y2={m.y}
                stroke="rgba(97,213,180,.14)" strokeWidth="1" strokeDasharray="4 6" />
              <text x={W - 4} y={m.y - 3} textAnchor="end"
                fontSize="7.5" fill="rgba(97,213,180,.4)" fontFamily="inherit">
                {fmtShortLabel(m.val)}
              </text>
            </g>
          ))}

          {/* Inflation-adjusted area + line — violet */}
          {showReal && (
            <>
              <path d={realArea} fill="url(#pg2)" />
              <path d={realPath} fill="none" stroke="#d946ef" strokeWidth="1.6"
                strokeDasharray="5 4" strokeLinecap="round" />
            </>
          )}

          {/* Nominal area + line — amber→teal→violet gradient */}
          <path d={nomArea} fill="url(#pg1)" />
          <path d={nomPath} fill="none" stroke="url(#pgLine)" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" />

          {/* Current value dot — amber glow */}
          <circle cx={toX(0)} cy={toY(CV)} r={7} fill="rgba(232,184,75,.1)" />
          <circle cx={toX(0)} cy={toY(CV)} r={3.5} fill="#e8b84b" />
          <circle cx={toX(0)} cy={toY(CV)} r={3.5} fill="none" stroke="#e8b84b" strokeOpacity="0.4" strokeWidth="5" />

          {/* X axis labels */}
          {[0, 5, 10, 15, 20, 25, 30].map(y => (
            <text key={y} x={toX(y)} y={H - PB + 14} textAnchor="middle"
              fontSize="8.5" fill="#4a6880" fontFamily="inherit">
              {y === 0 ? (isEN ? 'Now' : 'Hoje') : `${y}y`}
            </text>
          ))}
        </svg>
      </div>

      {/* Summary horizon cards — each with its own time-horizon color */}
      <div className="proj-horizon-row">
        {projections.map((p, i) => {
          const col = HORIZON_COLORS[i] ?? '#e8b84b';
          return (
            <div key={p.years} className="proj-horizon-card"
              style={{ borderTopColor: col }}>
              <span className="proj-horizon-years"
                style={{ color: col }}>{p.years}{isEN ? 'Y' : 'A'}</span>
              <span className="proj-horizon-val"
                style={{ color: col }}>
                {fmtFull(showReal ? p.real : p.nominal, currency)}
              </span>
              {showReal && (
                <span className="proj-horizon-nom">
                  {fmtFull(p.nominal, currency)} {isEN ? 'nom.' : 'nom.'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Chart legend */}
      <div className="proj-legend-row">
        <span className="proj-legend-dot proj-legend-amber" />
        <span className="proj-legend-label">{isEN ? 'Nominal return' : 'Retorno nominal'}</span>
        {showReal && (
          <>
            <span className="proj-legend-dot proj-legend-violet" />
            <span className="proj-legend-label">{isEN ? 'Inflation-adjusted' : 'Ajustado à inflação'}</span>
          </>
        )}
      </div>

      {/* Milestones */}
      <div className="proj-milestones">
        <p className="proj-milestones-title">
          {isEN ? 'Wealth milestones' : 'Marcos de patrimônio'}
        </p>
        {milestoneData.map((m, i) => {
          const col = HORIZON_COLORS[Math.min(i, HORIZON_COLORS.length - 1)];
          return (
            <div key={i} className="proj-milestone-row">
              <div className="proj-milestone-head">
                <span className="proj-milestone-label">{fmtFull(m.target, currency)}</span>
                <span className={`proj-milestone-eta${m.years === 0 ? ' reached' : ''}`}
                  style={m.years !== 0 && m.reachable ? { color: col } : undefined}>
                  {m.years === 0
                    ? (isEN ? '✓ Reached' : '✓ Alcançado')
                    : !m.reachable
                    ? (isEN ? '> 30 years' : '> 30 anos')
                    : `~${Math.ceil(m.years * 10) / 10}${isEN ? ' yrs' : ' anos'}`}
                </span>
              </div>
              <div className="proj-milestone-bar-bg">
                <div className="proj-milestone-bar-fill"
                  style={{ width: `${m.pct}%`, background: `linear-gradient(90deg, ${col}99, ${col})` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="proj-disclaimer">
        {isEN
          ? 'Projections are illustrative only. Past performance does not guarantee future results.'
          : 'Projeções são meramente ilustrativas. Retornos passados não garantem resultados futuros.'}
      </p>
    </section>
  );
}
