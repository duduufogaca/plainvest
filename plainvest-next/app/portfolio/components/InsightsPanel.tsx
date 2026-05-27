type Insight = {
  text: string;
  textPt: string;
  type: 'positive' | 'caution' | 'info';
};

type Props = {
  insights: Insight[];
  lang: string;
};

const ICON = { positive: '✦', caution: '◈', info: '◉' } as const;

export function InsightsPanel({ insights, lang }: Props) {
  const isEN = lang !== 'pt';
  const [primary, ...secondary] = insights;

  return (
    <section className="portfolio-card insights-card">
      <p className="eyebrow">{isEN ? 'AI Insights' : 'Análise Inteligente'}</p>
      <h2>{isEN ? 'Your Portfolio in Plain English' : 'Seu Portfólio em Linguagem Simples'}</h2>

      <div className="insights-list">
        {/* Primary insight — larger, more prominent */}
        {primary && (
          <div className={`insight-item insight-primary insight-${primary.type}`}>
            <span className="insight-icon">{ICON[primary.type]}</span>
            <p className="insight-text">{isEN ? primary.text : primary.textPt}</p>
          </div>
        )}

        {/* Secondary insights */}
        {secondary.map((ins, i) => (
          <div key={i} className={`insight-item insight-secondary insight-${ins.type}`}>
            <span className="insight-icon">{ICON[ins.type]}</span>
            <p className="insight-text">{isEN ? ins.text : ins.textPt}</p>
          </div>
        ))}
      </div>

      <p className="insights-disclaimer">
        {isEN
          ? 'Generated automatically from your portfolio data. Not financial advice.'
          : 'Gerado automaticamente dos seus dados. Não é consultoria financeira.'}
      </p>
    </section>
  );
}
