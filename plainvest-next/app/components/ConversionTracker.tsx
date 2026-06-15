'use client';

import { useEffect } from 'react';

const AW = 'AW-18234441233';
const PURCHASE_LABEL = 'zXjzCNqQ970cEJH87fZD';
const SIGNUP_LABEL = 'pSdzCJHl4L8cEJH87fZD';

/**
 * Fires Google Ads conversions exactly once on the landing page after a
 * successful purchase (?purchase=success) or a confirmed sign-up
 * (?signup=confirmed), then strips the flag from the URL so a refresh or
 * back-navigation never double-counts.
 */
export function ConversionTracker() {
  useEffect(() => {
    const w = window as unknown as {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    // Ensure gtag exists so the event is queued even if gtag.js hasn't loaded yet.
    w.dataLayer = w.dataLayer || [];
    if (typeof w.gtag !== 'function') {
      w.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments);
      };
    }

    const params = new URLSearchParams(window.location.search);
    let changed = false;

    if (params.get('purchase') === 'success') {
      w.gtag('event', 'conversion', {
        send_to: `${AW}/${PURCHASE_LABEL}`,
        transaction_id: params.get('txn') || '',
      });
      params.delete('purchase');
      params.delete('txn');
      changed = true;
    }

    if (params.get('signup') === 'confirmed') {
      w.gtag('event', 'conversion', {
        send_to: `${AW}/${SIGNUP_LABEL}`,
        value: 1.0,
        currency: 'AUD',
      });
      params.delete('signup');
      changed = true;
    }

    if (changed) {
      const qs = params.toString();
      const url = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
      window.history.replaceState(null, '', url);
    }
  }, []);

  return null;
}
