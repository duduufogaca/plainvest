'use client';

import { useState } from 'react';
import { realValue, fmtCurrency, inflationSeries, convert, roundNice } from '@/lib/finance';
import { TOOLS_T, type Lang } from '@/lib/tools-i18n';
import { ToolChart } from './ToolChart';
import { NumberField, SliderField, Legend } from './ToolBits';

type Props = { currency: string; rates: Record<string, number>; lang: Lang };

export function InflationTool({ currency, rates, lang }: Props) {
  const T = TOOLS_T[lang]; const s = T.tool.inflation; const co = T.common;
  const r = rates[currency] || 1;
  const [amount, setAmount] = useState(roundNice(convert(100000, r)));
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(3);

  const real = realValue(amount, rate, years);
  const loss = Math.max(0, amount - real);
  const lostPct = amount > 0 ? Math.round((1 - real / amount) * 100) : 0;
  const series = inflationSeries(amount, rate, years);

  return (
    <div className="tool-view">
      <div className="tool-grid">
        <div className="tool-inputs portfolio-card">
          <div className="tool-inputs-title">{co.settings}</div>
          <NumberField label={`${s.lAmount} (${currency})`} value={amount} onChange={setAmount} />
          <SliderField label={s.lYears} value={years} min={1} max={50} onChange={setYears} />
          <SliderField label={s.lRate} value={rate} min={0} max={15} step={0.5} onChange={setRate} display={`${rate}%`} />
        </div>

        <div className="tool-result-col">
          <div className="tool-result portfolio-card tool-result-warn">
            <span className="tool-result-label">{s.rTitle}</span>
            <span className="tool-result-val tool-result-val-warn">{fmtCurrency(real, currency)}</span>
            <span className="tool-result-sub">{s.loss}: <strong className="tool-loss">−{fmtCurrency(loss, currency)}</strong> · {(s.reduction || '').replace('{x}', String(lostPct))}</span>
          </div>

          <div className="portfolio-card tool-compare">
            <div className="tool-compare-side">
              <span className="tool-compare-lbl">{s.today}</span>
              <span className="tool-compare-val">{fmtCurrency(amount, currency)}</span>
            </div>
            <span className="tool-compare-arrow">→</span>
            <div className="tool-compare-side">
              <span className="tool-compare-lbl">{(s.future || '').replace('{y}', String(years))}</span>
              <span className="tool-compare-val tool-compare-val-warn">{fmtCurrency(real, currency)}</span>
            </div>
          </div>

          <div className="portfolio-card tool-insight tool-insight-warn">
            <span className="tool-insight-title">{s.warnTitle}</span>
            <span className="tool-insight-body">{s.warnBody}</span>
          </div>

          <div className="portfolio-card tool-chart-card">
            <ToolChart main={series} baseline={series.map(p => ({ ...p, value: amount }))} years={years} nowLabel={co.now} color="#e05555" />
            <Legend items={[{ color: '#e05555', label: co.realLine }, { color: '#5a7a96', label: s.today }]} />
          </div>
        </div>
      </div>
      <p className="tool-disclaimer">{co.disclaimer}</p>
    </div>
  );
}
