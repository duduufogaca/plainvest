'use client';

import { useState } from 'react';
import { fv, fmtCurrency, growthSeries, convert, roundNice } from '@/lib/finance';
import { TOOLS_T, type Lang } from '@/lib/tools-i18n';
import { ToolChart } from './ToolChart';

type Props = { currency: string; rates: Record<string, number>; lang: Lang };

export function RetirementTool({ currency, rates, lang }: Props) {
  const t = TOOLS_T[lang]; const s = t.retirement;
  const r = rates[currency] || 1;
  const [age, setAge] = useState(30);
  const [retire, setRetire] = useState(65);
  const [savings, setSavings] = useState(roundNice(convert(10000, r)));
  const [monthly, setMonthly] = useState(roundNice(convert(400, r)));
  const [rate, setRate] = useState(7);

  const years = Math.max(0, retire - age);
  const value = fv(savings, monthly, rate, years);
  const income = value * 0.04;
  const series = growthSeries(savings, monthly, rate, Math.max(1, years));

  return (
    <div className="tool-view">
      <div className="tool-grid">
        <div className="tool-inputs portfolio-card">
          <label className="tool-field"><span>{s.lAge}: <strong>{age}</strong></span>
            <input type="range" min={16} max={75} value={age} onChange={e => setAge(+e.target.value)} className="tool-slider" /></label>
          <label className="tool-field"><span>{s.lRetire}: <strong>{retire}</strong></span>
            <input type="range" min={40} max={80} value={retire} onChange={e => setRetire(+e.target.value)} className="tool-slider" /></label>
          <label className="tool-field"><span>{s.lSavings} ({currency})</span>
            <input type="number" min={0} value={savings} onChange={e => setSavings(+e.target.value || 0)} /></label>
          <label className="tool-field"><span>{s.lMonthly} ({currency})</span>
            <input type="number" min={0} value={monthly} onChange={e => setMonthly(+e.target.value || 0)} /></label>
          <label className="tool-field"><span>{t.common.annualReturn}: <strong>{rate}%</strong></span>
            <input type="range" min={0} max={20} step={0.5} value={rate} onChange={e => setRate(+e.target.value)} className="tool-slider" /></label>
        </div>
        <div className="tool-result-col">
          <div className="tool-result portfolio-card">
            <span className="tool-result-label">{s.rValue}</span>
            <span className="tool-result-val">{fmtCurrency(value, currency)}</span>
            <span className="tool-result-sub">{s.rIncome.replace('{x}', fmtCurrency(income, currency))}</span>
          </div>
          <div className="portfolio-card tool-chart-card">
            <ToolChart main={series} baseline={series.map(p => ({ ...p, value: p.contributed }))} years={Math.max(1, years)} nowLabel={t.common.now} />
            <div className="tool-legend"><span className="tool-dot tool-dot-teal" />{t.common.projectedLine}<span className="tool-dot tool-dot-grey" />{t.common.invested}</div>
          </div>
        </div>
      </div>
      <p className="tool-disclaimer">{t.common.disclaimer}</p>
    </div>
  );
}
