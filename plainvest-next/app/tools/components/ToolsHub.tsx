import type { ReactNode } from 'react';
import { fv, realValue, fmtCurrency, convert, roundNice } from '@/lib/finance';
import { TOOLS_T, CATEGORIES, type Lang, type ToolId } from '@/lib/tools-i18n';

const ICONS: Record<ToolId, ReactNode> = {
  simulator: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
  retirement: <><path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /></>,
  dca: <><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></>,
  etf: <><path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></>,
  inflation: <><path d="M3 7l6 6 4-4 8 8" /><path d="M17 17h4v-4" /></>,
  freedom: <><circle cx="12" cy="12" r="9" /><path d="M12 7v10" /><path d="M9 9.5a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-2.5 2.5s-2.5 1-2.5 2.5a2.5 2.5 0 0 0 5 0" /></>,
};

/* Live value preview per tool, using each tool's default inputs in the member's currency. */
function preview(id: ToolId, currency: string, r: number): string {
  const c = (n: number) => fmtCurrency(convert(n, r), currency);
  switch (id) {
    case 'simulator':  return c(fv(10000, 500, 8, 20));
    case 'etf':        return c(fv(2000, 300, 8, 25));
    case 'dca':        return c(fv(0, 300, 8, 20));
    case 'retirement': return c(fv(10000, 400, 7, 35));
    case 'inflation':  return c(realValue(100000, 3, 20));
    case 'freedom':    return c(50000 / 0.04);
  }
}
function previewLine(id: ToolId, t: Record<string, string>, currency: string, r: number): string {
  const v = preview(id, currency, r);
  const m = fmtCurrency(roundNice(convert(300, r)), currency);
  const a = fmtCurrency(roundNice(convert(id === 'inflation' ? 100000 : 50000, r)), currency);
  const y = id === 'etf' ? '25' : id === 'retirement' ? '35' : '20';
  return (t.preview || '{v}').replace('{v}', v).replace('{y}', y).replace('{m}', m).replace('{a}', a);
}

export function ToolsHub({ lang, currency, rates }: { lang: Lang; currency: string; rates: Record<string, number> }) {
  const t = TOOLS_T[lang];
  const r = rates[currency] || 1;
  return (
    <div className="tools-hub-wrap">
      {CATEGORIES.map(cat => (
        <section key={cat.id} className="tools-cat">
          <h2 className="tools-cat-label">{t.cat[cat.id]}</h2>
          <div className="tools-hub">
            {cat.tools.map(id => (
              <a key={id} href={`/tools?tool=${id}`} className="tool-hub-card">
                <span className="tool-hub-top">
                  <span className="tool-hub-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{ICONS[id]}</svg>
                  </span>
                  <span className="tool-hub-arrow">→</span>
                </span>
                <span className="tool-hub-name">{t.cards[id].name}</span>
                <span className="tool-hub-preview">{previewLine(id, t.tool[id], currency, r)}</span>
                <span className="tool-hub-go">{t.hub.open}</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
