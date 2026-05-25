'use client';

import { useState } from 'react';

export type DonutSegment = {
  label: string;
  ticker?: string;
  value: number;
  pct: number;
  color: string;
  pnlPct?: number | null;
};

const R = 85;
const SW = 24;
const CX = 118;
const CY = 118;
const GAP = 2.5;

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg - 90) * (Math.PI / 180);
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arc(startDeg: number, endDeg: number, r = R): string {
  if (endDeg - startDeg >= 360) endDeg = startDeg + 359.99;
  const [sx, sy] = polar(CX, CY, r, startDeg);
  const [ex, ey] = polar(CX, CY, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

export function DonutChart({
  segments,
  totalValue,
  currency,
}: {
  segments: DonutSegment[];
  totalValue: number;
  currency: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const locale = currency === 'BRL' ? 'pt-BR' : currency === 'USD' ? 'en-US' : 'en-AU';

  const fmtCompact = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency', currency,
      minimumFractionDigits: 0, maximumFractionDigits: 0,
      notation: 'compact', compactDisplay: 'short',
    }).format(n);

  const fmtFull = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency', currency,
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(n);

  let cursor = 0;
  const arcs = segments.map((seg, i) => {
    const span = (seg.pct / 100) * 360;
    const start = cursor + GAP / 2;
    const end = cursor + span - GAP / 2;
    cursor += span;
    return { ...seg, start, end, i };
  });

  const active = hovered !== null ? arcs[hovered] : null;

  return (
    <div className="donut-v2-wrap">
      <div className="donut-v2-svg-wrap">
        <svg viewBox="0 0 236 236" width="220" height="220">
          <defs>
            <filter id="donut-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth={SW + 4} />

          {arcs.map(a => {
            const isHov = hovered === a.i;
            const isFade = hovered !== null && !isHov;
            return (
              <path
                key={a.i}
                d={arc(a.start, a.end, isHov ? R + 8 : R)}
                fill="none"
                stroke={a.color}
                strokeWidth={isHov ? SW + 9 : SW}
                strokeLinecap="butt"
                opacity={isFade ? 0.18 : 1}
                filter={isHov ? 'url(#donut-glow)' : undefined}
                style={{ transition: 'all 0.18s ease', cursor: 'pointer' }}
                onMouseEnter={() => setHovered(a.i)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}

          <text x={CX} y={CY - 21} textAnchor="middle" fontSize="8" fontWeight="700"
            fill="rgba(255,255,255,0.35)" fontFamily="inherit" letterSpacing="2">
            {active ? (active.ticker || active.label.slice(0, 10).toUpperCase()) : 'TOTAL INVESTED'}
          </text>

          <text x={CX} y={CY + 6} textAnchor="middle" fontSize="20" fontWeight="800"
            fill="white" fontFamily="inherit">
            {active ? fmtCompact(active.value) : fmtCompact(totalValue)}
          </text>

          <text
            x={CX} y={CY + 27}
            textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="inherit"
            fill={
              active && active.pnlPct != null
                ? active.pnlPct >= 0 ? '#61d5b4' : '#fb7185'
                : 'rgba(255,255,255,0.35)'
            }
          >
            {active
              ? active.pnlPct != null
                ? (active.pnlPct >= 0 ? '▲ +' : '▼ ') + active.pnlPct.toFixed(1) + '%'
                : active.pct.toFixed(1) + '% of portfolio'
              : segments.length + ' asset' + (segments.length !== 1 ? 's' : '')}
          </text>
        </svg>
      </div>

      <div className="donut-v2-legend">
        {arcs.map(a => (
          <div
            key={a.i}
            className={`donut-v2-row${hovered === a.i ? ' hov' : ''}`}
            onMouseEnter={() => setHovered(a.i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="donut-v2-dot" style={{ background: a.color }} />
            <div className="donut-v2-info">
              <span className="donut-v2-name">{a.ticker || a.label}</span>
              {a.ticker && <span className="donut-v2-sub">{a.label}</span>}
            </div>
            <div className="donut-v2-nums">
              <span className="donut-v2-pct-badge">{a.pct.toFixed(1)}%</span>
              <span className="donut-v2-amount">{fmtFull(a.value)}</span>
              {a.pnlPct != null && (
                <span className={`donut-v2-gain ${a.pnlPct >= 0 ? 'pos' : 'neg'}`}>
                  {a.pnlPct >= 0 ? '▲' : '▼'} {Math.abs(a.pnlPct).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
