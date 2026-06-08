'use client';

import { useState } from 'react';
import { realValue, fmtCurrency, inflationSeries, convert, roundNice } from '@/lib/finance';
import { TOOLS_T, type Lang } from '@/lib/tools-i18n';
import { ToolChart } from './ToolChart';

type Props = { currency: string; rates: Record<string, number>; lang: Lang };

export function InflationTool({ currency, rates, lang }: Props) {
  const t = TOOLS_T[lang]; const s = t.inflation;
  const r = rates[currency] || 1;
  const [amount, setAmount] = useState(roundNice(convert(100000, r)));
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(3);

  const real = realValue(amount, rate, years);
  const lostPct = amount > 0 ? Math.round((1 - real / amount) * 100) : 0;
  const series = inflationSeries(amount, rate, years);

  return (
    <div className="tool-view">
      <div className="tool-grid">
        <div className="tool-inputs portfolio-card">
          <label className="tool-field"><span>{s.lAmount} ({currency})</span>
            <input type="number" min={0} value={amount} onChange={e => setAmount(+e.target.value || 0)} /></label>
          <label className="tool-field"><span>{s.lYears}: <strong>{years}</strong></span>
            <input type="range" min={1} max={50} value={years} onChange={e => setYears(+e.target.value)} className="tool-slider" /></label>
          <label className="tool-field"><span>{s.lRate}: <strong>{rate}%</strong></span>
            <input type="range" min={0} max={15} step={0.5} value={rate} onChange={e => setRate(+e.target.value)} className="tool-slider" /></label>
        </div>
        <div className="tool-result-col">
          <div className="tool-result portfolio-card tool-result-warn">
            <span className="tool-result-label">{s.rValue}</span>
            <span className="tool-result-val tool-result-val-warn">{fmtCurrency(real, currency)}</span>
            <span className="tool-result-sub">{s.rLost.replace('{x}', String(lostPct))}</span>
          </div>
          <div className="portfolio-card tool-chart-card">
            <ToolChart main={series} baseline={series.map(p => ({ ...p, value: amount }))} years={years} nowLabel={t.common.now} color="#e05555" />
            <div className="tool-legend"><span className="tool-dot tool-dot-red" />{t.common.realLine}<span className="tool-dot tool-dot-grey" />{s.lAmount}</div>
          </div>
        </div>
      </div>
      <p className="tool-disclaimer">{t.common.disclaimer}</p>
    </div>
  );
}
