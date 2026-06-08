/* Shared finance helpers for the PRO calculator tools.
   Formulas mirror app/portfolio/components/ProjectionEngine.tsx so results stay consistent. */

/** Future value of a starting amount plus fixed monthly contributions, compounded monthly. */
export function fv(pv: number, monthlyC: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (Math.abs(r) < 1e-9) return pv + monthlyC * n;
  return pv * Math.pow(1 + r, n) + monthlyC * (Math.pow(1 + r, n) - 1) / r;
}

/** Years needed for (pv + monthly @ rate) to reach a target (binary search; capped at 100y). */
export function yearsTo(pv: number, monthlyC: number, annualRatePct: number, target: number): number {
  if (pv >= target) return 0;
  let lo = 0, hi = 100;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (fv(pv, monthlyC, annualRatePct, mid) < target) lo = mid; else hi = mid;
  }
  return hi;
}

/** Real (inflation-adjusted) value of an amount after N years. */
export function realValue(amount: number, inflationPct: number, years: number): number {
  return amount / Math.pow(1 + inflationPct / 100, years);
}

const LOCALE: Record<string, string> = { AUD: 'en-AU', USD: 'en-US', BRL: 'pt-BR' };

/** Currency formatting matching the member dashboard (AUD/USD/BRL), no decimals. */
export function fmtCurrency(n: number, currency: string): string {
  const cur = LOCALE[currency] ? currency : 'AUD';
  return new Intl.NumberFormat(LOCALE[cur], { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(
    isFinite(n) ? n : 0,
  );
}

/** Short axis label, e.g. 1.2M / 45K. */
export function fmtShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return `${Math.round(n)}`;
}

export type SeriesPoint = { year: number; value: number; contributed: number };

/** Year-by-year growth series for charts. `points` controls resolution. */
export function growthSeries(
  pv: number, monthly: number, ratePct: number, years: number, points = 60,
): SeriesPoint[] {
  const out: SeriesPoint[] = [];
  const step = years / points;
  for (let i = 0; i <= points; i++) {
    const y = i * step;
    out.push({ year: y, value: fv(pv, monthly, ratePct, y), contributed: pv + monthly * 12 * y });
  }
  return out;
}

/** Purchasing-power decline series (nominal flat vs real eroding). */
export function inflationSeries(amount: number, inflationPct: number, years: number, points = 60): SeriesPoint[] {
  const out: SeriesPoint[] = [];
  const step = years / points;
  for (let i = 0; i <= points; i++) {
    const y = i * step;
    out.push({ year: y, value: realValue(amount, inflationPct, y), contributed: amount });
  }
  return out;
}

/** Convert a base-currency amount using a rate map value (rate = units of target per 1 base). */
export function convert(n: number, rate: number): number {
  return n * (rate || 1);
}

/** Round a converted default to a clean figure for input fields. */
export function roundNice(n: number): number {
  if (n >= 100_000) return Math.round(n / 1000) * 1000;
  if (n >= 1_000) return Math.round(n / 50) * 50;
  return Math.round(n / 10) * 10;
}
