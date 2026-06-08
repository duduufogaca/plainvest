'use client';

import { useState } from 'react';
import { fmtCurrency, convert, roundNice } from '@/lib/finance';
import { TOOLS_T, type Lang } from '@/lib/tools-i18n';
import { NumberField, SliderField, StatRows } from './ToolBits';

type Props = { currency: string; rates: Record<string, number>; lang: Lang };

export function FreedomTool({ currency, rates, lang }: Props) {
  const T = TOOLS_T[lang]; const s = T.tool.freedom; const co = T.common;
  const r = rates[currency] || 1;
  const [expenses, setExpenses] = useState(roundNice(convert(50000, r)));
  const [rate, setRate] = useState(4);

  const number = rate > 0 ? expenses / (rate / 100) : 0;
  const monthly = expenses / 12;

  return (
    <div className="tool-view">
      <div className="tool-grid">
        <div className="tool-inputs portfolio-card">
          <div className="tool-inputs-title">{co.settings}</div>
          <NumberField label={`${s.lExpenses} (${currency})`} value={expenses} onChange={setExpenses} />
          <SliderField label={s.lRate} value={rate} min={2} max={6} step={0.5} onChange={setRate} display={`${rate}%`} />
        </div>

        <div className="tool-result-col">
          <div className="tool-result portfolio-card">
            <span className="tool-result-label">{s.rTitle}</span>
            <span className="tool-result-val">{fmtCurrency(number, currency)}</span>
            <span className="tool-result-sub">{(s.basedOn || '').replace('{a}', fmtCurrency(expenses, currency)).replace('{r}', String(rate))}</span>
          </div>

          <div className="portfolio-card tool-summary">
            <StatRows items={[
              { label: s.monthlyLifestyle, value: fmtCurrency(monthly, currency) },
              { label: s.yearlyLifestyle, value: fmtCurrency(expenses, currency) },
              { label: s.requiredPortfolio, value: fmtCurrency(number, currency), strong: true },
            ]} />
          </div>

          <div className="portfolio-card tool-progress">
            <span className="tool-progress-title">{s.progressTitle}</span>
            <span className="tool-progress-val">{fmtCurrency(number, currency)}</span>
            <div className="tool-progress-track"><div className="tool-progress-fill" style={{ width: '100%' }} /></div>
            <span className="tool-progress-note">{s.progressNote}</span>
          </div>
        </div>
      </div>
      <p className="tool-disclaimer">{co.disclaimer}</p>
    </div>
  );
}
