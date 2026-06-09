'use client';

/**
 * Shared client helpers so the Next.js member pages (/home, /profile, /portfolio)
 * reflect the SAME server-persisted progress as the public-site card hub.
 *
 * The server (member_progress table via /api/member/progress) is the source of
 * truth, so opened guides + "where I left off" survive tab close, logout, and
 * sync across devices/sessions. localStorage is only a fast-paint cache that the
 * existing sync() readers already use — we mirror the server into it.
 */

type ServerProgress = {
  authenticated?: boolean;
  read_guides?: string[];
  starred?: string[];
  last_guide?: string | null;
  sim_run?: boolean;
  projection_run?: boolean;
  portfolio_added?: boolean;
};


/** Fire-and-forget write-through to the server (survives navigation via keepalive). */
export function saveProgress(patch: Record<string, unknown>): void {
  try {
    fetch('/api/member/progress', {
      method: 'POST',
      credentials: 'include',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch || {}),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

/**
 * Pull progress from the server and mirror it into localStorage so the page's
 * existing sync() picks it up. On the first run, if the server is empty but the
 * browser already has local progress, push that up so nothing is lost.
 * Resolves true when server data was applied (caller should re-sync state).
 */
export async function hydrateProgress(): Promise<boolean> {
  try {
    const r = await fetch('/api/member/progress', { credentials: 'include', cache: 'no-store' });
    if (!r.ok) return false;
    const d: ServerProgress = await r.json();
    if (!d || d.authenticated === false) return false;

    // Server is the single source of truth for THIS account — overwrite the local
    // cache (no merge/migration) so one account never inherits another's leftover
    // browser data in the same browser.
    const sGuides = Array.isArray(d.read_guides) ? d.read_guides : [];
    const sStars = Array.isArray(d.starred) ? d.starred : [];
    try { localStorage.setItem('pv_read_guides', JSON.stringify(sGuides)); } catch { /* */ }
    try { localStorage.setItem('pv_starred', JSON.stringify(sStars)); } catch { /* */ }
    try {
      if (d.last_guide) localStorage.setItem('pv_last_guide', d.last_guide);
      else localStorage.removeItem('pv_last_guide');
      if (d.projection_run) localStorage.setItem('pv_projection_run', '1'); else localStorage.removeItem('pv_projection_run');
      if (d.portfolio_added) localStorage.setItem('pv_portfolio_created', '1'); else localStorage.removeItem('pv_portfolio_created');
    } catch { /* */ }

    return true;
  } catch {
    return false;
  }
}
