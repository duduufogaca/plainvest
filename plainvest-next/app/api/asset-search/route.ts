import { NextRequest, NextResponse } from 'next/server';
import { searchStocks } from '@/app/portfolio/assets-data';

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

  const results = searchStocks(q, type);
  return NextResponse.json({ results });
}
