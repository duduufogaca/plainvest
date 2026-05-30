export type GuideDifficulty = 'Beginner' | 'Intermediate';

export interface GuideMeta {
  title: string;
  file: string;
  description: string;
  readMins: number;
  difficulty: GuideDifficulty;
  why: string;
}

export const GUIDE_META: Record<string, GuideMeta> = {
  guides: {
    title: 'Investment Paths Guide',
    file: '/files/premium_content/01-investment-paths-guide.html',
    description: 'Understand which investment path fits your goals.',
    readMins: 15,
    difficulty: 'Beginner',
    why: 'Build your investing foundation before exploring stocks, ETFs and Bitcoin.',
  },
  dca: {
    title: 'DCA Method Guide',
    file: '/files/premium_content/02-dca-method-guide.html',
    description: 'Build a consistent investing habit with dollar-cost averaging.',
    readMins: 12,
    difficulty: 'Beginner',
    why: 'This single habit is responsible for most beginner investing success stories.',
  },
  firsttrade: {
    title: 'Your First Trade Walkthrough',
    file: '/files/premium_content/15-first-trade-walkthrough.html',
    description: 'Step-by-step: place your very first trade with confidence.',
    readMins: 10,
    difficulty: 'Beginner',
    why: 'Remove the anxiety of your first trade with a clear, step-by-step walkthrough.',
  },
  exchange: {
    title: 'Exchange & Platform Setup',
    file: '/files/premium_content/03-exchange-and-platform-setup-checklist.html',
    description: 'Choose and set up the right platform for your situation.',
    readMins: 8,
    difficulty: 'Beginner',
    why: 'Choosing the right platform from the start prevents costly, avoidable mistakes.',
  },
  inflation: {
    title: 'Inflation & Purchasing Power',
    file: '/files/premium_content/16-inflation-and-purchasing-power.html',
    description: 'Understand why your money loses value over time — and how to fight it.',
    readMins: 10,
    difficulty: 'Beginner',
    why: 'Understanding inflation changes how you think about every financial decision.',
  },
  sentiment: {
    title: 'Market Sentiment: Fear & Greed',
    file: '/files/premium_content/17-market-sentiment-fear-and-greed.html',
    description: 'Read the emotional cycle of markets before it reads you.',
    readMins: 9,
    difficulty: 'Intermediate',
    why: 'Market psychology drives most short-term price movements — learn to see it.',
  },
  panicsell: {
    title: "Don't Panic Sell",
    file: '/files/premium_content/18-dont-panic-sell.html',
    description: 'Stay the course when markets drop. This guide saves portfolios.',
    readMins: 7,
    difficulty: 'Beginner',
    why: 'The investors who stay calm in downturns are the ones who build real wealth.',
  },
  bitcoin: {
    title: 'Bitcoin Research Section',
    file: '/files/premium_content/05-bitcoin-research-section.html',
    description: 'A deep, honest look at Bitcoin as an asset class.',
    readMins: 20,
    difficulty: 'Intermediate',
    why: 'Understand Bitcoin objectively before deciding if it fits your portfolio.',
  },
  crypto: {
    title: 'Crypto & Self-Custody Guide',
    file: '/files/premium_content/04-crypto-and-self-custody-guide.html',
    description: 'Own your crypto safely without relying on an exchange.',
    readMins: 15,
    difficulty: 'Intermediate',
    why: 'Not your keys, not your coins — learn self-custody before you need it.',
  },
  tools: {
    title: 'Chart Reading & Research Tools',
    file: '/files/premium_content/07-chart-reading-and-research-tools.html',
    description: 'Read price charts and find credible research sources.',
    readMins: 15,
    difficulty: 'Intermediate',
    why: 'The ability to read a chart separates informed investors from guessers.',
  },
  cycles: {
    title: 'Crypto Cycle Lessons',
    file: '/files/premium_content/08-crypto-cycle-lessons.html',
    description: 'How market cycles work — and how to stop being the victim of them.',
    readMins: 12,
    difficulty: 'Intermediate',
    why: 'Most losses happen because investors don\'t recognise where they are in the cycle.',
  },
  books: {
    title: 'Books & Reading Path',
    file: '/files/premium_content/06-books-and-reading-path.html',
    description: 'The curated reading list that builds genuine financial knowledge.',
    readMins: 8,
    difficulty: 'Beginner',
    why: 'These books have shaped the thinking of the world\'s most successful investors.',
  },
  tax: {
    title: 'Australian Tax & CGT Basics',
    file: '/files/premium_content/11-australian-tax-cgt-basics.html',
    description: 'Understand CGT and how your investments are taxed in Australia.',
    readMins: 10,
    difficulty: 'Intermediate',
    why: 'Tax strategy is how investors legally keep more of what they earn.',
  },
  super: {
    title: 'Superannuation Basics',
    file: '/files/premium_content/12-superannuation-basics.html',
    description: 'Make the most of your super as part of your long-term plan.',
    readMins: 10,
    difficulty: 'Intermediate',
    why: 'Super is Australia\'s most powerful wealth-building vehicle — learn to use it.',
  },
  platforms: {
    title: 'Platform Comparison: AU, US & BR',
    file: '/files/premium_content/13-australian-platform-comparison.html',
    description: 'Which platforms are worth using — and which to avoid.',
    readMins: 8,
    difficulty: 'Intermediate',
    why: 'Platform fees and features quietly determine your long-term net returns.',
  },
  zoom: {
    title: 'Zoom Call Preparation',
    file: '/files/premium_content/09-zoom-call-preparation.html',
    description: 'Make the most of your included support call.',
    readMins: 6,
    difficulty: 'Beginner',
    why: 'A prepared support call is 10x more valuable than an unprepared one.',
  },
  references: {
    title: 'Research & Tools Library',
    file: '/files/premium_content/10-research-sources.html',
    description: 'The full library of trusted sources and analysis tools.',
    readMins: 10,
    difficulty: 'Intermediate',
    why: 'Know where to look for reliable information when markets move.',
  },
  glossary: {
    title: 'Glossary of Investing Terms',
    file: '/files/premium_content/14-glossary-60-key-terms.html',
    description: '60 key terms explained in plain English.',
    readMins: 15,
    difficulty: 'Beginner',
    why: 'Fluency in investing language makes every other guide easier to understand.',
  },
};

export const GUIDE_ORDER = [
  'guides', 'dca', 'firsttrade', 'exchange', 'inflation', 'sentiment', 'panicsell',
  'bitcoin', 'crypto', 'tools', 'cycles', 'books', 'tax', 'super', 'platforms',
  'zoom', 'references', 'glossary',
];

export const TOTAL_GUIDES = GUIDE_ORDER.length;

interface GuideI18n {
  title: string;
  description: string;
  why: string;
}

const GUIDE_META_PT: Record<string, GuideI18n> = {
  guides: {
    title: 'Guia de Caminhos de Investimento',
    description: 'Entenda qual caminho de investimento se encaixa nos seus objetivos.',
    why: 'Construa sua base antes de explorar ações, ETFs e Bitcoin.',
  },
  dca: {
    title: 'Guia do Método DCA',
    description: 'Crie um hábito consistente de investimento com o custo médio.',
    why: 'Esse único hábito é responsável pela maioria dos casos de sucesso de investidores iniciantes.',
  },
  firsttrade: {
    title: 'Passo a Passo: Sua Primeira Operação',
    description: 'Passo a passo: realize sua primeira operação com confiança.',
    why: 'Elimine a ansiedade da primeira operação com um guia claro e detalhado.',
  },
  exchange: {
    title: 'Configuração de Corretora e Plataforma',
    description: 'Escolha e configure a plataforma certa para a sua situação.',
    why: 'Escolher a plataforma certa desde o início evita erros caros e desnecessários.',
  },
  inflation: {
    title: 'Inflação e Poder de Compra',
    description: 'Entenda por que seu dinheiro perde valor com o tempo — e como combater isso.',
    why: 'Compreender a inflação muda como você pensa sobre cada decisão financeira.',
  },
  sentiment: {
    title: 'Sentimento de Mercado: Medo e Ganância',
    description: 'Leia o ciclo emocional dos mercados antes que ele leia você.',
    why: 'A psicologia de mercado impulsiona a maioria dos movimentos de preço de curto prazo.',
  },
  panicsell: {
    title: 'Não Venda por Pânico',
    description: 'Mantenha o curso quando os mercados caem. Este guia salva portfólios.',
    why: 'Os investidores que se mantêm calmos em quedas são os que constroem riqueza real.',
  },
  bitcoin: {
    title: 'Seção de Pesquisa sobre Bitcoin',
    description: 'Uma análise profunda e honesta do Bitcoin como classe de ativo.',
    why: 'Entenda o Bitcoin objetivamente antes de decidir se ele se encaixa no seu portfólio.',
  },
  crypto: {
    title: 'Guia de Cripto e Autocustódia',
    description: 'Tenha suas criptos com segurança sem depender de uma corretora.',
    why: 'Sem suas chaves, sem suas moedas — aprenda autocustódia antes de precisar.',
  },
  tools: {
    title: 'Leitura de Gráficos e Ferramentas de Pesquisa',
    description: 'Leia gráficos de preço e encontre fontes de pesquisa confiáveis.',
    why: 'Saber ler um gráfico separa investidores informados de apostadores.',
  },
  cycles: {
    title: 'Lições sobre Ciclos Cripto',
    description: 'Como funcionam os ciclos de mercado — e como parar de ser vítima deles.',
    why: 'A maioria das perdas ocorre porque investidores não reconhecem em que fase do ciclo estão.',
  },
  books: {
    title: 'Livros e Trilha de Leitura',
    description: 'A lista de leitura selecionada que constrói conhecimento financeiro genuíno.',
    why: 'Esses livros moldaram o pensamento dos investidores mais bem-sucedidos do mundo.',
  },
  tax: {
    title: 'Noções de Imposto e CGT na Austrália',
    description: 'Entenda o CGT e como seus investimentos são tributados na Austrália.',
    why: 'A estratégia tributária é como os investidores legalmente retêm mais do que ganham.',
  },
  super: {
    title: 'Noções de Superannuation',
    description: 'Aproveite ao máximo seu super como parte do seu plano de longo prazo.',
    why: 'O Super é o veículo de construção de patrimônio mais poderoso da Austrália.',
  },
  platforms: {
    title: 'Comparação de Plataformas: AU, EUA e BR',
    description: 'Quais plataformas valem a pena usar — e quais evitar.',
    why: 'As taxas e recursos da plataforma determinam silenciosamente seus retornos líquidos de longo prazo.',
  },
  zoom: {
    title: 'Preparação para a Sessão de Suporte',
    description: 'Aproveite ao máximo sua sessão de suporte incluída.',
    why: 'Uma sessão preparada é 10x mais valiosa do que uma sem preparação.',
  },
  references: {
    title: 'Biblioteca de Pesquisa e Ferramentas',
    description: 'A biblioteca completa de fontes confiáveis e ferramentas de análise.',
    why: 'Saiba onde buscar informação confiável quando os mercados se movem.',
  },
  glossary: {
    title: 'Glossário de Termos de Investimento',
    description: '60 termos essenciais explicados em linguagem simples.',
    why: 'Dominar o vocabulário de investimentos facilita a compreensão de todos os outros guias.',
  },
};

export function getGuideI18n(key: string, lang: 'en' | 'pt'): GuideI18n {
  if (lang === 'pt' && GUIDE_META_PT[key]) return GUIDE_META_PT[key];
  const g = GUIDE_META[key];
  return { title: g?.title ?? key, description: g?.description ?? '', why: g?.why ?? '' };
}
