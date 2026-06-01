import { signOut } from '../actions/auth';
import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { getExchangeRates } from '@/lib/exchange-rates';
import { redirect } from 'next/navigation';
import { SubmitButton } from '../components/submit-button';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Lang = 'en' | 'pt';

const T = {
  en: {
    eyebrow: 'Plainvest membership',
    title: 'Invest with clarity, starting today.',
    sub: 'You already took the first step by signing up. Now get the guides, tools, and strategy to invest confidently — without the noise.',
    loggedInAs: 'Logged in as',
    beforeLabel: 'Before Plainvest',
    afterLabel: 'After Plainvest',
    before: [
      'Overwhelmed by conflicting advice online',
      'No clear strategy — just guessing',
      'Scared to invest in case you lose it all',
      'Learning from random YouTube videos',
    ],
    after: [
      'A structured path built for beginners',
      'A consistent method you actually understand',
      'Guides for every risk level and goal',
      '19 expert guides in plain language',
    ],
    comparePlans: 'Compare plans',
    feature: 'Feature',
    oneTime: 'one-time',
    perMonth: '/month',
    mostComplete: 'Most complete',
    premiumName: 'Guides & Learning Hub',
    premiumDesc: 'All 19 investment guides, DCA method, chart tools, Bitcoin research, and one included Zoom support call.',
    premiumPrice: 'AUD $89.90',
    premiumPeriod: 'one-time purchase',
    getPremium: 'Get Premium',
    proName: 'Full Access + Dashboard',
    proDesc: 'Everything in Premium — plus a live portfolio tracker, investment simulator, and future projections dashboard.',
    proPrice: 'AUD $9.90',
    proPeriod: '/month · cancel anytime',
    getPro: 'Get Pro',
    faqTitle: 'Common questions',
    faq: [
      { q: 'Is Premium a one-time purchase?', a: 'Yes. You pay AUD $89.90 once and keep access to all 19 guides and the learning hub forever. No subscription, no renewal.' },
      { q: 'Is Pro a subscription?', a: 'Yes. Pro is AUD $9.90/month. You can cancel at any time from your account. When you cancel, access continues until the end of the billing period.' },
      { q: 'Can I upgrade from Premium to Pro later?', a: 'Absolutely. Go to your account and click Upgrade to Pro at any time. Your guides are already included — you just unlock the portfolio tools.' },
      { q: 'Does Plainvest manage my money?', a: 'No. Plainvest is education-only. We teach you how to invest — you make the decisions and use your own brokerage account.' },
    ],
    notSure: 'Not sure which plan?',
    bottomSub: 'Start with Premium if you want to learn at your own pace. Upgrade to Pro any time when you\'re ready to track your portfolio.',
    getPremiumPrice: 'Get Premium — $89.90',
    getProPrice: 'Get Pro — $9.90/mo',
    upgradeEyebrow: 'Upgrade to Pro',
    upgradeTitle: 'Unlock the full Plainvest experience.',
    upgradeSub: 'Your Premium guides stay exactly as they are. Pro adds the tools that turn knowledge into action.',
    upgradeGains: [
      'Portfolio tracker — log every asset you own',
      "Investment simulator — model your wealth over time",
      "Future projections dashboard — see where you're headed",
    ],
    upgradeIncluded: 'All 19 Premium guides — already included, nothing lost',
    upgradePeriod: '/month',
    cancelAnytime: 'Cancel anytime. No lock-in.',
    upgradeCta: 'Upgrade to Pro',
    backToHub: '← Back to my hub',
    account: 'Account',
    logout: 'Logout',
    openingCheckout: 'Opening checkout…',
    loggingOut: '…',
    cancelled: 'Checkout was cancelled — no charge was made.',
    features: [
      '19 premium investment guides',
      'DCA method & investment paths',
      'Chart reading & research tools',
      'One included Zoom support call',
      'Portfolio tracker',
      'Investment simulator',
      'Future projections dashboard',
      'Cancel anytime',
    ],
    featurePremium: [true, true, true, true, false, false, false, false],
  },
  pt: {
    eyebrow: 'Plano Plainvest',
    title: 'Invista com clareza, a partir de hoje.',
    sub: 'Você já deu o primeiro passo ao se cadastrar. Agora, obtenha os guias, ferramentas e estratégia para investir com confiança — sem ruído.',
    loggedInAs: 'Conectado como',
    beforeLabel: 'Antes do Plainvest',
    afterLabel: 'Depois do Plainvest',
    before: [
      'Sobrecarregado por conselhos contraditórios',
      'Sem estratégia clara — só adivinhando',
      'Com medo de investir e perder tudo',
      'Aprendendo com vídeos aleatórios no YouTube',
    ],
    after: [
      'Um caminho estruturado para iniciantes',
      'Um método consistente que você realmente entende',
      'Guias para todos os níveis de risco e objetivos',
      '19 guias especializados em linguagem simples',
    ],
    comparePlans: 'Comparar planos',
    feature: 'Recurso',
    oneTime: 'pagamento único',
    perMonth: '/mês',
    mostComplete: 'Mais completo',
    premiumName: 'Guias & Hub de Aprendizado',
    premiumDesc: 'Todos os 19 guias de investimento, método DCA, ferramentas de gráficos, pesquisa sobre Bitcoin e uma chamada Zoom de suporte incluída.',
    premiumPrice: 'AUD $89,90',
    premiumPeriod: 'compra única',
    getPremium: 'Comprar Premium',
    proName: 'Acesso Completo + Dashboard',
    proDesc: 'Tudo do Premium — mais rastreamento de portfólio, simulador de investimentos e painel de projeções futuras.',
    proPrice: 'AUD $9,90',
    proPeriod: '/mês · cancele quando quiser',
    getPro: 'Assinar Pro',
    faqTitle: 'Dúvidas frequentes',
    faq: [
      { q: 'O Premium é uma compra única?', a: 'Sim. Você paga AUD $89,90 uma vez e mantém acesso a todos os 19 guias e ao hub de aprendizado para sempre. Sem assinatura, sem renovação.' },
      { q: 'O Pro é uma assinatura?', a: 'Sim. O Pro custa AUD $9,90/mês. Você pode cancelar a qualquer momento. O acesso continua até o final do período de cobrança.' },
      { q: 'Posso fazer upgrade do Premium para o Pro depois?', a: 'Com certeza. Acesse sua conta e clique em Upgrade para Pro a qualquer momento. Seus guias já estão incluídos — você só desbloqueia as ferramentas de portfólio.' },
      { q: 'A Plainvest gerencia meu dinheiro?', a: 'Não. A Plainvest é educacional. Nós ensinamos como investir — você toma as decisões e usa sua própria corretora.' },
    ],
    notSure: 'Não sabe qual escolher?',
    bottomSub: 'Comece com o Premium se quiser aprender no seu ritmo. Faça upgrade para o Pro quando estiver pronto para rastrear seu portfólio.',
    getPremiumPrice: 'Comprar Premium — $89,90',
    getProPrice: 'Assinar Pro — $9,90/mês',
    upgradeEyebrow: 'Upgrade para Pro',
    upgradeTitle: 'Desbloqueie a experiência completa da Plainvest.',
    upgradeSub: 'Seus guias Premium continuam exatamente como estão. O Pro adiciona as ferramentas que transformam conhecimento em ação.',
    upgradeGains: [
      'Rastreador de portfólio — registre todos os seus ativos',
      'Simulador de investimentos — modele sua riqueza ao longo do tempo',
      'Painel de projeções futuras — veja para onde está indo',
    ],
    upgradeIncluded: 'Todos os 19 guias Premium — já incluídos, nada é perdido',
    upgradePeriod: '/mês',
    cancelAnytime: 'Cancele quando quiser. Sem fidelidade.',
    upgradeCta: 'Fazer Upgrade para Pro',
    backToHub: '← Voltar ao hub',
    account: 'Conta',
    logout: 'Sair',
    openingCheckout: 'Abrindo checkout…',
    loggingOut: '…',
    cancelled: 'Checkout cancelado — nenhuma cobrança foi feita.',
    features: [
      '19 guias premium de investimento',
      'Método DCA & caminhos de investimento',
      'Leitura de gráficos & ferramentas de pesquisa',
      'Uma chamada Zoom de suporte incluída',
      'Rastreador de portfólio',
      'Simulador de investimentos',
      'Painel de projeções futuras',
      'Cancele quando quiser',
    ],
    featurePremium: [true, true, true, true, false, false, false, false],
  },
} as const;

function formatBRL(aud: number, rate: number) {
  const brl = aud * rate;
  return `R$ ${brl.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; upgrade?: string; lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === 'pt' ? 'pt' : 'en';
  const t = T[lang];

  const missingEnv = [
    ['NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL],
    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
  ].filter(([, value]) => !value).map(([name]) => name);

  if (missingEnv.length > 0) {
    return (
      <main className="setup-shell">
        <section className="setup-card">
          <p className="eyebrow">Setup needed</p>
          <h1>Supabase is not connected on this deployment yet.</h1>
          <p>Add these environment variables in Vercel, then redeploy the project:</p>
          <ul>{missingEnv.map((name) => <li key={name}>{name}</li>)}</ul>
        </section>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Allow non-logged-in visitors to see the pricing page.
  // Checkout requires auth and will prompt login at that point.
  let hasGuideAccess = false;
  let isPro = false;
  let isUpgradePrompt = false;

  if (user) {
    const { hasGuideAccess: hga, isPro: ip, error: accessError } = await getPremiumAccess(supabase, user.id);

    if (accessError) {
      console.error('Plainvest member access check failed:', accessError.message);
      redirect('/access-error?reason=error');
    }

    if (ip) redirect('/home');
    if (hga && params.upgrade !== 'pro') redirect('/home');

    hasGuideAccess = hga;
    isPro = ip;
    isUpgradePrompt = hga && params.upgrade === 'pro';
  }

  // Fetch BRL rate when Portuguese is selected
  let brlRate: number | null = null;
  if (lang === 'pt') {
    const rates = await getExchangeRates('AUD');
    brlRate = rates['BRL'] ?? 3.72;
  }

  // Build language-toggle URLs, preserving other params
  const baseParams = new URLSearchParams();
  if (params.upgrade) baseParams.set('upgrade', params.upgrade);
  if (params.payment) baseParams.set('payment', params.payment);
  const enParams = new URLSearchParams(baseParams); enParams.set('lang', 'en');
  const ptParams = new URLSearchParams(baseParams); ptParams.set('lang', 'pt');
  const enUrl = `/dashboard?${enParams}`;
  const ptUrl = `/dashboard?${ptParams}`;

  return (
    <main className="ms-shell">

      {/* ── Topbar ── */}
      <nav className="ms-topbar">
        <a href="/" className="ms-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/LOGO%20TRANSPARENTE%20BACK.png" alt="Plainvest" className="ms-brand-logo" />
        </a>
        <div className="ms-topbar-actions">
          {/* Language switcher */}
          <div className="ms-lang-switcher">
            <a href={enUrl} className={`ms-lang-btn${lang === 'en' ? ' ms-lang-btn--active' : ''}`}>EN</a>
            <a href={ptUrl} className={`ms-lang-btn${lang === 'pt' ? ' ms-lang-btn--active' : ''}`}>PT</a>
          </div>
          {hasGuideAccess && <a href="/home" className="ms-nav-link">{t.backToHub}</a>}
          {hasGuideAccess && <a href="/profile" className="ms-nav-link">{t.account}</a>}
          <form action={signOut}>
            <SubmitButton className="ms-logout-btn" pendingText={t.loggingOut}>{t.logout}</SubmitButton>
          </form>
        </div>
      </nav>

      <div className="ms-content">

        {params.payment === 'cancelled' && (
          <p className="ms-cancelled-notice">{t.cancelled}</p>
        )}

        {isUpgradePrompt ? (

          /* ═══════════════════════════════════
             UPGRADE PROMPT (Premium → Pro)
          ════════════════════════════════════ */
          <div className="ms-upgrade-wrap">
            <div className="ms-upgrade-hero">
              <p className="eyebrow">{t.upgradeEyebrow}</p>
              <h1 className="ms-upgrade-title">{t.upgradeTitle}</h1>
              <p className="ms-upgrade-sub">{t.upgradeSub}</p>
            </div>

            <div className="ms-upgrade-card">
              <div className="ms-upgrade-gain-list">
                {t.upgradeGains.map((item) => (
                  <div key={item} className="ms-upgrade-gain-item">
                    <span className="ms-upgrade-gain-icon">+</span>
                    <span>{item}</span>
                  </div>
                ))}
                <div className="ms-upgrade-gain-item ms-upgrade-gain-keep">
                  <span className="ms-upgrade-gain-icon">✓</span>
                  <span>{t.upgradeIncluded}</span>
                </div>
              </div>

              <div className="ms-upgrade-price-block">
                <div className="ms-upgrade-price">
                  <strong>{t.proPrice}</strong>
                  <span>{t.upgradePeriod}</span>
                </div>
                {brlRate && (
                  <p className="ms-brl-note">≈ {formatBRL(9.90, brlRate)}{t.upgradePeriod}</p>
                )}
                <p className="ms-upgrade-price-note">{t.cancelAnytime}</p>
                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="plan" value="pro" />
                  <SubmitButton pendingText={t.openingCheckout} className="ms-cta-primary ms-cta-full">
                    {t.upgradeCta}
                  </SubmitButton>
                </form>
                <p className="tiny-links" style={{ justifyContent: 'center', marginTop: '.75rem' }}>
                  <a href="/terms">Terms</a><span>•</span><a href="/privacy">Privacy</a>
                </p>
              </div>
            </div>
          </div>

        ) : (

          /* ═══════════════════════════════════
             FULL PRICING PAGE (New users)
          ════════════════════════════════════ */
          <>
            {/* HERO */}
            <div className="ms-hero login-fade-in">
              <p className="eyebrow">{t.eyebrow}</p>
              <h1 className="ms-hero-title">{t.title}</h1>
              <p className="ms-hero-sub">{t.sub}</p>
              {user && <p className="ms-hero-account">{t.loggedInAs} <span>{user.email}</span></p>}
            </div>

            {/* BEFORE / AFTER */}
            <div className="ms-transform login-fade-in">
              <div className="ms-transform-col ms-transform-before">
                <p className="ms-transform-label ms-transform-label--before">{t.beforeLabel}</p>
                {t.before.map((item) => (
                  <div key={item} className="ms-transform-item ms-transform-item--before">
                    <span className="ms-transform-icon">✗</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="ms-transform-divider">
                <div className="ms-transform-arrow">→</div>
              </div>
              <div className="ms-transform-col ms-transform-after">
                <p className="ms-transform-label ms-transform-label--after">{t.afterLabel}</p>
                {t.after.map((item) => (
                  <div key={item} className="ms-transform-item ms-transform-item--after">
                    <span className="ms-transform-icon">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PRICING CARDS */}
            <div className="ms-pricing-grid">

              {/* Premium */}
              <div className="ms-plan-card">
                <div className="ms-plan-header">
                  <p className="ms-plan-eyebrow">Premium</p>
                  <h2 className="ms-plan-name">{t.premiumName}</h2>
                  <p className="ms-plan-desc">{t.premiumDesc}</p>
                </div>
                <div className="ms-plan-price-block">
                  <div className="ms-plan-price">
                    <strong className="ms-plan-amount">{t.premiumPrice}</strong>
                    <span className="ms-plan-period">{t.premiumPeriod}</span>
                  </div>
                  {brlRate && (
                    <p className="ms-brl-note">≈ {formatBRL(89.90, brlRate)}</p>
                  )}
                </div>
                <form action="/api/stripe/checkout" method="POST" className="ms-plan-cta">
                  <input type="hidden" name="plan" value="premium" />
                  <SubmitButton pendingText={t.openingCheckout} className="ms-cta-secondary ms-cta-full">
                    {t.getPremium}
                  </SubmitButton>
                </form>
                <ul className="ms-plan-features">
                  {t.features.map((feature, i) => (
                    <li key={feature} className={`ms-plan-feature ${t.featurePremium[i] ? 'ms-plan-feature--yes' : 'ms-plan-feature--no'}`}>
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="tiny-links"><a href="/terms">Terms</a><span>•</span><a href="/privacy">Privacy</a></p>
              </div>

              {/* Pro — featured */}
              <div className="ms-plan-card ms-plan-card--featured">
                <div className="ms-plan-featured-badge">{t.mostComplete}</div>
                <div className="ms-plan-header">
                  <p className="ms-plan-eyebrow ms-plan-eyebrow--pro">Pro</p>
                  <h2 className="ms-plan-name">{t.proName}</h2>
                  <p className="ms-plan-desc">{t.proDesc}</p>
                </div>
                <div className="ms-plan-price-block">
                  <div className="ms-plan-price">
                    <strong className="ms-plan-amount ms-plan-amount--pro">{t.proPrice}</strong>
                    <span className="ms-plan-period">{t.proPeriod}</span>
                  </div>
                  {brlRate && (
                    <p className="ms-brl-note ms-brl-note--pro">≈ {formatBRL(9.90, brlRate)}{lang === 'pt' ? '/mês' : '/mo'}</p>
                  )}
                </div>
                <form action="/api/stripe/checkout" method="POST" className="ms-plan-cta">
                  <input type="hidden" name="plan" value="pro" />
                  <SubmitButton pendingText={t.openingCheckout} className="ms-cta-primary ms-cta-full">
                    {t.getPro}
                  </SubmitButton>
                </form>
                <ul className="ms-plan-features">
                  {t.features.map((feature) => (
                    <li key={feature} className="ms-plan-feature ms-plan-feature--yes">{feature}</li>
                  ))}
                </ul>
                <p className="tiny-links"><a href="/terms">Terms</a><span>•</span><a href="/privacy">Privacy</a></p>
              </div>
            </div>

            {/* COMPARISON TABLE */}
            <div className="ms-table-wrap">
              <p className="ms-table-title">{t.comparePlans}</p>
              <table className="ms-table">
                <thead>
                  <tr>
                    <th className="ms-th-feature">{t.feature}</th>
                    <th className="ms-th-plan">Premium</th>
                    <th className="ms-th-plan ms-th-plan--pro">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {t.features.map((feature, i) => (
                    <tr key={feature}>
                      <td className="ms-td-feature">{feature}</td>
                      <td className="ms-td-check">
                        {t.featurePremium[i]
                          ? <span className="ms-check ms-check--yes">✓</span>
                          : <span className="ms-check ms-check--no">—</span>}
                      </td>
                      <td className="ms-td-check"><span className="ms-check ms-check--yes">✓</span></td>
                    </tr>
                  ))}
                  <tr className="ms-table-price-row">
                    <td className="ms-td-feature"></td>
                    <td className="ms-td-check ms-td-price">
                      {t.premiumPrice}<br />
                      {brlRate && <span className="ms-brl-inline">≈ {formatBRL(89.90, brlRate)}</span>}
                      {!brlRate && <span>{t.oneTime}</span>}
                    </td>
                    <td className="ms-td-check ms-td-price ms-td-price--pro">
                      {t.proPrice}{t.perMonth}<br />
                      {brlRate && <span className="ms-brl-inline">{formatBRL(9.90, brlRate)}{lang === 'pt' ? '/mês' : '/mo'}</span>}
                      {!brlRate && <span>{lang === 'pt' ? '/mês' : '/month'}</span>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* FAQ */}
            <div className="ms-faq">
              <p className="ms-faq-title">{t.faqTitle}</p>
              <div className="ms-faq-grid">
                {t.faq.map(({ q, a }) => (
                  <div key={q} className="ms-faq-item">
                    <p className="ms-faq-q">{q}</p>
                    <p className="ms-faq-a">{a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM CTA */}
            <div className="ms-bottom-cta">
              <p className="ms-bottom-cta-label">{t.notSure}</p>
              <p className="ms-bottom-cta-sub">{t.bottomSub}</p>
              <div className="ms-bottom-cta-actions">
                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="plan" value="premium" />
                  <SubmitButton pendingText={t.openingCheckout} className="ms-cta-secondary">{t.getPremiumPrice}</SubmitButton>
                </form>
                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="plan" value="pro" />
                  <SubmitButton pendingText={t.openingCheckout} className="ms-cta-primary">{t.getProPrice}</SubmitButton>
                </form>
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
