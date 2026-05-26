type AssetInput = { key: string; ticker: string | null; assetType: string; currency: string };
export type LivePrice = { price: number; priceCurrency: string };
export type LivePrices = Record<string, LivePrice>;

async function yahooPrice(yTicker: string): Promise<number | null> {
  try {
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yTicker)}?interval=1d&range=1d&includePrePost=false`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    return typeof price === 'number' && price > 0 ? price : null;
  } catch {
    return null;
  }
}

export async function fetchLivePrices(assets: AssetInput[]): Promise<LivePrices> {
  const fetchable = assets.filter(a => a.ticker && a.assetType !== 'other');
  if (fetchable.length === 0) return {};

  const settled = await Promise.allSettled(
    fetchable.map(async (a) => {
      const t = a.ticker!.toUpperCase();
      let price: number | null = null;
      let priceCurrency = a.currency;

      if (a.assetType === 'crypto') {
        price = await yahooPrice(`${t}-USD`);
        priceCurrency = 'USD';
        // fallback: try native currency pair (e.g. BTC-AUD)
        if (!price) {
          price = await yahooPrice(`${t}-${a.currency}`);
          if (price) priceCurrency = a.currency;
        }
      } else if (a.currency === 'AUD') {
        price = await yahooPrice(`${t}.AX`);
        if (!price) price = await yahooPrice(t); // some ETFs skip .AX
      } else if (a.currency === 'BRL') {
        price = await yahooPrice(`${t}.SA`);
        if (!price) price = await yahooPrice(t);
      } else {
        price = await yahooPrice(t);
      }

      return price != null ? { key: a.key, price, priceCurrency } : null;
    })
  );

  const prices: LivePrices = {};
  settled.forEach(r => {
    if (r.status === 'fulfilled' && r.value) {
      prices[r.value.key] = { price: r.value.price, priceCurrency: r.value.priceCurrency };
    }
  });
  return prices;
}
