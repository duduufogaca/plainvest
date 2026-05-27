'use client';

import { useState } from 'react';
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
};

export function SidebarClient({ displayCurrency, lang, backHref, portfolioHref, profileLabel, logoutLabel, userName, profileActive }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [showCurrencies, setShowCurrencies] = useState(true);
  const [showLanguages, setShowLanguages] = useState(true);
  const isEN = lang !== 'pt';
  const initial = userName ? userName[0].toUpperCase() : '?';

  return (
    <aside className={`portfolio-sidebar${collapsed ? ' sidebar-collapsed' : ''}`}>

      {/* Welcome / brand row */}
      <div className="sidebar-brand-row">
        {collapsed ? (
          <a href={backHref} className="sidebar-avatar-btn" title={userName}>
            {initial}
          </a>
        ) : (
          <div className="sidebar-welcome-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <a href={backHref} className="sidebar-logo-link">
              <img
                src="/assets/LOGO%20TRANSPARENTE%20BACK.png"
                alt="Plainvest"
                className="sidebar-logo-img"
              />
            </a>
            <div className="sidebar-welcome-name">
              <span className="sidebar-welcome-label">{isEN ? 'Welcome back,' : 'Bem-vindo,'}</span>
              <span className="sidebar-welcome-first">{userName || '—'}</span>
            </div>
          </div>
        )}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? (isEN ? 'Expand' : 'Expandir') : (isEN ? 'Collapse' : 'Recolher')}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      <nav className="sidebar-nav">
        <a href={backHref} className="sidebar-link">
          <span className="sidebar-icon sidebar-icon-svg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </span>
          {!collapsed && <span className="sidebar-link-label">{isEN ? 'Dashboard' : 'Painel'}</span>}
        </a>

        {portfolioHref ? (
          <a href={portfolioHref} className="sidebar-link">
            <span className="sidebar-icon sidebar-icon-svg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </span>
            {!collapsed && <span className="sidebar-link-label">{isEN ? 'Portfolio' : 'Portfólio'}</span>}
          </a>
        ) : (
          <span className="sidebar-link sidebar-active">
            <span className="sidebar-icon sidebar-icon-svg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </span>
            {!collapsed && <span className="sidebar-link-label">{isEN ? 'Portfolio' : 'Portfólio'}</span>}
          </span>
        )}

        <div className="sidebar-nav-divider" />

        <span className="sidebar-link sidebar-link-soon" title={isEN ? 'Coming soon' : 'Em breve'}>
          <span className="sidebar-icon sidebar-icon-svg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
          {!collapsed && (
            <>
              <span className="sidebar-link-label">{isEN ? 'Future' : 'Futuro'}</span>
              <span className="sidebar-soon-badge">{isEN ? 'Soon' : 'Breve'}</span>
            </>
          )}
        </span>

        <span className="sidebar-link sidebar-link-soon" title={isEN ? 'Coming soon' : 'Em breve'}>
          <span className="sidebar-icon sidebar-icon-svg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
            </svg>
          </span>
          {!collapsed && (
            <>
              <span className="sidebar-link-label">{isEN ? 'Insights' : 'Análises'}</span>
              <span className="sidebar-soon-badge">{isEN ? 'Soon' : 'Breve'}</span>
            </>
          )}
        </span>

        <span className="sidebar-link sidebar-link-soon" title={isEN ? 'Coming soon' : 'Em breve'}>
          <span className="sidebar-icon sidebar-icon-svg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </span>
          {!collapsed && (
            <>
              <span className="sidebar-link-label">{isEN ? 'Learn' : 'Aprender'}</span>
              <span className="sidebar-soon-badge">{isEN ? 'Soon' : 'Breve'}</span>
            </>
          )}
        </span>

        <div className="sidebar-nav-divider" />

        {profileActive ? (
          <span className="sidebar-link sidebar-active">
            <span className="sidebar-icon sidebar-icon-svg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            {!collapsed && <span className="sidebar-link-label">{profileLabel}</span>}
          </span>
        ) : (
          <a href="/profile" className="sidebar-link">
            <span className="sidebar-icon sidebar-icon-svg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            {!collapsed && <span className="sidebar-link-label">{profileLabel}</span>}
          </a>
        )}
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">

          {/* Currency section */}
          <div className="sidebar-section">
            <button
              className="sidebar-section-header"
              onClick={() => setShowCurrencies(c => !c)}
            >
              <span className="sidebar-section-label">{isEN ? 'Currency' : 'Moeda'}</span>
              <span className={`sidebar-section-chevron${showCurrencies ? ' open' : ''}`}>›</span>
            </button>
            {showCurrencies && (
              <div className="sidebar-section-content">
                <CurrencySwitcher current={displayCurrency} lang={lang} />
              </div>
            )}
          </div>

          {/* Language section */}
          <div className="sidebar-section">
            <button
              className="sidebar-section-header"
              onClick={() => setShowLanguages(c => !c)}
            >
              <span className="sidebar-section-label">{isEN ? 'Language' : 'Idioma'}</span>
              <span className={`sidebar-section-chevron${showLanguages ? ' open' : ''}`}>›</span>
            </button>
            {showLanguages && (
              <div className="sidebar-section-content">
                <LangSwitcher current={lang} currency={displayCurrency} />
              </div>
            )}
          </div>

          {/* Guide */}
          <div className="sidebar-guide-wrap">
            <HelpModal lang={lang} />
          </div>

          <form action={signOut}>
            <SubmitButton className="sidebar-logout-btn" pendingText="...">{logoutLabel}</SubmitButton>
          </form>
        </div>
      )}

      {/* Collapsed: show logout icon only */}
      {collapsed && (
        <div className="sidebar-collapsed-footer">
          <form action={signOut}>
            <SubmitButton className="sidebar-logout-icon-btn" pendingText="·">⏻</SubmitButton>
          </form>
        </div>
      )}
    </aside>
  );
}
