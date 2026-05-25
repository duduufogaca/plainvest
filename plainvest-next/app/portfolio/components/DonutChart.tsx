'use client';

import { useState } from 'react';

export type DonutSegment = {
  label: string;
  value: number;
  pct: number;
  color: string;
  ticker?: string;
};

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, inner: number, start: number, end: number) {
  const gap = 1.5;
  const s = start + gap / 2;
  const e = end - gap / 2;
  if (e - s <= 0) return '';
  const large = e - s > 180 ? 1 : 0;
  const p1 = polarToXY(cx, cy, r, s);
  const p2 = polarToXY(cx, cy, r, e);
  const p3 = polarToXY(cx, cy, inner, e);
  const p4 = polarToXY(cx, cy, inner, s);
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${inner} ${inner} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
}

export function DonutChart({ segments, currency = 'AUD' }: { segments: DonutSegment[]; currency?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const size = 220;
  const cx = size / 2, cy = size / 2;
  const r = 88, inner = 58;

  let cum = 0;
  const arcs = segments.map((seg, i) => {
    const start = cum;
    const span = (seg.pct / 100) * 360;
    cum += span;
    return { ...seg, start, end: cum, i };
  });

  const hov = hovered !== null ? segments[hovered] : null;

  const fmtVal = (v: number) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v);

  return (
    <div className="donut-container">
      <div className="donut-chart-wrap">
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ overflow: 'visible' }}>
          {arcs.map((arc) => {
            const isHov = hovered === arc.i;
            const rr = isHov ? r + 6 : r;
            return (
              <path
                key={arc.i}
                d={arcPath(cx, cy, rr, inner, arc.start, arc.end)}
                fill={arc.color}
                opacity={hovered !== null && !isHov ? 0.45 : 1}
                style={{ transition: 'all .2s', cursor: 'pointer' }}
                onMouseEnter={() => setHovered(arc.i)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
          {/* Centre label */}
          {hov ? (
            <>
              <text x={cx} y={cy - 10} textAnchor="middle" fill="#ddeeff" fontSize="15" fontWeight="900">
                {hov.pct.toFixed(1)}%
              </text>
              <text x={cx} y={cy + 7} textAnchor="middle" fill="#61d5b4" fontSize="10" fontWeight="800">
                {hov.ticker || hov.label}
              </text>
              <text x={cx} y={cy + 22} textAnchor="middle" fill="#7a8fa8" fontSize="9">
                {fmtVal(hov.value)}
              </text>
            </>
          ) : (
            <>
              <text x={cx} y={cy - 5} textAnchor="middle" fill="#ddeeff" fontSize="13" fontWeight="900">
                Portfolio
              </text>
              <text x={cx} y={cy + 12} textAnchor="middle" fill="#7a8fa8" fontSize="9">
                allocation
              </text>
            </>
          )}
        </svg>
      </div>
      <div className="donut-legend">
        {segments.map((seg, i) => (
          <div
            key={i}
            className={`donut-legend-row${hovered === i ? ' active' : ''}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="donut-dot" style={{ background: seg.color }} />
            <span className="donut-leg-label">
              {seg.ticker ? <><strong>{seg.ticker}</strong> <span>{seg.label}</span></> : seg.label}
            </span>
            <span className="donut-leg-pct">{seg.pct.toFixed(1)}%</span>
            <span className="donut-leg-val">{fmtVal(seg.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
