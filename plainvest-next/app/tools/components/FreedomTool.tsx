'use client';

import { useState } from 'react';
import { fmtCurrency, convert, roundNice } from '@/lib/finance';
import { TOOLS_T, type Lang } from '@/lib/tools-i18n';

type Props = { currency: string; rates: Record<string, number>; lang: Lang };

export function FreedomTool({ currency, rates, lang }: Props) {
  const t = TOOLS_T[lang]; const s = t.freedom;
  const r = rates[currency] || 1;
  const [expenses, setExpenses] = useState(roundNice(convert(50000, r)));
  const [rate, setRate] = useState(4);

  const number = rate > 0 ? expenses / (rate / 100) : 0;
  const multiple = rate > 0 ? Math.round(100 / rate) : 0;

  return (
    <div className="tool-view">
      <div className="tool-grid">
        <div className="tool-inputs portfolio-card">
          <label className="tool-field"><span>{s.lExpenses} ({currency})</span>
            <input type="number" min={0} value={expenses} onChange={e => setExpenses(+e.target.value || 0)} /></label>
          <label className="tool-field"><span>{s.lRate}: <strong>{rate}%</strong></span>
            <input type="range" min={2} max={6} step={0.5} value={rate} onChange={e => setRate(+e.target.value)} className="tool-slider" /></label>
        </div>
        <div className="tool-result-col">
          <div className="tool-result portfolio-card">
            <span className="tool-result-label">{s.rValue}</span>
            <span className="tool-result-val">{fmtCurrency(number, currency)}</span>
            <span className="tool-result-sub">{s.rNote.replace('{x}', String(multiple))}</span>
          </div>
          <div className="portfolio-card tool-freedom-bars">
            <div className="tool-fbar">
              <span className="tool-fbar-label">{s.lExpenses}</span>
              <div className="tool-fbar-track"><div className="tool-fbar-fill" style={{ width: `${Math.min(100, (expenses / Math.max(number, 1)) * 100)}%` }} /></div>
              <span className="tool-fbar-val">{fmtCurrency(expenses, currency)}</span>
            </div>
            <div className="tool-fbar">
              <span className="tool-fbar-label">{s.rValue}</span>
              <div className="tool-fbar-track"><div className="tool-fbar-fill tool-fbar-fill-full" style={{ width: '100%' }} /></div>
              <span className="tool-fbar-val">{fmtCurrency(number, currency)}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="tool-disclaimer">{t.common.disclaimer}</p>
    </div>
  );
}
