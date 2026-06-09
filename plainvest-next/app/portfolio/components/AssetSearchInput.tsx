'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { T } from '@/lib/portfolio-i18n';
import type { Lang } from '@/lib/portfolio-i18n';

type Result = { name: string; ticker: string; type: string; rank?: number | null; thumb?: string };

export function AssetSearchInput({
  assetType,
  defaultName = '',
  defaultTicker = '',
  lang = 'en',
  onPick,
}: {
  assetType: string;
  defaultName?: string;
  defaultTicker?: string;
  lang?: Lang;
  onPick?: (type: string) => void;
}) {
  const [name, setName] = useState(defaultName);
  const [ticker, setTicker] = useState(defaultTicker);
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const justPickedRef = useRef(false);

  const search = useCallback(async (q: string) => {
    if (!q || q.length < 2 || assetType === 'other') {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/asset-search?q=${encodeURIComponent(q)}&type=${assetType}`);
      const data = await res.json();
      setResults(data.results || []);
      setOpen((data.results || []).length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [assetType]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(val), 280);
  };

  const pick = (r: Result) => {
    justPickedRef.current = true; // keep these values across the type-driven reset effect
    setName(r.name);
    setTicker(r.ticker);
    setOpen(false);
    setResults([]);
    // auto-correct the asset type to match what was actually selected (e.g. TLT = ETF)
    if (r.type === 'stock' || r.type === 'etf') onPick?.(r.type);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    // Skip the reset when the type change was triggered by picking a result,
    // otherwise the just-picked name/ticker would be wiped.
    if (justPickedRef.current) { justPickedRef.current = false; return; }
    setName(defaultName);
    setTicker(defaultTicker);
  }, [assetType, defaultName, defaultTicker]);

  const tx = T[lang];
  const namePlaceholder = assetType === 'crypto'
    ? tx.formPlaceholderCrypto
    : assetType === 'etf'
    ? tx.formPlaceholderETF
    : tx.formPlaceholderStock;

  return (
    <div className="asset-search-wrap" ref={wrapRef}>
      <div className="asset-search-row">
        <label className="portfolio-label asset-name-label">
          {tx.formAssetName} *
          <div className="asset-input-wrap">
            <input
              name="asset_name"
              type="text"
              required
              autoComplete="off"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              onFocus={() => name.length >= 2 && results.length > 0 && setOpen(true)}
              placeholder={namePlaceholder}
            />
            {loading && <span className="asset-spinner" />}
          </div>
          {open && results.length > 0 && (
            <ul className="asset-dropdown" role="listbox">
              {results.map((r, i) => (
                <li key={i} role="option" className="asset-dropdown-item" onMouseDown={() => pick(r)}>
                  {r.thumb && <img src={r.thumb} alt="" className="asset-thumb" width={20} height={20} />}
                  <span className="asset-dd-name">{r.name}</span>
                  <span className="asset-dd-ticker">{r.ticker}</span>
                  {r.rank && <span className="asset-dd-rank">#{r.rank}</span>}
                </li>
              ))}
            </ul>
          )}
        </label>

        <label className="portfolio-label">
          {tx.formTicker}
          <input
            name="ticker"
            type="text"
            value={ticker}
            onChange={e => setTicker(e.target.value.toUpperCase())}
            placeholder={assetType === 'crypto' ? tx.formPlaceholderTicker : tx.formPlaceholderTickerStock}
          />
        </label>
      </div>
    </div>
  );
}
