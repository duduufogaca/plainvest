'use client';

import { useEffect, useState } from 'react';

type Props = {
  firstName: string;
  plan: string;
  isPro: boolean;
  memberSince: string;
};

const GUIDE_META: Record<string, { title: string; file: string; description: string }> = {
  guides:    { title: 'Investment Paths Guide',             file: '/files/premium_content/01-investment-paths-guide.html',                description: 'Understand which investment path fits your goals.' },
  dca:       { title: 'DCA Method Guide',                  file: '/files/premium_content/02-dca-method-guide.html',                      description: 'Build a consistent investing habit with dollar-cost averaging.' },
  firsttrade:{ title: 'Your First Trade Walkthrough',      file: '/files/premium_content/15-first-trade-walkthrough.html',               description: 'Step-by-step: place your very first trade with confidence.' },
  exchange:  { title: 'Exchange & Platform Setup',         file: '/files/premium_content/03-exchange-and-platform-setup-checklist.html', description: 'Choose and set up the right platform for your situation.' },
  inflation: { title: 'Inflation & Purchasing Power',      file: '/files/premium_content/16-inflation-and-purchasing-power.html',        description: 'Understand why your money loses value over time — and how to fight it.' },
  sentiment: { title: 'Market Sentiment: Fear & Greed',   file: '/files/premium_content/17-market-sentiment-fear-and-greed.html',       description: 'Read the emotional cycle of markets before it reads you.' },
  panicsell: { title: "Don't Panic Sell",                  file: '/files/premium_content/18-dont-panic-sell.html',                       description: 'Stay the course when markets drop. This guide saves portfolios.' },
  bitcoin:   { title: 'Bitcoin Research Section',          file: '/files/premium_content/05-bitcoin-research-section.html',              description: 'A deep, honest look at Bitcoin as an asset class.' },
  crypto:    { title: 'Crypto & Self-Custody Guide',       file: '/files/premium_content/04-crypto-and-self-custody-guide.html',         description: 'Own your crypto safely without relying on an exchange.' },
  tools:     { title: 'Chart Reading & Research Tools',   file: '/files/premium_content/07-chart-reading-and-research-tools.html',      description: 'Read price charts and find credible research sources.' },
  cycles:    { title: 'Crypto Cycle Lessons',              file: '/files/premium_content/08-crypto-cycle-lessons.html',                  description: 'How market cycles work — and how to stop being the victim of them.' },
  books:     { title: 'Books & Reading Path',              file: '/files/premium_content/06-books-and-reading-path.html',               description: 'The curated reading list that builds genuine financial knowledge.' },
  tax:       { title: 'Australian Tax & CGT Basics',       file: '/files/premium_content/11-australian-tax-cgt-basics.html',             description: 'Understand CGT and how your investments are taxed in Australia.' },
  super:     { title: 'Superannuation Basics',             file: '/files/premium_content/12-superannuation-basics.html',                 description: 'Make the most of your super as part of your long-term plan.' },
  platforms: { title: 'Platform Comparison: AU, US & BR', file: '/files/premium_content/13-australian-platform-comparison.html',        description: 'Which platforms are worth using — and which to avoid.' },
  zoom:      { title: 'Zoom Call Preparation',             file: '/files/premium_content/09-zoom-call-preparation.html',                 description: 'Make the most of your included support call.' },
  references:{ title: 'Research & Tools Library',          file: '/files/premium_content/10-research-sources.html',                     description: 'The full library of trusted sources and analysis tools.' },
  glossary:  { title: 'Glossary of Investing Terms',       file: '/files/premium_content/14-glossary-60-key-terms.html',                description: '60 key terms explained in plain English.' },
};

const GUIDE_ORDER = [
  'guides', 'dca', 'firsttrade', 'exchange', 'inflation', 'sentiment', 'panicsell',
  'bitcoin', 'crypto', 'tools', 'cycles', 'books', 'tax', 'super', 'platforms',
  'zoom', 'references', 'glossary',
];

const TOTAL_GUIDES = GUIDE_ORDER.length;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function MemberHomeClient({ firstName, plan, isPro, memberSince }: Props) {
  const [readGuides, setReadGuides] = useState<string[]>([]);
  const [lastGuideKey, setLastGuideKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('pv_read_guides');
      const parsed: string[] = raw ? JSON.parse(raw) : [];
      setReadGuides(Array.isArray(parsed) ? parsed.filter(k => k !== 'welcome') : []);
    } catch { setReadGuides([]); }
    try {
      setLastGuideKey(localStorage.getItem('pv_last_guide'));
    } catch { /* ignore */ }
  }, []);

  const readCount = readGuides.length;
  const progressPct = Math.round((readCount / TOTAL_GUIDES) * 100);

  const lastGuide = lastGuideKey ? GUIDE_META[lastGuideKey] : null;

  const nextGuideKey = GUIDE_ORDER.find(k => !readGuides.includes(k)) ?? null;
  const nextGuide = nextGuideKey ? GUIDE_META[nextGuideKey] : null;

  const hubHref = '/index.html?member_session=1#member';

  return (
    <div className="portfolio-main mh-main">

      {/* ── Hero ── */}
      <div className="mh-hero">
        <div className="mh-hero-text">
          <p className="mh-greeting">{getGreeting()}{firstName ? `, ${firstName}` : ''}.</p>
          <h1 className="mh-headline">Continue building your financial future.</h1>
          <div className="mh-hero-meta">
            <span className={`mh-plan-badge ${plan === 'pro' ? 'mh-badge-pro' : 'mh-badge-premium'}`}>
              {plan === 'pro' ? '◈ Pro' : '◈ Premium'}
            </span>
            <span className="mh-hero-since">Member since {memberSince}</span>
          </div>
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="mh-stats-row">
        <div className="mh-stat-card">
          <span className="mh-stat-value">{mounted ? readCount : '—'}</span>
          <span className="mh-stat-label">Guides read</span>
        </div>
        <div className="mh-stat-card">
          <span className="mh-stat-value">{mounted ? `${progressPct}%` : '—'}</span>
          <span className="mh-stat-label">Learning progress</span>
        </div>
        <div className="mh-stat-card">
          <span className="mh-stat-value">{TOTAL_GUIDES}</span>
          <span className="mh-stat-label">Total guides</span>
        </div>
        {isPro && (
          <div className="mh-stat-card mh-stat-link" onClick={() => window.location.href = '/portfolio'} role="button" tabIndex={0}>
            <span className="mh-stat-value mh-stat-arrow">→</span>
            <span className="mh-stat-label">View portfolio</span>
          </div>
        )}
      </div>

      {/* ── Learning row ── */}
      <div className="mh-two-col">

        {/* Continue learning */}
        <div className="mh-card mh-continue-card">
          <p className="mh-card-eyebrow">Continue learning</p>
          {!mounted ? (
            <div className="mh-skeleton mh-skeleton-block" />
          ) : lastGuide ? (
            <>
              <h2 className="mh-card-title">{lastGuide.title}</h2>
              <p className="mh-card-body">{lastGuide.description}</p>
              <a href={lastGuide.file} className="mh-btn-primary">Continue reading →</a>
            </>
          ) : (
            <>
              <h2 className="mh-card-title">Start your first guide</h2>
              <p className="mh-card-body">Open the Investment Paths Guide to begin building your investing foundation.</p>
              <a href={GUIDE_META.guides.file} className="mh-btn-primary">Start reading →</a>
            </>
          )}
        </div>

        {/* Progress */}
        <div className="mh-card">
          <p className="mh-card-eyebrow">Learning progress</p>
          <div className="mh-progress-header">
            <span className="mh-progress-count">{mounted ? readCount : '—'} of {TOTAL_GUIDES} guides</span>
            <span className="mh-progress-pct">{mounted ? `${progressPct}%` : ''}</span>
          </div>
          <div className="mh-progress-track">
            <div className="mh-progress-fill" style={{ width: mounted ? `${progressPct}%` : '0%' }} />
          </div>
          {mounted && readCount > 0 && (
            <p className="mh-progress-msg">
              {readCount < 3 ? "You're ahead of most beginners." :
               readCount < 7 ? "Real progress — keep going." :
               readCount < 13 ? "You're building a solid foundation." :
               "Strong financial clarity — keep it up."}
            </p>
          )}
          <a href={hubHref} className="mh-link-secondary">View all guides →</a>
        </div>
      </div>

      {/* ── Recommended next ── */}
      {nextGuide && (
        <div className="mh-card mh-recommended-card">
          <p className="mh-card-eyebrow">Recommended next</p>
          <div className="mh-recommended-inner">
            <div>
              <h2 className="mh-card-title">{nextGuide.title}</h2>
              <p className="mh-card-body">{nextGuide.description}</p>
            </div>
            <a href={nextGuide.file} className="mh-btn-outline">Start guide →</a>
          </div>
        </div>
      )}

      {/* ── Portfolio snapshot (Pro only) ── */}
      {isPro ? (
        <div className="mh-card mh-portfolio-card">
          <p className="mh-card-eyebrow">Portfolio</p>
          <h2 className="mh-card-title">Your investment portfolio</h2>
          <p className="mh-card-body">Track your assets, view projections, and get insights tailored to your holdings.</p>
          <div className="mh-portfolio-actions">
            <a href="/portfolio" className="mh-btn-primary">Open portfolio →</a>
            <a href="/portfolio?view=projections" className="mh-btn-outline">Future projections</a>
          </div>
        </div>
      ) : (
        <div className="mh-card mh-upgrade-card">
          <div className="mh-upgrade-inner">
            <div>
              <p className="mh-card-eyebrow">Pro feature</p>
              <h2 className="mh-card-title">Portfolio tracker & dashboard</h2>
              <p className="mh-card-body">Upgrade to Pro to track your investments, run projections, and get personalised insights.</p>
            </div>
            <a href="/dashboard?upgrade=pro" className="mh-btn-upgrade">Upgrade to Pro →</a>
          </div>
        </div>
      )}

      {/* ── Support ── */}
      <div className="mh-card mh-support-card">
        <p className="mh-card-eyebrow">Support</p>
        <h2 className="mh-card-title">Need guidance?</h2>
        <p className="mh-card-body">Your plan includes a Zoom support call. Use it to get personalised advice on your investing journey.</p>
        <div className="mh-support-actions">
          <a href={GUIDE_META.zoom.file} className="mh-btn-outline">Prepare for your call →</a>
          <a href="mailto:support@plainvest.app" className="mh-link-secondary">support@plainvest.app</a>
        </div>
      </div>

    </div>
  );
}
