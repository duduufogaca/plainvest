'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

type Props = { lang?: string };

type Section = { title: string; body: string; tip?: string };

const SECTIONS_EN: Section[] = [
  {
    title: 'KPI Cards — Invested, Value & P&L',
    body: 'The three cards at the top are your portfolio\'s vital signs. "Total Invested" is the sum of every purchase you made, converted to your display currency at today\'s exchange rate — it is your cost basis, not what the market says it is worth. "Current Value" is the live market price of each asset multiplied by your quantity. If a price cannot be fetched automatically, that asset is excluded from this number until you enter a price manually. "P&L" (Profit & Loss) is simply Current Value minus Total Invested. A positive P&L means your portfolio is worth more than you paid; negative means it is worth less.',
    tip: 'P&L only counts assets where a current price is available. If some assets show "—", their gains/losses are not yet included.',
  },
  {
    title: 'Portfolio Evolution Chart',
    body: 'This line chart shows how much capital you have deployed over time, month by month. Each point represents the cumulative total of all purchases up to that month. It is intentionally a cost-basis chart — it shows your investment discipline, not market performance. A steadily rising line means you are consistently adding money. A flat line means no new money came in during that period.',
    tip: 'If you enter a buy date for each trade, the chart becomes more accurate. Without a date, the chart uses the date you added the entry to Plainvest.',
  },
  {
    title: 'Asset Allocation & Donut Chart',
    body: 'The donut chart shows each asset as a percentage of your total invested capital. This is based on cost (what you paid), not current value. It answers: "Where did I put my money?" Large slices indicate concentrated positions. Diversification across many small slices reduces single-asset risk. The legend on the right shows tickers, percentages, and individual P&L for each position.',
    tip: 'Heavy concentration in one asset (e.g. >50% in a single stock) is a risk to monitor. Consider rebalancing if one position dominates your portfolio.',
  },
  {
    title: 'Performance: Best & Worst Performer',
    body: 'These cards identify your highest and lowest returning assets by percentage gain/loss from your average buy price to the current live price. A stock you bought multiple times at different prices is averaged together — the "avg buy price" is the weighted average across all your purchases. The absolute gain/loss (in your display currency) is shown below the percentage.',
    tip: 'A high percentage winner on a small position has little impact on your overall portfolio. Always read performance together with allocation size.',
  },
  {
    title: 'CAGR — Compound Annual Growth Rate',
    body: 'CAGR is the single most useful number for comparing investment performance. It asks: "If my portfolio grew at a constant rate every year, what would that rate be?" A portfolio that doubled in 5 years has a CAGR of 14.9%. CAGR eliminates the distortion of short-term volatility and lets you compare your returns against benchmarks like the S&P 500 (~10% historical CAGR) or Australian ASX 200 (~9.5%).',
    tip: 'CAGR needs at least several months of history to be meaningful. A new portfolio with a sharp early gain will show a very high CAGR that is unlikely to sustain.',
  },
  {
    title: 'Future Projection — How to Read the Chart',
    body: 'The projection chart uses the compound interest formula applied to your current portfolio value and average monthly contribution. The green curve (nominal) shows the raw dollar growth. When you enable "Inflation-adjusted", a second purple dashed curve appears showing what those future dollars are worth in today\'s purchasing power. The yellow dashed horizontal lines mark each milestone target. The key insight: compound growth is slow at first and explosive later — this is why starting early matters far more than starting with more money.',
    tip: 'The projection is illustrative. Real returns fluctuate yearly. Use it to compare scenarios ("what if I invest $500/month vs $1,000/month?") rather than treat it as a prediction.',
  },
  {
    title: 'Projection Sliders — Annual Return & Inflation',
    body: 'The "Annual return" slider (default 7%) represents your expected average yearly growth rate. For reference: global stock market index funds have historically returned 7–10% annually before inflation. The "Inflation" slider (default 3%) is used only when the inflation-adjusted view is on — it subtracts inflation from your nominal rate to show real purchasing power. The real rate formula is simply: Real Rate = Nominal Rate − Inflation. A 7% nominal return with 3% inflation gives a 4% real return.',
    tip: 'Conservative investors often use 5–6% for projections. Aggressive investors use 9–10%. Using 7% for stocks and 4–5% for mixed portfolios is a common planning baseline.',
  },
  {
    title: 'Milestones — Time to Reach Financial Goals',
    body: 'Each milestone shows how long it will take to reach a wealth target (e.g. $100K, $500K, $1M) given your current portfolio value and average monthly contribution, compounding at the selected annual return rate. The progress bar shows where you currently stand as a percentage of each target. "✓ Reached" means you are already there. "> 30 years" means the target is not achievable in 30 years at the current contribution rate — increasing monthly contributions or the return rate will bring it forward.',
    tip: 'The monthly contribution used in projections is automatically calculated as your average monthly investment. If you have only one month of data, it defaults to $0 to avoid inflating the estimate. You can update this by adding more historical transactions.',
  },
  {
    title: 'Live Prices & How They Work',
    body: 'Prices are fetched automatically from Yahoo Finance every time you load the page, then cached for 5 minutes to avoid slow loads. Australian stocks use the ".AX" suffix (e.g. VAS.AX), Brazilian stocks use ".SA", US stocks and ETFs use the bare ticker. Crypto is fetched as a USD pair (e.g. BTC-USD) and converted to your display currency. A green "Live" badge confirms the price is current. A grey "Manual" badge means you entered the price yourself and it will stay fixed until you update it.',
    tip: 'If a price is not loading, it usually means the ticker is not in Yahoo Finance under the standard format. Try checking the exact ticker symbol on finance.yahoo.com.',
  },
];

const SECTIONS_PT: Section[] = [
  {
    title: 'Cartões KPI — Investido, Valor e L&P',
    body: 'Os três cartões no topo são os sinais vitais do seu portfólio. "Total Investido" é a soma de todas as suas compras, convertida para a sua moeda de exibição — é a sua base de custo, não o que o mercado diz valer. "Valor Atual" é o preço de mercado ao vivo de cada ativo multiplicado pela sua quantidade. Se um preço não puder ser obtido automaticamente, esse ativo é excluído até você inserir o preço manualmente. "L&P" (Lucro e Perda) é simplesmente o Valor Atual menos o Total Investido.',
    tip: 'O L&P conta apenas ativos com preço atual disponível. Se alguns mostram "—", seus ganhos/perdas ainda não estão incluídos.',
  },
  {
    title: 'Gráfico de Evolução do Portfólio',
    body: 'Este gráfico de linha mostra quanto capital você alocou ao longo do tempo, mês a mês. Cada ponto representa o total acumulado de todas as compras até aquele mês. É intencionalmente um gráfico de base de custo — mostra sua disciplina de investimento, não o desempenho do mercado. Uma linha crescendo constantemente significa que você está adicionando dinheiro regularmente. Uma linha plana significa que não entrou dinheiro novo naquele período.',
    tip: 'Se você inserir uma data de compra para cada transação, o gráfico fica mais preciso. Sem uma data, o gráfico usa a data em que você adicionou o registro na Plainvest.',
  },
  {
    title: 'Alocação de Ativos e Gráfico de Rosca',
    body: 'O gráfico de rosca mostra cada ativo como percentual do capital total investido, baseado no custo (o que você pagou), não no valor atual. Ele responde: "Onde coloquei meu dinheiro?" Fatias grandes indicam posições concentradas. A diversificação em muitas fatias pequenas reduz o risco de um único ativo. A legenda à direita mostra os tickers, percentuais e L&P individual de cada posição.',
    tip: 'Alta concentração em um ativo (ex: >50% em uma única ação) é um risco a monitorar. Considere rebalancear se uma posição dominar o portfólio.',
  },
  {
    title: 'Desempenho: Melhor e Pior Ativo',
    body: 'Esses cartões identificam seus ativos com maior e menor retorno percentual, do preço médio de compra ao preço atual ao vivo. Uma ação comprada várias vezes tem seus preços calculados como média ponderada de todas as compras. O ganho/perda absoluto (na sua moeda) é mostrado abaixo do percentual.',
    tip: 'Um vencedor percentual alto em uma posição pequena tem pouco impacto no portfólio geral. Sempre leia o desempenho junto com o tamanho da alocação.',
  },
  {
    title: 'CAGR — Taxa de Crescimento Anual Composta',
    body: 'O CAGR é o número mais útil para comparar desempenho de investimentos. Ele pergunta: "Se meu portfólio crescesse a uma taxa constante todo ano, qual seria essa taxa?" Um portfólio que dobrou em 5 anos tem CAGR de 14,9%. O CAGR elimina a distorção da volatilidade de curto prazo e permite comparar seus retornos com benchmarks como o S&P 500 (~10% CAGR histórico) ou o Ibovespa (~12% nominalmente, ~6% real).',
    tip: 'O CAGR precisa de pelo menos alguns meses de histórico para ser significativo. Um portfólio novo com ganho inicial forte mostrará CAGR muito alto, improvável de se manter.',
  },
  {
    title: 'Projeção Futura — Como Ler o Gráfico',
    body: 'O gráfico de projeção usa a fórmula de juros compostos aplicada ao valor atual do portfólio e à contribuição mensal média. A curva verde (nominal) mostra o crescimento em reais/dólares. Com o modo "Ajustado à inflação" ativado, uma segunda curva roxa tracejada mostra o que esses valores futuros valem em poder de compra de hoje. As linhas horizontais tracejadas em amarelo marcam cada meta de marco.',
    tip: 'A projeção é ilustrativa. Os retornos reais flutuam anualmente. Use-a para comparar cenários ("e se eu investir R$500/mês vs R$1.000/mês?") em vez de tratá-la como uma previsão.',
  },
  {
    title: 'Sliders — Retorno Anual e Inflação',
    body: 'O slider "Retorno anual" (padrão 7%) representa sua taxa média esperada de crescimento anual. Para referência: fundos de índice globais historicamente retornaram 7–10% ao ano antes da inflação. O slider "Inflação" (padrão 3%) é usado apenas no modo ajustado à inflação — ele subtrai a inflação da taxa nominal para mostrar o poder de compra real. A fórmula: Taxa Real = Taxa Nominal − Inflação.',
    tip: 'Investidores conservadores costumam usar 5–6% nas projeções. Para portfólios mistos (ações + renda fixa), 5–6% é uma base de planejamento comum.',
  },
  {
    title: 'Marcos — Tempo para Atingir Metas',
    body: 'Cada marco mostra quanto tempo levará para atingir uma meta de patrimônio (ex: R$500K, R$1M) dado seu portfólio atual e contribuição mensal média, com juros compostos pela taxa anual selecionada. A barra de progresso mostra onde você está em relação a cada meta. "✓ Alcançado" significa que você já chegou lá. "> 30 anos" significa que a meta não é atingível em 30 anos na taxa atual — aumentar contribuições ou a taxa de retorno vai antecipá-la.',
    tip: 'A contribuição mensal usada nas projeções é calculada automaticamente como sua média mensal de investimento. Com apenas um mês de dados, ela é definida como 0 para evitar estimativas infladas.',
  },
  {
    title: 'Preços ao Vivo — Como Funcionam',
    body: 'Os preços são obtidos automaticamente do Yahoo Finance cada vez que você carrega a página, e armazenados em cache por 5 minutos. Ações australianas usam o sufixo ".AX" (ex: VAS.AX), brasileiras usam ".SA", e ações/ETFs americanos usam o ticker simples. Cripto é obtido como par em USD (ex: BTC-USD) e convertido para sua moeda. O badge verde "Live" confirma que o preço é atual. O badge cinza "Manual" significa que você inseriu o preço manualmente.',
    tip: 'Se um preço não está carregando, geralmente é porque o ticker não está no Yahoo Finance no formato padrão. Verifique o símbolo exato em finance.yahoo.com.',
  },
];

export function HelpModal({ lang = 'en' }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const isEN = lang !== 'pt';
  const sections = isEN ? SECTIONS_EN : SECTIONS_PT;

  const overlay = (
    <div className="help-overlay" onClick={() => setOpen(false)}>
      <div className="help-modal" onClick={e => e.stopPropagation()}>
        <div className="help-modal-header">
          <div>
            <p className="help-modal-eyebrow">{isEN ? 'Dashboard Guide' : 'Guia do Painel'}</p>
            <h2 className="help-modal-title">
              {isEN ? 'Understanding your portfolio' : 'Entenda seu portfólio'}
            </h2>
            <p className="help-modal-subtitle">
              {isEN ? '9 topics · tap any to expand' : '9 tópicos · toque para expandir'}
            </p>
          </div>
          <button className="help-modal-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="help-modal-body">
          {sections.map((s, i) => (
            <div key={i} className={`help-section${expanded === i ? ' help-section-open' : ''}`}>
              <button
                className="help-section-btn"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <div className="help-section-left">
                  <span className="help-section-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="help-section-title">{s.title}</span>
                </div>
                <span className={`help-section-chevron${expanded === i ? ' open' : ''}`}>›</span>
              </button>
              {expanded === i && (
                <div className="help-section-content">
                  <p className="help-section-body">{s.body}</p>
                  {s.tip && (
                    <div className="help-section-tip">
                      <span className="help-tip-icon">💡</span>
                      <p className="help-tip-text">{s.tip}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button className="sidebar-help-btn" onClick={() => setOpen(true)}>
        <span className="sidebar-icon">◎</span>
        {isEN ? 'Guide' : 'Guia'}
      </button>
      {mounted && open && createPortal(overlay, document.body)}
    </>
  );
}
