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
      {/* Animated graph background */}
      <div className="ppb-bg-anim" aria-hidden="true">
        <svg viewBox="0 0 1400 280" fill="none" preserveAspectRatio="xMidYMid slice" className="ppb-bg-svg">
          <defs>
            <linearGradient id="ppb-grad-t" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#61d5b4" stopOpacity="0"/>
              <stop offset="45%" stopColor="#61d5b4" stopOpacity="1"/>
              <stop offset="100%" stopColor="#61d5b4" stopOpacity="0.2"/>
            </linearGradient>
            <linearGradient id="ppb-grad-g" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f4c86a" stopOpacity="0"/>
              <stop offset="55%" stopColor="#f4c86a" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#f4c86a" stopOpacity="0"/>
            </linearGradient>
            <radialGradient id="ppb-glow-t" cx="86%" cy="22%" r="30%">
              <stop offset="0%" stopColor="#61d5b4" stopOpacity="0.14"/>
              <stop offset="100%" stopColor="#61d5b4" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="ppb-glow-g" cx="14%" cy="78%" r="25%">
              <stop offset="0%" stopColor="#f4c86a" stopOpacity="0.09"/>
              <stop offset="100%" stopColor="#f4c86a" stopOpacity="0"/>
            </radialGradient>
          </defs>
          {/* Ambient glow fills */}
          <rect width="1400" height="280" fill="url(#ppb-glow-t)"/>
          <rect width="1400" height="280" fill="url(#ppb-glow-g)"/>
          {/* Growth curves */}
          <path className="ppb-c1"
            d="M0 248 C180 225 380 198 600 165 C820 132 1020 98 1220 65 C1310 50 1360 43 1400 38"
            stroke="url(#ppb-grad-t)" strokeWidth="1.5"/>
          <path className="ppb-c2"
            d="M0 262 C220 248 450 232 680 210 C910 188 1100 162 1280 132 C1360 118 1390 112 1400 108"
            stroke="url(#ppb-grad-t)" strokeWidth="0.9"/>
          <path className="ppb-c3"
            d="M0 274 C160 268 340 260 560 250 C780 240 980 224 1180 202 C1290 190 1360 184 1400 180"
            stroke="url(#ppb-grad-g)" strokeWidth="0.7"/>
          {/* Endpoint glow */}
          <circle cx="1220" cy="65" r="4" fill="#61d5b4" opacity="0.6"/>
          <circle cx="1220" cy="65" r="12" fill="#61d5b4" opacity="0.1"/>
          <circle cx="1220" cy="65" r="22" fill="#61d5b4" opacity="0.05"/>
          {/* Star particles */}
          <circle cx="320" cy="180" r="1" fill="white" opacity="0.25"/>
          <circle cx="580" cy="130" r="1.2" fill="white" opacity="0.3"/>
          <circle cx="820" cy="95" r="0.8" fill="white" opacity="0.22"/>
          <circle cx="1060" cy="72" r="1" fill="white" opacity="0.28"/>
          <circle cx="440" cy="210" r="0.8" fill="white" opacity="0.2"/>
          <circle cx="970" cy="148" r="1.1" fill="white" opacity="0.24"/>
        </svg>
      </div>

      {/* Centered content */}
      <div className="ppb-center">
        <span className="ppb-kicker">
          <span className="ppb-kicker-dot" aria-hidden="true" />
          {isEN ? 'Your Financial Future' : 'Seu Futuro Financeiro'}
        </span>

        <h1 className="ppb-headline">
          <span className="ppb-hl-plain">{isEN ? 'Your future is' : 'Seu futuro é'}</span>
          <em className="ppb-hl-gold">{isEN ? 'built today.' : 'construído hoje.'}</em>
        </h1>

        <p className="ppb-sub">
          {isEN
            ? <>We help you invest with <strong>clarity and confidence.</strong></>
            : <>Te ajudamos a investir com <strong>clareza e confiança.</strong></>}
        </p>

        {/* Emotional micro-metric */}
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

        {/* Trust signals */}
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
