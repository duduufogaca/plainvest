import Link from 'next/link';
import { cookies } from 'next/headers';
import { LangSwitcher } from './portfolio/components/LangSwitcher';

const T = {
  en: {
    eyebrow: 'Plainvest Premium',
    h1: 'Everything you need to invest with confidence.',
    intro: 'Create your account to access your investing roadmap, simulator tools, and Premium learning paths.',
    create: 'Create account',
    haveAccount: 'I already have an account',
    secure: 'Secure account',
    noFees: 'No hidden fees',
    support: 'Beginner-friendly support',
    forgot: 'Forgot password?',
    terms: 'Terms',
    privacy: 'Privacy',
    unlock: 'What you unlock',
    journey: 'Your entire investing journey in one place.',
    items: [
      'Beginner investing roadmap',
      'ETF, Bitcoin & DCA learning paths',
      'Long-term simulator tools',
      'Portfolio tracking',
      'Included Zoom support call',
    ],
    reassure: 'Built for people starting from zero — no jargon, no hype, no pressure.',
    note: 'Designed to help first-time investors feel clear, confident, and in control.',
  },
  pt: {
    eyebrow: 'Plainvest Premium',
    h1: 'Tudo o que você precisa para investir com confiança.',
    intro: 'Crie sua conta para acessar seu roteiro de investimentos, ferramentas de simulação e trilhas de aprendizado Premium.',
    create: 'Criar conta',
    haveAccount: 'Já tenho uma conta',
    secure: 'Conta segura',
    noFees: 'Sem taxas ocultas',
    support: 'Suporte amigável para iniciantes',
    forgot: 'Esqueceu a senha?',
    terms: 'Termos',
    privacy: 'Privacidade',
    unlock: 'O que você libera',
    journey: 'Toda a sua jornada de investimentos em um só lugar.',
    items: [
      'Roteiro de investimentos para iniciantes',
      'Trilhas de ETF, Bitcoin e DCA',
      'Ferramentas de simulação de longo prazo',
      'Rastreamento de portfólio',
      'Chamada de suporte no Zoom incluída',
    ],
    reassure: 'Feito para quem está começando do zero — sem termos complexos, sem hype, sem pressão.',
    note: 'Pensado para que investidores iniciantes se sintam claros, confiantes e no controle.',
  },
};

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const lang: 'en' | 'pt' = (sp.lang || cookieStore.get('pv_lang')?.value) === 'pt' ? 'pt' : 'en';
  const t = T[lang];

  return (
    <main className="auth-shell--split">
      <div className="auth-lang-toggle"><LangSwitcher current={lang} /></div>
      <div className="auth-split-wrap">

        {/* LEFT — gateway action */}
        <div className="auth-card-wrap">
          <div className="auth-card--premium auth-gateway">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.h1}</h1>
            <p className="muted">{t.intro}</p>
            <div className="gateway-actions">
              <Link href={`/signup?lang=${lang}`} className="gateway-btn-primary">{t.create}</Link>
              <Link href={`/login?mode=manual&lang=${lang}`} className="gateway-btn-secondary">{t.haveAccount}</Link>
            </div>
            <div className="auth-trust-row">
              <span className="auth-trust-item">{t.secure}</span>
              <span className="auth-trust-item">{t.noFees}</span>
              <span className="auth-trust-item">{t.support}</span>
            </div>
            <p className="tiny-links">
              <Link href={`/forgot-password?lang=${lang}`}>{t.forgot}</Link>
              <span>&nbsp;&middot;&nbsp;</span>
              <Link href="/terms">{t.terms}</Link>
              <span>&nbsp;&middot;&nbsp;</span>
              <Link href="/privacy">{t.privacy}</Link>
            </p>
          </div>
        </div>

        {/* RIGHT — value panel */}
        <div className="auth-value-panel">
          <p className="avp-label">{t.unlock}</p>
          <h2 className="avp-headline">{t.journey}</h2>
          <ul className="avp-list">
            {t.items.map((item) => (
              <li key={item}>
                <span className="avp-check">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="avp-reassurance">{t.reassure}</div>
          <p className="avp-note">{t.note}</p>
        </div>

      </div>
    </main>
  );
}
