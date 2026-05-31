import { NextResponse } from 'next/server';
import { getResendClient, FROM_ADDRESS, ADMIN_EMAIL } from '@/lib/email/client';
import * as T from '@/lib/email/templates';

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || '';
  const to = searchParams.get('to') || ADMIN_EMAIL;

  const MOCK = {
    name: 'Eduardo Carvalho',
    email: to,
    date: '1 June 2026',
    time: '10:00 AM AEST',
    meetingLink: 'https://zoom.us/j/123456789',
    transactionId: 'pi_test_abc123xyz',
    amount: '$89.00',
    nextRenewal: '1 June 2027',
    guideTitle: 'Understanding Dollar-Cost Averaging',
    guideDesc: 'A practical guide to DCA — what it is, why it works, and how to start.',
    guideUrl: 'https://members.plainvest.app',
  };

  type TemplateMap = Record<string, { subject: string; html: string }>;

  const templates: TemplateMap = {
    welcome:               { subject: 'Welcome to Plainvest',                           html: T.welcomeEmail(MOCK.name) },
    newsletter:            { subject: "You're on the Plainvest list",                   html: T.newsletterConfirmationEmail(to) },
    password_reset:        { subject: 'Reset your Plainvest password',                  html: T.passwordResetEmail(MOCK.name, 'https://members.plainvest.app/update-password?token=test') },
    password_changed:      { subject: 'Your password was updated — Plainvest',          html: T.passwordChangedEmail(MOCK.name) },
    pro_welcome:           { subject: 'Your Plainvest Pro dashboard is ready',          html: T.proWelcomeEmail(MOCK.name, to) },
    lifetime_welcome:      { subject: 'Your Plainvest access is ready',                 html: T.premiumWelcomeEmail(MOCK.name, to) },
    receipt:               { subject: 'Your Plainvest receipt',                         html: T.paymentReceiptEmail(MOCK.name, { product: 'Plainvest Lifetime', price: MOCK.amount, date: MOCK.date, transactionId: MOCK.transactionId }) },
    zoom_confirmation:     { subject: 'Your Plainvest support call is booked',          html: T.supportCallConfirmationEmail(MOCK.name, to, { date: MOCK.date, time: MOCK.time, meetingLink: MOCK.meetingLink }) },
    zoom_reminder:         { subject: 'Your Plainvest support call is tomorrow',        html: T.supportCallReminderEmail(MOCK.name, { date: MOCK.date, time: MOCK.time, meetingLink: MOCK.meetingLink }) },
    new_guide:             { subject: 'New Plainvest guide available',                  html: T.newGuideEmail(MOCK.name, { title: MOCK.guideTitle, description: MOCK.guideDesc, url: MOCK.guideUrl }) },
    milestone:             { subject: 'You reached a Plainvest milestone',              html: T.milestoneEmail(MOCK.name, { completed: 5, total: 18, milestone: '5 guides completed — 28% done' }) },
    reengagement:          { subject: 'Continue where you left off',                    html: T.reengagementEmail(MOCK.name) },
    promotion:             { subject: 'Build your investing confidence with Plainvest', html: T.promotionEmail({ subject: 'Build your investing confidence with Plainvest', headline: 'Build clarity before risking money.', body: 'Plainvest gives you a structured learning path, investing tools, and future projections — all in one place, built for beginners.', ctaText: 'Get Lifetime Access', ctaUrl: 'https://plainvest.app', subtext: 'One-time payment. No recurring fees.' }) },
    sub_cancelled:         { subject: 'Your Pro subscription has been cancelled',       html: T.subscriptionCancelledEmail(MOCK.name) },
    sub_renewed:           { subject: 'Your Pro subscription renewed — Plainvest',      html: T.subscriptionRenewedEmail(MOCK.name, { price: MOCK.amount, nextRenewal: MOCK.nextRenewal }) },
    payment_failed:        { subject: 'Payment issue — Plainvest',                      html: T.paymentFailedEmail(MOCK.name) },
    email_verification:    { subject: 'Verify your Plainvest email',                    html: T.emailVerificationEmail(MOCK.name, 'https://members.plainvest.app/auth/callback?token=test') },
    waitlist:              { subject: "You're on the waitlist — Plainvest",              html: T.waitlistConfirmationEmail(to) },
    contact_confirmation:  { subject: 'We received your message — Plainvest',           html: T.contactConfirmationEmail(MOCK.name) },
    admin_new_user:        { subject: 'New user — Plainvest',                          html: T.adminNewUserEmail({ name: MOCK.name, email: to, date: MOCK.date }) },
    admin_new_subscriber:  { subject: 'New newsletter signup — Plainvest',             html: T.adminNewSubscriberEmail({ email: to, language: 'English', page: 'plainvest.app' }) },
    admin_pro_purchase:    { subject: 'New Pro purchase — Plainvest',                  html: T.adminNewProPurchaseEmail({ customer: to, amount: MOCK.amount, transactionId: MOCK.transactionId, date: MOCK.date }) },
    admin_lifetime:        { subject: 'New Lifetime purchase — Plainvest',             html: T.adminNewLifetimePurchaseEmail({ customer: to, amount: MOCK.amount, transactionId: MOCK.transactionId, date: MOCK.date }) },
    admin_zoom:            { subject: 'New Zoom booking — Plainvest',                  html: T.adminNewZoomBookingEmail({ customer: MOCK.name, email: to, date: MOCK.date, time: MOCK.time }) },
    contact_notification:  { subject: 'New Contact from Eduardo — Plainvest',          html: T.contactNotificationEmail({ formType: 'Contact', name: MOCK.name, email: to, topic: 'Getting started', message: 'Hi, I have a question about ETFs and how to start investing.', language: 'English', page: 'plainvest.app/contact' }) },
    nl_welcome:            { subject: 'Start here: the most important investing lesson', html: T.newsletterWelcomeEmail(to) },
    nl_edu1:               { subject: 'Why most beginners lose money',                   html: T.newsletterEdu1Email(to) },
    nl_edu2:               { subject: 'The simplest investing strategy most people ignore', html: T.newsletterEdu2Email(to) },
    nl_edu3:               { subject: "Stocks, ETFs, Bitcoin: what's the difference?",   html: T.newsletterEdu3Email(to) },
    nl_edu4:               { subject: 'How much do you actually need to retire?',         html: T.newsletterEdu4Email(to) },
    nl_edu5:               { subject: "What I'd learn first if I were starting from zero", html: T.newsletterEdu5Email(to) },
    nl_product:            { subject: 'Want help building your roadmap?',                 html: T.newsletterProductEmail(to) },
    nl_lifetime:           { subject: 'Build your investing foundation for life',         html: T.newsletterLifetimeEmail(to) },
    nl_pro:                { subject: 'See where your future wealth could go',            html: T.newsletterProEmail(to) },
  };

  // List all available types
  if (!type || type === 'list') {
    return NextResponse.json({ available: Object.keys(templates) });
  }

  const tpl = templates[type];
  if (!tpl) {
    return NextResponse.json({ error: `Unknown type "${type}". Use ?type=list to see all.` }, { status: 400 });
  }

  // Preview in browser (no send)
  if (searchParams.get('preview') === '1') {
    return new Response(tpl.html, { headers: { 'Content-Type': 'text/html' } });
  }

  // Send via Resend
  const resend = getResendClient();
  const { error } = await resend.emails.send({ from: FROM_ADDRESS, to, subject: tpl.subject, html: tpl.html });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, sent_to: to, type, subject: tpl.subject });
}
