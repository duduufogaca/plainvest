export type Insight = {
  text: string;
  textPt: string;
  type: 'positive' | 'caution' | 'info';
  badge?: string;
  badgePt?: string;
};

type Props = {
  insights: Insight[];
  lang: string;
};

const ICON_SVG = {
  positive: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  caution: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  info: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
} as const;

const DEFAULT_BADGE = {
  positive: { en: 'Positive', pt: 'Positivo' },
  caution:  { en: 'Attention', pt: 'Atenção' },
  info:     { en: 'Mindset', pt: 'Mentalidade' },
} as const;

export function InsightsPanel({ insights, lang }: Props) {
  const isEN = lang !== 'pt';

  return (
    <section className="portfolio-card insights-card-v2">
      <div className="ins-header-row">
        <div>
          <p className="eyebrow">{isEN ? 'AI Insights' : 'Análise Inteligente'}</p>
          <h2>{isEN ? 'Insights that help you grow' : 'Análises que ajudam você a crescer'}</h2>
        </div>
        <a href="#holdings-section" className="ins-view-all-btn">
          {isEN ? 'View all' : 'Ver tudo'} <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="ins-list-v2">
        {insights.map((ins, i) => {
          const badgeLabel = ins.badge ?? DEFAULT_BADGE[ins.type].en;
          const badgeLabelPt = ins.badgePt ?? DEFAULT_BADGE[ins.type].pt;
          return (
            <div key={i} className={`ins-card-v2 ins-card-${ins.type}`}>
              <span className={`ins-icon-wrap ins-icon-${ins.type}`}>
                {ICON_SVG[ins.type]}
              </span>
              <p className="ins-card-text">{isEN ? ins.text : ins.textPt}</p>
              <span className={`ins-badge ins-badge-${ins.type}`}>
                {isEN ? badgeLabel : badgeLabelPt}
              </span>
            </div>
          );
        })}
      </div>

      <p className="ins-disclaimer">
        {isEN
          ? 'Insights are generated automatically and for educational purposes only.'
          : 'Análises geradas automaticamente e apenas para fins educacionais.'}
      </p>
    </section>
  );
}
