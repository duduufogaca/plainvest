import { getResendClient, FROM_ADDRESS, ADMIN_EMAIL } from './client';
import {
  welcomeEmail,
  passwordChangedEmail,
  premiumWelcomeEmail,
  proWelcomeEmail,
  supportCallConfirmationEmail,
  contactNotificationEmail,
  contactConfirmationEmail,
  newsletterConfirmationEmail,
  newsletterNotificationEmail,
} from './templates';

async function send(to: string, subject: string, html: string): Promise<void> {
  const resend = getResendClient();
  const { error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await send(to, 'Welcome to Plainvest', welcomeEmail(name));
}

export async function sendPasswordChangedEmail(to: string, name: string): Promise<void> {
  await send(to, 'Your Plainvest password was changed', passwordChangedEmail(name));
}

export async function sendPremiumWelcomeEmail(to: string, name: string): Promise<void> {
  await send(to, 'Welcome to Plainvest Premium', premiumWelcomeEmail(name, to));
}

export async function sendProWelcomeEmail(to: string, name: string): Promise<void> {
  await send(to, 'Welcome to Plainvest Pro', proWelcomeEmail(name, to));
}

export async function sendSupportCallConfirmationEmail(to: string, name: string): Promise<void> {
  await send(to, 'Your Zoom call is confirmed — Plainvest', supportCallConfirmationEmail(name, to));
}

export async function sendContactNotification(data: {
  formType: string;
  name: string;
  email: string;
  topic?: string;
  company?: string;
  message: string;
  language: string;
  page: string;
}): Promise<void> {
  await send(ADMIN_EMAIL, `New ${data.formType} from ${data.name}`, contactNotificationEmail(data));
}

export async function sendContactConfirmation(to: string, name: string): Promise<void> {
  await send(to, "We received your message — Plainvest", contactConfirmationEmail(name));
}

export async function sendNewsletterConfirmation(to: string): Promise<void> {
  await send(to, "You're on the Plainvest list", newsletterConfirmationEmail(to));
}

export async function sendNewsletterNotification(email: string, language: string, page: string): Promise<void> {
  await send(ADMIN_EMAIL, `New newsletter signup — ${email}`, newsletterNotificationEmail(email, language, page));
}
