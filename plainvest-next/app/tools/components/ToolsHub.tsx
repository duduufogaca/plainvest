import type { ReactNode } from 'react';
import { TOOLS_T, TOOL_IDS, type Lang, type ToolId } from '@/lib/tools-i18n';

const ICONS: Record<ToolId, ReactNode> = {
  simulator: <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
  retirement: <><path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /></>,
  dca: <><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></>,
  etf: <><path d="M12 2 2 7l10 5 10-5-10-5Z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></>,
  inflation: <><path d="M3 7l6 6 4-4 8 8" /><path d="M17 17h4v-4" /></>,
  freedom: <><circle cx="12" cy="12" r="9" /><path d="M12 7v10" /><path d="M9 9.5a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-2.5 2.5s-2.5 1-2.5 2.5a2.5 2.5 0 0 0 5 0" /></>,
};

export function ToolsHub({ lang }: { lang: Lang }) {
  const t = TOOLS_T[lang];
  return (
    <div className="tools-hub">
      {TOOL_IDS.map(id => (
        <a key={id} href={`/tools?tool=${id}`} className="tool-hub-card portfolio-card">
          <span className="tool-hub-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{ICONS[id]}</svg>
          </span>
          <span className="tool-hub-name">{t.cards[id].name}</span>
          <span className="tool-hub-desc">{t.cards[id].desc}</span>
          <span className="tool-hub-go">→</span>
        </a>
      ))}
    </div>
  );
}
