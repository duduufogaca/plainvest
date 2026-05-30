'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CurrencySwitcher } from './CurrencySwitcher';
import { LangSwitcher } from './LangSwitcher';
import { HelpModal } from './HelpModal';
import { SubmitButton } from '../../components/submit-button';
import { signOut } from '../../actions/auth';

type Props = {
  displayCurrency: string;
  lang: string;
  backHref: string;
  portfolioHref?: string;
  profileLabel: string;
  logoutLabel: string;
  userName?: string;
  profileActive?: boolean;
  plan?: string;
};

const NavIcon = ({ d, viewBox = '0 0 24 24' }: { d: string; viewBox?: string }) => (
  <svg width="15" height="15" viewBox={viewBox} fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

export function SidebarClient({ displayCurrency, lang, backHref, portfolioHref, profileLabel, logoutLabel, userName, profileActive, plan }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCurrencies, setShowCurrencies] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const isEN = lang !== 'pt';
  const initial = userName ? userName[0].toUpperCase() : '?';
  const isPortfolioActive = !portfolioHref;
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || '';

  function navHref(view: string) {
    const p = new URLSearchParams();
    if (displayCurrency && displayCurrency !== 'AUD') p.set('currency', displayCurrency);
    if (lang && lang !== 'en') p.set('lang', lang);
    if (view) p.set('view', view);
    const qs = p.toString();
    return `/portfolio${qs ? '?' + qs : ''}`;
  }

  function isActive(view: string) {
    return currentView === view;
  }

  return (
    <>
    {/* ── Mobile nav toggle (only visible on mobile) ── */}
    <button
      className="mob-sidebar-toggle"
      onClick={() => setMobileOpen(o => !o)}
      aria-label={isEN ? 'Open navigation' : 'Abrir navegação'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>

    {/* ── Mobile overlay backdrop ── */}
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
            <img src="/assets/LOGO%20TRANSPARENTE%20BACK.png" alt="Plainvest" className="sb-logo-img" />
            <span className="sb-tagline">
              {isEN ? 'Future clarity. Smarter decisions.' : 'Clareza futura. Decisões mais inteligentes.'}
            </span>
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
            <span className="sb-user-greeting">{isEN ? 'Welcome back,' : 'Bem-vindo,'}</span>
            <div className="sb-user-name-row">
              <span className="sb-user-name">{userName || '—'}</span>
              <span className={plan === 'pro' ? 'sb-pro-badge' : 'sb-premium-badge'}>{plan === 'pro' ? 'Pro' : 'Premium'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="sb-nav">
        {/* Overview */}
        <a href={navHref('')} className={`sb-link${isPortfolioActive && !currentView ? ' sb-active' : ''}`}>
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </span>
          {!collapsed && <span className="sb-label">{isEN ? 'Overview' : 'Visão Geral'}</span>}
        </a>

        {/* Portfolio (charts + allocation) */}
        <a href={navHref('portfolio')} className={`sb-link${isActive('portfolio') ? ' sb-active' : ''}`}>
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </span>
          {!collapsed && <span className="sb-label">{isEN ? 'Portfolio' : 'Portfólio'}</span>}
        </a>

        {/* Insights */}
        <a href={navHref('insights')} className={`sb-link${isActive('insights') ? ' sb-active' : ''}`}>
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </span>
          {!collapsed && <span className="sb-label">{isEN ? 'Insights' : 'Análises'}</span>}
        </a>

        {/* Future Projections */}
        <a href={navHref('projections')} className={`sb-link${isActive('projections') ? ' sb-active' : ''}`}>
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </span>
          {!collapsed && <span className="sb-label">{isEN ? 'Future Projections' : 'Projeções'}</span>}
        </a>

        {/* Transactions */}
        <a href={navHref('transactions')} className={`sb-link${isActive('transactions') ? ' sb-active' : ''}`}>
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </span>
          {!collapsed && <span className="sb-label">{isEN ? 'Transactions' : 'Transações'}</span>}
        </a>

        {/* Goals (soon) */}
        <span className="sb-link sb-link-soon" title={isEN ? 'Coming soon' : 'Em breve'}>
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r=".5" fill="currentColor"/>
            </svg>
          </span>
          {!collapsed && (
            <>
              <span className="sb-label">{isEN ? 'Goals' : 'Metas'}</span>
              <span className="sb-soon">{isEN ? 'Soon' : 'Em breve'}</span>
            </>
          )}
        </span>

        <a href={backHref} className="sb-link">
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </span>
          {!collapsed && <span className="sb-label">{isEN ? 'Hub' : 'Início'}</span>}
        </a>

        <a href="/index.html#learn" className="sb-link">
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </span>
          {!collapsed && <span className="sb-label">{isEN ? 'Learn' : 'Aprender'}</span>}
        </a>

        {/* Tools section */}
        {!collapsed && <div className="sb-section-label">{isEN ? 'Tools' : 'Ferramentas'}</div>}
        {collapsed && <div className="sb-nav-divider" />}

        <a href="/index.html#inflation" className="sb-link">
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </span>
          {!collapsed && <span className="sb-label">{isEN ? 'Inflation Calculator' : 'Calc. de Inflação'}</span>}
        </a>

        <a href="/index.html#simulator" className="sb-link">
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </span>
          {!collapsed && <span className="sb-label">{isEN ? 'Investment Simulator' : 'Simulador'}</span>}
        </a>

        <span className="sb-link sb-link-soon" title={isEN ? 'Coming soon' : 'Em breve'}>
          <span className="sb-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/>
              <line x1="6" y1="9" x2="6" y2="21"/>
            </svg>
          </span>
          {!collapsed && (
            <>
              <span className="sb-label">{isEN ? 'Compare Scenarios' : 'Comparar Cenários'}</span>
              <span className="sb-soon">{isEN ? 'Soon' : 'Em breve'}</span>
            </>
          )}
        </span>
      </nav>

      {/* ── Footer ── */}
      <div className="sb-footer">
        {!collapsed && (
          <div className="sb-footer-settings">
            {/* Currency */}
            <div className="sidebar-section">
              <button className="sidebar-section-header" onClick={() => setShowCurrencies(c => !c)}>
                <span className="sidebar-section-label">{isEN ? 'Currency' : 'Moeda'}</span>
                <span className={`sidebar-section-chevron${showCurrencies ? ' open' : ''}`}>›</span>
              </button>
              {showCurrencies && (
                <div className="sidebar-section-content">
                  <CurrencySwitcher current={displayCurrency} lang={lang} />
                </div>
              )}
            </div>

            {/* Language */}
            <div className="sidebar-section">
              <button className="sidebar-section-header" onClick={() => setShowLanguages(c => !c)}>
                <span className="sidebar-section-label">{isEN ? 'Language' : 'Idioma'}</span>
                <span className={`sidebar-section-chevron${showLanguages ? ' open' : ''}`}>›</span>
              </button>
              {showLanguages && (
                <div className="sidebar-section-content">
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
