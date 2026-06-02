import { getResendClient, FROM_ADDRESS, ADMIN_EMAIL } from './client';
import {
  welcomeEmail,
  newsletterConfirmRequestEmail,
  newsletterConfirmationEmail,
  passwordResetEmail,
  passwordChangedEmail,
  proWelcomeEmail,
  premiumWelcomeEmail,
  paymentReceiptEmail,
  refundProcessedEmail,
  adminRefundEmail,
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

async function send(to: string, subject: string, html: string, unsubscribeUrl?: string): Promise<void> {
  const resend = getResendClient();
  const headers = unsubscribeUrl
    ? { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' }
    : undefined;
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS, to, subject, html, ...(headers ? { headers } : {}),
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}

// ─── User emails ─────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await send(to, 'Welcome to Plainvest', welcomeEmail(name));
}

export async function sendNewsletterConfirmRequest(to: string, confirmUrl: string): Promise<void> {
  await send(to, 'Confirm your Plainvest subscription', newsletterConfirmRequestEmail(to, confirmUrl));
}

export async function sendNewsletterConfirmation(to: string, unsubscribeUrl?: string): Promise<void> {
  await send(to, "You're on the Plainvest list", newsletterConfirmationEmail(to, unsubscribeUrl), unsubscribeUrl);
}

export async function sendPasswordResetEmail(to: string, name: string, resetLink: string): Promise<void> {
  await send(to, 'Reset your Plainvest password', passwordResetEmail(name, resetLink));
}

export async function sendPasswordChangedEmail(to: string, name: string): Promise<void> {
  await send(to, 'Your password was updated — Plainvest', passwordChangedEmail(name));
}

export async function sendProWelcomeEmail(to: string, name: string): Promise<void> {
  await send(to, 'Your Plainvest Pro dashboard is ready', proWelcomeEmail(name, to));
}

export async function sendPremiumWelcomeEmail(to: string, name: string): Promise<void> {
  await send(to, 'Your Plainvest access is ready', premiumWelcomeEmail(name, to));
}

export async function sendPaymentReceiptEmail(to: string, name: string, data: {
  product: string;
  price: string;
  date: string;
  transactionId: string;
}): Promise<void> {
  await send(to, 'Your Plainvest receipt', paymentReceiptEmail(name, data));
}

export async function sendRefundEmail(to: string, name: string, data: {
  product: string;
  amount: string;
  date: string;
  transactionId: string;
}): Promise<void> {
  await send(to, 'Your Plainvest refund has been processed', refundProcessedEmail(name, data));
}

export async function sendSupportCallConfirmationEmail(to: string, name: string, data?: {
  date?: string;
  time?: string;
  meetingLink?: string;
}): Promise<void> {
  await send(to, 'Your Plainvest support call is booked', supportCallConfirmationEmail(name, to, data));
}

export async function sendSupportCallReminderEmail(to: string, name: string, data: {
  date: string;
  time: string;
  meetingLink: string;
}): Promise<void> {
  await send(to, 'Your Plainvest support call is tomorrow', supportCallReminderEmail(name, data));
}

export async function sendNewGuideEmail(to: string, name: string, guide: {
  title: string;
  description: string;
  url: string;
}, unsubscribeUrl?: string): Promise<void> {
  await send(to, 'New Plainvest guide available', newGuideEmail(name, guide, unsubscribeUrl), unsubscribeUrl);
}

export async function sendMilestoneEmail(to: string, name: string, data: {
  completed: number;
  total: number;
  milestone: string;
}, unsubscribeUrl?: string): Promise<void> {
  await send(to, 'You reached a Plainvest milestone', milestoneEmail(name, data, unsubscribeUrl), unsubscribeUrl);
}

export async function sendReengagementEmail(to: string, name: string, unsubscribeUrl?: string): Promise<void> {
  await send(to, 'Continue where you left off', reengagementEmail(name, undefined, unsubscribeUrl), unsubscribeUrl);
}

export async function sendPromotionEmail(to: string, data: {
  subject: string;
  headline: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  subtext?: string;
}, unsubscribeUrl?: string): Promise<void> {
  await send(to, data.subject, promotionEmail(data, unsubscribeUrl), unsubscribeUrl);
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
  await send(to, 'Verify your Plainvest email', emailVerificationEmail(name, verifyLink));
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

export async function sendNewsletterNotification(email: string, language: string, page: string, extra?: {
  date?: string;
  country?: string;
  utmSource?: string;
}): Promise<void> {
  await send(ADMIN_EMAIL, `New subscriber: ${email}`, adminNewSubscriberEmail({ email, language, page, ...extra }));
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

export async function sendAdminRefund(data: {
  customer: string;
  email: string;
  amount: string;
  transactionId: string;
  date: string;
}): Promise<void> {
  await send(ADMIN_EMAIL, `Refund processed: ${data.customer}`, adminRefundEmail(data));
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
