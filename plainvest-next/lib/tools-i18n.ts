/* i18n for the PRO calculator tools (separate from lib/portfolio-i18n.ts to keep that file lean). */

export type Lang = 'en' | 'pt';
export type ToolId = 'simulator' | 'retirement' | 'dca' | 'etf' | 'inflation' | 'freedom';
export const TOOL_IDS: ToolId[] = ['simulator', 'retirement', 'dca', 'etf', 'inflation', 'freedom'];

export type CatId = 'wealth' | 'retirement' | 'risk';
export const CATEGORIES: { id: CatId; tools: ToolId[] }[] = [
  { id: 'wealth', tools: ['simulator', 'etf', 'dca'] },
  { id: 'retirement', tools: ['retirement', 'freedom'] },
  { id: 'risk', tools: ['inflation'] },
];

type Card = { name: string; desc: string };
type ToolStrings = Record<string, string>;
type Dict = {
  hub: { eyebrow: string; title: string; sub: string; open: string };
  cat: Record<CatId, string>;
  cards: Record<ToolId, Card>;
  common: {
    back: string; settings: string; annualReturn: string; years: string; now: string;
    disclaimer: string; invested: string; growth: string; projectedLine: string; realLine: string;
    contributions: string; growthShare: string;
  };
  tool: Record<ToolId, ToolStrings>;
};

export const TOOLS_T: Record<Lang, Dict> = {
  en: {
    hub: { eyebrow: 'Pro tools', title: 'Calculators', sub: 'Model your money across currencies — every projection updates live.', open: 'Open tool →' },
    cat: { wealth: 'Wealth building', retirement: 'Retirement planning', risk: 'Risk & purchasing power' },
    cards: {
      simulator:  { name: 'Investment Simulator', desc: 'Compound growth of a starting amount plus regular contributions.' },
      retirement: { name: 'Retirement', desc: 'Project current savings and contributions to retirement age.' },
      dca:        { name: 'DCA', desc: 'Invest a fixed amount on a regular schedule — no market timing.' },
      etf:        { name: 'ETF Growth', desc: 'Regular investing into a broad, diversified ETF.' },
      inflation:  { name: 'Inflation', desc: 'How much real buying power an amount keeps over time.' },
      freedom:    { name: 'Financial Freedom', desc: 'The amount invested whose returns can cover your life.' },
    },
    common: {
      back: '← All tools', settings: 'Settings', annualReturn: 'Average annual return (%)', years: 'Years', now: 'Now',
      disclaimer: 'Educational estimate. Past performance does not guarantee future results.',
      invested: 'You invested', growth: 'Investment growth', projectedLine: 'Projected', realLine: 'Real value',
      contributions: 'Contributions', growthShare: 'Growth',
    },
    tool: {
      simulator: {
        sub: 'Model how regular investing can grow over time.',
        lStart: 'Starting amount', lMonthly: 'Monthly contribution', lYears: 'Years invested',
        rTitle: 'Projected portfolio value', preview: 'See how consistent investing could become {v} over {y} years.',
      },
      retirement: {
        sub: 'See where your savings and contributions could land by retirement.',
        lAge: 'Current age', lRetire: 'Retirement age', lSavings: 'Current savings', lMonthly: 'Monthly contribution',
        rTitle: 'Projected retirement portfolio', income: 'Potential income', perWeek: '≈ {v}/week',
        retireAt: 'Retire at', yearsRemaining: 'Years remaining', balance: 'Projected balance', incomePotential: 'Income potential',
        preview: 'Project ~{v} by retirement.',
      },
      dca: {
        sub: 'See how investing the same amount every month adds up.',
        lMonthly: 'Amount invested each month', lYears: 'Years investing',
        rTitle: 'Total accumulated through DCA', monthly: 'Monthly contribution', totalContributed: 'Total contributed',
        insightTitle: 'Consistency beats timing.', deposits: '{n} monthly deposits, through every market.',
        preview: 'Turn {m}/mo into {v} over {y} years.',
      },
      etf: {
        sub: 'Project regular investing into a broad, diversified ETF.',
        lStart: 'Starting investment', lMonthly: 'Monthly investment', lYears: 'Years invested',
        rTitle: 'Projected ETF value', summaryTitle: 'ETF projection summary',
        initial: 'Initial investment', monthlyInv: 'Monthly investment', totalInvested: 'Total invested', growthGen: 'Growth generated',
        divNote: 'Broad ETFs spread risk across hundreds of companies — diversification with one purchase.',
        preview: 'Project to {v} over {y} years.',
      },
      inflation: {
        sub: 'See how rising prices quietly erode the value of idle cash.',
        lAmount: 'Amount today', lYears: 'Years from now', lRate: 'Average annual inflation (%)',
        rTitle: 'Future buying power', loss: 'Loss of purchasing power', reduction: '≈ {x}% reduction',
        today: 'Today', future: 'In {y} years',
        warnTitle: 'Idle cash loses value', warnBody: 'Inflation silently reduces the value of cash sitting still. Investing aims to outpace it.',
        preview: '{a} today ≈ {v} in {y} years.',
      },
      freedom: {
        sub: 'Find the portfolio that makes work optional (4% rule).',
        lExpenses: 'Annual living expenses', lRate: 'Safe withdrawal rate (%)',
        rTitle: 'Financial freedom target', basedOn: 'Based on {a} annual expenses · {r}% withdrawal rule',
        monthlyLifestyle: 'Monthly lifestyle', yearlyLifestyle: 'Yearly lifestyle', requiredPortfolio: 'Required portfolio',
        progressTitle: 'Freedom progress', progressNote: 'You are building toward full work-optional status.',
        preview: 'Target {v} to cover {a}/yr.',
      },
    },
  },
  pt: {
    hub: { eyebrow: 'Ferramentas Pro', title: 'Calculadoras', sub: 'Simule seu dinheiro em várias moedas — cada projeção atualiza ao vivo.', open: 'Abrir ferramenta →' },
    cat: { wealth: 'Construção de patrimônio', retirement: 'Planejamento de aposentadoria', risk: 'Risco e poder de compra' },
    cards: {
      simulator:  { name: 'Simulador de Investimentos', desc: 'Crescimento composto de um valor inicial mais aportes regulares.' },
      retirement: { name: 'Aposentadoria', desc: 'Projete economias atuais e aportes até a aposentadoria.' },
      dca:        { name: 'DCA', desc: 'Invista um valor fixo de forma regular — sem acertar o mercado.' },
      etf:        { name: 'Crescimento de ETF', desc: 'Investir regularmente em um ETF amplo e diversificado.' },
      inflation:  { name: 'Inflação', desc: 'Quanto poder de compra real um valor mantém ao longo do tempo.' },
      freedom:    { name: 'Liberdade Financeira', desc: 'O valor investido cujos rendimentos cobrem sua vida.' },
    },
    common: {
      back: '← Todas as ferramentas', settings: 'Configurações', annualReturn: 'Retorno médio anual (%)', years: 'Anos', now: 'Hoje',
      disclaimer: 'Estimativa educacional. Retornos passados não garantem resultados futuros.',
      invested: 'Você investiu', growth: 'Crescimento do investimento', projectedLine: 'Projetado', realLine: 'Valor real',
      contributions: 'Aportes', growthShare: 'Crescimento',
    },
    tool: {
      simulator: {
        sub: 'Veja como investir com regularidade pode crescer ao longo do tempo.',
        lStart: 'Valor inicial', lMonthly: 'Aporte mensal', lYears: 'Anos investindo',
        rTitle: 'Valor projetado da carteira', preview: 'Veja como investir com consistência pode chegar a {v} em {y} anos.',
      },
      retirement: {
        sub: 'Veja onde suas economias e aportes podem chegar na aposentadoria.',
        lAge: 'Idade atual', lRetire: 'Idade de aposentadoria', lSavings: 'Economias atuais', lMonthly: 'Aporte mensal',
        rTitle: 'Carteira projetada na aposentadoria', income: 'Renda potencial', perWeek: '≈ {v}/semana',
        retireAt: 'Aposentar aos', yearsRemaining: 'Anos restantes', balance: 'Saldo projetado', incomePotential: 'Renda potencial',
        preview: 'Projete ~{v} na aposentadoria.',
      },
      dca: {
        sub: 'Veja como investir o mesmo valor todo mês se acumula.',
        lMonthly: 'Valor investido por mês', lYears: 'Anos investindo',
        rTitle: 'Total acumulado com DCA', monthly: 'Aporte mensal', totalContributed: 'Total aportado',
        insightTitle: 'Consistência vence o timing.', deposits: '{n} aportes mensais, em todos os mercados.',
        preview: 'Transforme {m}/mês em {v} em {y} anos.',
      },
      etf: {
        sub: 'Projete investir regularmente em um ETF amplo e diversificado.',
        lStart: 'Investimento inicial', lMonthly: 'Investimento mensal', lYears: 'Anos investindo',
        rTitle: 'Valor projetado do ETF', summaryTitle: 'Resumo da projeção do ETF',
        initial: 'Investimento inicial', monthlyInv: 'Investimento mensal', totalInvested: 'Total investido', growthGen: 'Crescimento gerado',
        divNote: 'ETFs amplos distribuem o risco entre centenas de empresas — diversificação em uma única compra.',
        preview: 'Projete até {v} em {y} anos.',
      },
      inflation: {
        sub: 'Veja como a alta de preços corrói silenciosamente o dinheiro parado.',
        lAmount: 'Valor hoje', lYears: 'Daqui a quantos anos', lRate: 'Inflação média anual (%)',
        rTitle: 'Poder de compra futuro', loss: 'Perda de poder de compra', reduction: '≈ {x}% de redução',
        today: 'Hoje', future: 'Em {y} anos',
        warnTitle: 'Dinheiro parado perde valor', warnBody: 'A inflação reduz silenciosamente o valor do dinheiro parado. Investir busca superá-la.',
        preview: '{a} hoje ≈ {v} em {y} anos.',
      },
      freedom: {
        sub: 'Encontre a carteira que torna o trabalho opcional (regra dos 4%).',
        lExpenses: 'Gastos anuais de vida', lRate: 'Taxa de retirada segura (%)',
        rTitle: 'Meta de liberdade financeira', basedOn: 'Baseado em {a} de gastos anuais · regra de retirada de {r}%',
        monthlyLifestyle: 'Estilo de vida mensal', yearlyLifestyle: 'Estilo de vida anual', requiredPortfolio: 'Carteira necessária',
        progressTitle: 'Progresso da liberdade', progressNote: 'Você está construindo rumo ao status de trabalho opcional.',
        preview: 'Meta de {v} para cobrir {a}/ano.',
      },
    },
  },
};
