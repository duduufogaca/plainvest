'use client';

import type { ReactNode } from 'react';

export function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="tool-field">
      <span>{label}</span>
      <input type="number" min={0} value={value} onChange={e => onChange(+e.target.value || 0)} />
    </label>
  );
}

export function SliderField({
  label, value, min, max, step = 1, onChange, display,
}: { label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void; display?: string }) {
  return (
    <label className="tool-field">
      <span>{label}: <strong>{display ?? value}</strong></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(+e.target.value)} className="tool-slider" />
    </label>
  );
}

/* Contributions-vs-growth split bar */
export function SplitBar({ contribPct, leftLabel, rightLabel }: { contribPct: number; leftLabel: string; rightLabel: string }) {
  const c = Math.max(0, Math.min(100, isFinite(contribPct) ? contribPct : 0));
  return (
    <div className="tool-split">
      <div className="tool-split-bar">
        <div className="tool-split-contrib" style={{ width: `${c}%` }} />
        <div className="tool-split-growth" style={{ width: `${100 - c}%` }} />
      </div>
      <div className="tool-split-legend">
        <span><i className="tool-dot tool-dot-grey" />{Math.round(c)}% {leftLabel}</span>
        <span><i className="tool-dot tool-dot-teal" />{Math.round(100 - c)}% {rightLabel}</span>
      </div>
    </div>
  );
}

export function StatRows({ items }: { items: { label: string; value: ReactNode; strong?: boolean }[] }) {
  return (
    <div className="tool-statrows">
      {items.map((it, i) => (
        <div key={i} className={`tool-statrow${it.strong ? ' tool-statrow-strong' : ''}`}>
          <span className="tool-statrow-label">{it.label}</span>
          <span className="tool-statrow-value">{it.value}</span>
        </div>
      ))}
    </div>
  );
}

export function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="tool-legend">
      {items.map((it, i) => (<span key={i}><i className="tool-dot" style={{ background: it.color }} />{it.label}</span>))}
    </div>
  );
}
