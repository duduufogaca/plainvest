import { createClient } from '@/lib/supabase/server';
import { getPremiumAccess } from '@/lib/premium';
import { getExchangeRates } from '@/lib/exchange-rates';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { SidebarClient } from '../portfolio/components/SidebarClient';
import { TOOLS_T, TOOL_IDS, type Lang, type ToolId } from '@/lib/tools-i18n';
import { ToolsHub } from './components/ToolsHub';
import { SimulatorTool } from './components/SimulatorTool';
import { RetirementTool } from './components/RetirementTool';
import { DcaTool } from './components/DcaTool';
import { EtfTool } from './components/EtfTool';
import { InflationTool } from './components/InflationTool';
import { FreedomTool } from './components/FreedomTool';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = {
  title: 'Calculators — Plainvest',
  robots: { index: false, follow: false },
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ tool?: string; currency?: string; lang?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { isPro, plan } = await getPremiumAccess(supabase, user.id);
  if (!isPro) redirect('/dashboard');

  const params = await searchParams;
  const cookieStore = await cookies();
  const lang = ((params.lang || cookieStore.get('pv_lang')?.value || 'en') === 'pt' ? 'pt' : 'en') as Lang;
  const currency = params.currency || cookieStore.get('pv_currency')?.value || 'AUD';
  const rates = await getExchangeRates('AUD');

  const meta = user.user_metadata || {};
  const fullName: string = meta.full_name || '';
  const firstName = fullName.split(' ')[0] || user.email?.split('@')[0] || '';

  const t = TOOLS_T[lang];
  const tool = (TOOL_IDS as string[]).includes(params.tool || '') ? (params.tool as ToolId) : null;
  const tp = { currency, rates, lang };

  return (
    <main className="portfolio-shell">
      <SidebarClient
        displayCurrency={currency}
        lang={lang}
        backHref="/home"
        portfolioHref="/portfolio"
        profileLabel={lang === 'pt' ? 'Perfil' : 'Profile'}
        logoutLabel={lang === 'pt' ? 'Sair' : 'Logout'}
        userName={firstName}
        userFullName={fullName || firstName}
        plan={plan ?? 'pro'}
        toolsActive
      />

      <div className="portfolio-main">
        <div className="portfolio-content portfolio-content-wide">
          <a href="/home" className="back-to-hub-btn">
            ← {lang === 'pt' ? 'Voltar ao Hub' : 'Back to Member Hub'}
          </a>

          <div className="tools-head">
            <h1>{tool ? t.cards[tool].name : t.hub.title}</h1>
            <p className="tools-head-sub">{tool ? (t.tool[tool].sub ?? t.cards[tool].desc) : t.hub.sub}</p>
            {tool && <a href="/tools" className="tool-back-link">{t.common.back}</a>}
          </div>

          {!tool && <ToolsHub lang={lang} currency={currency} rates={rates} />}
          {tool === 'simulator' && <SimulatorTool {...tp} />}
          {tool === 'retirement' && <RetirementTool {...tp} />}
          {tool === 'dca' && <DcaTool {...tp} />}
          {tool === 'etf' && <EtfTool {...tp} />}
          {tool === 'inflation' && <InflationTool {...tp} />}
          {tool === 'freedom' && <FreedomTool {...tp} />}
        </div>
      </div>
    </main>
  );
}
