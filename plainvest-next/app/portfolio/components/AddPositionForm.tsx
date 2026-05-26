'use client';

import { useState } from 'react';
import { addPortfolioEntry } from '@/app/actions/portfolio';
import { AssetSearchInput } from './AssetSearchInput';
import { SubmitButton } from '@/app/components/submit-button';
import { T } from '@/lib/portfolio-i18n';
import type { Lang } from '@/lib/portfolio-i18n';

export function AddPositionForm({ lang = 'en' }: { lang?: Lang }) {
  const [assetType, setAssetType] = useState('stock');
  const tx = T[lang];

  return (
    <section className="portfolio-card">
      <p className="eyebrow">{tx.addEyebrow}</p>
      <h2>{tx.addTitle}</h2>
      <form action={addPortfolioEntry} className="portfolio-add-form">
        {/* Type + Currency row */}
        <div className="portfolio-form-grid-top">
          <label className="portfolio-label">
            {tx.formAssetType} *
            <select
              name="asset_type"
              required
              value={assetType}
              onChange={e => setAssetType(e.target.value)}
            >
              <option value="stock">📈 {tx.formTypeStock}</option>
              <option value="etf">🗂️ {tx.formTypeETF}</option>
              <option value="crypto">₿ {tx.formTypeCrypto}</option>
              <option value="other">{tx.formTypeOther}</option>
            </select>
          </label>
          <label className="portfolio-label">
            {tx.formCurrency} *
            <select name="currency">
              <option value="AUD">AUD — Australian Dollar</option>
              <option value="USD">USD — US Dollar</option>
              <option value="BRL">BRL — Brazilian Real</option>
            </select>
          </label>
        </div>

        {/* Asset name + ticker */}
        <AssetSearchInput assetType={assetType} lang={lang} />

        {/* Numbers */}
        <div className="portfolio-form-grid">
          <label className="portfolio-label">
            {tx.formQty} *
            <input name="quantity" type="number" step="any" required min="0"
              placeholder={tx.formPlaceholderQty} />
          </label>
          <label className="portfolio-label">
            {tx.formBuyPrice} *
            <input name="buy_price" type="number" step="any" required min="0"
              placeholder={tx.formPlaceholderPrice} />
          </label>
          <label className="portfolio-label">
            {tx.formBuyDate}
            <input name="buy_date" type="date" />
          </label>
        </div>

        <label className="portfolio-label portfolio-notes-label">
          {tx.formNotes} <span className="field-note">{tx.formOptional}</span>
          <input name="notes" type="text" placeholder={tx.formPlaceholderNotes} />
        </label>

        <SubmitButton pendingText={tx.formBtnAdding} className="portfolio-submit-btn">
          {tx.formBtnAdd}
        </SubmitButton>
      </form>
    </section>
  );
}
