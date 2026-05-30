// ─── Shared layout ─────────────────────────────────────────────────────────

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background: #071120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .wrap { max-width: 580px; margin: 0 auto; padding: 32px 16px 48px; }
    .logo { font-size: 18px; font-weight: 900; color: #00d4aa; letter-spacing: -.02em; margin-bottom: 32px; }
    .card { background: #0e1e35; border-radius: 16px; border: 1px solid rgba(0,212,170,.12); border-top: 3px solid #00d4aa; padding: 32px 28px; }
    h1 { margin: 0 0 8px; font-size: 22px; font-weight: 800; color: #f0f6ff; line-height: 1.25; }
    .sub { font-size: 14px; color: rgba(255,255,255,.45); margin: 0 0 24px; line-height: 1.5; }
    p { margin: 0 0 16px; font-size: 15px; color: rgba(255,255,255,.72); line-height: 1.65; }
    .btn { display: inline-block; background: #00d4aa; color: #071410; font-size: 15px; font-weight: 900; padding: 13px 28px; border-radius: 10px; text-decoration: none; margin: 8px 0 24px; }
    .divider { height: 1px; background: rgba(255,255,255,.07); margin: 24px 0; }
    .checklist { list-style: none; padding: 0; margin: 0 0 20px; }
    .checklist li { font-size: 14px; color: rgba(255,255,255,.7); padding: 5px 0 5px 22px; position: relative; line-height: 1.5; }
    .checklist li::before { content: '✓'; position: absolute; left: 0; color: #00d4aa; font-weight: 900; }
    .highlight { background: rgba(0,212,170,.08); border: 1px solid rgba(0,212,170,.15); border-radius: 10px; padding: 14px 16px; margin: 0 0 20px; }
    .highlight p { margin: 0; font-size: 14px; color: rgba(255,255,255,.65); }
    .label { font-size: 11px; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; color: rgba(0,212,170,.7); margin-bottom: 6px; }
    .footer { margin-top: 28px; text-align: center; font-size: 12px; color: rgba(255,255,255,.22); line-height: 1.6; }
    .footer a { color: rgba(0,212,170,.5); text-decoration: none; }
    @media (max-width: 480px) { .card { padding: 24px 18px; } h1 { font-size: 19px; } }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">◈ Plainvest</div>
    <div class="card">${body}</div>
    <div class="footer">
      Plainvest · Educational investing platform<br />
      <a href="https://plainvest.app">plainvest.app</a> · <a href="mailto:hello@plainvest.app">hello@plainvest.app</a><br />
      <br />You're receiving this because you have a Plainvest account.
    </div>
  </div>
</body>
</html>`;
}

// ─── Auth emails ────────────────────────────────────────────────────────────

export function welcomeEmail(name: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Welcome to Plainvest', `
    <div class="label">Welcome</div>
    <h1>You're in, ${firstName}.</h1>
    <p class="sub">Your Plainvest account is ready.</p>
    <p>Thanks for joining Plainvest. Your account is set up and ready to go.</p>
    <p>Once you've confirmed your email and completed your membership, you'll unlock the full learning hub — 18 structured guides built for beginner investors.</p>
    <div class="divider"></div>
    <div class="label">What's inside</div>
    <ul class="checklist">
      <li>18 structured investing guides</li>
      <li>Bitcoin & ETF education</li>
      <li>Investment simulator</li>
      <li>Curated book reading path</li>
      <li>Portfolio tracking dashboard</li>
    </ul>
    <a href="https://members.plainvest.app" class="btn">Open Member Hub →</a>
    <div class="divider"></div>
    <p style="font-size:13px; color:rgba(255,255,255,.4);">Questions? Reply to this email or reach us at hello@plainvest.app.</p>
  `);
}

export function passwordChangedEmail(name: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Password changed — Plainvest', `
    <div class="label">Security notice</div>
    <h1>Your password was changed.</h1>
    <p class="sub">This is a confirmation for your records.</p>
    <p>Hi ${firstName}, your Plainvest password was successfully updated.</p>
    <p>If you made this change, no action is needed.</p>
    <p>If you did <strong>not</strong> make this change, please reset your password immediately and contact us at hello@plainvest.app.</p>
    <a href="https://members.plainvest.app/forgot-password" class="btn">Reset Password →</a>
  `);
}

// ─── Membership emails ───────────────────────────────────────────────────────

export function premiumWelcomeEmail(name: string, email: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Welcome to Plainvest Premium', `
    <div class="label">Premium access confirmed</div>
    <h1>You're a Premium member, ${firstName}.</h1>
    <p class="sub">Lifetime access · One-time payment</p>
    <p>Your payment was successful and your Premium access is now active. Everything is unlocked and ready.</p>
    <div class="highlight">
      <div class="label" style="margin-bottom:4px;">Account</div>
      <p>${email}</p>
    </div>
    <div class="label">What you've unlocked</div>
    <ul class="checklist">
      <li>18 structured investing guides — lifetime access</li>
      <li>Bitcoin & ETF education</li>
      <li>Curated book reading path</li>
      <li>60-minute onboarding Zoom call (included)</li>
      <li>Exchange setup support</li>
    </ul>
    <a href="https://members.plainvest.app" class="btn">Open Your Learning Hub →</a>
    <div class="divider"></div>
    <div class="label">Your included Zoom call</div>
    <p>Your plan includes a 60-minute onboarding Zoom call. Once you've completed the first 2–3 guides, reply to this email to schedule it.</p>
    <p style="font-size:13px; color:rgba(255,255,255,.4);">Questions? Reply to this email anytime.</p>
  `);
}

export function proWelcomeEmail(name: string, email: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Welcome to Plainvest Pro', `
    <div class="label">Pro membership confirmed</div>
    <h1>Welcome to Pro, ${firstName}.</h1>
    <p class="sub">Full platform access · Portfolio dashboard · Projections</p>
    <p>Your Pro membership is now active. You have full access to every tool on the platform.</p>
    <div class="highlight">
      <div class="label" style="margin-bottom:4px;">Account</div>
      <p>${email}</p>
    </div>
    <div class="label">Everything in Pro</div>
    <ul class="checklist">
      <li>18 structured investing guides</li>
      <li>Live portfolio tracking dashboard</li>
      <li>20-year future projections</li>
      <li>Freedom Score™ dashboard</li>
      <li>Goal tracking & AI insights</li>
      <li>60-minute onboarding Zoom call (included)</li>
      <li>All future guides and tools</li>
    </ul>
    <a href="https://members.plainvest.app" class="btn">Open Your Pro Dashboard →</a>
    <div class="divider"></div>
    <div class="label">Your included Zoom call</div>
    <p>Your plan includes a 60-minute onboarding Zoom call. Once you've completed the first 2–3 guides, reply to this email to schedule it.</p>
    <div class="label" style="margin-top:16px;">Getting started</div>
    <p>Start with the <strong>Premium Welcome guide</strong> in your hub — it takes 5 minutes and shows you exactly what to open first.</p>
    <p style="font-size:13px; color:rgba(255,255,255,.4);">Questions? Reply to this email anytime.</p>
  `);
}

export function supportCallConfirmationEmail(name: string, email: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Zoom call confirmed — Plainvest', `
    <div class="label">Support call</div>
    <h1>Your Zoom call is booked, ${firstName}.</h1>
    <p class="sub">60-minute personal session</p>
    <p>Your Zoom support call payment is confirmed. We'll be in touch within 24 hours to send you a booking link for your preferred time.</p>
    <div class="highlight">
      <div class="label" style="margin-bottom:4px;">What to expect</div>
      <p>A 60-minute 1-on-1 session focused on your situation — goals, risk, portfolio setup, and any questions you have about the guides.</p>
    </div>
    <div class="label">Prepare for your call</div>
    <ul class="checklist">
      <li>Complete the first 3–4 guides before the call</li>
      <li>Write down your current investing questions</li>
      <li>Have your goals and timeline in mind</li>
      <li>Note any exchange or account setup questions</li>
    </ul>
    <p>Booking confirmation: <strong>${email}</strong></p>
    <p>We'll email you a Zoom link within 24 hours. Reply to this email if you need to reschedule.</p>
    <p style="font-size:13px; color:rgba(255,255,255,.4);">Questions? Reply to this email anytime.</p>
  `);
}

// ─── Contact form emails ─────────────────────────────────────────────────────

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
    <div class="label">${data.formType}</div>
    <h1>New ${data.formType}</h1>
    <p class="sub">Submitted via plainvest.app</p>
    <div class="highlight">
      <p><strong>Name:</strong> ${data.name}<br />
      <strong>Email:</strong> ${data.email}<br />
      ${data.company ? `<strong>Company:</strong> ${data.company}<br />` : ''}
      ${data.topic ? `<strong>Topic:</strong> ${data.topic}<br />` : ''}
      <strong>Language:</strong> ${data.language}<br />
      <strong>Page:</strong> ${data.page}</p>
    </div>
    <div class="label">Message</div>
    <p style="white-space: pre-wrap;">${data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
  `);
}

export function contactConfirmationEmail(name: string): string {
  const firstName = name ? name.split(' ')[0] : 'there';
  return layout('Message received — Plainvest', `
    <div class="label">Got it</div>
    <h1>Thanks, ${firstName}.</h1>
    <p>We've received your message and will get back to you within 1–2 business days.</p>
    <p>In the meantime, feel free to explore the guides and tools at your own pace.</p>
    <a href="https://plainvest.app" class="btn">Back to Plainvest →</a>
    <p style="font-size:13px; color:rgba(255,255,255,.4); margin-top:16px;">Questions? Reply to this email anytime.</p>
  `);
}

export function newsletterConfirmationEmail(email: string): string {
  return layout('You\'re on the list — Plainvest', `
    <div class="label">Subscribed</div>
    <h1>You're on the list.</h1>
    <p>Thanks for joining the Plainvest insights list. We'll send occasional investing education, platform updates, and relevant resources — no spam.</p>
    <p>Confirmed address: <strong>${email}</strong></p>
    <a href="https://plainvest.app" class="btn">Explore Plainvest →</a>
  `);
}

export function newsletterNotificationEmail(email: string, language: string, page: string): string {
  return layout('New newsletter signup — Plainvest', `
    <div class="label">Newsletter signup</div>
    <h1>New subscriber</h1>
    <div class="highlight">
      <p><strong>Email:</strong> ${email}<br />
      <strong>Language:</strong> ${language}<br />
      <strong>Page:</strong> ${page}</p>
    </div>
  `);
}
