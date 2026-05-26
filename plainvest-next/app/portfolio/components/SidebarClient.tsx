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
        {portfolioHref ? (
          <a href={portfolioHref} className="sidebar-link">
            <span className="sidebar-icon">◈</span>
            {!collapsed && 'Portfolio'}
          </a>
        ) : (
          <span className="sidebar-link sidebar-active">
            <span className="sidebar-icon">◈</span>
            {!collapsed && 'Portfolio'}
          </span>
        )}
        <a href={backHref} className="sidebar-link">
          <span className="sidebar-icon">⌂</span>
          {!collapsed && 'Hub'}
        </a>
        {profileActive ? (
          <span className="sidebar-link sidebar-active">
            <span className="sidebar-icon">◯</span>
            {!collapsed && profileLabel}
          </span>
        ) : (
          <a href="/profile" className="sidebar-link">
            <span className="sidebar-icon">◯</span>
            {!collapsed && profileLabel}
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
