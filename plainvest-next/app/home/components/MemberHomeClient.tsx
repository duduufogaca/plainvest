'use client';

import { useEffect, useState } from 'react';
import { GUIDE_META, GUIDE_ORDER, TOTAL_GUIDES, getGuideI18n } from '@/lib/guide-meta';
import posthog from 'posthog-js';

type Props = {
  firstName: string;
  fullName: string;
  plan: string;
  isPro: boolean;
  memberSince: string;
  lang: 'en' | 'pt';
  displayCurrency: string;
};

function getGreeting(lang: 'en' | 'pt') {
  const h = new Date().getHours();
  if (lang === 'pt') {
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const T = {
  en: {
    headline:         'Continue building your financial future.',
    proBadge:         '◈ Pro Member',
    premiumBadge:     '◈ Premium Member',
    memberSince:      'Member since',
    guidesComplete:   (n: number, tot: number, p: number) => `${n} of ${tot} guides complete · ${p}%`,
    nextUp:           'Next up',
    scoreLabel:       'Financial Foundation Score',
    scoreNext:        (pts: number, text: string) => `+${pts} pts → ${text}`,
    guidesRead:       'Guides read',
    learningProgress: 'Learning progress',
    guidesAvailable:  'Guides available',
    memberSinceStat:  'Member since',
    continueLearning: 'Continue learning',
    startFirstTitle:  'Start your first guide',
    startFirstBody:   'Open the Investment Paths Guide to begin building your investing foundation.',
    continueBtn:      'Continue reading →',
    startBtn:         'Start reading →',
    progressEyebrow:  'Learning progress',
    guideCount:       (n: number, tot: number) => `${n} of ${tot} guides`,
    viewAll:          (tot: number) => `View all ${tot} guides →`,
    progressMsgs:     ["You're ahead of most beginners.", "Real progress — keep going.", "You're building a solid foundation.", "Strong financial clarity — keep it up."],
    recNext:          'Recommended next',
    whyGuide:         'Why this guide?',
    startLearning:    'Start learning →',
    achievements:     'Achievements',
    achieveEmpty:     'Complete your first guide to earn your first achievement.',
    achieveList: [
      { title: 'First Step',          desc: 'Completed your first guide'   },
      { title: 'Building Momentum',   desc: '5 guides completed'           },
      { title: 'Halfway There',       desc: '9 of 19 guides completed'     },
      { title: 'Knowledge Complete',  desc: 'All 19 guides completed'      },
      { title: 'Portfolio Builder',   desc: 'Added your first investment'  },
      { title: 'Future Thinker',      desc: 'Ran a future projection'      },
    ],
    portfolioEyebrow: 'Portfolio',
    portfolioTitle:   'Your investment portfolio',
    portfolioBody:    'Track your assets, view projections, and get insights tailored to your holdings.',
    openPortfolio:    'Open portfolio →',
    futureProj:       'Future projections',
    proEyebrow:       'Pro feature',
    proTitle:         'Portfolio tracker & projections',
    proBody:          'Upgrade to unlock:',
    proFeatures:      ['Portfolio tracking & allocations', 'Future projections & compound growth', 'Allocation analysis', 'Performance metrics'],
    upgradeBtn:       'Upgrade to Pro →',
    supportEyebrow:   'Need personal guidance?',
    supportTitle:     'Your membership includes a support session.',
    supportBody:      'Use it for:',
    supportItems:     ['Portfolio questions & strategy reviews', 'Platform walkthroughs & setup help', 'Building your personal learning roadmap', 'Any investing question on your mind'],
    prepareCall:      'Prepare for my call →',
    scoreNextAction:  (title: string, pts: number) => `Complete "${title}" (+${pts} pts)`,
  },
  pt: {
    headline:         'Continue construindo seu futuro financeiro.',
    proBadge:         '◈ Membro Pro',
    premiumBadge:     '◈ Membro Premium',
    memberSince:      'Membro desde',
    guidesComplete:   (n: number, tot: number, p: number) => `${n} de ${tot} guias concluídos · ${p}%`,
    nextUp:           'Próximo',
    scoreLabel:       'Pontuação de Fundação',
    scoreNext:        (pts: number, text: string) => `+${pts} pts → ${text}`,
    guidesRead:       'Guias lidos',
    learningProgress: 'Progresso',
    guidesAvailable:  'Guias disponíveis',
    memberSinceStat:  'Membro desde',
    continueLearning: 'Continuar aprendendo',
    startFirstTitle:  'Comece seu primeiro guia',
    startFirstBody:   'Abra o Guia de Caminhos de Investimento para começar sua jornada.',
    continueBtn:      'Continuar lendo →',
    startBtn:         'Começar a ler →',
    progressEyebrow:  'Progresso de aprendizado',
    guideCount:       (n: number, tot: number) => `${n} de ${tot} guias`,
    viewAll:          (tot: number) => `Ver todos os ${tot} guias →`,
    progressMsgs:     ['Você está à frente da maioria dos iniciantes.', 'Progresso real — continue assim.', 'Você está construindo uma base sólida.', 'Clareza financeira forte — continue assim.'],
    recNext:          'Recomendado a seguir',
    whyGuide:         'Por que este guia?',
    startLearning:    'Começar a aprender →',
    achievements:     'Conquistas',
    achieveEmpty:     'Complete seu primeiro guia para ganhar sua primeira conquista.',
    achieveList: [
      { title: 'Primeiro Passo',          desc: 'Concluiu seu primeiro guia'        },
      { title: 'Ganhando Ritmo',          desc: '5 guias concluídos'                },
      { title: 'Metade do Caminho',       desc: '9 de 19 guias concluídos'          },
      { title: 'Conhecimento Completo',   desc: 'Todos os 19 guias concluídos'      },
      { title: 'Construtor de Portfólio', desc: 'Adicionou seu primeiro investimento'},
      { title: 'Pensador do Futuro',      desc: 'Executou uma projeção futura'      },
    ],
    portfolioEyebrow: 'Portfólio',
    portfolioTitle:   'Seu portfólio de investimentos',
    portfolioBody:    'Acompanhe seus ativos, veja projeções e obtenha insights personalizados.',
    openPortfolio:    'Abrir portfólio →',
    futureProj:       'Projeções futuras',
    proEyebrow:       'Recurso Pro',
    proTitle:         'Rastreador de portfólio e projeções',
    proBody:          'Faça upgrade para desbloquear:',
    proFeatures:      ['Rastreamento de portfólio e alocações', 'Projeções futuras e crescimento composto', 'Análise de alocação', 'Métricas de desempenho'],
    upgradeBtn:       'Fazer upgrade para Pro →',
    supportEyebrow:   'Precisa de orientação pessoal?',
    supportTitle:     'Sua assinatura inclui uma sessão de suporte.',
    supportBody:      'Use para:',
    supportItems:     ['Dúvidas sobre portfólio e estratégia', 'Configuração de plataforma passo a passo', 'Criação do seu roteiro de aprendizado', 'Qualquer dúvida sobre investimentos'],
    prepareCall:      'Preparar minha sessão →',
    scoreNextAction:  (title: string, pts: number) => `Concluir "${title}" (+${pts} pts)`,
  },
};

const ROADMAP_KEYS = ['guides', 'dca', 'firsttrade', 'exchange'];

export function MemberHomeClient({ firstName, fullName, plan, isPro, memberSince, lang, displayCurrency }: Props) {
  const [readGuides, setReadGuides]       = useState<string[]>([]);
  const [lastGuideKey, setLastGuideKey]   = useState<string | null>(null);
  const [hasPortfolio, setHasPortfolio]   = useState(false);
  const [hasProjection, setHasProjection] = useState(false);
  const [mounted, setMounted]             = useState(false);

  useEffect(() => {
    setMounted(true);
    function sync() {
      try {
        const raw = localStorage.getItem('pv_read_guides');
        const parsed: string[] = raw ? JSON.parse(raw) : [];
        setReadGuides(Array.isArray(parsed) ? parsed.filter(k => k !== 'welcome') : []);
      } catch { setReadGuides([]); }
      try { setLastGuideKey(localStorage.getItem('pv_last_guide')); } catch { /* */ }
      try { setHasPortfolio(localStorage.getItem('pv_portfolio_created') === '1'); } catch { /* */ }
      try { setHasProjection(localStorage.getItem('pv_projection_run') === '1'); } catch { /* */ }
    }
    sync();
    window.addEventListener('pageshow', sync);          // re-read when returning from a guide (incl. bfcache)
    document.addEventListener('visibilitychange', sync);
    return () => { window.removeEventListener('pageshow', sync); document.removeEventListener('visibilitychange', sync); };
  }, []);

  const t = T[lang];

  const readCount   = readGuides.length;
  const progressPct = Math.round((readCount / TOTAL_GUIDES) * 100);
  const lastGuide   = lastGuideKey ? GUIDE_META[lastGuideKey] : null;
  const nextGuideKey = GUIDE_ORDER.find(k => !readGuides.includes(k)) ?? null;
  const nextGuide    = nextGuideKey ? GUIDE_META[nextGuideKey] : null;

  // Foundation Score
  const guideScore      = Math.round((readCount / TOTAL_GUIDES) * 55);
  const portfolioScore  = hasPortfolio ? 20 : 0;
  const projectionScore = hasProjection ? 15 : 0;
  const profileScore    = fullName ? 10 : 0;
  const foundationScore = guideScore + portfolioScore + projectionScore + profileScore;

  const R            = 44;
  const circumference = 2 * Math.PI * R;
  const dashOffset    = circumference - (foundationScore / 100) * circumference;

  const nextScoreText = nextGuide
    ? t.scoreNextAction(nextGuide.title, Math.max(3, Math.round(55 / TOTAL_GUIDES)))
    : null;

  const hubHref = '/index.html?member_session=1#member';

  const difficultyLabel = (d: string) =>
    lang === 'pt' ? (d === 'Beginner' ? 'Iniciante' : 'Intermediário') : d;

  return (
    <div className="portfolio-main mh-main">

      {/* ── Hero ── */}
      <div className="mh-hero">
        <div className="mh-hero-left">
          <p className="mh-greeting">{getGreeting(lang)}{firstName ? `, ${firstName}` : ''}.</p>
          <h1 className="mh-headline">{t.headline}</h1>
          <div className="mh-hero-meta">
            <span className={`mh-plan-badge ${plan === 'pro' ? 'mh-badge-pro' : 'mh-badge-premium'}`}>
              {plan === 'pro' ? t.proBadge : t.premiumBadge}
            </span>
            <span className="mh-hero-since">{t.memberSince} {memberSince}</span>
          </div>
          <div className="mh-hero-progress-wrap">
            <div className="mh-hero-progress-track">
              <div className="mh-hero-progress-fill" style={{ width: mounted ? `${progressPct}%` : '0%' }} />
            </div>
            <span className="mh-hero-progress-label">
              {t.guidesComplete(mounted ? readCount : 0, TOTAL_GUIDES, mounted ? progressPct : 0)}
            </span>
          </div>
          {nextGuide && nextGuideKey && (
            <a href={nextGuide.file} className="mh-hero-next-hint">
              {t.nextUp}: {getGuideI18n(nextGuideKey, lang).title} →
            </a>
          )}
        </div>

        <div className="mh-hero-score">
          <svg className="mh-score-svg" viewBox="0 0 100 100" width="100" height="100">
            <circle cx="50" cy="50" r={R} stroke="rgba(255,255,255,.06)" strokeWidth="8" fill="none" />
            <circle
              cx="50" cy="50" r={R}
              stroke="#3fa9f5" strokeWidth="8" fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={mounted ? dashOffset : circumference}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset .6s ease' }}
            />
            <text x="50" y="46" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" fontFamily="inherit">
              {mounted ? foundationScore : 0}
            </text>
            <text x="50" y="62" textAnchor="middle" fill="#4a6a88" fontSize="11" fontFamily="inherit">/100</text>
          </svg>
          <p className="mh-score-label">{t.scoreLabel}</p>
          {nextScoreText && (
            <p className="mh-score-next">{t.scoreNext(Math.max(3, Math.round(55 / TOTAL_GUIDES)), nextScoreText)}</p>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="mh-stats-row">
        <div className="mh-stat-card">
          <span className="mh-stat-value">{mounted ? readCount : '—'}</span>
          <span className="mh-stat-label">{t.guidesRead}</span>
        </div>
        <div className="mh-stat-card">
          <span className="mh-stat-value">{mounted ? `${progressPct}%` : '—'}</span>
          <span className="mh-stat-label">{t.learningProgress}</span>
        </div>
        <div className="mh-stat-card">
          <span className="mh-stat-value">{TOTAL_GUIDES}</span>
          <span className="mh-stat-label">{t.guidesAvailable}</span>
        </div>
        <div className="mh-stat-card">
          <span className="mh-stat-value mh-stat-since">{memberSince}</span>
          <span className="mh-stat-label">{t.memberSinceStat}</span>
        </div>
      </div>

      {/* ── Learning row ── */}
      <div className="mh-two-col">

        <div className="mh-card mh-continue-card">
          <p className="mh-card-eyebrow">{t.continueLearning}</p>
          {!mounted ? (
            <div className="mh-skeleton mh-skeleton-block" />
          ) : lastGuide && lastGuideKey ? (
            <>
              <h2 className="mh-card-title">{getGuideI18n(lastGuideKey, lang).title}</h2>
              <p className="mh-card-body">{getGuideI18n(lastGuideKey, lang).description}</p>
              <div className="mh-guide-meta-row">
                <span className="mh-guide-chip">{lastGuide.readMins} min</span>
                <span className={`mh-guide-chip mh-chip-${lastGuide.difficulty.toLowerCase()}`}>
                  {difficultyLabel(lastGuide.difficulty)}
                </span>
              </div>
              <a href={lastGuide.file} className="mh-btn-primary">{t.continueBtn}</a>
            </>
          ) : (
            <>
              <h2 className="mh-card-title">{t.startFirstTitle}</h2>
              <p className="mh-card-body">{t.startFirstBody}</p>
              <div className="mh-guide-meta-row">
                <span className="mh-guide-chip">{GUIDE_META.guides.readMins} min</span>
                <span className="mh-guide-chip mh-chip-beginner">{difficultyLabel('Beginner')}</span>
              </div>
              <a href={GUIDE_META.guides.file} className="mh-btn-primary">{t.startBtn}</a>
            </>
          )}
        </div>

        <div className="mh-card">
          <p className="mh-card-eyebrow">{t.progressEyebrow}</p>
          <div className="mh-progress-header">
            <span className="mh-progress-count">{t.guideCount(mounted ? readCount : 0, TOTAL_GUIDES)}</span>
            <span className="mh-progress-pct">{mounted ? `${progressPct}%` : ''}</span>
          </div>
          <div className="mh-progress-track">
            <div className="mh-progress-fill" style={{ width: mounted ? `${progressPct}%` : '0%' }} />
          </div>
          {mounted && readCount > 0 && (
            <p className="mh-progress-msg">
              {readCount < 3 ? t.progressMsgs[0] :
               readCount < 7 ? t.progressMsgs[1] :
               readCount < 13 ? t.progressMsgs[2] :
               t.progressMsgs[3]}
            </p>
          )}
          <div className="mh-roadmap" id="mh-progress">
            {ROADMAP_KEYS.map((key, i) => {
              const done   = readGuides.includes(key);
              const isNext = !done && GUIDE_ORDER.find(k => !readGuides.includes(k)) === key;
              return (
                <div key={key} className={`mh-roadmap-item${done ? ' mh-roadmap-done' : isNext ? ' mh-roadmap-next' : ''}`}>
                  <span className="mh-roadmap-status">{done ? '✓' : isNext ? '→' : String(i + 1)}</span>
                  <span className="mh-roadmap-title">{getGuideI18n(key, lang).title}</span>
                </div>
              );
            })}
          </div>
          <a href={hubHref} className="mh-link-secondary">{t.viewAll(TOTAL_GUIDES)}</a>
        </div>
      </div>

      {/* ── Recommended next ── */}
      {nextGuide && (
        <div className="mh-card mh-recommended-card">
          <div className="mh-recommended-body">
            <div className="mh-recommended-left">
              <p className="mh-card-eyebrow">{t.recNext}</p>
              <h2 className="mh-rec-title">{nextGuideKey ? getGuideI18n(nextGuideKey, lang).title : nextGuide.title}</h2>
              <div className="mh-guide-meta-row">
                <span className="mh-guide-chip">{nextGuide.readMins} min</span>
                <span className={`mh-guide-chip mh-chip-${nextGuide.difficulty.toLowerCase()}`}>
                  {difficultyLabel(nextGuide.difficulty)}
                </span>
              </div>
              <div className="mh-rec-why">
                <p className="mh-rec-why-label">{t.whyGuide}</p>
                <p className="mh-rec-why-text">{nextGuideKey ? getGuideI18n(nextGuideKey, lang).why : nextGuide.why}</p>
              </div>
            </div>
            <div className="mh-recommended-right">
              <a href={nextGuide.file} className="mh-btn-primary mh-btn-lg">{t.startLearning}</a>
            </div>
          </div>
        </div>
      )}

      {/* ── Achievements ── */}
      <div className="mh-card mh-achievements-card">
        <p className="mh-card-eyebrow">{t.achievements}</p>
        <div className="mh-achievement-row">
          {t.achieveList.map((a, i) => {
            const checks = [
              readCount >= 1,
              readCount >= 5,
              readCount >= 9,
              readCount >= 19,
              hasPortfolio,
              hasProjection,
            ];
            const earned = mounted && checks[i];
            return (
              <div key={i} className={`mh-achievement${earned ? ' mh-achievement--earned' : ''}`}>
                <div className="mh-achievement-icon">{earned ? '★' : '○'}</div>
                <div className="mh-achievement-title">{a.title}</div>
                <div className="mh-achievement-desc">{a.desc}</div>
              </div>
            );
          })}
        </div>
        {mounted && readCount === 0 && (
          <p className="mh-achievements-empty">{t.achieveEmpty}</p>
        )}
      </div>

      {/* ── Portfolio ── */}
      {isPro ? (
        <div className="mh-card mh-portfolio-card">
          <p className="mh-card-eyebrow">{t.portfolioEyebrow}</p>
          <h2 className="mh-card-title">{t.portfolioTitle}</h2>
          <p className="mh-card-body">{t.portfolioBody}</p>
          <div className="mh-portfolio-actions">
            <a href="/portfolio" className="mh-btn-primary">{t.openPortfolio}</a>
            <a href="/portfolio?view=projections" className="mh-btn-outline">{t.futureProj}</a>
          </div>
        </div>
      ) : (
        <div className="mh-card mh-upgrade-card">
          <div className="mh-upgrade-inner">
            <div>
              <p className="mh-card-eyebrow">{t.proEyebrow}</p>
              <h2 className="mh-card-title">{t.proTitle}</h2>
              <p className="mh-card-body">{t.proBody}</p>
              <ul className="mh-upgrade-list">
                {t.proFeatures.map(f => (
                  <li key={f}><span className="mh-check">✓</span>{f}</li>
                ))}
              </ul>
            </div>
            <a href="/dashboard?upgrade=pro" className="mh-btn-upgrade" onClick={() => posthog.capture('upgrade_cta_clicked', { source: 'member_home' })}>{t.upgradeBtn}</a>
          </div>
        </div>
      )}

      {/* ── Support ── */}
      <div className="mh-card mh-support-card">
        <p className="mh-card-eyebrow">{t.supportEyebrow}</p>
        <h2 className="mh-card-title">{t.supportTitle}</h2>
        <p className="mh-card-body">{t.supportBody}</p>
        <ul className="mh-support-list">
          {t.supportItems.map(item => (
            <li key={item}><span className="mh-check">✓</span>{item}</li>
          ))}
        </ul>
        <div className="mh-support-actions">
          <a href={GUIDE_META.zoom.file} className="mh-btn-primary">{t.prepareCall}</a>
          <a href="mailto:hello@plainvest.app" className="mh-link-secondary">hello@plainvest.app</a>
        </div>
      </div>

    </div>
  );
}
