'use client';

import { useState } from 'react';

function logoUrl(ticker: string | null, assetType: string): string | null {
  if (!ticker) return null;
  const t = ticker.toLowerCase();
  if (assetType === 'crypto') {
    // cryptocurrency-icons covers ~800 tokens (BTC, ETH, SOL, BNB, ADA, etc.)
    return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${t}.svg`;
  }
  // Financial Modeling Prep free stock logos by ticker
  return `https://financialmodelingprep.com/image-stock/${ticker.toUpperCase()}.png`;
}

export function AssetLogo({
  ticker,
  assetType,
  initials,
  color,
}: {
  ticker: string | null;
  assetType: string;
  initials: string;
  color: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = !failed ? logoUrl(ticker, assetType) : null;

  if (src) {
    return (
      <div className="asset-logo-wrap">
        <img
          src={src}
          alt={initials}
          className="asset-logo-img"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="asset-initials" style={{ background: color }}>
      {initials}
    </div>
  );
}
