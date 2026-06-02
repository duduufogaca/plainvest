import { getResendClient, FROM_ADDRESS } from './client';
import {
  newsletterWelcomeEmail,
  newsletterEdu1Email,
  newsletterEdu2Email,
  newsletterEdu3Email,
  newsletterEdu4Email,
  newsletterEdu5Email,
  newsletterProductEmail,
  newsletterLifetimeEmail,
  newsletterProEmail,
} from './templates';

// Sequence definition — step 0 is handled by the newsletter API (confirmation sent immediately)
// Each entry: { subject, template, delayDays (until next step) }
// delayDays: null means this is the last step

export const NEWSLETTER_SEQUENCE = [
  null, // step 0 — placeholder (confirmation sent by API, next_send_at set to +1 day)
  { subject: 'Start here: the most important investing lesson',      template: newsletterWelcomeEmail,  delayDays: 2 },
  { subject: 'Why most beginners lose money',                        template: newsletterEdu1Email,      delayDays: 2 },
  { subject: 'The simplest investing strategy most people ignore',   template: newsletterEdu2Email,      delayDays: 2 },
  { subject: "Stocks, ETFs, Bitcoin: what's the difference?",        template: newsletterEdu3Email,      delayDays: 2 },
  { subject: 'How much do you actually need to retire?',             template: newsletterEdu4Email,      delayDays: 2 },
  { subject: "What I'd learn first if I were starting from zero",    template: newsletterEdu5Email,      delayDays: 3 },
  { subject: 'Want help building your roadmap?',                     template: newsletterProductEmail,   delayDays: 7 },
  { subject: 'Build your investing foundation for life',             template: newsletterLifetimeEmail,  delayDays: 3 },
  { subject: 'See where your future wealth could go',                template: newsletterProEmail,       delayDays: null },
] as const;

export const SEQUENCE_LENGTH = NEWSLETTER_SEQUENCE.length - 1; // 9 steps

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://members.plainvest.app';

function unsubscribeUrl(subscriberId: string): string {
  return `${BASE_URL}/api/newsletter-unsubscribe?id=${subscriberId}`;
}

function withUnsubscribeFooter(html: string, url: string): string {
  const footer = `
    <table role="presentation" width="100%" bgcolor="#07111D" style="background-color:#07111D;border-collapse:collapse;">
      <tr><td align="center" style="padding:0 16px 30px;text-align:center;background-color:#07111D;">
        <div style="max-width:440px;margin:0 auto;font-size:12px;line-height:1.6;color:#7F8FA3;">
          You are receiving this because you joined Plainvest or subscribed to Plainvest updates.
          <a href="${url}" style="color:#7F8FA3;text-decoration:underline;">Unsubscribe anytime.</a>
        </div>
      </td></tr>
    </table>`;
  return html.replace('</body>', `${footer}</body>`);
}

export async function sendSequenceStep(
  to: string,
  step: number,
  subscriberId: string,
): Promise<void> {
  const entry = NEWSLETTER_SEQUENCE[step];
  if (!entry) throw new Error(`No sequence entry for step ${step}`);

  const url = unsubscribeUrl(subscriberId);
  const html = withUnsubscribeFooter(entry.template(to), url);

  const resend = getResendClient();
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: entry.subject,
    html,
    headers: {
      'List-Unsubscribe': `<${url}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });

  if (error) throw new Error(`Resend error: ${error.message}`);
}

export function nextSendAt(delayDays: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + delayDays);
  d.setHours(9, 0, 0, 0); // 9am UTC
  return d;
}
