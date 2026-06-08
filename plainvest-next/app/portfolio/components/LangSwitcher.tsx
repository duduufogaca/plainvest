'use client';

import { usePathname, useSearchParams } from 'next/navigation';

const LANGS = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
] as const;

/* Stays on the current page (preserving other params) and persists via cookie. */
export function LangSwitcher({ current }: { current: string; currency?: string }) {
  const pathname = usePathname();
  const sp = useSearchParams();

  function hrefFor(code: string) {
    const params = new URLSearchParams(sp.toString());
    params.set('lang', code);
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="lang-switcher">
      {LANGS.map(l => (
        <a
          key={l.code}
          href={hrefFor(l.code)}
          onClick={() => { document.cookie = `pv_lang=${l.code};path=/;max-age=31536000`; }}
          className={`lang-btn${l.code === current ? ' active' : ''}`}
        >
          <span className="lang-flag">{l.flag}</span>
          {l.label}
        </a>
      ))}
    </div>
  );
}
