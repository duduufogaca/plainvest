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
              ? 'Advanced projections, detailed analytics, AI reports, and premium tools to accelerate your journey.'
              : 'Projeções avançadas, análises detalhadas, relatórios de IA e ferramentas premium para acelerar sua jornada.'}
          </p>
        </div>
      </div>
      <a href="#" className="premium-cta-btn">
        <span>♛</span>
        {isEN ? 'Upgrade to Premium' : 'Tornar-se Premium'}
      </a>
    </div>
  );
}
