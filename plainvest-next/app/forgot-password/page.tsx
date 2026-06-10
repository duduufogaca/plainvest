import Link from 'next/link';
import { cookies } from 'next/headers';
import { requestPasswordReset } from '../actions/auth';
import { SubmitButton } from '../components/submit-button';
import { LangSwitcher } from '../portfolio/components/LangSwitcher';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

const T = {
  en: {
    eyebrow: 'Password reset',
    h1: 'Reset your password.',
    intro: "Enter your member email and we'll send a secure reset link immediately.",
    email: 'Email',
    back: '← Back to login',
    sending: 'Sending...',
    submit: 'Send secure reset link',
    secure: 'Secure account recovery',
    noSpam: 'No spam',
    support: 'Beginner-friendly support',
    reassure: 'Your learning progress and Premium access stay safely connected to your account.',
  },
  pt: {
    eyebrow: 'Redefinir senha',
    h1: 'Redefina sua senha.',
    intro: 'Digite o e-mail da sua conta e enviaremos um link seguro de redefinição imediatamente.',
    email: 'E-mail',
    back: '← Voltar para o login',
    sending: 'Enviando...',
    submit: 'Enviar link seguro de redefinição',
    secure: 'Recuperação de conta segura',
    noSpam: 'Sem spam',
    support: 'Suporte amigável para iniciantes',
    reassure: 'Seu progresso de aprendizado e acesso Premium permanecem seguros e vinculados à sua conta.',
  },
};

export default async function ForgotPassword({ searchParams }: { searchParams: Promise<{ message?: string; lang?: string }> }) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const lang: 'en' | 'pt' = (params.lang || cookieStore.get('pv_lang')?.value) === 'pt' ? 'pt' : 'en';
  const t = T[lang];

  return (
    <main className="auth-shell--split">
      <div className="auth-lang-toggle"><LangSwitcher current={lang} /></div>
      <div className="auth-card-wrap auth-card-wrap--reset">
        <form className="auth-card--premium" action={requestPasswordReset}>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="auth-h1--reset">{t.h1}</h1>
          <p className="muted">{t.intro}</p>
          {params.message ? <div className="notice">{params.message}</div> : null}
          <label>{t.email}<input name="email" type="email" placeholder="you@email.com" required /></label>
          <Link href={`/login?mode=manual&lang=${lang}`} className="auth-back-link">{t.back}</Link>
          <SubmitButton pendingText={t.sending}>{t.submit}</SubmitButton>
          <div className="auth-trust-row">
            <span className="auth-trust-item">{t.secure}</span>
            <span className="auth-trust-item">{t.noSpam}</span>
            <span className="auth-trust-item">{t.support}</span>
          </div>
          <p className="auth-reset-reassurance">{t.reassure}</p>
        </form>
      </div>
    </main>
  );
}
