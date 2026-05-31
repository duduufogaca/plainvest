// ─── Shared layout ─────────────────────────────────────────────────────────

function layout(title: string, body: string, compact = false): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { margin:0; padding:0; background-color:#060d1a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased; }
    .outer { background-color:#060d1a; width:100%; padding:${compact ? '24px 16px 32px' : '40px 16px 52px'}; box-sizing:border-box; }
    .inner { max-width:580px; margin:0 auto; }
    .logo-row { text-align:center; margin-bottom:28px; }
    .card { background:#0b1929; border-radius:20px; border:1px solid rgba(0,212,170,.1); border-top:3px solid #00d4aa; padding:${compact ? '28px 28px' : '40px 36px'}; }
    .label { display:block; font-size:11px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:rgba(0,212,170,.75); margin-bottom:10px; }
    h1 { margin:0 0 10px; font-size:${compact ? '20px' : '26px'}; font-weight:900; color:#ffffff; line-height:1.2; }
    .sub { display:block; font-size:14px; color:rgba(255,255,255,.4); margin:0 0 28px; line-height:1.5; }
    p { margin:0 0 16px; font-size:15px; color:rgba(255,255,255,.7); line-height:1.7; }
    strong { color:rgba(255,255,255,.9); font-weight:700; }
    .btn-wrap { margin:20px 0 28px; }
    .btn { display:inline-block; background:#00d4aa; color:#04120e; font-size:15px; font-weight:900; padding:15px 36px; border-radius:10px; text-decoration:none; letter-spacing:.01em; }
    .divider { height:1px; background:rgba(255,255,255,.06); margin:28px 0; }
    .highlight { background:rgba(0,212,170,.07); border:1px solid rgba(0,212,170,.14); border-left:3px solid rgba(0,212,170,.5); border-radius:10px; padding:16px 18px; margin:0 0 24px; }
    .highlight p { margin:0; font-size:14px; color:rgba(255,255,255,.65); line-height:1.65; }
    .email-pill { display:inline-block; background:rgba(0,212,170,.1); border:1px solid rgba(0,212,170,.2); border-radius:8px; padding:8px 14px; font-size:14px; color:rgba(255,255,255,.8); margin:0 0 24px; word-break:break-all; }
    .checklist { list-style:none; padding:0; margin:0 0 24px; }
    .checklist li { font-size:14px; color:rgba(255,255,255,.7); padding:6px 0 6px 24px; position:relative; line-height:1.55; }
    .checklist li::before { content:'✓'; position:absolute; left:0; color:#00d4aa; font-weight:900; }
    .receipt-table { width:100%; border-collapse:collapse; margin:0 0 24px; }
    .receipt-table td { padding:10px 0; font-size:14px; color:rgba(255,255,255,.65); border-bottom:1px solid rgba(255,255,255,.06); line-height:1.5; }
    .receipt-table td:last-child { text-align:right; color:rgba(255,255,255,.85); font-weight:600; }
    .security-note { background:rgba(255,183,77,.06); border:1px solid rgba(255,183,77,.15); border-radius:10px; padding:12px 16px; margin:0 0 20px; }
    .security-note p { margin:0; font-size:13px; color:rgba(255,200,100,.75); }
    .footer { margin-top:32px; text-align:center; }
    .footer-links { font-size:13px; color:rgba(255,255,255,.3); margin:0 0 6px; line-height:1.6; }
    .footer-links a { color:rgba(0,212,170,.55); text-decoration:none; }
    .footer-legal { font-size:11px; color:rgba(255,255,255,.18); line-height:1.6; margin:0; }
    .hint { font-size:13px; color:rgba(255,255,255,.35); margin-top:4px; line-height:1.6; }
    @media (max-width:480px) {
      .card { padding:28px 20px !important; border-radius:16px !important; }
      h1 { font-size:${compact ? '18px' : '22px'} !important; }
      .btn { padding:14px 28px !important; font-size:14px !important; }
    }
  </style>
</head>
<body>
  <div class="outer">
    <div class="inner">

      <div class="logo-row">
        <a href="https://plainvest.app" style="display:inline-block;text-decoration:none;">
          <img
            src="https://members.plainvest.app/assets/LOGO%20TRANSPARENTE%20BACK.png"
            alt="Plainvest"
            width="160"
            style="display:block;width:160px;height:auto;border:0;"
          />
        </a>
      </div>

      <div class="card">${body}</div>

      <div class="footer">
        <p class="footer-links">
          <a href="https://plainvest.app">plainvest.app</a>
          &nbsp;·&nbsp;
          <a href="mailto:hello@plainvest.app">hello@plainvest.app</a>
        </p>
        <p class="footer-legal">
          Educational platform. Not financial advice.<br />
          You're receiving this because you have a Plainvest account.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;
}

// ─── 1. Welcome ──────────────────────────────────────────────────────────────

export function welcomeEmail(name: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Welcome to Plainvest', `
    <span class="label">Welcome</span>
    <h1>Welcome to Plainvest.</h1>
    <span class="sub">Your account is ready.</span>
    <p>You're now part of a platform designed to help you understand investing with clarity and confidence.</p>
    <p>Start with the Welcome Guide and follow the learning path step by step.</p>
    <span class="label">Inside your account</span>
    <ul class="checklist">
      <li>Beginner-friendly investing education</li>
      <li>Portfolio planning tools</li>
      <li>Future projections</li>
      <li>Plain-English explanations</li>
      <li>Structured learning paths</li>
    </ul>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Open My Dashboard →</a></div>
    <p class="hint">Questions? Reply to this email anytime — we're happy to help.</p>
  `);
}

// ─── 2. Newsletter confirmation ───────────────────────────────────────────────

export function newsletterConfirmationEmail(email: string): string {
  return layout("You're subscribed to Plainvest Insights", `
    <span class="label">Subscribed</span>
    <h1>You're on the list.</h1>
    <p>Thanks for joining the Plainvest insights list. We'll occasionally send:</p>
    <ul class="checklist">
      <li>Investing education</li>
      <li>Market insights</li>
      <li>Platform updates</li>
      <li>New guides and resources</li>
    </ul>
    <p style="font-size:13px;color:rgba(255,255,255,.35);margin-bottom:24px;">No spam. Unsubscribe anytime.</p>
    <span class="label" style="margin-bottom:6px;">Confirmed address</span>
    <div class="email-pill">${email}</div>
    <div class="btn-wrap"><a href="https://plainvest.app" class="btn">Explore Plainvest →</a></div>
  `);
}

// ─── 3. Password reset ────────────────────────────────────────────────────────

export function passwordResetEmail(name: string, resetLink: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Reset your Plainvest password', `
    <span class="label">Password reset</span>
    <h1>Reset your password.</h1>
    <span class="sub">Requested for ${firstName}'s account.</span>
    <p>We received a request to reset your Plainvest password. Click the button below to choose a new one.</p>
    <p>If you didn't request this change, you can safely ignore this email — your account remains secure.</p>
    <div class="btn-wrap"><a href="${resetLink}" class="btn">Reset Password →</a></div>
    <div class="security-note">
      <p>⏱ This link expires in 30 minutes. After that, you'll need to request a new one.</p>
    </div>
    <p class="hint">Need help? Reply to this email or contact hello@plainvest.app.</p>
  `);
}

// ─── 4. Password changed ──────────────────────────────────────────────────────

export function passwordChangedEmail(name: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Your password was updated — Plainvest', `
    <span class="label">Security notice</span>
    <h1>Your password was updated.</h1>
    <span class="sub">Hi ${firstName} — this is a confirmation for your records.</span>
    <p>Your Plainvest password has been successfully changed. You can now log in with your new password.</p>
    <p>If you did <strong>not</strong> make this change, contact us immediately at hello@plainvest.app and reset your password right away.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Open Account →</a></div>
  `);
}

// ─── 5. Pro activated ─────────────────────────────────────────────────────────

export function proWelcomeEmail(name: string, email: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Welcome to Plainvest Pro', `
    <span class="label">Pro membership confirmed</span>
    <h1>Welcome to Plainvest Pro.</h1>
    <span class="sub">Full platform access is now active.</span>
    <p>Your Pro membership is now active. You have access to every tool on the platform.</p>
    <span class="label" style="margin-bottom:6px;">Account</span>
    <div class="email-pill">${email}</div>
    <span class="label">Your Pro access includes</span>
    <ul class="checklist">
      <li>Portfolio tracking dashboard</li>
      <li>Future projections &amp; 20-year outlook</li>
      <li>Freedom Score™</li>
      <li>Goal tracking &amp; investing insights</li>
      <li>All investing guides</li>
      <li>60-minute onboarding Zoom call (included)</li>
      <li>All future guides and tools</li>
    </ul>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Open Pro Dashboard →</a></div>
    <div class="divider"></div>
    <span class="label">Your included Zoom call</span>
    <p>Your plan includes a 60-minute onboarding call. Once you've completed the first 2–3 guides, reply to this email to schedule it.</p>
    <p class="hint">Questions? Reply to this email anytime.</p>
  `);
}

// ─── 6. Lifetime (Premium) activated ─────────────────────────────────────────

export function premiumWelcomeEmail(name: string, email: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Welcome to Plainvest Lifetime', `
    <span class="label">Lifetime access confirmed</span>
    <h1>Welcome to Plainvest Lifetime.</h1>
    <span class="sub">Permanent access · One-time payment · No recurring fees.</span>
    <p>Your Lifetime access is now active. Everything is unlocked and ready for you.</p>
    <span class="label" style="margin-bottom:6px;">Account</span>
    <div class="email-pill">${email}</div>
    <span class="label">Your Lifetime access includes</span>
    <ul class="checklist">
      <li>All investing guides — forever</li>
      <li>Bitcoin &amp; ETF education</li>
      <li>Beginner roadmap</li>
      <li>Included Zoom support call</li>
      <li>Lifetime access to new guides</li>
    </ul>
    <p style="font-size:13px;color:rgba(255,255,255,.4);margin-bottom:24px;">No recurring fees. Ever.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Start Learning →</a></div>
    <div class="divider"></div>
    <span class="label">Your included Zoom call</span>
    <p>Once you've completed the first 2–3 guides, reply to this email to schedule your 60-minute onboarding call.</p>
    <p class="hint">Questions? Reply to this email anytime.</p>
  `);
}

// ─── 7. Payment receipt ───────────────────────────────────────────────────────

export function paymentReceiptEmail(name: string, data: {
  product: string;
  price: string;
  date: string;
  transactionId: string;
}): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Your Plainvest receipt', `
    <span class="label">Payment confirmed</span>
    <h1>Your Plainvest receipt.</h1>
    <span class="sub">Thank you for your purchase, ${firstName}.</span>
    <table class="receipt-table">
      <tr><td>Product</td><td>${data.product}</td></tr>
      <tr><td>Price</td><td>${data.price}</td></tr>
      <tr><td>Date</td><td>${data.date}</td></tr>
      <tr><td>Transaction ID</td><td style="font-size:12px;font-family:monospace;">${data.transactionId}</td></tr>
    </table>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">View Account →</a></div>
    <p class="hint">Keep this email as your record. Questions? Reply anytime.</p>
  `);
}

// ─── 8. Zoom call confirmation ────────────────────────────────────────────────

export function supportCallConfirmationEmail(name: string, email: string, data?: {
  date?: string;
  time?: string;
  meetingLink?: string;
}): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  const hasDetails = data?.date || data?.time || data?.meetingLink;
  return layout('Your Plainvest support call is confirmed', `
    <span class="label">Zoom call confirmed</span>
    <h1>Your call has been booked.</h1>
    <span class="sub">60-minute 1-on-1 session</span>
    <p>Your Plainvest support call is confirmed. ${hasDetails ? '' : "We'll be in touch within 24 hours to send your Zoom link and preferred time."}</p>
    ${hasDetails ? `
    <div class="highlight">
      <p>
        ${data?.date ? `<strong>Date:</strong> ${data.date}<br />` : ''}
        ${data?.time ? `<strong>Time:</strong> ${data.time}<br />` : ''}
        ${data?.meetingLink ? `<strong>Meeting Link:</strong> <a href="${data.meetingLink}" style="color:#00d4aa;">${data.meetingLink}</a>` : ''}
      </p>
    </div>` : ''}
    <span class="label">Bring questions about</span>
    <ul class="checklist">
      <li>ETFs and how to use them</li>
      <li>Bitcoin basics and custody</li>
      <li>Dollar-cost averaging (DCA)</li>
      <li>Portfolio construction</li>
      <li>Getting started — where to begin</li>
    </ul>
    <span class="label" style="margin-bottom:6px;">Confirmation sent to</span>
    <div class="email-pill">${email}</div>
    ${data?.meetingLink ? `<div class="btn-wrap"><a href="${data.meetingLink}" class="btn">View Booking →</a></div>` : ''}
    <p class="hint">Need to reschedule? Reply to this email anytime.</p>
  `);
}

// ─── 9. Zoom call reminder ────────────────────────────────────────────────────

export function supportCallReminderEmail(name: string, data: {
  date: string;
  time: string;
  meetingLink: string;
}): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Reminder: your Plainvest support call', `
    <span class="label">Call reminder</span>
    <h1>Your call is tomorrow, ${firstName}.</h1>
    <div class="highlight">
      <p>
        <strong>Date:</strong> ${data.date}<br />
        <strong>Time:</strong> ${data.time}<br />
        <strong>Meeting Link:</strong> <a href="${data.meetingLink}" style="color:#00d4aa;">${data.meetingLink}</a>
      </p>
    </div>
    <p>Come with your questions and a clear idea of where you're at — we'll make the most of the 60 minutes.</p>
    <div class="btn-wrap"><a href="${data.meetingLink}" class="btn">Join Call →</a></div>
    <p class="hint">Need to reschedule? Reply to this email as soon as possible.</p>
  `);
}

// ─── 10. New guide published ──────────────────────────────────────────────────

export function newGuideEmail(name: string, guide: {
  title: string;
  description: string;
  url: string;
}): string {
  return layout('New guide available on Plainvest', `
    <span class="label">New guide</span>
    <h1>A new guide is available.</h1>
    <p>We've added a new guide to help you continue building your investing knowledge.</p>
    <div class="highlight">
      <p><strong>${guide.title}</strong><br />${guide.description}</p>
    </div>
    <div class="btn-wrap"><a href="${guide.url}" class="btn">Read Guide →</a></div>
    <p class="hint">Questions about the guide? Reply to this email anytime.</p>
  `);
}

// ─── 11. Progress milestone ───────────────────────────────────────────────────

export function milestoneEmail(name: string, data: {
  completed: number;
  total: number;
  milestone: string;
}): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout("You've reached a new milestone — Plainvest", `
    <span class="label">Milestone reached</span>
    <h1>Great work, ${firstName}.</h1>
    <span class="sub">${data.milestone}</span>
    <p>You've completed <strong>${data.completed} of ${data.total} guides</strong>. Keep building your investing foundation — the most important step is the one in front of you.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Continue Learning →</a></div>
  `);
}

// ─── 12. Re-engagement ───────────────────────────────────────────────────────

export function reengagementEmail(name: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Ready to continue your investing journey? — Plainvest', `
    <span class="label">We miss you</span>
    <h1>Ready to continue, ${firstName}?</h1>
    <p>You've already made progress inside Plainvest. Your guides, tools, and learning path are right where you left them.</p>
    <p>Building financial knowledge takes time — and every step matters. Come back and continue where you left off.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Resume Learning →</a></div>
    <p class="hint">Questions or need help getting started? Reply to this email anytime.</p>
  `);
}

// ─── 13. Promotion ───────────────────────────────────────────────────────────

export function promotionEmail(data: {
  subject: string;
  headline: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  subtext?: string;
}): string {
  return layout(data.subject, `
    <span class="label">Plainvest</span>
    <h1>${data.headline}</h1>
    <p>${data.body}</p>
    ${data.subtext ? `<p style="font-size:13px;color:rgba(255,255,255,.4);">${data.subtext}</p>` : ''}
    <div class="btn-wrap"><a href="${data.ctaUrl}" class="btn">${data.ctaText} →</a></div>
    <p class="hint">Questions? Reply to this email anytime.</p>
  `);
}

// ─── 14. Subscription cancelled ──────────────────────────────────────────────

export function subscriptionCancelledEmail(name: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Your Pro subscription has been cancelled — Plainvest', `
    <span class="label">Subscription update</span>
    <h1>Your subscription has been cancelled.</h1>
    <span class="sub">Hi ${firstName} — this is a confirmation for your records.</span>
    <p>Your Plainvest Pro subscription has been cancelled. You'll retain access until the end of your current billing period.</p>
    <p>If you cancelled by mistake or have any questions, reply to this email and we'll sort it out.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Open Account →</a></div>
    <p class="hint">We're sorry to see you go. If there's anything we can improve, reply and let us know.</p>
  `);
}

// ─── 15. Subscription renewed ────────────────────────────────────────────────

export function subscriptionRenewedEmail(name: string, data: {
  price: string;
  nextRenewal: string;
}): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Your Pro subscription renewed — Plainvest', `
    <span class="label">Subscription renewed</span>
    <h1>Your subscription renewed successfully.</h1>
    <span class="sub">Hi ${firstName} — your Pro access continues uninterrupted.</span>
    <table class="receipt-table">
      <tr><td>Amount charged</td><td>${data.price}</td></tr>
      <tr><td>Next renewal</td><td>${data.nextRenewal}</td></tr>
    </table>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Open Dashboard →</a></div>
    <p class="hint">Questions about your subscription? Reply to this email anytime.</p>
  `);
}

// ─── 16. Failed payment ───────────────────────────────────────────────────────

export function paymentFailedEmail(name: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Payment issue — Plainvest', `
    <span class="label">Payment notice</span>
    <h1>We couldn't process your payment.</h1>
    <span class="sub">Hi ${firstName} — action may be required.</span>
    <p>We were unable to process your most recent Plainvest payment. This can happen if your card expired or has insufficient funds.</p>
    <p>Please update your payment details to keep your access active.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Update Payment →</a></div>
    <p class="hint">Need help? Reply to this email or contact hello@plainvest.app.</p>
  `);
}

// ─── 17. Email verification ───────────────────────────────────────────────────

export function emailVerificationEmail(name: string, verifyLink: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Verify your email — Plainvest', `
    <span class="label">Verify your email</span>
    <h1>Confirm your email address.</h1>
    <span class="sub">Almost there, ${firstName}.</span>
    <p>Click the button below to verify your email address and activate your Plainvest account.</p>
    <div class="btn-wrap"><a href="${verifyLink}" class="btn">Verify Email →</a></div>
    <div class="security-note">
      <p>⏱ This link expires in 24 hours. If you didn't create a Plainvest account, you can ignore this email.</p>
    </div>
  `);
}

// ─── 18. Waitlist confirmation ────────────────────────────────────────────────

export function waitlistConfirmationEmail(email: string): string {
  return layout("You're on the waitlist — Plainvest", `
    <span class="label">Waitlist</span>
    <h1>You're on the list.</h1>
    <p>Thanks for your interest. We'll notify you as soon as a spot opens up.</p>
    <span class="label" style="margin-bottom:6px;">Confirmed address</span>
    <div class="email-pill">${email}</div>
    <p class="hint">Questions? Reply to this email anytime.</p>
  `);
}

// ─── 19. Contact confirmation ─────────────────────────────────────────────────

export function contactConfirmationEmail(name: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Message received — Plainvest', `
    <span class="label">Support</span>
    <h1>We received your message, ${firstName}.</h1>
    <p>We'll get back to you within 1–2 business days.</p>
    <p>In the meantime, feel free to explore the guides and tools at your own pace.</p>
    <div class="btn-wrap"><a href="https://plainvest.app" class="btn">Explore Plainvest →</a></div>
    <p class="hint">Questions? Reply to this email anytime.</p>
  `);
}

// ─── Admin notification emails ───────────────────────────────────────────────

export function adminNewUserEmail(data: {
  name: string;
  email: string;
  date: string;
}): string {
  return layout('New user — Plainvest', `
    <span class="label">New account</span>
    <h1>New user registered.</h1>
    <div class="highlight">
      <p>
        <strong>Name:</strong> ${data.name || '—'}<br />
        <strong>Email:</strong> ${data.email}<br />
        <strong>Date:</strong> ${data.date}
      </p>
    </div>
  `, true);
}

export function adminNewSubscriberEmail(data: {
  email: string;
  language: string;
  page: string;
}): string {
  return layout('New newsletter signup — Plainvest', `
    <span class="label">Newsletter signup</span>
    <h1>New subscriber.</h1>
    <div class="highlight">
      <p>
        <strong>Email:</strong> ${data.email}<br />
        <strong>Language:</strong> ${data.language}<br />
        <strong>Source:</strong> ${data.page}
      </p>
    </div>
  `, true);
}

export function adminNewProPurchaseEmail(data: {
  customer: string;
  amount: string;
  transactionId: string;
  date: string;
}): string {
  return layout('New Pro purchase — Plainvest', `
    <span class="label">New Pro purchase</span>
    <h1>Pro membership sold.</h1>
    <div class="highlight">
      <p>
        <strong>Customer:</strong> ${data.customer}<br />
        <strong>Amount:</strong> ${data.amount}<br />
        <strong>Transaction ID:</strong> <span style="font-family:monospace;font-size:12px;">${data.transactionId}</span><br />
        <strong>Date:</strong> ${data.date}
      </p>
    </div>
  `, true);
}

export function adminNewLifetimePurchaseEmail(data: {
  customer: string;
  amount: string;
  transactionId: string;
  date: string;
}): string {
  return layout('New Lifetime purchase — Plainvest', `
    <span class="label">New Lifetime purchase</span>
    <h1>Lifetime access sold.</h1>
    <div class="highlight">
      <p>
        <strong>Customer:</strong> ${data.customer}<br />
        <strong>Amount:</strong> ${data.amount}<br />
        <strong>Transaction ID:</strong> <span style="font-family:monospace;font-size:12px;">${data.transactionId}</span><br />
        <strong>Date:</strong> ${data.date}
      </p>
    </div>
  `, true);
}

export function adminNewZoomBookingEmail(data: {
  customer: string;
  email: string;
  date?: string;
  time?: string;
}): string {
  return layout('New Zoom booking — Plainvest', `
    <span class="label">New Zoom booking</span>
    <h1>Support call booked.</h1>
    <div class="highlight">
      <p>
        <strong>Customer:</strong> ${data.customer}<br />
        <strong>Email:</strong> ${data.email}<br />
        ${data.date ? `<strong>Date:</strong> ${data.date}<br />` : ''}
        ${data.time ? `<strong>Time:</strong> ${data.time}` : ''}
      </p>
    </div>
  `, true);
}

export function contactNotificationEmail(data: {
  formType: string;
  name: string;
  email: string;
  topic?: string;
  company?: string;
  message: string;
  language: string;
  page: string;
}): string {
  return layout(`New ${data.formType} — Plainvest`, `
    <span class="label">${data.formType}</span>
    <h1>New ${data.formType}.</h1>
    <div class="highlight">
      <p>
        <strong>Name:</strong> ${data.name}<br />
        <strong>Email:</strong> ${data.email}<br />
        ${data.company ? `<strong>Company:</strong> ${data.company}<br />` : ''}
        ${data.topic ? `<strong>Topic:</strong> ${data.topic}<br />` : ''}
        <strong>Language:</strong> ${data.language}<br />
        <strong>Page:</strong> ${data.page}
      </p>
    </div>
    <span class="label">Message</span>
    <p style="white-space:pre-wrap;font-size:14px;">${data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
  `, true);
}

// Legacy alias — kept for backwards compat
export function newsletterNotificationEmail(email: string, language: string, page: string): string {
  return adminNewSubscriberEmail({ email, language, page });
}
