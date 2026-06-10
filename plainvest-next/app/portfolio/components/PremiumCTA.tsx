type Props = { lang: string };

export function PremiumCTA({ lang }: Props) {
  const isEN = lang !== 'pt';
  return (
    <div className="premium-cta-banner">
      <div className="premium-cta-left">
        <span className="premium-cta-crown" aria-hidden="true">♛</span>
        <div>
          <p className="premium-cta-title">
            {isEN ? 'Unlock the full potential of Plainvest' : 'Desbloqueie todo o potencial do Plainvest'}
          </p>
          <p className="premium-cta-sub">
            {isEN
              ? 'Advanced projections, detailed analytics, AI insights, and premium tools to accelerate your journey.'
              : 'Projeções avançadas, análises detalhadas, insights de IA e ferramentas premium para acelerar sua jornada.'}
          </p>
        </div>
      </div>
      <a href="/dashboard?upgrade=pro" className="premium-cta-btn">
        <span>♛</span>
        {isEN ? 'Upgrade to Pro' : 'Fazer upgrade para Pro'}
      </a>
    </div>
  );
}
