import { NextRequest, NextResponse } from 'next/server';
import { searchStocks } from '@/app/portfolio/assets-data';

type Result = { name: string; ticker: string; type: string; rank?: number | null; thumb?: string };

// Live fallback so ANY listed stock/ETF is found automatically, not just the
// curated catalogue. Yahoo is already used server-side for live prices, so it's
// reachable here too. Suffixes for the markets we price (.AX = ASX, .SA = B3) are
// stripped to the base ticker, because live pricing re-adds them from the currency.
async function yahooSearch(q: string): Promise<Result[]> {
  try {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=12&newsCount=0&listsCount=0`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    const quotes: Array<{ symbol?: string; shortname?: string; longname?: string; quoteType?: string }> =
      data?.quotes || [];
    return quotes
      .map((c) => {
        const qt = (c.quoteType || '').toUpperCase();
        const type = qt === 'ETF' ? 'etf' : qt === 'EQUITY' ? 'stock' : null;
        if (!type || !c.symbol) return null;
        const ticker = c.symbol.replace(/\.(AX|SA)$/i, '').toUpperCase();
        // Drop other foreign-exchange listings (.MX, .NS, .TO, .L…) we can't price.
        if (ticker.includes('.')) return null;
        return { name: c.shortname || c.longname || ticker, ticker, type };
      })
      .filter((r): r is Result => r !== null);
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const type = searchParams.get('type') || '';

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  if (type === 'crypto') {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`,
        { next: { revalidate: 0 } },
      );
      if (!res.ok) throw new Error('CoinGecko error');
      const data = await res.json();
      const results = (data.coins || []).slice(0, 8).map((c: {
        name: string; symbol: string; market_cap_rank: number | null; thumb: string;
      }) => ({
        name: c.name,
        ticker: c.symbol.toUpperCase(),
        type: 'crypto',
        rank: c.market_cap_rank,
        thumb: c.thumb,
      }));
      return NextResponse.json({ results });
    } catch {
      return NextResponse.json({ results: [] });
    }
  }

  // Curated catalogue first (instant, clean names), then live results for anything
  // not already covered — deduped by ticker, capped at 8.
  const curated: Result[] = searchStocks(q, type);
  const seen = new Set(curated.map(r => r.ticker.toUpperCase()));
  const live = await yahooSearch(q);
  const merged = curated.concat(live.filter(r => !seen.has(r.ticker.toUpperCase()))).slice(0, 8);

  return NextResponse.json({ results: merged });
}
