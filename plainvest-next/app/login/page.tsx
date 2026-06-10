import Link from 'next/link';
import { cookies } from 'next/headers';
import { signIn, resendConfirmation } from '../actions/auth';
import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { redirect } from 'next/navigation';
import { SubmitButton } from '../components/submit-button';
import { PasswordInput } from '../components/password-input';
import { LangSwitcher } from '../portfolio/components/LangSwitcher';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

const T = {
  en: {
    eyebrow: 'Member login',
    h1: 'Welcome back.',
    intro: 'Your guides, progress, and portfolio are waiting for you.',
    confirmTitle: 'Confirm your email first',
    confirmBodyA: 'We sent a confirmation link to',
    confirmBodyB: 'Open it, then come back here to log in.',
    yourEmail: 'your email',
    sending: 'Sending…',
    resend: 'Resend confirmation email',
    email: 'Email',
    password: 'Password',
    loggingIn: 'Logging in…',
    submit: 'Continue to my hub',
    secure: 'Secure & encrypted',
    private: 'Your data stays private',
    support: 'Beginner-friendly support',
    forgot: 'Forgot your password?',
    newHere: 'New here?',
    create: 'Create an account',
    progressHere: 'Your progress is here',
    headline: 'Everything you built is waiting for you.',
    statLabel: 'of your data is saved — pick up exactly where you left off.',
    list: [
      { icon: '📚', text: 'Your learning paths & reading progress' },
      { icon: '📊', text: 'Portfolio tracking & allocations' },
      { icon: '🔮', text: 'Simulator runs & future projections' },
      { icon: '🎯', text: 'Premium guides & Zoom support access' },
    ],
  },
  pt: {
    eyebrow: 'Acesso de membro',
    h1: 'Bem-vindo de volta.',
    intro: 'Seus guias, progresso e portfólio estão esperando por você.',
    confirmTitle: 'Confirme seu e-mail primeiro',
    confirmBodyA: 'Enviamos um link de confirmação para',
    confirmBodyB: 'Abra-o e volte aqui para entrar.',
    yourEmail: 'seu e-mail',
    sending: 'Enviando…',
    resend: 'Reenviar e-mail de confirmação',
    email: 'E-mail',
    password: 'Senha',
    loggingIn: 'Entrando…',
    submit: 'Continuar para meu hub',
    secure: 'Seguro e criptografado',
    private: 'Seus dados permanecem privados',
    support: 'Suporte amigável para iniciantes',
    forgot: 'Esqueceu sua senha?',
    newHere: 'Novo por aqui?',
    create: 'Criar uma conta',
    progressHere: 'Seu progresso está aqui',
    headline: 'Tudo o que você construiu está esperando por você.',
    statLabel: 'dos seus dados ficam salvos — continue exatamente de onde parou.',
    list: [
      { icon: '📚', text: 'Suas trilhas de aprendizado e progresso de leitura' },
      { icon: '📊', text: 'Rastreamento de portfólio e alocações' },
      { icon: '🔮', text: 'Simulações e projeções futuras' },
      { icon: '🎯', text: 'Guias Premium e acesso ao suporte por Zoom' },
    ],
  },
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; mode?: string; confirm_email?: string; email?: string; lang?: string }>;
}) {
  const params = await searchParams;
  const missingEnv = [
    ['NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL],
    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
  ].filter(([, value]) => !value).map(([name]) => name);

  if (missingEnv.length > 0) {
    return (
      <main className="setup-shell">
        <section className="setup-card">
          <p className="eyebrow">Setup needed</p>
          <h1>Member login is not connected yet.</h1>
          <p>Add these environment variables in Vercel, then redeploy the project:</p>
          <ul>
            {missingEnv.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </section>
      </main>
    );
  }

  let user = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    return (
      <main className="setup-shell">
        <section className="setup-card">
          <p className="eyebrow">Setup needed</p>
          <h1>Member login is not available right now.</h1>
          <p>Please check the Supabase environment variables in Vercel, redeploy, and try again.</p>
        </section>
      </main>
    );
  }

  if (user && params.mode !== 'manual') {
    const supabase = await createClient();
    const { isPremium } = await getPremiumAccess(supabase, user.id);
    redirect(isPremium ? '/home' : '/dashboard');
  }

  const cookieStore = await cookies();
  const lang: 'en' | 'pt' = (params.lang || cookieStore.get('pv_lang')?.value) === 'pt' ? 'pt' : 'en';
  const t = T[lang];

  const needsConfirm = params.confirm_email === '1';
  const prefillEmail = params.email ?? '';

  return (
    <main className="auth-shell--split">
      <div className="auth-lang-toggle"><LangSwitcher current={lang} /></div>
      <div className="auth-split-wrap">

        {/* LEFT — login form */}
        <div className="auth-card-wrap">
          <form className="auth-card--premium login-fade-in" action={signIn}>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.h1}</h1>
            <p className="muted">{t.intro}</p>

            {/* Email confirmation notice with resend */}
            {needsConfirm && (
              <div className="notice notice-confirm">
                <p className="notice-confirm-title">{t.confirmTitle}</p>
                <p className="notice-confirm-body">
                  {t.confirmBodyA} <strong>{prefillEmail || t.yourEmail}</strong>. {t.confirmBodyB}
                </p>
                <form action={resendConfirmation} className="notice-resend-form">
                  <input type="hidden" name="email" value={prefillEmail} />
                  <SubmitButton pendingText={t.sending} className="notice-resend-btn">
                    {t.resend}
                  </SubmitButton>
                </form>
              </div>
            )}

            {/* General error message */}
            {!needsConfirm && params.message && (
              <div className="notice">{params.message}</div>
            )}

            <label>
              {t.email}
              <input
                name="email"
                type="email"
                placeholder="you@email.com"
                defaultValue={prefillEmail}
                required
              />
            </label>
            <label>{t.password}<PasswordInput name="password" minLength={6} required /></label>
            <SubmitButton pendingText={t.loggingIn}>{t.submit}</SubmitButton>

            <div className="auth-trust-row">
              <span className="auth-trust-item">{t.secure}</span>
              <span className="auth-trust-item">{t.private}</span>
              <span className="auth-trust-item">{t.support}</span>
            </div>

            <p className="switch"><Link href={`/forgot-password?lang=${lang}`}>{t.forgot}</Link></p>
            <p className="switch">{t.newHere} <Link href={`/signup?lang=${lang}`}>{t.create}</Link></p>
          </form>
        </div>

        {/* RIGHT — value reminder panel */}
        <div className="auth-welcome-panel login-fade-in login-fade-in--delayed">
          <p className="awp-label">{t.progressHere}</p>
          <h2 className="awp-headline">{t.headline}</h2>
          <ul className="awp-list">
            {t.list.map(({ icon, text }) => (
              <li key={text}>
                <span className="awp-icon">{icon}</span>
                {text}
              </li>
            ))}
          </ul>
          <div className="awp-stat">
            <div className="awp-stat-number">100%</div>
            <div className="awp-stat-label">{t.statLabel}</div>
          </div>
        </div>

      </div>
    </main>
  );
}
