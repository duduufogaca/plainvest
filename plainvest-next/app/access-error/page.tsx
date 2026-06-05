import { RefreshButton } from './RefreshButton';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { title: 'Access — Plainvest', robots: { index: false, follow: false } };

type Reason = 'expired' | 'inactive' | 'error' | 'denied';
type Lang = 'en' | 'pt';

const T = {
  en: {
    expired: {
      badge: 'Access expired',
      headline: "Let's get you back in.",
      sub: 'Your Plainvest membership has expired. Renew below to continue accessing your guides and tools — your progress is still saved.',
      primary: { label: 'Renew my access', href: '/dashboard' },
      refresh: null,
    },
    inactive: {
      badge: 'Membership inactive',
      headline: "Let's get you back in.",
      sub: 'Your Plainvest membership is no longer active. This can happen if a payment was cancelled or your subscription ended. Start a new plan below to regain access.',
      primary: { label: 'View plans', href: '/dashboard' },
      refresh: null,
    },
    error: {
      badge: 'Access check failed',
      headline: "Something went wrong.",
      sub: "We couldn't verify your access right now. This is usually temporary. Try refreshing — if the issue continues, contact us and we'll sort it out.",
      primary: null,
      refresh: 'Try refreshing',
    },
    denied: {
      badge: 'Members only',
      headline: "This content is for members.",
      sub: 'The page you tried to reach is only available to Plainvest members. Choose a plan below to get instant access to all guides, tools, and support.',
      primary: { label: 'View membership plans', href: '/dashboard' },
      refresh: null,
    },
    returnHome: 'Return home',
    returnLogin: 'Back to login',
    contactSupport: 'Contact support',
    supportEmail: 'hello@plainvest.app',
    supportNote: 'We usually reply within a few hours.',
  },
  pt: {
    expired: {
      badge: 'Acesso expirado',
      headline: 'Vamos resolver isso.',
      sub: 'Seu plano Plainvest expirou. Renove abaixo para continuar acessando seus guias e ferramentas — seu progresso ainda está salvo.',
      primary: { label: 'Renovar meu acesso', href: '/dashboard?lang=pt' },
      refresh: null,
    },
    inactive: {
      badge: 'Assinatura inativa',
      headline: 'Vamos resolver isso.',
      sub: 'Seu plano Plainvest não está mais ativo. Isso pode acontecer se um pagamento foi cancelado ou sua assinatura encerrou. Escolha um novo plano abaixo para recuperar o acesso.',
      primary: { label: 'Ver planos', href: '/dashboard?lang=pt' },
      refresh: null,
    },
    error: {
      badge: 'Erro de verificação',
      headline: 'Algo deu errado.',
      sub: 'Não conseguimos verificar seu acesso agora. Isso costuma ser temporário. Tente atualizar a página — se o problema persistir, entre em contato e resolveremos.',
      primary: null,
      refresh: 'Tentar novamente',
    },
    denied: {
      badge: 'Área exclusiva',
      headline: 'Este conteúdo é para membros.',
      sub: 'A página que você tentou acessar está disponível apenas para membros da Plainvest. Escolha um plano abaixo para ter acesso imediato.',
      primary: { label: 'Ver planos', href: '/dashboard?lang=pt' },
      refresh: null,
    },
    returnHome: 'Voltar ao início',
    returnLogin: 'Ir para o login',
    contactSupport: 'Falar com suporte',
    supportEmail: 'hello@plainvest.app',
    supportNote: 'Geralmente respondemos em poucas horas.',
  },
} as const;

const ICON_PATHS: Record<Reason, { d: string; color: string }> = {
  expired:  { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', color: 'rgba(244,200,106,.7)' },
  inactive: { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', color: 'rgba(248,113,113,.6)' },
  error:    { d: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01', color: 'rgba(248,113,113,.6)' },
  denied:   { d: 'M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10', color: 'rgba(97,213,180,.6)' },
};

export default async function AccessErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === 'pt' ? 'pt' : 'en';
  const reason: Reason = (['expired', 'inactive', 'error', 'denied'] as Reason[]).includes(params.reason as Reason)
    ? (params.reason as Reason)
    : 'denied';

  const t = T[lang];
  const content = t[reason];
  const icon = ICON_PATHS[reason];

  const enUrl = `/access-error?reason=${reason}&lang=en`;
  const ptUrl = `/access-error?reason=${reason}&lang=pt`;

  return (
    <main className="ae-shell">

      {/* Language switcher */}
      <div className="ae-lang">
        <a href={enUrl} className={`ms-lang-btn${lang === 'en' ? ' ms-lang-btn--active' : ''}`}>EN</a>
        <a href={ptUrl} className={`ms-lang-btn${lang === 'pt' ? ' ms-lang-btn--active' : ''}`}>PT</a>
      </div>

      <div className="ae-card login-fade-in">

        {/* Icon */}
        <div className="ae-icon-wrap">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke={icon.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {icon.d.split(' M').map((segment, i) => (
              <path key={i} d={i === 0 ? segment : 'M' + segment} />
            ))}
          </svg>
        </div>

        {/* Badge */}
        <span className={`ae-badge ae-badge--${reason}`}>{content.badge}</span>

        {/* Headline + sub */}
        <h1 className="ae-headline">{content.headline}</h1>
        <p className="ae-sub">{content.sub}</p>

        {/* Actions */}
        <div className="ae-actions">
          {content.primary && (
            <a href={content.primary.href} className="ae-btn-primary">
              {content.primary.label}
            </a>
          )}
          {'refresh' in content && content.refresh && (
            <RefreshButton label={content.refresh} />
          )}
          <a href="/login" className="ae-btn-ghost">{t.returnLogin}</a>
        </div>

        {/* Divider */}
        <div className="ae-divider" />

        {/* Support */}
        <div className="ae-support">
          <p className="ae-support-label">{t.contactSupport}</p>
          <a href={`mailto:${t.supportEmail}`} className="ae-support-email">{t.supportEmail}</a>
          <p className="ae-support-note">{t.supportNote}</p>
        </div>

      </div>

      {/* Plainvest brand */}
      <a href="/" className="ae-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/plainvest-logo-clean.png" alt="Plainvest" className="ae-brand-logo" />
      </a>

    </main>
  );
}
