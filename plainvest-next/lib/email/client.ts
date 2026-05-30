import { Resend } from 'resend';

let client: Resend | null = null;

export function getResendClient(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey.startsWith('re_replace')) {
      throw new Error('RESEND_API_KEY is not configured.');
    }
    client = new Resend(apiKey);
  }
  return client;
}

export const FROM_ADDRESS =
  process.env.RESEND_FROM_EMAIL || 'Plainvest <hello@plainvest.app>';

export const ADMIN_EMAIL =
  process.env.RESEND_ADMIN_EMAIL || 'carvalhoo.freefly@gmail.com';
