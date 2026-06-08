'use client';

import { usePathname, useSearchParams } from 'next/navigation';

const CURRENCIES = [
  { code: 'AUD', flag: '🇦🇺' },
  { code: 'USD', flag: '🇺🇸' },
  { code: 'BRL', flag: '🇧🇷' },
];

/* Stays on the current page (preserving other params) and persists via cookie,
   so currency works on /tools, /portfolio, /home, etc. — not only /portfolio. */
export function CurrencySwitcher({ current }: { current: string; lang?: string }) {
  const pathname = usePathname();
  const sp = useSearchParams();

  function hrefFor(code: string) {
    const params = new URLSearchParams(sp.toString());
    params.set('currency', code);
    return `${pathname}?${params.toString()}`;
  }

  return (
    <div className="currency-switcher">
      {CURRENCIES.map(c => (
        <a
          key={c.code}
          href={hrefFor(c.code)}
          onClick={() => { document.cookie = `pv_currency=${c.code};path=/;max-age=31536000`; }}
          className={`currency-btn${c.code === current ? ' active' : ''}`}
        >
          <span className="currency-flag">{c.flag}</span>
          {c.code}
        </a>
      ))}
    </div>
  );
}
