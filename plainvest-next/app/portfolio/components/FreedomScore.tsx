'use client';

import { useEffect, useState } from 'react';

export type ScoreItem = {
  label: string;
  labelPt: string;
  value: number;
  color: string;
  desc: string;
  descPt: string;
};

type Props = {
  scores: ScoreItem[];
  lang: string;
};

export function FreedomScore({ scores, lang }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const isEN = lang !== 'pt';
  const R = 33;
  const C = 2 * Math.PI * R; // ~207.3

  const overall = Math.round(scores.reduce((s, sc) => s + sc.value, 0) / scores.length);
  const overallColor = overall >= 75 ? '#61d5b4' : overall >= 50 ? '#f4c86a' : '#f0956a';

  const overallLabel = overall >= 80
    ? (isEN ? 'Excellent' : 'Excelente')
    : overall >= 65
    ? (isEN ? 'Strong' : 'Forte')
    : overall >= 50
    ? (isEN ? 'Building' : 'Em crescimento')
    : (isEN ? 'Getting started' : 'Começando');

  return (
    <section className="portfolio-card freedom-score-card">
      <div className="freedom-header">
        <div>
          <p className="eyebrow">Freedom Score™</p>
          <h2>{isEN ? 'Portfolio Health' : 'Saúde do Portfólio'}</h2>
        </div>
        <div className="freedom-overall-badge">
          <span className="freedom-overall-num" style={{ color: overallColor }}>{overall}</span>
          <span className="freedom-overall-denom">/100</span>
          <span className="freedom-overall-status" style={{ color: overallColor }}>{overallLabel}</span>
        </div>
      </div>

      <div className="freedom-rings-row">
        {scores.map(s => {
          const filled = mounted ? (s.value / 100) * C : 0;
          return (
            <div key={s.label} className="freedom-ring-item">
              <svg width="84" height="84" viewBox="0 0 84 84" className="freedom-ring-svg">
                <circle cx="42" cy="42" r={R} fill="none"
                  stroke="rgba(255,255,255,.06)" strokeWidth="7.5" />
                <circle cx="42" cy="42" r={R} fill="none"
                  stroke={s.color}
                  strokeWidth="7.5"
                  strokeLinecap="round"
                  strokeDasharray={`${filled} ${C}`}
                  transform="rotate(-90 42 42)"
                  style={{ transition: 'stroke-dasharray 1.3s cubic-bezier(.4,0,.2,1)' }}
                />
                <text x="42" y="47" textAnchor="middle"
                  fontSize="16" fontWeight="800" fill={s.color}
                  fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">
                  {s.value}
                </text>
              </svg>
              <span className="freedom-ring-label">{isEN ? s.label : s.labelPt}</span>
              <span className="freedom-ring-desc">{isEN ? s.desc : s.descPt}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
