'use client';

import { useState, useTransition } from 'react';
import { addPortfolioEntry } from '@/app/actions/portfolio';
import { AssetSearchInput } from './AssetSearchInput';

export function AddPositionForm() {
  const [assetType, setAssetType] = useState('stock');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await addPortfolioEntry(fd);
    });
  };

  return (
    <section className="portfolio-card">
      <p className="eyebrow">Add position</p>
      <h2>Log a new purchase</h2>
      <form onSubmit={handleSubmit} className="portfolio-add-form">
        {/* Type + Currency row */}
        <div className="portfolio-form-grid-top">
          <label className="portfolio-label">
            Asset type *
            <select
              name="asset_type"
              required
              value={assetType}
              onChange={e => setAssetType(e.target.value)}
            >
              <option value="stock">📈 Stock</option>
              <option value="etf">🗂️ ETF</option>
              <option value="crypto">₿ Crypto</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="portfolio-label">
            Currency *
            <select name="currency">
              <option value="AUD">AUD — Australian Dollar</option>
              <option value="USD">USD — US Dollar</option>
              <option value="BRL">BRL — Brazilian Real</option>
            </select>
          </label>
        </div>

        {/* Asset name + ticker with autocomplete */}
        <AssetSearchInput assetType={assetType} />

        {/* Numbers row */}
        <div className="portfolio-form-grid">
          <label className="portfolio-label">
            Quantity *
            <input
              name="quantity"
              type="number"
              step="any"
              required
              min="0"
              placeholder="e.g. 0.05, 10, 100"
            />
          </label>
          <label className="portfolio-label">
            Buy price per unit *
            <input
              name="buy_price"
              type="number"
              step="any"
              required
              min="0"
              placeholder="e.g. 42000.00"
            />
          </label>
          <label className="portfolio-label">
            Current price <span className="field-note">(optional, for P&L)</span>
            <input
              name="current_price"
              type="number"
              step="any"
              min="0"
              placeholder="Add now or update later"
            />
          </label>
          <label className="portfolio-label">
            Buy date
            <input name="buy_date" type="date" />
          </label>
        </div>

        <label className="portfolio-label portfolio-notes-label">
          Notes <span className="field-note">(optional)</span>
          <input name="notes" type="text" placeholder="e.g. DCA buy, long-term hold" />
        </label>

        <button type="submit" className="portfolio-submit-btn" disabled={isPending}>
          {isPending ? 'Adding…' : '+ Add position'}
        </button>
      </form>
    </section>
  );
}
