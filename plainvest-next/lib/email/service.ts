import { getResendClient, FROM_ADDRESS, ADMIN_EMAIL } from './client';
import {
  welcomeEmail,
  newsletterConfirmationEmail,
  passwordResetEmail,
  passwordChangedEmail,
  proWelcomeEmail,
  premiumWelcomeEmail,
  paymentReceiptEmail,
  supportCallConfirmationEmail,
  supportCallReminderEmail,
  newGuideEmail,
  milestoneEmail,
  reengagementEmail,
  promotionEmail,
  subscriptionCancelledEmail,
  subscriptionRenewedEmail,
  paymentFailedEmail,
  emailVerificationEmail,
  waitlistConfirmationEmail,
  contactConfirmationEmail,
  contactNotificationEmail,
  adminNewUserEmail,
  adminNewSubscriberEmail,
  adminNewProPurchaseEmail,
  adminNewLifetimePurchaseEmail,
  adminNewZoomBookingEmail,
} from './templates';

async function send(to: string, subject: string, html: string): Promise<void> {
  const resend = getResendClient();
  const { error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

// ─── User emails ─────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await send(to, 'Welcome to Plainvest', welcomeEmail(name));
}

export async function sendNewsletterConfirmation(to: string): Promise<void> {
  await send(to, "You're subscribed to Plainvest Insights", newsletterConfirmationEmail(to));
}

export async function sendPasswordResetEmail(to: string, name: string, resetLink: string): Promise<void> {
  await send(to, 'Reset your Plainvest password', passwordResetEmail(name, resetLink));
}

export async function sendPasswordChangedEmail(to: string, name: string): Promise<void> {
  await send(to, 'Your password was updated — Plainvest', passwordChangedEmail(name));
}

export async function sendProWelcomeEmail(to: string, name: string): Promise<void> {
  await send(to, 'Welcome to Plainvest Pro', proWelcomeEmail(name, to));
}

export async function sendPremiumWelcomeEmail(to: string, name: string): Promise<void> {
  await send(to, 'Welcome to Plainvest Lifetime', premiumWelcomeEmail(name, to));
}

export async function sendPaymentReceiptEmail(to: string, name: string, data: {
  product: string;
  price: string;
  date: string;
  transactionId: string;
}): Promise<void> {
  await send(to, 'Your Plainvest receipt', paymentReceiptEmail(name, data));
}

export async function sendSupportCallConfirmationEmail(to: string, name: string, data?: {
  date?: string;
  time?: string;
  meetingLink?: string;
}): Promise<void> {
  await send(to, 'Your Plainvest support call is confirmed', supportCallConfirmationEmail(name, to, data));
}

export async function sendSupportCallReminderEmail(to: string, name: string, data: {
  date: string;
  time: string;
  meetingLink: string;
}): Promise<void> {
  await send(to, 'Reminder: your Plainvest support call', supportCallReminderEmail(name, data));
}

export async function sendNewGuideEmail(to: string, name: string, guide: {
  title: string;
  description: string;
  url: string;
}): Promise<void> {
  await send(to, 'New guide available on Plainvest', newGuideEmail(name, guide));
}

export async function sendMilestoneEmail(to: string, name: string, data: {
  completed: number;
  total: number;
  milestone: string;
}): Promise<void> {
  await send(to, "You've reached a new milestone — Plainvest", milestoneEmail(name, data));
}

export async function sendReengagementEmail(to: string, name: string): Promise<void> {
  await send(to, 'Ready to continue your investing journey?', reengagementEmail(name));
}

export async function sendPromotionEmail(to: string, data: {
  subject: string;
  headline: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  subtext?: string;
}): Promise<void> {
  await send(to, data.subject, promotionEmail(data));
}

export async function sendSubscriptionCancelledEmail(to: string, name: string): Promise<void> {
  await send(to, 'Your Pro subscription has been cancelled — Plainvest', subscriptionCancelledEmail(name));
}

export async function sendSubscriptionRenewedEmail(to: string, name: string, data: {
  price: string;
  nextRenewal: string;
}): Promise<void> {
  await send(to, 'Your Pro subscription renewed — Plainvest', subscriptionRenewedEmail(name, data));
}

export async function sendPaymentFailedEmail(to: string, name: string): Promise<void> {
  await send(to, 'Payment issue — Plainvest', paymentFailedEmail(name));
}

export async function sendEmailVerification(to: string, name: string, verifyLink: string): Promise<void> {
  await send(to, 'Verify your email — Plainvest', emailVerificationEmail(name, verifyLink));
}

export async function sendWaitlistConfirmation(to: string): Promise<void> {
  await send(to, "You're on the waitlist — Plainvest", waitlistConfirmationEmail(to));
}

export async function sendContactConfirmation(to: string, name: string): Promise<void> {
  await send(to, 'We received your message — Plainvest', contactConfirmationEmail(name));
}

// ─── Admin notifications ─────────────────────────────────────────────────────

export async function sendAdminNewUser(data: {
  name: string;
  email: string;
  date: string;
}): Promise<void> {
  await send(ADMIN_EMAIL, `New user: ${data.email}`, adminNewUserEmail(data));
}

export async function sendNewsletterNotification(email: string, language: string, page: string): Promise<void> {
  await send(ADMIN_EMAIL, `New subscriber: ${email}`, adminNewSubscriberEmail({ email, language, page }));
}

export async function sendAdminNewProPurchase(data: {
  customer: string;
  amount: string;
  transactionId: string;
  date: string;
}): Promise<void> {
  await send(ADMIN_EMAIL, `New Pro purchase: ${data.customer}`, adminNewProPurchaseEmail(data));
}

export async function sendAdminNewLifetimePurchase(data: {
  customer: string;
  amount: string;
  transactionId: string;
  date: string;
}): Promise<void> {
  await send(ADMIN_EMAIL, `New Lifetime purchase: ${data.customer}`, adminNewLifetimePurchaseEmail(data));
}

export async function sendAdminNewZoomBooking(data: {
  customer: string;
  email: string;
  date?: string;
  time?: string;
}): Promise<void> {
  await send(ADMIN_EMAIL, `New Zoom booking: ${data.customer}`, adminNewZoomBookingEmail(data));
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
