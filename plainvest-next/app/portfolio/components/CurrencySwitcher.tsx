const CURRENCIES = [
  { code: 'AUD', flag: '🇦🇺' },
  { code: 'USD', flag: '🇺🇸' },
  { code: 'BRL', flag: '🇧🇷' },
];

export function CurrencySwitcher({
  current,
  lang,
}: {
  current: string;
  lang: string;
}) {
  return (
    <div className="currency-switcher">
      {CURRENCIES.map(c => (
        <a
          key={c.code}
          href={`/portfolio?currency=${c.code}&lang=${lang}`}
          className={`currency-btn${c.code === current ? ' active' : ''}`}
        >
          <span className="currency-flag">{c.flag}</span>
          {c.code}
        </a>
      ))}
    </div>
  );
}
