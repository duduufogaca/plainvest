'use client';

import { useState } from 'react';
import { fv, fmtCurrency, growthSeries, convert, roundNice } from '@/lib/finance';
import { TOOLS_T, type Lang } from '@/lib/tools-i18n';
import { ToolChart } from './ToolChart';

type Props = { currency: string; rates: Record<string, number>; lang: Lang };

export function DcaTool({ currency, rates, lang }: Props) {
  const t = TOOLS_T[lang]; const s = t.dca;
  const r = rates[currency] || 1;
  const [monthly, setMonthly] = useState(roundNice(convert(300, r)));
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(8);

  const value = fv(0, monthly, rate, years);
  const contributed = monthly * 12 * years;
  const series = growthSeries(0, monthly, rate, years);

  return (
    <div className="tool-view">
      <div className="tool-grid">
        <div className="tool-inputs portfolio-card">
          <label className="tool-field"><span>{s.lMonthly} ({currency})</span>
            <input type="number" min={0} value={monthly} onChange={e => setMonthly(+e.target.value || 0)} /></label>
          <label className="tool-field"><span>{s.lYears}: <strong>{years}</strong></span>
            <input type="range" min={1} max={50} value={years} onChange={e => setYears(+e.target.value)} className="tool-slider" /></label>
          <label className="tool-field"><span>{t.common.annualReturn}: <strong>{rate}%</strong></span>
            <input type="range" min={0} max={20} step={0.5} value={rate} onChange={e => setRate(+e.target.value)} className="tool-slider" /></label>
        </div>
        <div className="tool-result-col">
          <div className="tool-result portfolio-card">
            <span className="tool-result-label">{s.rValue}</span>
            <span className="tool-result-val">{fmtCurrency(value, currency)}</span>
            <span className="tool-result-sub">{s.rInvested} {fmtCurrency(contributed, currency)} · {s.rGrowth} {fmtCurrency(Math.max(0, value - contributed), currency)}</span>
          </div>
          <div className="portfolio-card tool-chart-card">
            <ToolChart main={series} baseline={series.map(p => ({ ...p, value: p.contributed }))} years={years} nowLabel={t.common.now} />
            <div className="tool-legend"><span className="tool-dot tool-dot-teal" />{t.common.projectedLine}<span className="tool-dot tool-dot-grey" />{t.common.invested}</div>
          </div>
        </div>
      </div>
      <p className="tool-disclaimer">{t.common.disclaimer}</p>
    </div>
  );
}
