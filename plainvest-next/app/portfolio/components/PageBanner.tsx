type Props = {
  firstName: string;
  lang: string;
};

export function PageBanner({ firstName, lang }: Props) {
  const isEN = lang !== 'pt';

  return (
    <div className="ppb-wrap">
      {/* Atmospheric glows — cinematic background light */}
      <div className="ppb-glow ppb-glow-top" aria-hidden="true" />
      <div className="ppb-glow ppb-glow-mid" aria-hidden="true" />
      <div className="ppb-glow ppb-glow-br" aria-hidden="true" />

      <div className="ppb-inner">
        {/* Kicker badge — matches public homepage style */}
        <span className="ppb-kicker">
          <span className="ppb-kicker-dot" aria-hidden="true" />
          {isEN ? 'Your Financial Future' : 'Seu Futuro Financeiro'}
        </span>

        {/* Big emotional headline — identity before data */}
        <h1 className="ppb-headline">
          {isEN ? (
            <>
              <span className="ppb-hl-plain">Build wealth</span>
              <em className="ppb-hl-teal">with clarity.</em>
            </>
          ) : (
            <>
              <span className="ppb-hl-plain">Construa patrimônio</span>
              <em className="ppb-hl-teal">com clareza.</em>
            </>
          )}
        </h1>

        {/* Welcome greeting */}
        <p className="ppb-greeting">
          {isEN
            ? <>{`Welcome back, `}<strong className="ppb-name">{firstName}</strong>.</>
            : <>{`Bem-vindo de volta, `}<strong className="ppb-name">{firstName}</strong>.</>}
        </p>
      </div>
    </div>
  );
}
