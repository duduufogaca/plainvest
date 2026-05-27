type Props = {
  lang: string;
  firstName?: string;
  freedomScore?: number;
};

export function PageBanner({ lang, firstName, freedomScore }: Props) {
  const isEN = lang !== 'pt';

  const scoreColor = freedomScore == null ? '#9fb0c8'
    : freedomScore >= 75 ? '#61d5b4'
    : freedomScore >= 50 ? '#f4c86a'
    : '#9fb0c8';

  const scoreLabel = freedomScore == null ? ''
    : isEN
      ? (freedomScore >= 80 ? 'Excellent' : freedomScore >= 65 ? 'Strong' : freedomScore >= 50 ? 'Building' : 'Starting')
      : (freedomScore >= 80 ? 'Excelente' : freedomScore >= 65 ? 'Sólido' : freedomScore >= 50 ? 'Crescendo' : 'Iniciando');

  return (
    <div className="ppb-wrap">
      <div className="ppb-glow-teal" aria-hidden="true" />
      <div className="ppb-glow-gold" aria-hidden="true" />

      <div className="ppb-center">
        {/* Greeting */}
        {firstName && (
          <p className="ppb-greeting">
            {isEN ? 'Welcome back, ' : 'Bem-vindo de volta, '}
            <strong>{firstName.toUpperCase()}</strong>
          </p>
        )}

        {/* Top ornament */}
        <div className="ppb-ornament" aria-hidden="true">
          <div className="ppb-ornament-line" />
          <span className="ppb-ornament-diamond">◆</span>
          <div className="ppb-ornament-line ppb-ornament-line-r" />
        </div>

        {/* Poster-scale headline */}
        <h1 className="ppb-headline">
          <span className="ppb-hl-line1">{isEN ? 'Your future' : 'Seu futuro'}</span>
          <span className="ppb-hl-line2">
            <span className="ppb-hl-plain">{isEN ? 'is ' : 'é '}</span>
            <em className="ppb-hl-gold">{isEN ? 'built today.' : 'construído hoje.'}</em>
          </span>
        </h1>

        {/* Gold glow sweep */}
        <div className="ppb-gold-sweep" aria-hidden="true" />

        {/* Subtitle */}
        <p className="ppb-sub">
          {isEN
            ? <>We help you invest with <strong>clarity</strong>, <strong>confidence</strong> and a <strong>long-term vision.</strong></>
            : <>Te ajudamos a investir com <strong>clareza</strong>, <strong>confiança</strong> e uma <strong>visão de longo prazo.</strong></>}
        </p>

        {/* Freedom score pill */}
        {freedomScore != null && (
          <div className="ppb-score-pill">
            <span className="ppb-sp-label">{isEN ? 'Freedom Score™' : 'Pontuação de Liberdade™'}</span>
            <span className="ppb-sp-val" style={{ color: scoreColor }}>{freedomScore}/100</span>
            <span className="ppb-sp-sep" aria-hidden="true">·</span>
            <span className="ppb-sp-status" style={{ color: scoreColor }}>{scoreLabel}</span>
          </div>
        )}

        {/* Bottom ornament */}
        <div className="ppb-ornament" aria-hidden="true">
          <div className="ppb-ornament-line" />
          <span className="ppb-ornament-diamond">◆</span>
          <div className="ppb-ornament-line ppb-ornament-line-r" />
        </div>
      </div>
    </div>
  );
}
