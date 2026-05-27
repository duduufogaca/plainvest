'use client';

import React, { useEffect, useState } from 'react';

export type ScoreItem = {
  label: string;
  labelPt: string;
  value: number;
  color: string;
  desc: string;
  descPt: string;
  why: string;
  whyPt: string;
};

type Props = {
  scores: ScoreItem[];
  lang: string;
};

const SCORE_ICONS: Record<string, React.ReactElement> = {
  'Consistency': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  'Diversification': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  'Inflation Protection': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  'Long-term Strength': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  'Future Readiness': (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
};

export function FreedomScore({ scores, lang }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  const isEN = lang !== 'pt';
  const overall = Math.round(scores.reduce((s, sc) => s + sc.value, 0) / scores.length);
  const overallColor = overall >= 75 ? '#61d5b4' : overall >= 50 ? '#f4c86a' : '#a0b4c8';

  const overallLabel = overall >= 80
    ? (isEN ? 'Excellent foundation' : 'Base excelente')
    : overall >= 65
    ? (isEN ? 'Strong foundation' : 'Base sólida')
    : overall >= 50
    ? (isEN ? 'Building steadily' : 'Crescendo')
    : (isEN ? 'Getting started' : 'Começando');

  // Main ring geometry
  const R = 68; const C = 2 * Math.PI * R;
  const filled = mounted ? (overall / 100) * C : 0;

  const motivationMsg = overall >= 75
    ? (isEN ? "Keep going! You're building long-term wealth." : 'Continue! Você está construindo riqueza de longo prazo.')
    : overall >= 50
    ? (isEN ? "You're on the right path. Consistency is key." : 'Você está no caminho certo. Consistência é fundamental.')
    : (isEN ? "Every step matters. You've started — that's the hardest part." : 'Cada passo importa. Você começou — essa é a parte mais difícil.');

  return (
    <section className="portfolio-card freedom-score-card-v2">
      <div className="fs-header">
        <p className="eyebrow">Freedom Score™</p>
        <h2>{isEN ? 'Your Financial Health' : 'Sua Saúde Financeira'}</h2>
      </div>

      <div className="fs-body">
        {/* Left: big animated ring */}
        <div className="fs-ring-col">
          <svg width="168" height="168" viewBox="0 0 168 168" className="fs-main-ring-svg">
            <defs>
              <linearGradient id="fs-ring-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#61d5b4"/>
                <stop offset="100%" stopColor="#f4c86a"/>
              </linearGradient>
            </defs>
            {/* Background ring */}
            <circle cx="84" cy="84" r={R} fill="none"
              stroke="rgba(255,255,255,.06)" strokeWidth="13"/>
            {/* Score ring */}
            <circle cx="84" cy="84" r={R} fill="none"
              stroke="url(#fs-ring-grad)"
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${C}`}
              transform="rotate(-90 84 84)"
              style={{ transition: 'stroke-dasharray 1.6s cubic-bezier(.4,0,.2,1)' }}
            />
            {/* Score text */}
            <text x="84" y="76" textAnchor="middle"
              fontSize="38" fontWeight="900" fill={overallColor}
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">
              {overall}
            </text>
            <text x="84" y="94" textAnchor="middle"
              fontSize="13" fill="rgba(159,176,200,.7)"
              fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">
              /100
            </text>
          </svg>
          <span className="fs-ring-status" style={{ color: overallColor }}>{overallLabel}</span>
        </div>

        {/* Right: progress bars */}
        <div className="fs-bars-col">
          {scores.map((s) => {
            const icon = SCORE_ICONS[s.label] ?? SCORE_ICONS['Future Readiness'];
            return (
              <div key={s.label} className="fs-bar-item">
                <div className="fs-bar-row">
                  <span className="fs-bar-icon" style={{ color: s.color }}>{icon}</span>
                  <span className="fs-bar-label">{isEN ? s.label : s.labelPt}</span>
                  <span className="fs-bar-score" style={{ color: s.color }}>{s.value}/100</span>
                </div>
                <div className="fs-bar-track">
                  <div
                    className="fs-bar-fill"
                    style={{
                      width: mounted ? `${s.value}%` : '0%',
                      background: s.color,
                      transition: 'width 1.4s cubic-bezier(.4,0,.2,1)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational message */}
      <div className="fs-motivation">
        <span className="fs-mot-icon">⚡</span>
        <span className="fs-mot-text">{motivationMsg}</span>
      </div>
    </section>
  );
}
