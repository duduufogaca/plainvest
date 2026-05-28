'use client';

import { useState } from 'react';

export type ChartPoint = { label: string; cumulative: number; added: number };
type Period = '1m' | '3m' | '6m' | '1y' | 'all';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtLabel(s: string) {
  const [y, m] = s.split('-');
  return m ? `${MONTH_NAMES[parseInt(m) - 1]} '${y.slice(2)}` : y;
}

function fmtCompact(v: number, currency: string) {
  const locale = currency === 'BRL' ? 'pt-BR' : currency === 'USD' ? 'en-US' : 'en-AU';
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1,
  }).format(v);
}

function fmtFull(v: number, currency: string) {
  const locale = currency === 'BRL' ? 'pt-BR' : currency === 'USD' ? 'en-US' : 'en-AU';
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(v);
}

const PERIOD_LABELS: Record<string, Record<Period, string>> = {
  en: { '1m': '1M', '3m': '3M', '6m': '6M', '1y': '1Y', all: 'All' },
  pt: { '1m': '1M', '3m': '3M', '6m': '6M', '1y': '1A', all: 'Tudo' },
};

const NO_DATA_MSG: Record<string, string> = {
  en: 'Add purchases with dates to see your portfolio evolution.',
  pt: 'Adicione compras com datas para ver a evolução do portfólio.',
};

function filterByPeriod(monthly: ChartPoint[], period: Period): ChartPoint[] {
  if (period === 'all' || monthly.length === 0) return monthly;
  const now = new Date();
  const cutoff = new Date(now);
  if (period === '1m') cutoff.setMonth(cutoff.getMonth() - 1);
  else if (period === '3m') cutoff.setMonth(cutoff.getMonth() - 3);
  else if (period === '6m') cutoff.setMonth(cutoff.getMonth() - 6);
  else cutoff.setFullYear(cutoff.getFullYear() - 1);
  const cutStr = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}`;
  const filtered = monthly.filter(p => p.label >= cutStr);
  return filtered.length >= 1 ? filtered : monthly;
}

export function PortfolioLineChart({
  monthly,
  currency,
  lang = 'en',
}: {
  monthly: ChartPoint[];
  currency: string;
  lang?: string;
}) {
  const [period, setPeriod] = useState<Period>('all');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const labels = PERIOD_LABELS[lang] || PERIOD_LABELS.en;
  const data = filterByPeriod(monthly, period);

  if (monthly.length === 0) {
    return <p className="muted pchart-empty">{NO_DATA_MSG[lang] || NO_DATA_MSG.en}</p>;
  }

  // Dimensions
  const W = 760, H = 210;
  const PAD = { t: 14, r: 18, b: 38, l: 60 };
  const pw = W - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;

  const maxV = Math.max(...data.map(p => p.cumulative)) * 1.1 || 1;
  const minV = 0;

  const n = data.length;
  const sx = (i: number) => PAD.l + (n <= 1 ? pw / 2 : (i / (n - 1)) * pw);
  const sy = (v: number) => PAD.t + ph - ((v - minV) / (maxV - minV)) * ph;

  // Build smooth bezier path
  const pts: [number, number][] = data.map((p, i) => [sx(i), sy(p.cumulative)]);

  let linePath = '';
  if (pts.length === 1) {
    linePath = `M ${pts[0][0]} ${PAD.t + ph} L ${pts[0][0]} ${pts[0][1]}`;
  } else {
    linePath = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const [px, py] = pts[i - 1], [cx, cy] = pts[i];
      const cpx = (cx - px) * 0.42;
      linePath += ` C ${(px + cpx).toFixed(1)} ${py.toFixed(1)}, ${(cx - cpx).toFixed(1)} ${cy.toFixed(1)}, ${cx.toFixed(1)} ${cy.toFixed(1)}`;
    }
  }

  const areaPath = pts.length > 1
    ? linePath
      + ` L ${pts[pts.length - 1][0].toFixed(1)} ${(PAD.t + ph).toFixed(1)}`
      + ` L ${pts[0][0].toFixed(1)} ${(PAD.t + ph).toFixed(1)} Z`
    : '';

  // Y ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => maxV * t);

  // X labels — max 7 evenly spaced
  const step = Math.max(1, Math.ceil(n / 7));
  const xLabels = data
    .map((p, i) => ({ i, label: fmtLabel(p.label) }))
    .filter((_, i) => i % step === 0 || i === n - 1);

  const hp = hoverIdx !== null ? data[hoverIdx] : null;
  const hx = hoverIdx !== null ? sx(hoverIdx) : 0;
  const hy = hoverIdx !== null ? sy(data[hoverIdx].cumulative) : 0;

  return (
    <div className="pchart-wrap">
      <div className="pchart-controls">
        {(['1m', '3m', '6m', '1y', 'all'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`pchart-btn${period === p ? ' active' : ''}`}
          >
            {labels[p]}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="pchart-svg"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="pcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8b84b" stopOpacity="0.28" />
            <stop offset="70%" stopColor="#e8b84b" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#e8b84b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y grid + labels */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line
              x1={PAD.l} y1={sy(v)} x2={W - PAD.r} y2={sy(v)}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1"
            />
            <text
              x={PAD.l - 6} y={sy(v) + 4}
              textAnchor="end" fontSize="9" fill="#4a637a"
            >
              {fmtCompact(v, currency)}
            </text>
          </g>
        ))}

        {/* Area fill */}
        {areaPath && <path d={areaPath} fill="url(#pcGrad)" />}

        {/* Line */}
        <path d={linePath} fill="none" stroke="#e8b84b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

        {/* X labels */}
        {xLabels.map(({ i, label }) => (
          <text key={i} x={sx(i)} y={H - 7} textAnchor="middle" fontSize="9" fill="#4a637a">
            {label}
          </text>
        ))}

        {/* Hover zones (invisible rects) */}
        {data.map((_, i) => {
          const x0 = i === 0 ? PAD.l : (sx(i - 1) + sx(i)) / 2;
          const x1 = i === n - 1 ? W - PAD.r : (sx(i) + sx(i + 1)) / 2;
          return (
            <rect
              key={i}
              x={x0} y={PAD.t}
              width={Math.max(x1 - x0, 8)} height={ph}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setHoverIdx(i)}
            />
          );
        })}

        {/* Hover indicator */}
        {hp && hoverIdx !== null && (() => {
          const TW = 152, TH = hp.added > 0 ? 56 : 40;
          const tx = Math.min(Math.max(hx - TW / 2, PAD.l + 2), W - PAD.r - TW - 2);
          const ty = hy - TH - 14 < PAD.t ? hy + 16 : hy - TH - 14;
          return (
            <g>
              <line
                x1={hx} y1={PAD.t} x2={hx} y2={PAD.t + ph}
                stroke="rgba(232,184,75,0.25)" strokeWidth="1" strokeDasharray="3 3"
              />
              <circle cx={hx} cy={hy} r="9" fill="rgba(232,184,75,0.15)" />
              <circle cx={hx} cy={hy} r="4.5" fill="#e8b84b" />
              <rect
                x={tx} y={ty} width={TW} height={TH} rx="8"
                fill="#0d1a26" stroke="rgba(232,184,75,0.3)" strokeWidth="1"
              />
              <text x={tx + 10} y={ty + 15} fontSize="9" fill="#e8b84b" fontWeight="800">
                {fmtLabel(hp.label)}
              </text>
              <text x={tx + 10} y={ty + 31} fontSize="12" fill="#e2eaf3" fontWeight="700">
                {fmtFull(hp.cumulative, currency)}
              </text>
              {hp.added > 0 && (
                <text x={tx + 10} y={ty + 47} fontSize="9" fill="#7a8fa8">
                  +{fmtCompact(hp.added, currency)}{lang === 'pt' ? ' adicionado' : ' added this month'}
                </text>
              )}
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
