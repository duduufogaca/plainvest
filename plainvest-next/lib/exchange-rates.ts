const FALLBACK: Record<string, Record<string, number>> = {
  AUD: { AUD: 1, USD: 0.64, BRL: 3.72 },
  USD: { AUD: 1.56, USD: 1, BRL: 5.82 },
  BRL: { AUD: 0.269, USD: 0.172, BRL: 1 },
};

export async function getExchangeRates(base: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('rate fetch failed');
    const json = await res.json();
    return json.rates as Record<string, number>;
  } catch {
    return FALLBACK[base] ?? FALLBACK.AUD;
  }
}
