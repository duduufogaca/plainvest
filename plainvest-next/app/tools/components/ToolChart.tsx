'use client';

import { useMemo } from 'react';
import { fmtShort, type SeriesPoint } from '@/lib/finance';

type Props = {
  main: SeriesPoint[];                 // primary line (uses .value)
  baseline?: SeriesPoint[];            // optional secondary line (uses .value) — e.g. contributions or nominal
  years: number;
  nowLabel: string;
  color?: string;                      // primary stroke gradient endpoint (defaults teal)
  baselineColor?: string;
  height?: number;                     // rendered pixel height (default 400 for premium tools)
};

/* Lightweight area+line chart shared by the Pro calculator tools. */
export function ToolChart({ main, baseline, years, nowLabel, color = '#2dd4bf', baselineColor = '#5a7a96', height = 400 }: Props) {
  const W = 660, H = 210, PL = 50, PB = 26, PT = 12;

  const maxVal = useMemo(() => {
    const vals = main.map(p => p.value).concat(baseline ? baseline.map(p => p.value) : []);
    return Math.max(1, ...vals) * 1.08;
  }, [main, baseline]);

  const toX = (y: number) => PL + (years > 0 ? (y / years) : 0) * (W - PL - 8);
  const toY = (v: number) => PT + (1 - v / maxVal) * (H - PB - PT);

  function path(points: SeriesPoint[]) {
    return points.reduce((acc, p, i) => {
      const x = toX(p.year).toFixed(1), y = toY(p.value).toFixed(1);
      if (i === 0) return `M ${x} ${y}`;
      const prev = points[i - 1];
      const cpx = ((toX(prev.year) + toX(p.year)) / 2).toFixed(1);
      return `${acc} C ${cpx} ${toY(prev.value).toFixed(1)} ${cpx} ${y} ${x} ${y}`;
    }, '');
  }

  const mainPath = path(main);
  const mainArea = `${mainPath} L ${toX(years).toFixed(1)} ${toY(0).toFixed(1)} L ${toX(0).toFixed(1)} ${toY(0).toFixed(1)} Z`;
  const basePath = baseline ? path(baseline) : '';

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(p => ({ val: maxVal * p, y: toY(maxVal * p) }));
  const xTicks = Array.from({ length: 6 }, (_, i) => Math.round((years / 5) * i));

  return (
    <div className="tool-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: `${height}px`, display: 'block' }}>
        <defs>
          <linearGradient id="toolArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.26" />
            <stop offset="85%" stopColor={color} stopOpacity="0.03" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={PL} x2={W - 6} y1={t.y} y2={t.y} stroke="rgba(255,255,255,.05)" strokeWidth="1" />
            <text x={PL - 5} y={t.y + 3.5} textAnchor="end" fontSize="8.5" fill="#4a6880" fontFamily="inherit">{fmtShort(t.val)}</text>
          </g>
        ))}

        {baseline && (
          <path d={basePath} fill="none" stroke={baselineColor} strokeWidth="1.5" strokeDasharray="5 4" strokeLinecap="round" />
        )}

        <path d={mainArea} fill="url(#toolArea)" />
        <path d={mainPath} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

        {xTicks.map((y, i) => (
          <text key={i} x={toX(y)} y={H - PB + 14} textAnchor="middle" fontSize="8.5" fill="#4a6880" fontFamily="inherit">
            {y === 0 ? nowLabel : `${y}${nowLabel === 'Hoje' ? 'a' : 'y'}`}
          </text>
        ))}
      </svg>
    </div>
  );
}
