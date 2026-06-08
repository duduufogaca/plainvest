'use client';

import { useState } from 'react';
import { fv, fmtCurrency, growthSeries, convert, roundNice } from '@/lib/finance';
import { TOOLS_T, type Lang } from '@/lib/tools-i18n';
import { ToolChart } from './ToolChart';
import { NumberField, SliderField, StatRows, Legend } from './ToolBits';

type Props = { currency: string; rates: Record<string, number>; lang: Lang };

export function RetirementTool({ currency, rates, lang }: Props) {
  const T = TOOLS_T[lang]; const s = T.tool.retirement; const co = T.common;
  const r = rates[currency] || 1;
  const [age, setAge] = useState(30);
  const [retire, setRetire] = useState(65);
  const [savings, setSavings] = useState(roundNice(convert(10000, r)));
  const [monthly, setMonthly] = useState(roundNice(convert(400, r)));
  const [rate, setRate] = useState(7);

  const years = Math.max(0, retire - age);
  const value = fv(savings, monthly, rate, years);
  const income = value * 0.04;
  const perWeek = income / 52;
  const series = growthSeries(savings, monthly, rate, Math.max(1, years));

  return (
    <div className="tool-view">
      <div className="tool-grid">
        <div className="tool-inputs portfolio-card">
          <div className="tool-inputs-title">{co.settings}</div>
          <SliderField label={s.lAge} value={age} min={16} max={75} onChange={setAge} />
          <SliderField label={s.lRetire} value={retire} min={40} max={80} onChange={setRetire} />
          <NumberField label={`${s.lSavings} (${currency})`} value={savings} onChange={setSavings} />
          <NumberField label={`${s.lMonthly} (${currency})`} value={monthly} onChange={setMonthly} />
          <SliderField label={co.annualReturn} value={rate} min={0} max={20} step={0.5} onChange={setRate} display={`${rate}%`} />
        </div>

        <div className="tool-result-col">
          <div className="tool-result portfolio-card">
            <span className="tool-result-label">{s.rTitle}</span>
            <span className="tool-result-val">{fmtCurrency(value, currency)}</span>
            <span className="tool-result-sub">{s.income}: <strong>{fmtCurrency(income, currency)}/{lang === 'pt' ? 'ano' : 'yr'}</strong> · {(s.perWeek || '').replace('{v}', fmtCurrency(perWeek, currency))}</span>
          </div>

          <div className="portfolio-card tool-summary">
            <StatRows items={[
              { label: s.retireAt, value: retire },
              { label: s.yearsRemaining, value: years },
              { label: s.balance, value: fmtCurrency(value, currency) },
              { label: s.incomePotential, value: `${fmtCurrency(income, currency)}/${lang === 'pt' ? 'ano' : 'yr'}`, strong: true },
            ]} />
          </div>

          <div className="portfolio-card tool-chart-card">
            <ToolChart main={series} baseline={series.map(p => ({ ...p, value: p.contributed }))} years={Math.max(1, years)} nowLabel={co.now} />
            <Legend items={[{ color: '#2dd4bf', label: co.projectedLine }, { color: '#5a7a96', label: co.invested }]} />
          </div>
        </div>
      </div>
      <p className="tool-disclaimer">{co.disclaimer}</p>
    </div>
  );
}
