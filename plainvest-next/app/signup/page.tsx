import Link from 'next/link';
import { cookies } from 'next/headers';
import { signUp } from '../actions/auth';
import { SubmitButton } from '../components/submit-button';
import { PasswordInput } from '../components/password-input';
import { LangSwitcher } from '../portfolio/components/LangSwitcher';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

const T = {
  en: {
    step: 'Step 1 of 3',
    eyebrow: 'Create account',
    h1: 'Start building your investing confidence.',
    intro: 'Your account keeps your guides, progress, and membership access in one place — always available when you come back.',
    email: 'Email',
    password: 'Password',
    creating: 'Creating account…',
    submit: 'Start my investing path',
    nextHint: "After signing up you'll confirm your email, then choose your plan.",
    secure: 'Secure & encrypted',
    noSpam: 'No spam',
    cancel: 'Cancel anytime',
    already: 'Already a member?',
    login: 'Log in',
    unlock: 'What you unlock',
    headline: 'Everything you need to invest with confidence.',
    firstSteps: 'Your first 3 steps',
    reassure: 'Built for people starting from zero — no jargon, no hype, no financial advice.',
    unlocks: [
      '19 structured investment guides',
      'DCA method & investment paths',
      'Chart reading & research tools',
      'Portfolio tracker & simulator',
      'One included Zoom support call',
    ],
    steps: [
      { n: '1', title: 'Create your account', body: 'Takes 30 seconds. Confirm your email to activate.' },
      { n: '2', title: 'Choose your plan', body: 'Premium (one-time) or Pro (monthly). Both built for beginners.' },
      { n: '3', title: 'Open your first guide', body: 'Start the Investment Paths Guide and build real clarity.' },
    ],
  },
  pt: {
    step: 'Passo 1 de 3',
    eyebrow: 'Criar conta',
    h1: 'Comece a construir sua confiança para investir.',
    intro: 'Sua conta mantém seus guias, progresso e acesso à assinatura em um só lugar — sempre disponíveis quando você voltar.',
    email: 'E-mail',
    password: 'Senha',
    creating: 'Criando conta…',
    submit: 'Começar meu caminho de investimentos',
    nextHint: 'Após o cadastro, você confirma seu e-mail e depois escolhe seu plano.',
    secure: 'Seguro e criptografado',
    noSpam: 'Sem spam',
    cancel: 'Cancele quando quiser',
    already: 'Já é membro?',
    login: 'Entrar',
    unlock: 'O que você libera',
    headline: 'Tudo o que você precisa para investir com confiança.',
    firstSteps: 'Seus 3 primeiros passos',
    reassure: 'Feito para quem está começando do zero — sem termos complexos, sem hype, sem conselho financeiro.',
    unlocks: [
      '19 guias estruturados de investimento',
      'Método DCA e caminhos de investimento',
      'Leitura de gráficos e ferramentas de pesquisa',
      'Rastreador de portfólio e simulador',
      'Uma chamada de suporte no Zoom incluída',
    ],
    steps: [
      { n: '1', title: 'Crie sua conta', body: 'Leva 30 segundos. Confirme seu e-mail para ativar.' },
      { n: '2', title: 'Escolha seu plano', body: 'Premium (pagamento único) ou Pro (mensal). Ambos feitos para iniciantes.' },
      { n: '3', title: 'Abra seu primeiro guia', body: 'Comece pelo Guia de Caminhos de Investimento e ganhe clareza real.' },
    ],
  },
};

export default async function SignUp({ searchParams }: { searchParams: Promise<{ message?: string; lang?: string }> }) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const lang: 'en' | 'pt' = (params.lang || cookieStore.get('pv_lang')?.value) === 'pt' ? 'pt' : 'en';
  const t = T[lang];

  return (
    <main className="auth-shell--split">
      <div className="auth-lang-toggle"><LangSwitcher current={lang} /></div>
      <div className="auth-split-wrap">

        {/* LEFT — signup form */}
        <div className="auth-card-wrap">
          <form className="auth-card--premium login-fade-in" action={signUp}>

            <div className="auth-step">
              <span className="auth-step-pill">{t.step}</span>
              <div className="auth-step-line" />
              <div className="auth-step-dots">
                <span className="auth-step-dot active" />
                <span className="auth-step-dot" />
                <span className="auth-step-dot" />
              </div>
            </div>

            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.h1}</h1>
            <p className="muted">{t.intro}</p>

            {params.message && <div className="notice">{params.message}</div>}

            <label>{t.email}<input name="email" type="email" placeholder="you@email.com" required /></label>
            <label>{t.password}<PasswordInput name="password" minLength={6} required /></label>

            <SubmitButton pendingText={t.creating}>{t.submit}</SubmitButton>

            <p className="auth-next-hint">{t.nextHint}</p>

            <div className="auth-trust-row">
              <span className="auth-trust-item">{t.secure}</span>
              <span className="auth-trust-item">{t.noSpam}</span>
              <span className="auth-trust-item">{t.cancel}</span>
            </div>

            <p className="switch">{t.already} <Link href={`/login?mode=manual&lang=${lang}`}>{t.login}</Link></p>
          </form>
        </div>

        {/* RIGHT — value + journey panel */}
        <div className="auth-value-panel login-fade-in login-fade-in--delayed">

          <div>
            <p className="avp-label">{t.unlock}</p>
            <h2 className="avp-headline">{t.headline}</h2>
          </div>

          <ul className="avp-list">
            {t.unlocks.map((item) => (
              <li key={item}>
                <span className="avp-check">✓</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="avp-divider" />

          <div>
            <p className="avp-label">{t.firstSteps}</p>
            <div className="avp-steps">
              {t.steps.map(({ n, title, body }) => (
                <div key={n} className="avp-step">
                  <div className="avp-step-num">{n}</div>
                  <div className="avp-step-text">
                    <span className="avp-step-title">{title}</span>
                    <span className="avp-step-body">{body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="avp-reassurance">{t.reassure}</div>

        </div>

      </div>
    </main>
  );
}
