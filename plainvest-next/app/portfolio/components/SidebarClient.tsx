'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CurrencySwitcher } from './CurrencySwitcher';
import { LangSwitcher } from './LangSwitcher';
import { HelpModal } from './HelpModal';
import { SubmitButton } from '../../components/submit-button';
import { signOut } from '../../actions/auth';
import { TOTAL_GUIDES } from '@/lib/guide-meta';

type Props = {
  displayCurrency: string;
  lang: string;
  backHref: string;
  portfolioHref?: string;
  profileLabel: string;
  logoutLabel: string;
  userName?: string;
  plan?: string;
  profileActive?: boolean;
  homeActive?: boolean;
  toolsActive?: boolean;
  userFullName?: string;
};

export function SidebarClient({ displayCurrency, lang, backHref, portfolioHref, profileLabel, logoutLabel, userName, plan, profileActive, homeActive, toolsActive, userFullName }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [guideCount, setGuideCount] = useState<number | null>(null);

  const isEN = lang !== 'pt';
  const isPro = plan === 'pro';
  const initial = userName ? userName[0].toUpperCase() : '?';
  const isPortfolioActive = !portfolioHref;
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || '';

  useEffect(() => {
    function sync() {
      try {
        const raw = localStorage.getItem('pv_read_guides');
        const parsed: string[] = raw ? JSON.parse(raw) : [];
        setGuideCount(Array.isArray(parsed) ? parsed.filter(k => k !== 'welcome').length : 0);
      } catch { setGuideCount(0); }
    }
    sync();
    window.addEventListener('pageshow', sync);          // re-read when returning from a guide (incl. bfcache)
    document.addEventListener('visibilitychange', sync);
    return () => { window.removeEventListener('pageshow', sync); document.removeEventListener('visibilitychange', sync); };
  }, []);

  function navHref(view: string) {
    const p = new URLSearchParams();
    if (displayCurrency && displayCurrency !== 'AUD') p.set('currency', displayCurrency);
    if (lang && lang !== 'en') p.set('lang', lang);
    if (view) p.set('view', view);
    const qs = p.toString();
    return `/portfolio${qs ? '?' + qs : ''}`;
  }

  function isViewActive(view: string) {
    return currentView === view;
  }

  const progressPct = guideCount !== null ? Math.round((guideCount / TOTAL_GUIDES) * 100) : 0;

  return (
    <>
    {/* ── Mobile nav toggle ── */}
    <button
      className="mob-sidebar-toggle"
      onClick={() => setMobileOpen(o => !o)}
      aria-label={isEN ? 'Open navigation' : 'Abrir navegação'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    {mobileOpen && (
      <div className="mob-sidebar-backdrop" onClick={() => setMobileOpen(false)} />
    )}

    <aside className={`portfolio-sidebar sb-v2${collapsed ? ' sidebar-collapsed' : ''}${mobileOpen ? ' mob-sidebar-open' : ''}`}>

      {/* ── Brand ── */}
      <div className="sb-brand">
        {collapsed ? (
          <a href={backHref} className="sb-brand-icon" title="Plainvest">P</a>
        ) : (
          <a href={backHref} className="sb-brand-logo-link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/plainvest-logo-clean.png" alt="Plainvest" className="sb-logo-img" />
          </a>
        )}
        <button
          className="sb-collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? (isEN ? 'Expand' : 'Expandir') : (isEN ? 'Collapse' : 'Recolher')}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* ── User section ── */}
      {!collapsed && (
        <div className="sb-user">
          <div className="sb-user-avatar">{initial}</div>
          <div className="sb-user-info">
            <div className="sb-user-name-row">
              <span className="sb-user-name">
                {userFullName
                  ? (userFullName.length > 18 ? userFullName.slice(0, 16) + '…' : userFullName)
                  : (userName || '—')}
              </span>
            </div>
            <span className={`sb-plan-label ${isPro ? 'sb-plan-pro' : 'sb-plan-premium'}`}>
              {isPro ? 'Pro Member' : 'Premium Member'}
            </span>
            {guideCount !== null && (
              <div className="sb-progress-wrap">
                <div className="sb-progress-track">
                  <div className="sb-progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
                <span className="sb-progress-label">{guideCount}/{TOTAL_GUIDES} guides</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="sb-nav">

        {/* Home */}
        <a href="/home" className={`sb-link${homeActive ? ' sb-active' : ''}`}>
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </span>
          {!collapsed && <span className="sb-label">{isEN ? 'Home' : 'Início'}</span>}
        </a>

        {/* LEARN */}
        {!collapsed && <div className="sb-section-label">{isEN ? 'Learn' : 'Aprender'}</div>}
        {collapsed && <div className="sb-nav-divider" />}

        {/* My Progress */}
        <a href="/home#mh-progress" className="sb-link">
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
          {!collapsed && (
            <span className="sb-label sb-label-progress">
              {isEN ? 'My Progress' : 'Meu Progresso'}
              {guideCount !== null && !collapsed && (
                <span className="sb-progress-inline">{guideCount}/{TOTAL_GUIDES}</span>
              )}
            </span>
          )}
        </a>

        <a href="/index.html?member_session=1#member" className="sb-link">
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </span>
          {!collapsed && <span className="sb-label">{isEN ? 'Guides & Hub' : 'Guias & Hub'}</span>}
        </a>

        {/* TOOLS */}
        {!collapsed && <div className="sb-section-label">{isEN ? 'Tools' : 'Ferramentas'}</div>}
        {collapsed && <div className="sb-nav-divider" />}

        <a href={navHref('')} className={`sb-link${isPortfolioActive && !currentView ? ' sb-active' : ''}`}>
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </span>
          {!collapsed && (
            <>
              <span className="sb-label">{isEN ? 'Portfolio' : 'Portfólio'}</span>
              {!isPro && <span className="sb-pro-lock">Pro</span>}
            </>
          )}
        </a>

        <a href={navHref('projections')} className={`sb-link${isViewActive('projections') ? ' sb-active' : ''}`}>
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </span>
          {!collapsed && (
            <>
              <span className="sb-label">{isEN ? 'Projections' : 'Projeções'}</span>
              {!isPro && <span className="sb-pro-lock">Pro</span>}
            </>
          )}
        </a>

        <a href="/tools" className={`sb-link${toolsActive ? ' sb-active' : ''}`}>
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="11" y2="14"/><line x1="8" y1="18" x2="11" y2="18"/>
            </svg>
          </span>
          {!collapsed && (
            <>
              <span className="sb-label">{isEN ? 'Calculators' : 'Calculadoras'}</span>
              {!isPro && <span className="sb-pro-lock">Pro</span>}
            </>
          )}
        </a>

      </nav>

      {/* ── Footer ── */}
      <div className="sb-footer">
        {!collapsed && (
          <div className="sb-footer-settings">

            {/* Settings — single accordion for currency + language */}
            <div className="sidebar-section">
              <button className="sidebar-section-header" onClick={() => setShowSettings(s => !s)}>
                <span className="sb-settings-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                  </svg>
                </span>
                <span className="sidebar-section-label">{isEN ? 'Settings' : 'Configurações'}</span>
                <span className={`sidebar-section-chevron${showSettings ? ' open' : ''}`}>›</span>
              </button>
              {showSettings && (
                <div className="sidebar-section-content sb-settings-content">
                  <p className="sb-settings-sublabel">{isEN ? 'Currency' : 'Moeda'}</p>
                  <CurrencySwitcher current={displayCurrency} lang={lang} />
                  <p className="sb-settings-sublabel" style={{ marginTop: '.6rem' }}>{isEN ? 'Language' : 'Idioma'}</p>
                  <LangSwitcher current={lang} currency={displayCurrency} />
                </div>
              )}
            </div>

            <div className="sidebar-guide-wrap">
              <HelpModal lang={lang} />
            </div>

          </div>
        )}

        <div className="sb-footer-bottom">
          {profileActive ? (
            <span className="sb-link sb-active">
              <span className="sb-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              {!collapsed && <span className="sb-label">{profileLabel}</span>}
            </span>
          ) : (
            <a href="/profile" className="sb-link">
              <span className="sb-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              {!collapsed && <span className="sb-label">{profileLabel}</span>}
            </a>
          )}

          <form action={signOut}>
            <SubmitButton className="sb-logout-btn" pendingText="...">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              {!collapsed && <span>{logoutLabel}</span>}
            </SubmitButton>
          </form>
        </div>
      </div>
    </aside>
    </>
  );
}
