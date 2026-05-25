export function LangSwitcher({
  current,
  currency,
}: {
  current: string;
  currency: string;
}) {
  return (
    <div className="lang-switcher">
      {(['en', 'pt'] as const).map(l => (
        <a
          key={l}
          href={`/portfolio?currency=${currency}&lang=${l}`}
          className={`lang-btn${l === current ? ' active' : ''}`}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
