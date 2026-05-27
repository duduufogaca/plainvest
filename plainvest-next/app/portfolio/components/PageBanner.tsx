type Props = {
  lang: string;
};

export function PageBanner({ lang }: Props) {
  const isEN = lang !== 'pt';

  return (
    <div className="ppb-wrap">
      <div className="ppb-left">
        {/* Kicker badge */}
        <span className="ppb-kicker">
          <span className="ppb-kicker-dot" aria-hidden="true" />
          {isEN ? 'Your Financial Future' : 'Seu Futuro Financeiro'}
        </span>

        {/* Large emotional headline */}
        <h1 className="ppb-headline">
          {isEN ? (
            <>
              <span className="ppb-hl-plain">Your future is</span>
              <em className="ppb-hl-gold">built today.</em>
            </>
          ) : (
            <>
              <span className="ppb-hl-plain">Seu futuro é</span>
              <em className="ppb-hl-gold">construído hoje.</em>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="ppb-sub">
          {isEN ? (
            <>We help you invest with <strong>clarity and confidence.</strong></>
          ) : (
            <>Te ajudamos a investir com <strong>clareza e confiança.</strong></>
          )}
        </p>

        {/* Benefit icons row */}
        <div className="ppb-benefits">
          <div className="ppb-benefit">
            <span className="ppb-ben-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </span>
            <span>{isEN ? 'Long-term financial freedom' : 'Liberdade financeira de longo prazo'}</span>
          </div>
          <div className="ppb-benefit">
            <span className="ppb-ben-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
            </span>
            <span>{isEN ? 'Smarter decisions with data & AI' : 'Decisões mais inteligentes com IA'}</span>
          </div>
          <div className="ppb-benefit">
            <span className="ppb-ben-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
              </svg>
            </span>
            <span>{isEN ? "Inflation won't stop your future" : 'Inflação não vai parar seu futuro'}</span>
          </div>
          <div className="ppb-benefit">
            <span className="ppb-ben-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </span>
            <span>{isEN ? 'Secure today, free tomorrow' : 'Seguro hoje, livre amanhã'}</span>
          </div>
        </div>

        {/* CTA button */}
        <a href="#portfolio-overview" className="ppb-cta-btn">
          {isEN ? 'See your future' : 'Ver seu futuro'}
          <span className="ppb-cta-arrow" aria-hidden="true">→</span>
        </a>
      </div>

      {/* Right side — cinematic landscape visual */}
      <div className="ppb-right" aria-hidden="true">
        <svg viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="ppb-visual-svg">
          <defs>
            <linearGradient id="ppb-vbg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d2240"/>
              <stop offset="100%" stopColor="#071120"/>
            </linearGradient>
            <radialGradient id="ppb-vsun" cx="69%" cy="33%" r="40%">
              <stop offset="0%" stopColor="#e8b84b" stopOpacity="0.7"/>
              <stop offset="30%" stopColor="#f4c86a" stopOpacity="0.22"/>
              <stop offset="70%" stopColor="#e8b84b" stopOpacity="0.05"/>
              <stop offset="100%" stopColor="#e8b84b" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="ppb-vteal" cx="90%" cy="25%" r="32%">
              <stop offset="0%" stopColor="#61d5b4" stopOpacity="0.28"/>
              <stop offset="60%" stopColor="#61d5b4" stopOpacity="0.05"/>
              <stop offset="100%" stopColor="#61d5b4" stopOpacity="0"/>
            </radialGradient>
          </defs>

          <rect width="480" height="300" fill="url(#ppb-vbg)"/>
          <rect width="480" height="300" fill="url(#ppb-vsun)"/>
          <rect width="480" height="300" fill="url(#ppb-vteal)"/>

          {/* Far mountain range */}
          <path d="M0 240 L70 165 L130 188 L200 125 L260 158 L318 108 L375 142 L435 104 L480 118 L480 300 L0 300Z" fill="#0b1d30" opacity="0.95"/>
          {/* Mid mountains */}
          <path d="M0 272 L55 225 L115 242 L168 208 L228 228 L285 202 L348 218 L398 203 L448 212 L480 208 L480 300 L0 300Z" fill="#08182a" opacity="0.98"/>
          {/* Foreground */}
          <path d="M0 300 L0 278 L90 274 L190 270 L310 268 L420 272 L480 270 L480 300Z" fill="#060f1e"/>

          {/* Sun */}
          <circle cx="332" cy="100" r="28" fill="#e8b84b" opacity="0.18"/>
          <circle cx="332" cy="100" r="18" fill="#fdd87e" opacity="0.5"/>
          <circle cx="332" cy="100" r="10" fill="#ffe499" opacity="0.7"/>
          <circle cx="332" cy="100" r="5" fill="white" opacity="0.85"/>

          {/* Growth trajectory line */}
          <path d="M28 282 C100 264 168 242 228 218 C288 194 348 164 408 132 C438 116 458 104 474 90"
                stroke="#61d5b4" strokeWidth="2" strokeOpacity="0.55" strokeLinecap="round"/>

          {/* Endpoint glow */}
          <circle cx="474" cy="90" r="5" fill="#61d5b4" opacity="0.85"/>
          <circle cx="474" cy="90" r="10" fill="#61d5b4" opacity="0.22"/>
          <circle cx="474" cy="90" r="18" fill="#61d5b4" opacity="0.07"/>

          {/* Star particles */}
          <circle cx="118" cy="48" r="1.2" fill="white" opacity="0.55"/>
          <circle cx="178" cy="30" r="1.5" fill="white" opacity="0.45"/>
          <circle cx="245" cy="52" r="0.8" fill="white" opacity="0.4"/>
          <circle cx="388" cy="42" r="1.3" fill="white" opacity="0.5"/>
          <circle cx="148" cy="72" r="0.9" fill="white" opacity="0.35"/>
          <circle cx="415" cy="58" r="1" fill="white" opacity="0.42"/>
          <circle cx="78" cy="38" r="1" fill="white" opacity="0.45"/>
          <circle cx="298" cy="36" r="0.7" fill="white" opacity="0.35"/>
          <circle cx="52" cy="58" r="0.8" fill="white" opacity="0.3"/>
        </svg>
      </div>
    </div>
  );
}
