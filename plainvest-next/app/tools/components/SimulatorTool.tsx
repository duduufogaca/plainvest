'use client';

import { useState } from 'react';
import { fv, fmtCurrency, growthSeries, convert, roundNice } from '@/lib/finance';
import { TOOLS_T, type Lang } from '@/lib/tools-i18n';
import { ToolChart } from './ToolChart';
import { NumberField, SliderField, SplitBar, StatRows, Legend } from './ToolBits';

type Props = { currency: string; rates: Record<string, number>; lang: Lang };

export function SimulatorTool({ currency, rates, lang }: Props) {
  const T = TOOLS_T[lang]; const s = T.tool.simulator; const co = T.common;
  const r = rates[currency] || 1;
  const [start, setStart] = useState(roundNice(convert(10000, r)));
  const [monthly, setMonthly] = useState(roundNice(convert(500, r)));
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(8);

  const value = fv(start, monthly, rate, years);
  const contributed = start + monthly * 12 * years;
  const growth = Math.max(0, value - contributed);
  const contribPct = value > 0 ? (contributed / value) * 100 : 0;
  const series = growthSeries(start, monthly, rate, years);

  return (
    <div className="tool-view">
      <div className="tool-grid">
        <div className="tool-inputs portfolio-card">
          <div className="tool-inputs-title">{co.settings}</div>
          <NumberField label={`${s.lStart} (${currency})`} value={start} onChange={setStart} />
          <NumberField label={`${s.lMonthly} (${currency})`} value={monthly} onChange={setMonthly} />
          <SliderField label={s.lYears} value={years} min={1} max={50} onChange={setYears} />
          <SliderField label={co.annualReturn} value={rate} min={0} max={20} step={0.5} onChange={setRate} display={`${rate}%`} />
        </div>

        <div className="tool-result-col">
          <div className="tool-result portfolio-card">
            <span className="tool-result-label">{s.rTitle}</span>
            <span className="tool-result-val">{fmtCurrency(value, currency)}</span>
            <StatRows items={[
              { label: co.invested, value: fmtCurrency(contributed, currency) },
              { label: co.growth, value: fmtCurrency(growth, currency), strong: true },
            ]} />
            <SplitBar contribPct={contribPct} leftLabel={co.contributions} rightLabel={co.growthShare} />
          </div>

          <div className="portfolio-card tool-chart-card">
            <ToolChart main={series} baseline={series.map(p => ({ ...p, value: p.contributed }))} years={years} nowLabel={co.now} />
            <Legend items={[{ color: '#2dd4bf', label: co.projectedLine }, { color: '#5a7a96', label: co.invested }]} />
          </div>
        </div>
      </div>
      <p className="tool-disclaimer">{co.disclaimer}</p>
    </div>
  );
}
