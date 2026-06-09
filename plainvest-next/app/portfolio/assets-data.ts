export type AssetOption = {
  name: string;
  ticker: string;
  type: 'stock' | 'etf';
  market: 'AU' | 'US' | 'BR';
};

export const STOCK_LIST: AssetOption[] = [
  // ── AU ETFs ──
  { ticker: 'VAS',    name: 'Vanguard Australian Shares ETF',          type: 'etf',   market: 'AU' },
  { ticker: 'VHY',    name: 'Vanguard Australian Shares High Yield ETF', type: 'etf', market: 'AU' },
  { ticker: 'VGS',    name: 'Vanguard MSCI Index International Shares ETF', type: 'etf', market: 'AU' },
  { ticker: 'A200',   name: 'BetaShares Australia 200 ETF',             type: 'etf',   market: 'AU' },
  { ticker: 'IOZ',    name: 'iShares Core S&P/ASX 200 ETF',             type: 'etf',   market: 'AU' },
  { ticker: 'STW',    name: 'SPDR S&P/ASX 200 Fund',                    type: 'etf',   market: 'AU' },
  { ticker: 'NDQ',    name: 'BetaShares NASDAQ 100 ETF',                type: 'etf',   market: 'AU' },
  { ticker: 'QUAL',   name: 'VanEck MSCI International Quality ETF',    type: 'etf',   market: 'AU' },
  { ticker: 'VDHG',   name: 'Vanguard Diversified High Growth ETF',     type: 'etf',   market: 'AU' },
  { ticker: 'DHHF',   name: 'BetaShares Diversified All Growth ETF',    type: 'etf',   market: 'AU' },
  { ticker: 'IVV',    name: 'iShares S&P 500 ETF (ASX)',                type: 'etf',   market: 'AU' },
  { ticker: 'VTS',    name: 'Vanguard US Total Market ETF',             type: 'etf',   market: 'AU' },
  { ticker: 'VEU',    name: 'Vanguard All-World Ex-US Shares ETF',      type: 'etf',   market: 'AU' },
  { ticker: 'VGAD',   name: 'Vanguard MSCI Index Intl Shares (Hedged)', type: 'etf',   market: 'AU' },
  { ticker: 'ETHI',   name: 'BetaShares Global Sustainability Leaders', type: 'etf',   market: 'AU' },
  { ticker: 'ATEC',   name: 'BetaShares S&P/ASX Australian Technology ETF', type: 'etf', market: 'AU' },
  { ticker: 'BGBL',   name: 'BetaShares Global Shares ETF (Hedged)',    type: 'etf',   market: 'AU' },
  { ticker: 'MOAT',   name: 'VanEck Morningstar Wide Moat ETF',         type: 'etf',   market: 'AU' },
  { ticker: 'WDIV',   name: 'SPDR S&P World ex Australia (Hedged)',     type: 'etf',   market: 'AU' },
  // ── AU Stocks ──
  { ticker: 'BHP',    name: 'BHP Group Limited',                        type: 'stock', market: 'AU' },
  { ticker: 'CBA',    name: 'Commonwealth Bank of Australia',           type: 'stock', market: 'AU' },
  { ticker: 'CSL',    name: 'CSL Limited',                              type: 'stock', market: 'AU' },
  { ticker: 'NAB',    name: 'National Australia Bank',                  type: 'stock', market: 'AU' },
  { ticker: 'WBC',    name: 'Westpac Banking Corporation',              type: 'stock', market: 'AU' },
  { ticker: 'ANZ',    name: 'ANZ Group Holdings',                       type: 'stock', market: 'AU' },
  { ticker: 'WES',    name: 'Wesfarmers Limited',                       type: 'stock', market: 'AU' },
  { ticker: 'MQG',    name: 'Macquarie Group',                          type: 'stock', market: 'AU' },
  { ticker: 'RIO',    name: 'Rio Tinto Limited',                        type: 'stock', market: 'AU' },
  { ticker: 'TLS',    name: 'Telstra Group',                            type: 'stock', market: 'AU' },
  { ticker: 'FMG',    name: 'Fortescue Ltd',                            type: 'stock', market: 'AU' },
  { ticker: 'GMG',    name: 'Goodman Group',                            type: 'stock', market: 'AU' },
  { ticker: 'WOW',    name: 'Woolworths Group',                         type: 'stock', market: 'AU' },
  { ticker: 'COL',    name: 'Coles Group',                              type: 'stock', market: 'AU' },
  { ticker: 'REA',    name: 'REA Group',                                type: 'stock', market: 'AU' },
  { ticker: 'XRO',    name: 'Xero Limited',                             type: 'stock', market: 'AU' },
  { ticker: 'QBE',    name: 'QBE Insurance Group',                      type: 'stock', market: 'AU' },
  { ticker: 'SHL',    name: 'Sonic Healthcare',                         type: 'stock', market: 'AU' },
  { ticker: 'AGL',    name: 'AGL Energy',                               type: 'stock', market: 'AU' },
  { ticker: 'ORG',    name: 'Origin Energy',                            type: 'stock', market: 'AU' },
  { ticker: 'S32',    name: 'South32 Limited',                          type: 'stock', market: 'AU' },
  { ticker: 'NCM',    name: 'Newcrest Mining',                          type: 'stock', market: 'AU' },
  { ticker: 'EVN',    name: 'Evolution Mining',                         type: 'stock', market: 'AU' },
  { ticker: 'NST',    name: 'Northern Star Resources',                  type: 'stock', market: 'AU' },
  { ticker: 'BXB',    name: 'Brambles Limited',                         type: 'stock', market: 'AU' },
  { ticker: 'TCL',    name: 'Transurban Group',                         type: 'stock', market: 'AU' },
  { ticker: 'WTC',    name: 'WiseTech Global',                          type: 'stock', market: 'AU' },
  { ticker: 'ALL',    name: 'Aristocrat Leisure',                       type: 'stock', market: 'AU' },
  { ticker: 'COH',    name: 'Cochlear Limited',                         type: 'stock', market: 'AU' },
  { ticker: 'JHX',    name: 'James Hardie Industries',                  type: 'stock', market: 'AU' },
  { ticker: 'QAN',    name: 'Qantas Airways',                           type: 'stock', market: 'AU' },
  { ticker: 'SUN',    name: 'Suncorp Group',                            type: 'stock', market: 'AU' },
  // ── US ETFs ──
  { ticker: 'SPY',    name: 'SPDR S&P 500 ETF Trust',                   type: 'etf',   market: 'US' },
  { ticker: 'QQQ',    name: 'Invesco QQQ Trust (NASDAQ 100)',            type: 'etf',   market: 'US' },
  { ticker: 'VTI',    name: 'Vanguard Total Stock Market ETF',          type: 'etf',   market: 'US' },
  { ticker: 'VOO',    name: 'Vanguard S&P 500 ETF',                     type: 'etf',   market: 'US' },
  { ticker: 'IWM',    name: 'iShares Russell 2000 ETF',                 type: 'etf',   market: 'US' },
  { ticker: 'EFA',    name: 'iShares MSCI EAFE ETF',                    type: 'etf',   market: 'US' },
  { ticker: 'AGG',    name: 'iShares Core US Aggregate Bond ETF',       type: 'etf',   market: 'US' },
  { ticker: 'BND',    name: 'Vanguard Total Bond Market ETF',           type: 'etf',   market: 'US' },
  { ticker: 'GLD',    name: 'SPDR Gold Shares',                         type: 'etf',   market: 'US' },
  { ticker: 'TLT',    name: 'iShares 20+ Year Treasury Bond ETF',       type: 'etf',   market: 'US' },
  { ticker: 'XLF',    name: 'Financial Select Sector SPDR Fund',        type: 'etf',   market: 'US' },
  { ticker: 'XLK',    name: 'Technology Select Sector SPDR Fund',       type: 'etf',   market: 'US' },
  { ticker: 'XLE',    name: 'Energy Select Sector SPDR Fund',           type: 'etf',   market: 'US' },
  { ticker: 'ARKK',   name: 'ARK Innovation ETF',                       type: 'etf',   market: 'US' },
  { ticker: 'VGT',    name: 'Vanguard Information Technology ETF',      type: 'etf',   market: 'US' },
  { ticker: 'SOXX',   name: 'iShares Semiconductor ETF',                type: 'etf',   market: 'US' },
  { ticker: 'VYM',    name: 'Vanguard High Dividend Yield ETF',         type: 'etf',   market: 'US' },
  { ticker: 'SCHD',   name: 'Schwab US Dividend Equity ETF',            type: 'etf',   market: 'US' },
  { ticker: 'JEPI',   name: 'JPMorgan Equity Premium Income ETF',       type: 'etf',   market: 'US' },
  { ticker: 'QQQM',   name: 'Invesco NASDAQ 100 ETF',                   type: 'etf',   market: 'US' },
  { ticker: 'DIA',    name: 'SPDR Dow Jones Industrial Average ETF',    type: 'etf',   market: 'US' },
  { ticker: 'VXUS',   name: 'Vanguard Total International Stock ETF',   type: 'etf',   market: 'US' },
  { ticker: 'SLV',    name: 'iShares Silver Trust',                     type: 'etf',   market: 'US' },
  { ticker: 'IAU',    name: 'iShares Gold Trust',                       type: 'etf',   market: 'US' },
  { ticker: 'TFLO',   name: 'iShares Treasury Floating Rate Bond ETF',  type: 'etf',   market: 'US' },
  { ticker: 'SGOV',   name: 'iShares 0-3 Month Treasury Bond ETF',      type: 'etf',   market: 'US' },
  { ticker: 'BIL',    name: 'SPDR Bloomberg 1-3 Month T-Bill ETF',      type: 'etf',   market: 'US' },
  { ticker: 'IEF',    name: 'iShares 7-10 Year Treasury Bond ETF',      type: 'etf',   market: 'US' },
  { ticker: 'SHY',    name: 'iShares 1-3 Year Treasury Bond ETF',       type: 'etf',   market: 'US' },
  { ticker: 'TIP',    name: 'iShares TIPS Bond ETF',                    type: 'etf',   market: 'US' },
  { ticker: 'VEA',    name: 'Vanguard FTSE Developed Markets ETF',      type: 'etf',   market: 'US' },
  { ticker: 'VWO',    name: 'Vanguard FTSE Emerging Markets ETF',       type: 'etf',   market: 'US' },
  { ticker: 'VNQ',    name: 'Vanguard Real Estate ETF',                 type: 'etf',   market: 'US' },
  { ticker: 'SMH',    name: 'VanEck Semiconductor ETF',                 type: 'etf',   market: 'US' },
  // ── US Stocks ──
  { ticker: 'AAPL',   name: 'Apple Inc.',                               type: 'stock', market: 'US' },
  { ticker: 'MSFT',   name: 'Microsoft Corporation',                    type: 'stock', market: 'US' },
  { ticker: 'GOOGL',  name: 'Alphabet Inc. (Class A)',                  type: 'stock', market: 'US' },
  { ticker: 'AMZN',   name: 'Amazon.com Inc.',                          type: 'stock', market: 'US' },
  { ticker: 'NVDA',   name: 'NVIDIA Corporation',                       type: 'stock', market: 'US' },
  { ticker: 'TSLA',   name: 'Tesla Inc.',                               type: 'stock', market: 'US' },
  { ticker: 'META',   name: 'Meta Platforms Inc.',                      type: 'stock', market: 'US' },
  { ticker: 'BRK-B',  name: 'Berkshire Hathaway Inc. (Class B)',        type: 'stock', market: 'US' },
  { ticker: 'JPM',    name: 'JPMorgan Chase & Co.',                     type: 'stock', market: 'US' },
  { ticker: 'JNJ',    name: 'Johnson & Johnson',                        type: 'stock', market: 'US' },
  { ticker: 'V',      name: 'Visa Inc.',                                type: 'stock', market: 'US' },
  { ticker: 'UNH',    name: 'UnitedHealth Group',                       type: 'stock', market: 'US' },
  { ticker: 'HD',     name: 'The Home Depot Inc.',                      type: 'stock', market: 'US' },
  { ticker: 'MA',     name: 'Mastercard Incorporated',                  type: 'stock', market: 'US' },
  { ticker: 'PG',     name: 'Procter & Gamble Co.',                     type: 'stock', market: 'US' },
  { ticker: 'XOM',    name: 'Exxon Mobil Corporation',                  type: 'stock', market: 'US' },
  { ticker: 'CVX',    name: 'Chevron Corporation',                      type: 'stock', market: 'US' },
  { ticker: 'LLY',    name: 'Eli Lilly and Company',                    type: 'stock', market: 'US' },
  { ticker: 'ABBV',   name: 'AbbVie Inc.',                              type: 'stock', market: 'US' },
  { ticker: 'MRK',    name: 'Merck & Co. Inc.',                         type: 'stock', market: 'US' },
  { ticker: 'PFE',    name: 'Pfizer Inc.',                              type: 'stock', market: 'US' },
  { ticker: 'KO',     name: 'The Coca-Cola Company',                    type: 'stock', market: 'US' },
  { ticker: 'PEP',    name: 'PepsiCo Inc.',                             type: 'stock', market: 'US' },
  { ticker: 'COST',   name: 'Costco Wholesale Corporation',             type: 'stock', market: 'US' },
  { ticker: 'MCD',    name: "McDonald's Corporation",                   type: 'stock', market: 'US' },
  { ticker: 'DIS',    name: 'The Walt Disney Company',                  type: 'stock', market: 'US' },
  { ticker: 'NFLX',   name: 'Netflix Inc.',                             type: 'stock', market: 'US' },
  { ticker: 'INTC',   name: 'Intel Corporation',                        type: 'stock', market: 'US' },
  { ticker: 'AMD',    name: 'Advanced Micro Devices Inc.',              type: 'stock', market: 'US' },
  { ticker: 'PYPL',   name: 'PayPal Holdings Inc.',                     type: 'stock', market: 'US' },
  { ticker: 'ADBE',   name: 'Adobe Inc.',                               type: 'stock', market: 'US' },
  { ticker: 'CRM',    name: 'Salesforce Inc.',                          type: 'stock', market: 'US' },
  { ticker: 'ORCL',   name: 'Oracle Corporation',                       type: 'stock', market: 'US' },
  { ticker: 'CSCO',   name: 'Cisco Systems Inc.',                       type: 'stock', market: 'US' },
  { ticker: 'TXN',    name: 'Texas Instruments Incorporated',           type: 'stock', market: 'US' },
  { ticker: 'AVGO',   name: 'Broadcom Inc.',                            type: 'stock', market: 'US' },
  { ticker: 'QCOM',   name: 'Qualcomm Incorporated',                    type: 'stock', market: 'US' },
  { ticker: 'WMT',    name: 'Walmart Inc.',                             type: 'stock', market: 'US' },
  { ticker: 'SBUX',   name: 'Starbucks Corporation',                    type: 'stock', market: 'US' },
  { ticker: 'NKE',    name: 'Nike Inc.',                                type: 'stock', market: 'US' },
  { ticker: 'BA',     name: 'The Boeing Company',                       type: 'stock', market: 'US' },
  { ticker: 'GE',     name: 'GE Aerospace',                             type: 'stock', market: 'US' },
  // ── BR ETFs ──
  { ticker: 'BOVA11',  name: 'iShares Ibovespa Fundo de Índice',        type: 'etf',   market: 'BR' },
  { ticker: 'IVVB11',  name: 'iShares S&P 500 FI (Brasil)',             type: 'etf',   market: 'BR' },
  { ticker: 'SMAL11',  name: 'iShares Small Cap Fundo de Índice',       type: 'etf',   market: 'BR' },
  { ticker: 'HASH11',  name: 'Hashdex Nasdaq Crypto Index Fundo',       type: 'etf',   market: 'BR' },
  { ticker: 'DEVA11',  name: 'BV Global Equity Fundo de Índice',        type: 'etf',   market: 'BR' },
  { ticker: 'SPXI11',  name: 'Trend S&P 500 Fundo de Índice',           type: 'etf',   market: 'BR' },
  { ticker: 'GOLD11',  name: 'Trend Ouro Fundo de Índice',              type: 'etf',   market: 'BR' },
  // ── BR Stocks ──
  { ticker: 'PETR4',  name: 'Petróleo Brasileiro S.A. (Petrobras)',     type: 'stock', market: 'BR' },
  { ticker: 'PETR3',  name: 'Petróleo Brasileiro S.A. (Petrobras ON)',  type: 'stock', market: 'BR' },
  { ticker: 'VALE3',  name: 'Vale S.A.',                                type: 'stock', market: 'BR' },
  { ticker: 'ITUB4',  name: 'Itaú Unibanco Holding S.A.',              type: 'stock', market: 'BR' },
  { ticker: 'BBDC4',  name: 'Banco Bradesco S.A.',                      type: 'stock', market: 'BR' },
  { ticker: 'BBAS3',  name: 'Banco do Brasil S.A.',                     type: 'stock', market: 'BR' },
  { ticker: 'ABEV3',  name: 'Ambev S.A.',                               type: 'stock', market: 'BR' },
  { ticker: 'WEGE3',  name: 'WEG S.A.',                                 type: 'stock', market: 'BR' },
  { ticker: 'RENT3',  name: 'Localiza Rent a Car S.A.',                 type: 'stock', market: 'BR' },
  { ticker: 'LREN3',  name: 'Lojas Renner S.A.',                        type: 'stock', market: 'BR' },
  { ticker: 'EGIE3',  name: 'Engie Brasil Energia S.A.',               type: 'stock', market: 'BR' },
  { ticker: 'B3SA3',  name: 'B3 S.A. - Brasil Bolsa Balcão',           type: 'stock', market: 'BR' },
  { ticker: 'RADL3',  name: 'Raia Drogasil S.A.',                       type: 'stock', market: 'BR' },
  { ticker: 'TOTS3',  name: 'TOTVS S.A.',                               type: 'stock', market: 'BR' },
  { ticker: 'EMBR3',  name: 'Embraer S.A.',                             type: 'stock', market: 'BR' },
  { ticker: 'ELET3',  name: 'Centrais Elétricas Brasileiras (Eletrobras)', type: 'stock', market: 'BR' },
  { ticker: 'SUZB3',  name: 'Suzano S.A.',                              type: 'stock', market: 'BR' },
  { ticker: 'SANB11', name: 'Banco Santander Brasil S.A.',              type: 'stock', market: 'BR' },
  { ticker: 'RDOR3',  name: 'Rede D\'Or São Luiz S.A.',                 type: 'stock', market: 'BR' },
  { ticker: 'HAPV3',  name: 'Hapvida Participações e Investimentos',    type: 'stock', market: 'BR' },
  { ticker: 'PRIO3',  name: 'PRIO S.A.',                                type: 'stock', market: 'BR' },
  { ticker: 'UGPA3',  name: 'Ultrapar Participações S.A.',              type: 'stock', market: 'BR' },
  { ticker: 'VIVT3',  name: 'Telefônica Brasil S.A. (Vivo)',            type: 'stock', market: 'BR' },
  { ticker: 'TAEE11', name: 'Taesa - Transmissora Aliança de Energia',  type: 'stock', market: 'BR' },
  { ticker: 'JBSS3',  name: 'JBS S.A.',                                 type: 'stock', market: 'BR' },
  { ticker: 'GGBR4',  name: 'Gerdau S.A.',                              type: 'stock', market: 'BR' },
  { ticker: 'USIM5',  name: 'Usiminas - Usinas Siderúrgicas',           type: 'stock', market: 'BR' },
  { ticker: 'KLBN11', name: 'Klabin S.A.',                              type: 'stock', market: 'BR' },
];

export function searchStocks(query: string, type?: string): AssetOption[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  // Search stocks AND ETFs together — a member shouldn't need to know whether a
  // ticker (e.g. TLT, SLV) is classed as a stock or an ETF to find it. ('other'
  // has no searchable catalogue.)
  if (type === 'other') return [];
  const pool = STOCK_LIST.filter(a => a.type === 'stock' || a.type === 'etf');

  const rank = (a: AssetOption): number => {
    const t = a.ticker.toLowerCase();
    const n = a.name.toLowerCase();
    if (t === q) return 0;            // exact ticker
    if (t.startsWith(q)) return 1;    // ticker prefix
    if (n.startsWith(q)) return 2;    // name prefix
    if (t.includes(q)) return 3;      // ticker contains
    if (n.includes(q)) return 4;      // name contains
    return 99;
  };

  return pool
    .map(a => ({ a, r: rank(a) }))
    .filter(x => x.r < 99)
    .sort((x, y) => x.r - y.r || x.a.ticker.localeCompare(y.a.ticker))
    .slice(0, 8)
    .map(x => x.a);
}
