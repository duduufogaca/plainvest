'use client';

import { useState } from 'react';

export type ChartPoint = { label: string; cumulative: number; added: number };
type Period = '6m' | '1y' | 'all';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtLabel(s: string) {
  const [y, m] = s.split('-');
  return m ? `${MONTHS[parseInt(m) - 1]} '${y.slice(2)}` : y;
}

function fmtCurrency(v: number, currency: string) {
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

  const data: ChartPoint[] = (() => {
    if (period === 'all' || monthly.length <= 2) return monthly;
    const now = new Date();
    const cutoff = new Date(now);
    if (period === '6m') cutoff.setMonth(cutoff.getMonth() - 6);
    else cutoff.setFullYear(cutoff.getFullYear() - 1);
    const cutStr = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}`;
    const f = monthly.filter(p => p.label >= cutStr);
    return f.length >= 2 ? f : monthly;
  })();

  const LABELS: Record<string, Record<string, string>> = {
    en: { '6m': '6M', '1y': '1Y', all: 'All', invested: 'added this month', cumulative: 'Cumulative invested', noData: 'Add purchases with dates to see portfolio evolution.' },
    pt: { '6m': '6M', '1y': '1Y', all: 'Tudo', invested: 'adicionado', cumulative: 'Investido total', noData: 'Adicione compras com datas para ver a evolução.' },
  };
  const lx = LABELS[lang] || LABELS.en;

  if (data.length === 0) {
    return <p className="muted pchart-empty">{lx.noData}</p>;
  }

  const W = 760, H = 210;
  const PAD = { t: 14, r: 18, b: 38, l: 60 };
  const pw = W - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;

  const maxV = Math.max(...data.map(p => p.cumulative)) * 1.1 || 1;
  const sx = (i: number) => PAD.l + (i / Math.max(data.length - 1, 1)) * pw;
  const sy = (v: number) => PAD.t + ph - (v / maxV) * ph;

  // Smooth bezier path
  const pts = data.map((p, i) => [sx(i), sy(p.cumulative)] as [number, number]);
  let linePath = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1], [cx, cy] = pts[i];
    const cpx = (cx - px) * 0.42;
    linePath += ` C ${(px + cpx).toFixed(1)} ${py.toFixed(1)}, ${(cx - cpx).toFixed(1)} ${cy.toFixed(1)}, ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }
  const areaPath = linePath
    + ` L ${pts[pts.length - 1][0].toFixed(1)} ${(PAD.t + ph).toFixed(1)}`
    + ` L ${pts[0][0].toFixed(1)} ${(PAD.t + ph).toFixed(1)} Z`;

  // Y ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => maxV * t);

  // X labels — max 8 evenly spaced
  const step = Math.max(1, Math.ceil(data.length / 8));
  const xLabels = data
    .map((p, i) => ({ i, label: fmtLabel(p.label) }))
    .filter((_, i) => i % step === 0 || i === data.length - 1);

  const hp = hoverIdx !== null ? data[hoverIdx] : null;
  const hx = hoverIdx !== null ? sx(hoverIdx) : 0;
  const hy = hoverIdx !== null ? sy(data[hoverIdx].cumulative) : 0;

  return (
    <div className="pchart-wrap">
      <div className="pchart-controls">
        {(['6m', '1y', 'all'] as Period[]).map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`pchart-btn${period === p ? ' active' : ''}`}>
            {lx[p]}
          </button>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="pchart-svg"
        onMouseLeave={() => setHoverIdx(null)}>
        <defs>
          <linearGradient id="pcGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#61d5b4" stopOpacity="0.2" />
            <stop offset="80%" stopColor="#61d5b4" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#61d5b4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y grid + labels */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={sy(v)} x2={W - PAD.r} y2={sy(v)}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PAD.l - 6} y={sy(v) + 4} textAnchor="end"
              fontSize="9" fill="#4a637a">{fmtCurrency(v, currency)}</text>
          </g>
        ))}

        {/* Area fill + line */}
        <path d={areaPath} fill="url(#pcGrad)" />
        <path d={linePath} fill="none" stroke="#61d5b4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* X labels */}
        {xLabels.map(({ i, label }) => (
          <text key={i} x={sx(i)} y={H - 7} textAnchor="middle" fontSize="9" fill="#4a637a">
            {label}
          </text>
        ))}

        {/* Hover zones */}
        {data.map((_, i) => {
          const x0 = i === 0 ? PAD.l : (sx(i - 1) + sx(i)) / 2;
          const x1 = i === data.length - 1 ? W - PAD.r : (sx(i) + sx(i + 1)) / 2;
          return (
            <rect key={i} x={x0} y={PAD.t} width={Math.max(x1 - x0, 4)} height={ph}
              fill="transparent" style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setHoverIdx(i)} />
          );
        })}

        {/* Hover indicator */}
        {hp && hoverIdx !== null && (() => {
          const TW = 148, TH = hp.added > 0 ? 54 : 38;
          const tx = Math.min(Math.max(hx - TW / 2, PAD.l + 2), W - PAD.r - TW - 2);
          const ty = hy - TH - 12 < PAD.t ? hy + 14 : hy - TH - 12;
          return (
            <g>
              <line x1={hx} y1={PAD.t} x2={hx} y2={PAD.t + ph}
                stroke="rgba(97,213,180,0.22)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={hx} cy={hy} r="8" fill="rgba(97,213,180,0.15)" />
              <circle cx={hx} cy={hy} r="4" fill="#61d5b4" />
              <rect x={tx} y={ty} width={TW} height={TH} rx="8"
                fill="#0d1a26" stroke="rgba(97,213,180,0.28)" strokeWidth="1" />
              <text x={tx + 10} y={ty + 14} fontSize="9" fill="#61d5b4" fontWeight="800">
                {fmtLabel(hp.label)}
              </text>
              <text x={tx + 10} y={ty + 29} fontSize="11.5" fill="#e2eaf3" fontWeight="700">
                {fmtFull(hp.cumulative, currency)}
              </text>
              {hp.added > 0 && (
                <text x={tx + 10} y={ty + 45} fontSize="9" fill="#7a8fa8">
                  +{fmtCurrency(hp.added, currency)} {lx.invested}
                </text>
              )}
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
