type Props = {
  lang: string;
  freedomScore?: number;
};

export function PageBanner({ lang, freedomScore }: Props) {
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
      {/* Subtle atmospheric glow — no lines */}
      <div className="ppb-glow-teal" aria-hidden="true" />
      <div className="ppb-glow-gold" aria-hidden="true" />

      <div className="ppb-center">
        {/* Massive headline — the whole point of this section */}
        <h1 className="ppb-headline">
          <span className="ppb-hl-plain">{isEN ? 'Your future is' : 'Seu futuro é'}</span>
          <em className="ppb-hl-gold">{isEN ? 'built today.' : 'construído hoje.'}</em>
        </h1>

        <p className="ppb-sub">
          {isEN
            ? <>We help you invest with <strong>clarity and confidence.</strong></>
            : <>Te ajudamos a investir com <strong>clareza e confiança.</strong></>}
        </p>

        {freedomScore != null && (
          <div className="ppb-score-pill">
            <span className="ppb-sp-label">Freedom Score™</span>
            <span className="ppb-sp-val" style={{ color: scoreColor }}>{freedomScore}/100</span>
            <span className="ppb-sp-sep" aria-hidden="true">·</span>
            <span className="ppb-sp-status" style={{ color: scoreColor }}>{scoreLabel}</span>
          </div>
        )}

        <a href="#portfolio-overview" className="ppb-cta-btn">
          {isEN ? 'See your future' : 'Ver seu futuro'}
          <span className="ppb-cta-arrow" aria-hidden="true">→</span>
        </a>

        <div className="ppb-trust-strip">
          <span className="ppb-trust-item">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            {isEN ? 'Secure tracking' : 'Rastreamento seguro'}
          </span>
          <span className="ppb-trust-sep" aria-hidden="true">·</span>
          <span className="ppb-trust-item">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            {isEN ? 'Privacy-first' : 'Privacidade em primeiro lugar'}
          </span>
          <span className="ppb-trust-sep" aria-hidden="true">·</span>
          <span className="ppb-trust-item">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            {isEN ? 'Educational only' : 'Apenas educacional'}
          </span>
          <span className="ppb-trust-sep" aria-hidden="true">·</span>
          <span className="ppb-trust-item">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            {isEN ? 'No broker required' : 'Sem corretora'}
          </span>
        </div>
      </div>
    </div>
  );
}
