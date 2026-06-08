/* i18n for the PRO calculator tools (separate from lib/portfolio-i18n.ts to keep that file lean). */

export type Lang = 'en' | 'pt';
export type ToolId = 'simulator' | 'retirement' | 'dca' | 'etf' | 'inflation' | 'freedom';
export const TOOL_IDS: ToolId[] = ['simulator', 'retirement', 'dca', 'etf', 'inflation', 'freedom'];

type Dict = {
  hub: { eyebrow: string; title: string; sub: string };
  cards: Record<ToolId, { name: string; desc: string }>;
  common: {
    back: string; annualReturn: string; years: string; now: string; disclaimer: string;
    invested: string; projectedLine: string; realLine: string; perYear: string;
  };
  simulator: { sub: string; lStart: string; lMonthly: string; lYears: string; rValue: string; rContribute: string; rGrowth: string };
  retirement: { sub: string; lAge: string; lRetire: string; lSavings: string; lMonthly: string; rValue: string; rIncome: string };
  dca: { sub: string; lMonthly: string; lYears: string; rValue: string; rInvested: string; rGrowth: string };
  etf: { sub: string; lStart: string; lMonthly: string; lYears: string; rValue: string; rGrowth: string };
  inflation: { sub: string; lAmount: string; lYears: string; lRate: string; rValue: string; rLost: string };
  freedom: { sub: string; lExpenses: string; lRate: string; rValue: string; rNote: string };
};

export const TOOLS_T: Record<Lang, Dict> = {
  en: {
    hub: {
      eyebrow: 'Pro tools',
      title: 'Calculators',
      sub: 'Model your money across currencies — every projection updates live.',
    },
    cards: {
      simulator:  { name: 'Investment Simulator', desc: 'See what consistent investing could become.' },
      retirement: { name: 'Retirement', desc: 'Project your savings to retirement age.' },
      dca:        { name: 'DCA', desc: 'Dollar-cost averaging over time.' },
      etf:        { name: 'ETF Growth', desc: 'Project regular investing into a broad ETF.' },
      inflation:  { name: 'Inflation', desc: 'See how prices erode purchasing power.' },
      freedom:    { name: 'Financial Freedom', desc: 'Find your freedom number (4% rule).' },
    },
    common: {
      back: '← All tools',
      annualReturn: 'Average annual return (%)',
      years: 'Years',
      now: 'Now',
      disclaimer: 'Educational estimate. Past performance does not guarantee future results.',
      invested: 'Invested',
      projectedLine: 'Projected',
      realLine: 'Real value',
      perYear: '/yr',
    },
    simulator: { sub: 'Compound growth of a starting amount plus regular contributions.', lStart: 'Starting amount', lMonthly: 'Monthly contribution', lYears: 'Years invested', rValue: 'Projected value', rContribute: 'You contribute', rGrowth: 'growth adds' },
    retirement: { sub: 'Project current savings and contributions to retirement age.', lAge: 'Current age', lRetire: 'Retirement age', lSavings: 'Current savings', lMonthly: 'Monthly contribution', rValue: 'Projected at retirement', rIncome: 'Could provide ~{x}/yr at a 4% withdrawal rate.' },
    dca: { sub: 'Invest a fixed amount on a regular schedule — no market timing.', lMonthly: 'Amount invested each month', lYears: 'Years investing', rValue: 'Projected value', rInvested: 'You invest', rGrowth: 'growth adds' },
    etf: { sub: 'Regular investing into a broad, diversified ETF.', lStart: 'Starting investment', lMonthly: 'Monthly investment', lYears: 'Years invested', rValue: 'Projected ETF value', rGrowth: 'growth adds' },
    inflation: { sub: 'How much real buying power an amount keeps over time.', lAmount: 'Amount today', lYears: 'Years from now', lRate: 'Average annual inflation (%)', rValue: 'Real value in the future', rLost: '~{x}% less buying power than today.' },
    freedom: { sub: 'The amount invested whose returns can cover your life (4% rule).', lExpenses: 'Annual living expenses', lRate: 'Safe withdrawal rate (%)', rValue: 'You need invested', rNote: 'About {x}× your yearly spending.' },
  },
  pt: {
    hub: {
      eyebrow: 'Ferramentas Pro',
      title: 'Calculadoras',
      sub: 'Simule seu dinheiro em várias moedas — cada projeção atualiza ao vivo.',
    },
    cards: {
      simulator:  { name: 'Simulador de Investimentos', desc: 'Veja no que investir com consistência pode se tornar.' },
      retirement: { name: 'Aposentadoria', desc: 'Projete suas economias até a aposentadoria.' },
      dca:        { name: 'DCA', desc: 'Custo médio (DCA) ao longo do tempo.' },
      etf:        { name: 'Crescimento de ETF', desc: 'Projete investir regularmente em um ETF amplo.' },
      inflation:  { name: 'Inflação', desc: 'Veja como os preços corroem o poder de compra.' },
      freedom:    { name: 'Liberdade Financeira', desc: 'Descubra o seu número da liberdade (regra dos 4%).' },
    },
    common: {
      back: '← Todas as ferramentas',
      annualReturn: 'Retorno médio anual (%)',
      years: 'Anos',
      now: 'Hoje',
      disclaimer: 'Estimativa educacional. Retornos passados não garantem resultados futuros.',
      invested: 'Investido',
      projectedLine: 'Projetado',
      realLine: 'Valor real',
      perYear: '/ano',
    },
    simulator: { sub: 'Crescimento composto de um valor inicial mais aportes regulares.', lStart: 'Valor inicial', lMonthly: 'Aporte mensal', lYears: 'Anos investindo', rValue: 'Valor projetado', rContribute: 'Você aporta', rGrowth: 'o crescimento adiciona' },
    retirement: { sub: 'Projete economias atuais e aportes até a idade de aposentadoria.', lAge: 'Idade atual', lRetire: 'Idade de aposentadoria', lSavings: 'Economias atuais', lMonthly: 'Aporte mensal', rValue: 'Projetado na aposentadoria', rIncome: 'Poderia gerar ~{x}/ano a uma taxa de retirada de 4%.' },
    dca: { sub: 'Invista um valor fixo de forma regular — sem acertar o mercado.', lMonthly: 'Valor investido por mês', lYears: 'Anos investindo', rValue: 'Valor projetado', rInvested: 'Você investe', rGrowth: 'o crescimento adiciona' },
    etf: { sub: 'Investir regularmente em um ETF amplo e diversificado.', lStart: 'Investimento inicial', lMonthly: 'Investimento mensal', lYears: 'Anos investindo', rValue: 'Valor projetado do ETF', rGrowth: 'o crescimento adiciona' },
    inflation: { sub: 'Quanto poder de compra real um valor mantém ao longo do tempo.', lAmount: 'Valor hoje', lYears: 'Daqui a quantos anos', lRate: 'Inflação média anual (%)', rValue: 'Valor real no futuro', rLost: '~{x}% menos poder de compra do que hoje.' },
    freedom: { sub: 'O valor investido cujos rendimentos cobrem sua vida (regra dos 4%).', lExpenses: 'Gastos anuais de vida', lRate: 'Taxa de retirada segura (%)', rValue: 'Você precisa ter investido', rNote: 'Cerca de {x}× seus gastos anuais.' },
  },
};
