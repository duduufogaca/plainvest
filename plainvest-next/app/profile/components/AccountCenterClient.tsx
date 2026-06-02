'use client';

import { useEffect, useState } from 'react';
import { updateProfile, changePassword, savePreferences } from '../../actions/profile';
import { signOut } from '../../actions/auth';
import { SubmitButton } from '../../components/submit-button';
import { PasswordInput } from '../../components/password-input';
import { GUIDE_META, GUIDE_ORDER, TOTAL_GUIDES, getGuideI18n } from '@/lib/guide-meta';

type Props = {
  firstName: string;
  fullName: string;
  email: string;
  joinDate: string;
  memberSince: string;
  memberSinceShort: string;
  dateOfBirth: string;
  gender: string;
  isPro: boolean;
  isPremium: boolean;
  plan: string;
  initial: string;
  savedLang: 'en' | 'pt';
  savedCurrency: 'AUD' | 'USD' | 'BRL';
  message?: string;
  success?: string;
};

const T = {
  en: {
    eyebrow:          'Account Center',
    scoreLabel:       'Financial Foundation Score',
    scoreBreakdown:   ['Guides', 'Portfolio', 'Projections', 'Profile'],
    journeyEyebrow:   'Your journey',
    journeyTitle:     'Plainvest milestones',
    journeyItems: [
      'Account created',
      'Premium membership activated',
      'First guide completed',
      'Portfolio created',
      'Future projections run',
      'Learning path completed',
    ],
    journeyDone:      'Completed',
    journeyPending:   'Not yet',
    membershipEyebrow:'Membership',
    membershipProTitle: 'Pro Member',
    membershipPremTitle:'Premium Member',
    statusKeys: {
      plan:        'Plan',
      status:      'Status',
      since:       'Member since',
      guides:      'Guides available',
      support:     'Support session',
      portfolio:   'Portfolio dashboard',
      billing:     'Billing',
    },
    statusVals: {
      active:      'Active ✓',
      unlocked:    'Unlocked ✓',
      proOnly:     'Pro only',
      included:    '1 included',
      billingPro:  'AUD $9.90 / month',
      billingPrem: 'One-time purchase',
    },
    upgradeBtn:       'Upgrade to Pro →',
    manageBilling:    'Manage subscription',
    manageBillingDesc:'Update your payment method, view invoices, or cancel your subscription anytime.',
    learnEyebrow:     'Learning summary',
    learnTitle:       'Your education progress',
    learnComplete:    'Complete',
    learnGuides:      'Guides',
    learnStartWith:   'Start with',
    learnNextGuide:   'Next guide',
    learnDone:        'All guides completed. Excellent work.',
    continueBtn:      'Continue learning →',
    startBtn:         'Start learning →',
    viewAllBtn:       'View all guides',
    supportEyebrow:   'Support center',
    supportTitle:     'Your included support session',
    supportBadge:     '1 session · Unused',
    supportBody:      'Use your included session for:',
    supportItems: [
      'Portfolio questions & strategy reviews',
      'Platform walkthroughs & setup help',
      'Building your personal learning roadmap',
      'Any investing question on your mind',
    ],
    prepareBtn:       'Prepare my session →',
    achieveEyebrow:   'Achievements',
    achieveTitle:     'Your milestones',
    achieveEmpty:     'Complete your first guide to earn your first achievement.',
    achieveList: [
      { title: 'First Step',          desc: 'Completed your first guide'    },
      { title: 'Building Momentum',   desc: '5 guides completed'            },
      { title: 'Halfway There',       desc: '9 of 19 guides completed'      },
      { title: 'Knowledge Complete',  desc: 'All 19 guides completed'       },
      { title: 'Portfolio Builder',   desc: 'Added your first investment'   },
      { title: 'Future Thinker',      desc: 'Ran a future projection'       },
    ],
    personalEyebrow:  'Personal info',
    personalTitle:    'Your details',
    labelFullName:    'Full name',
    placeholderName:  'Your full name',
    labelDob:         'Date of birth',
    labelGender:      'Gender',
    genderOptions:    [{ value: '', label: 'Prefer not to say' }, { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }],
    labelEmail:       'Email address',
    emailNote:        'Email cannot be changed here',
    saveChanges:      'Save changes',
    savingChanges:    'Saving…',
    securityEyebrow:  'Security',
    securityTitle:    'Account security',
    securityStrong:   'Strong',
    securityChecks: [
      { label: 'Password set',       ok: true  },
      { label: 'Email verified',     ok: true  },
      { label: 'Account active',     ok: true  },
      { label: 'Two-factor authentication', ok: false, soon: true },
    ],
    passwordLabel:    'Password',
    passwordDesc:     'Change your account password',
    changeBtn:        'Change',
    cancelBtn:        'Cancel',
    newPassword:      'New password',
    confirmPassword:  'Confirm new password',
    updatePassword:   'Update password',
    updatingPassword: 'Updating…',
    guidesEyebrow:    'Learning journey',
    guidesTitle:      'All guides',
    guidesOf:         (n: number, tot: number) => `${n} of ${tot} completed`,
    showAll:          (tot: number) => `Show all ${tot} guides`,
    showLess:         'Show less',
    prefsEyebrow:     'Preferences',
    prefsTitle:       'Display settings',
    langLabel:        'Language',
    currencyLabel:    'Display currency',
    savePrefs:        'Save preferences',
    savingPrefs:      'Saving…',
    prefsNote:        'Applied across the entire member hub.',
    signOut:          'Sign out of Plainvest',
    signingOut:       'Signing out…',
    difficulty:       { Beginner: 'Beginner', Intermediate: 'Intermediate' },
    soonTag:          'Soon',
  },
  pt: {
    eyebrow:          'Central da Conta',
    scoreLabel:       'Pontuação de Fundação',
    scoreBreakdown:   ['Guias', 'Portfólio', 'Projeções', 'Perfil'],
    journeyEyebrow:   'Sua jornada',
    journeyTitle:     'Marcos na Plainvest',
    journeyItems: [
      'Conta criada',
      'Assinatura Premium ativada',
      'Primeiro guia concluído',
      'Portfólio criado',
      'Projeções futuras executadas',
      'Trilha de aprendizado concluída',
    ],
    journeyDone:      'Concluído',
    journeyPending:   'Ainda não',
    membershipEyebrow:'Assinatura',
    membershipProTitle: 'Membro Pro',
    membershipPremTitle:'Membro Premium',
    statusKeys: {
      plan:        'Plano',
      status:      'Status',
      since:       'Membro desde',
      guides:      'Guias disponíveis',
      support:     'Sessão de suporte',
      portfolio:   'Painel de portfólio',
      billing:     'Cobrança',
    },
    statusVals: {
      active:      'Ativo ✓',
      unlocked:    'Desbloqueado ✓',
      proOnly:     'Apenas Pro',
      included:    '1 incluída',
      billingPro:  'AUD $9,90 / mês',
      billingPrem: 'Compra única',
    },
    upgradeBtn:       'Fazer upgrade para Pro →',
    manageBilling:    'Gerenciar assinatura',
    manageBillingDesc:'Atualize sua forma de pagamento, veja faturas ou cancele sua assinatura quando quiser.',
    learnEyebrow:     'Resumo de aprendizado',
    learnTitle:       'Seu progresso educacional',
    learnComplete:    'Concluído',
    learnGuides:      'Guias',
    learnStartWith:   'Comece com',
    learnNextGuide:   'Próximo guia',
    learnDone:        'Todos os guias concluídos. Excelente trabalho.',
    continueBtn:      'Continuar aprendendo →',
    startBtn:         'Começar a aprender →',
    viewAllBtn:       'Ver todos os guias',
    supportEyebrow:   'Central de suporte',
    supportTitle:     'Sua sessão de suporte incluída',
    supportBadge:     '1 sessão · Não utilizada',
    supportBody:      'Use sua sessão incluída para:',
    supportItems: [
      'Dúvidas sobre portfólio e estratégia',
      'Configuração de plataforma passo a passo',
      'Criação do seu roteiro de aprendizado',
      'Qualquer dúvida sobre investimentos',
    ],
    prepareBtn:       'Preparar minha sessão →',
    achieveEyebrow:   'Conquistas',
    achieveTitle:     'Seus marcos',
    achieveEmpty:     'Complete seu primeiro guia para ganhar sua primeira conquista.',
    achieveList: [
      { title: 'Primeiro Passo',          desc: 'Concluiu seu primeiro guia'        },
      { title: 'Ganhando Ritmo',          desc: '5 guias concluídos'                },
      { title: 'Metade do Caminho',       desc: '9 de 19 guias concluídos'          },
      { title: 'Conhecimento Completo',   desc: 'Todos os 19 guias concluídos'      },
      { title: 'Construtor de Portfólio', desc: 'Adicionou seu primeiro investimento'},
      { title: 'Pensador do Futuro',      desc: 'Executou uma projeção futura'      },
    ],
    personalEyebrow:  'Informações pessoais',
    personalTitle:    'Seus dados',
    labelFullName:    'Nome completo',
    placeholderName:  'Seu nome completo',
    labelDob:         'Data de nascimento',
    labelGender:      'Gênero',
    genderOptions:    [{ value: '', label: 'Prefiro não informar' }, { value: 'male', label: 'Masculino' }, { value: 'female', label: 'Feminino' }],
    labelEmail:       'Endereço de e-mail',
    emailNote:        'O e-mail não pode ser alterado aqui',
    saveChanges:      'Salvar alterações',
    savingChanges:    'Salvando…',
    securityEyebrow:  'Segurança',
    securityTitle:    'Segurança da conta',
    securityStrong:   'Forte',
    securityChecks: [
      { label: 'Senha definida',         ok: true  },
      { label: 'E-mail verificado',      ok: true  },
      { label: 'Conta ativa',            ok: true  },
      { label: 'Autenticação em dois fatores', ok: false, soon: true },
    ],
    passwordLabel:    'Senha',
    passwordDesc:     'Alterar sua senha',
    changeBtn:        'Alterar',
    cancelBtn:        'Cancelar',
    newPassword:      'Nova senha',
    confirmPassword:  'Confirmar nova senha',
    updatePassword:   'Atualizar senha',
    updatingPassword: 'Atualizando…',
    guidesEyebrow:    'Jornada de aprendizado',
    guidesTitle:      'Todos os guias',
    guidesOf:         (n: number, tot: number) => `${n} de ${tot} concluídos`,
    showAll:          (tot: number) => `Ver todos os ${tot} guias`,
    showLess:         'Ver menos',
    prefsEyebrow:     'Preferências',
    prefsTitle:       'Configurações de exibição',
    langLabel:        'Idioma',
    currencyLabel:    'Moeda de exibição',
    savePrefs:        'Salvar preferências',
    savingPrefs:      'Salvando…',
    prefsNote:        'Aplicado em todo o hub de membros.',
    signOut:          'Sair da Plainvest',
    signingOut:       'Saindo…',
    difficulty:       { Beginner: 'Iniciante', Intermediate: 'Intermediário' },
    soonTag:          'Em breve',
  },
};

const PREVIEW_GUIDES = 8;

export function AccountCenterClient({
  firstName, fullName, email, joinDate, memberSince, memberSinceShort,
  dateOfBirth, gender, isPro, isPremium, plan, initial,
  savedLang, savedCurrency,
  message, success,
}: Props) {
  const [readGuides, setReadGuides]         = useState<string[]>([]);
  const [lastGuideKey, setLastGuideKey]     = useState<string | null>(null);
  const [hasPortfolio, setHasPortfolio]     = useState(false);
  const [hasProjection, setHasProjection]   = useState(false);
  const [prefLang, setPrefLang]             = useState<'en' | 'pt'>(savedLang);
  const [prefCurrency, setPrefCurrency]     = useState<'AUD' | 'USD' | 'BRL'>(savedCurrency);
  const [mounted, setMounted]               = useState(false);
  const [showAllGuides, setShowAllGuides]   = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('pv_read_guides');
      const parsed: string[] = raw ? JSON.parse(raw) : [];
      setReadGuides(Array.isArray(parsed) ? parsed.filter(k => k !== 'welcome') : []);
    } catch { setReadGuides([]); }
    try { setLastGuideKey(localStorage.getItem('pv_last_guide')); } catch { /* */ }
    try { setHasPortfolio(localStorage.getItem('pv_portfolio_created') === '1'); } catch { /* */ }
    try { setHasProjection(localStorage.getItem('pv_projection_run') === '1'); } catch { /* */ }
  }, []);

  // Use the SAVED lang for all page labels (not the in-progress selection)
  const t = T[savedLang];

  const readCount    = readGuides.length;
  const progressPct  = Math.round((readCount / TOTAL_GUIDES) * 100);
  const lastGuide    = lastGuideKey ? GUIDE_META[lastGuideKey] : null;
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

  const visibleGuides = showAllGuides ? GUIDE_ORDER : GUIDE_ORDER.slice(0, PREVIEW_GUIDES);

  const joinDateFormatted = new Date(joinDate).toLocaleDateString(savedLang === 'pt' ? 'pt-BR' : 'en-AU', { month: 'long', year: 'numeric' });

  const journeyMilestones = [
    { done: true,                    date: joinDateFormatted },
    { done: isPremium,               date: isPremium ? memberSinceShort : undefined },
    { done: readCount >= 1,          date: readCount >= 1 ? t.journeyDone : undefined },
    { done: hasPortfolio,            date: hasPortfolio ? t.journeyDone : undefined },
    { done: hasProjection,           date: hasProjection ? t.journeyDone : undefined },
    { done: readCount >= TOTAL_GUIDES, date: readCount >= TOTAL_GUIDES ? t.journeyDone : undefined },
  ];

  const CURRENCIES: Array<'AUD' | 'USD' | 'BRL'> = ['AUD', 'USD', 'BRL'];

  return (
    <div className="ac-main">

      {success && <div className="notice notice-success" style={{ marginBottom: '1.25rem' }}>{success}</div>}
      {message  && <div className="notice"               style={{ marginBottom: '1.25rem' }}>{message}</div>}

      {/* ── HERO ── */}
      <div className="ac-hero ac-hero-v2">
        <div className="ac-hero-left">
          <div className="ac-avatar">{initial}</div>
          <div className="ac-hero-identity-text">
            <p className="ac-eyebrow">{t.eyebrow}</p>
            <h1 className="ac-hero-name">{fullName || firstName || email}</h1>
            <div className="ac-hero-meta">
              <span className={`ac-plan-badge ${plan === 'pro' ? 'ac-badge-pro' : 'ac-badge-premium'}`}>
                {plan === 'pro' ? `◈ ${t.membershipProTitle}` : `◈ ${t.membershipPremTitle}`}
              </span>
              <span className="ac-hero-since">{t.statusKeys.since} {memberSinceShort}</span>
            </div>
            <div className="ac-hero-progress-wrap">
              <div className="ac-hero-progress-track">
                <div className="ac-hero-progress-fill" style={{ width: mounted ? `${progressPct}%` : '0%' }} />
              </div>
              <span className="ac-hero-progress-label">
                {mounted ? `${readCount} / ${TOTAL_GUIDES} ${t.learnGuides.toLowerCase()} · ${progressPct}%` : `0 / ${TOTAL_GUIDES} · 0%`}
              </span>
            </div>
            {mounted && lastGuide && lastGuideKey && (
              <p className="ac-hero-last-guide">
                {t.learnNextGuide}: <a href={lastGuide.file} className="ac-hero-last-link">{getGuideI18n(lastGuideKey, savedLang).title}</a>
              </p>
            )}
          </div>
        </div>

        <div className="ac-hero-score">
          <svg className="ac-score-svg" viewBox="0 0 100 100" width="96" height="96">
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
            <text x="50" y="46" textAnchor="middle" fill="white" fontSize="19" fontWeight="700" fontFamily="inherit">
              {mounted ? foundationScore : 0}
            </text>
            <text x="50" y="61" textAnchor="middle" fill="#4a6a88" fontSize="11" fontFamily="inherit">/100</text>
          </svg>
          <p className="ac-score-label">{t.scoreLabel}</p>
          <div className="ac-score-breakdown">
            {t.scoreBreakdown.map((label, i) => {
              const scores = [guideScore, portfolioScore, projectionScore, profileScore];
              return (
                <span key={label} className="ac-score-part">
                  <span>{scores[i]}</span>{label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── YOUR JOURNEY ── */}
      <div className="ac-card ac-journey-card">
        <p className="ac-card-eyebrow">{t.journeyEyebrow}</p>
        <h2 className="ac-card-title">{t.journeyTitle}</h2>
        <div className="ac-journey-list">
          {journeyMilestones.map((m, i) => (
            <div key={i} className={`ac-journey-item${m.done ? ' ac-journey-done' : ''}`}>
              <div className="ac-journey-dot-wrap">
                <div className={`ac-journey-dot${m.done ? ' ac-journey-dot-done' : ''}`}>{m.done ? '✓' : '○'}</div>
                {i < journeyMilestones.length - 1 && <div className={`ac-journey-line${m.done ? ' ac-journey-line-done' : ''}`} />}
              </div>
              <div className="ac-journey-content">
                <span className="ac-journey-label">{t.journeyItems[i]}</span>
                {m.done && m.date && <span className="ac-journey-date">{m.date}</span>}
                {!m.done && <span className="ac-journey-pending">{t.journeyPending}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MEMBERSHIP + LEARNING ── */}
      <div className="ac-grid-two">

        <div className="ac-card ac-membership-card">
          <p className="ac-card-eyebrow">{t.membershipEyebrow}</p>
          <h2 className="ac-card-title">{plan === 'pro' ? t.membershipProTitle : t.membershipPremTitle}</h2>
          <div className="ac-status-grid">
            <div className="ac-status-item">
              <span className="ac-status-key">{t.statusKeys.plan}</span>
              <span className={`ac-status-val ${plan === 'pro' ? 'ac-status-pro' : 'ac-status-premium'}`}>
                {plan === 'pro' ? t.membershipProTitle : t.membershipPremTitle}
              </span>
            </div>
            <div className="ac-status-item">
              <span className="ac-status-key">{t.statusKeys.status}</span>
              <span className="ac-status-val ac-status-active">{t.statusVals.active}</span>
            </div>
            <div className="ac-status-item">
              <span className="ac-status-key">{t.statusKeys.since}</span>
              <span className="ac-status-val">{memberSinceShort}</span>
            </div>
            <div className="ac-status-item">
              <span className="ac-status-key">{t.statusKeys.guides}</span>
              <span className="ac-status-val">{TOTAL_GUIDES}</span>
            </div>
            <div className="ac-status-item">
              <span className="ac-status-key">{t.statusKeys.support}</span>
              <span className="ac-status-val ac-status-included">{t.statusVals.included}</span>
            </div>
            <div className="ac-status-item">
              <span className="ac-status-key">{t.statusKeys.portfolio}</span>
              <span className={`ac-status-val ${isPro ? 'ac-status-active' : 'ac-status-locked'}`}>
                {isPro ? t.statusVals.unlocked : t.statusVals.proOnly}
              </span>
            </div>
            <div className="ac-status-item">
              <span className="ac-status-key">{t.statusKeys.billing}</span>
              <span className="ac-status-val">{isPro ? t.statusVals.billingPro : t.statusVals.billingPrem}</span>
            </div>
          </div>
          {!isPro && <a href="/dashboard?upgrade=pro" className="ac-upgrade-btn">{t.upgradeBtn}</a>}
          {isPro && (
            <form action="/api/stripe/portal" method="POST" className="ac-billing-form">
              <button type="submit" className="ac-manage-billing-btn">{t.manageBilling}</button>
              <p className="ac-billing-note">{t.manageBillingDesc}</p>
            </form>
          )}
        </div>

        <div className="ac-card ac-learning-summary-card">
          <p className="ac-card-eyebrow">{t.learnEyebrow}</p>
          <h2 className="ac-card-title">{t.learnTitle}</h2>
          <div className="ac-learn-stat-row">
            <div className="ac-learn-stat">
              <span className="ac-learn-stat-val">{mounted ? progressPct : 0}%</span>
              <span className="ac-learn-stat-label">{t.learnComplete}</span>
            </div>
            <div className="ac-learn-stat">
              <span className="ac-learn-stat-val">{mounted ? readCount : 0}/{TOTAL_GUIDES}</span>
              <span className="ac-learn-stat-label">{t.learnGuides}</span>
            </div>
          </div>
          <div className="ac-progress-track" style={{ marginBottom: '1rem' }}>
            <div className="ac-progress-fill" style={{ width: mounted ? `${progressPct}%` : '0%' }} />
          </div>
          {mounted && nextGuide && nextGuideKey && (
            <div className="ac-learn-next">
              <span className="ac-learn-next-label">{readCount === 0 ? t.learnStartWith : t.learnNextGuide}</span>
              <a href={nextGuide.file} className="ac-learn-next-title">{getGuideI18n(nextGuideKey, savedLang).title}</a>
              <div className="ac-learn-next-meta">
                <span>{nextGuide.readMins} min</span>
                <span className={nextGuide.difficulty === 'Beginner' ? 'ac-chip-beginner' : 'ac-chip-intermediate'}>
                  {t.difficulty[nextGuide.difficulty as 'Beginner' | 'Intermediate']}
                </span>
              </div>
            </div>
          )}
          {mounted && !nextGuide && <p className="ac-learn-complete-msg">{t.learnDone}</p>}
          <div className="ac-learn-actions">
            <a href={lastGuide?.file ?? nextGuide?.file ?? '/index.html?member_session=1#member'} className="ac-btn-primary">
              {readCount > 0 ? t.continueBtn : t.startBtn}
            </a>
            <a href="/index.html?member_session=1#member" className="ac-btn-ghost">{t.viewAllBtn}</a>
          </div>
        </div>
      </div>

      {/* ── SUPPORT CENTER ── */}
      <div className="ac-card ac-support-card">
        <div className="ac-support-body">
          <div className="ac-support-left">
            <p className="ac-card-eyebrow">{t.supportEyebrow}</p>
            <h2 className="ac-card-title">{t.supportTitle}</h2>
            <div className="ac-support-status-wrap">
              <span className="ac-support-unused-badge">{t.supportBadge}</span>
            </div>
            <p className="ac-card-body" style={{ marginBottom: '.75rem' }}>{t.supportBody}</p>
            <ul className="ac-check-list">
              {t.supportItems.map(item => (
                <li key={item}><span className="ac-check">✓</span>{item}</li>
              ))}
            </ul>
          </div>
          <div className="ac-support-right">
            <a href={GUIDE_META.zoom.file} className="ac-btn-primary ac-btn-lg">{t.prepareBtn}</a>
            <a href="mailto:hello@plainvest.app" className="ac-support-email">hello@plainvest.app</a>
          </div>
        </div>
      </div>

      {/* ── ACHIEVEMENTS ── */}
      <div className="ac-card ac-achievements-card">
        <p className="ac-card-eyebrow">{t.achieveEyebrow}</p>
        <h2 className="ac-card-title">{t.achieveTitle}</h2>
        <div className="ac-achievement-row">
          {t.achieveList.map((a, i) => {
            const checks = [readCount >= 1, readCount >= 5, readCount >= 9, readCount >= 19, hasPortfolio, hasProjection];
            const earned = mounted && checks[i];
            return (
              <div key={i} className={`ac-achievement${earned ? ' ac-achievement--earned' : ''}`}>
                <div className="ac-achievement-icon">{earned ? '★' : '○'}</div>
                <div className="ac-achievement-title">{a.title}</div>
                <div className="ac-achievement-desc">{a.desc}</div>
              </div>
            );
          })}
        </div>
        {mounted && readCount === 0 && <p className="ac-achievements-empty">{t.achieveEmpty}</p>}
      </div>

      {/* ── PERSONAL INFO + SECURITY ── */}
      <div className="ac-grid-two">

        <div className="ac-card">
          <p className="ac-card-eyebrow">{t.personalEyebrow}</p>
          <h2 className="ac-card-title">{t.personalTitle}</h2>
          <form action={updateProfile} className="ac-form">
            <label className="ac-label">
              {t.labelFullName}
              <input name="full_name" type="text" defaultValue={fullName}
                placeholder={t.placeholderName} autoComplete="name" className="ac-input" />
            </label>
            <div className="ac-form-row">
              <label className="ac-label">
                {t.labelDob}
                <input name="date_of_birth" type="date" defaultValue={dateOfBirth} className="ac-input" />
              </label>
              <label className="ac-label">
                {t.labelGender}
                <select name="gender" defaultValue={gender} className="ac-input ac-select">
                  {t.genderOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </label>
            </div>
            <label className="ac-label">
              {t.labelEmail}
              <input type="email" defaultValue={email} disabled className="ac-input ac-input-disabled" />
              <span className="ac-field-note">{t.emailNote}</span>
            </label>
            <SubmitButton pendingText={t.savingChanges} className="ac-save-btn">{t.saveChanges}</SubmitButton>
          </form>
        </div>

        <div className="ac-card">
          <p className="ac-card-eyebrow">{t.securityEyebrow}</p>
          <h2 className="ac-card-title">{t.securityTitle}</h2>
          <div className="ac-security-score-wrap">
            <span className="ac-security-score-badge ac-security-strong">{t.securityStrong}</span>
          </div>
          <ul className="ac-security-checks">
            {t.securityChecks.map((c, i) => (
              <li key={i} className={`ac-security-check-item ${c.ok ? 'ac-check-ok' : 'ac-check-soon'}`}>
                <span className="ac-check-icon">{c.ok ? '✓' : '○'}</span>
                {c.label}
                {'soon' in c && c.soon && <span className="ac-soon-tag">{t.soonTag}</span>}
              </li>
            ))}
          </ul>
          <div className="ac-security-rows" style={{ marginTop: '1.25rem' }}>
            <div className="ac-security-row">
              <div className="ac-security-info">
                <span className="ac-security-name">{t.passwordLabel}</span>
                <span className="ac-security-status">{t.passwordDesc}</span>
              </div>
              <button className="ac-security-btn" onClick={() => setShowPasswordForm(s => !s)}>
                {showPasswordForm ? t.cancelBtn : t.changeBtn}
              </button>
            </div>
          </div>
          {showPasswordForm && (
            <form action={changePassword} className="ac-form" style={{ marginTop: '1.25rem' }}>
              <label className="ac-label">
                {t.newPassword}
                <PasswordInput name="password" minLength={6} required />
              </label>
              <label className="ac-label">
                {t.confirmPassword}
                <PasswordInput name="password_confirm" minLength={6} required />
              </label>
              <SubmitButton pendingText={t.updatingPassword} className="ac-save-btn">{t.updatePassword}</SubmitButton>
            </form>
          )}
        </div>
      </div>

      {/* ── ALL GUIDES ── */}
      <div className="ac-card ac-learning-card">
        <p className="ac-card-eyebrow">{t.guidesEyebrow}</p>
        <h2 className="ac-card-title">{t.guidesTitle}</h2>
        <div className="ac-progress-row">
          <span className="ac-progress-label">{t.guidesOf(mounted ? readCount : 0, TOTAL_GUIDES)}</span>
          <span className="ac-progress-pct">{mounted ? `${progressPct}%` : ''}</span>
        </div>
        <div className="ac-progress-track" style={{ marginBottom: '1rem' }}>
          <div className="ac-progress-fill" style={{ width: mounted ? `${progressPct}%` : '0%' }} />
        </div>
        <ul className="ac-guide-list">
          {visibleGuides.map(key => {
            const guide  = GUIDE_META[key];
            const isRead = mounted && readGuides.includes(key);
            const isLast = mounted && lastGuideKey === key && !isRead;
            return (
              <li key={key} className={`ac-guide-item${isRead ? ' ac-guide-done' : isLast ? ' ac-guide-active' : ''}`}>
                <span className="ac-guide-status">{isRead ? '✓' : isLast ? '→' : '·'}</span>
                <a href={guide.file} className="ac-guide-name">{getGuideI18n(key, savedLang).title}</a>
                <span className="ac-guide-chip">{guide.readMins} min</span>
              </li>
            );
          })}
        </ul>
        {GUIDE_ORDER.length > PREVIEW_GUIDES && (
          <button className="ac-toggle-link" onClick={() => setShowAllGuides(s => !s)}>
            {showAllGuides ? t.showLess : t.showAll(TOTAL_GUIDES)}
          </button>
        )}
      </div>

      {/* ── PREFERENCES ── */}
      <div className="ac-card ac-prefs-card">
        <p className="ac-card-eyebrow">{t.prefsEyebrow}</p>
        <h2 className="ac-card-title">{t.prefsTitle}</h2>
        <form action={savePreferences}>
          <input type="hidden" name="lang"     value={prefLang} />
          <input type="hidden" name="currency" value={prefCurrency} />
          <div className="ac-prefs-grid">
            <div className="ac-pref-item">
              <span className="ac-pref-label">{t.langLabel}</span>
              <div className="ac-pref-options">
                {(['en', 'pt'] as const).map(l => (
                  <button key={l} type="button"
                    className={`ac-pref-btn${prefLang === l ? ' ac-pref-btn--active' : ''}`}
                    onClick={() => setPrefLang(l)}>
                    {l === 'en' ? 'English' : 'Português'}
                  </button>
                ))}
              </div>
            </div>
            <div className="ac-pref-item">
              <span className="ac-pref-label">{t.currencyLabel}</span>
              <div className="ac-pref-options">
                {CURRENCIES.map(c => (
                  <button key={c} type="button"
                    className={`ac-pref-btn${prefCurrency === c ? ' ac-pref-btn--active' : ''}`}
                    onClick={() => setPrefCurrency(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="ac-prefs-footer">
            <SubmitButton pendingText={t.savingPrefs} className="ac-save-btn ac-prefs-save">
              {t.savePrefs}
            </SubmitButton>
            <span className="ac-pref-note">{t.prefsNote}</span>
          </div>
        </form>
      </div>

      {/* ── SIGN OUT ── */}
      <div className="ac-danger-zone">
        <form action={signOut}>
          <SubmitButton className="ac-danger-btn" pendingText={t.signingOut}>{t.signOut}</SubmitButton>
        </form>
      </div>

    </div>
  );
}
