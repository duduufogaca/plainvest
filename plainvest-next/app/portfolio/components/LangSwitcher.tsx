const LANGS = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
] as const;

export function LangSwitcher({
  current,
  currency,
}: {
  current: string;
  currency: string;
}) {
  return (
    <div className="lang-switcher">
      {LANGS.map(l => (
        <a
          key={l.code}
          href={`/portfolio?currency=${currency}&lang=${l.code}`}
          className={`lang-btn${l.code === current ? ' active' : ''}`}
        >
          <span className="lang-flag">{l.flag}</span>
          {l.label}
        </a>
      ))}
    </div>
  );
}
