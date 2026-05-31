// ─── Icons ──────────────────────────────────────────────────────────────────

const ICONS: Record<string, string> = {
  welcome:    `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><circle cx="8" cy="5" r="3" stroke="#00d4aa" stroke-width="1.5"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  newsletter: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="1" y="3" width="14" height="10" rx="2" stroke="#00d4aa" stroke-width="1.5"/><path d="M1 6l7 4 7-4" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  lock:       `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="3" y="7" width="10" height="8" rx="2" stroke="#00d4aa" stroke-width="1.5"/><path d="M5 7V5a3 3 0 016 0v2" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  shield:     `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M8 1.5L2 4.5v3.5c0 3 2.5 5 6 6.5 3.5-1.5 6-3.5 6-6.5V4.5L8 1.5z" stroke="#00d4aa" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  star:       `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M8 1.5l2 4 4.5.7-3.25 3.1.77 4.5L8 11.6 3.98 13.8l.77-4.5L1.5 6.2l4.5-.7L8 1.5z" stroke="#00d4aa" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  gem:        `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M8 14L1 6l2-4h10l2 4-7 8z" stroke="#00d4aa" stroke-width="1.5" stroke-linejoin="round"/><path d="M1 6h14M5.5 2L7 6M10.5 2L9 6" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  receipt:    `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="2" y="1" width="12" height="14" rx="2" stroke="#00d4aa" stroke-width="1.5"/><path d="M5 5.5h6M5 8.5h6M5 11.5h3" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  video:      `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="1" y="4" width="9" height="8" rx="2" stroke="#00d4aa" stroke-width="1.5"/><path d="M10 7.5l5-3v7l-5-3" stroke="#00d4aa" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  book:       `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M8 13S4.5 11.5 1.5 11.5V2C4.5 2 8 3.5 8 3.5S11.5 2 14.5 2v9.5C11.5 11.5 8 13 8 13z" stroke="#00d4aa" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 3.5V13" stroke="#00d4aa" stroke-width="1.5"/></svg>`,
  trophy:     `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M8 10c-2.761 0-5-2.239-5-5V2h10v3c0 2.761-2.239 5-5 5z" stroke="#00d4aa" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 10v4M5.5 14h5" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/><path d="M3 4H1.5M13 4h1.5" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  refresh:    `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M13.5 8A5.5 5.5 0 112.5 5.5" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/><path d="M2.5 2.5v3h3" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  rocket:     `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M8 1c2.5 0 5 2 5.5 5 .25 1.5 0 3-.5 4L8 15 2.5 10c-.5-1-.75-2.5-.5-4C2.5 3 5.5 1 8 1z" stroke="#00d4aa" stroke-width="1.5" stroke-linejoin="round"/><circle cx="8" cy="7" r="1.5" fill="#00d4aa"/></svg>`,
  cancel:     `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="rgba(255,255,255,.35)" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  check:      `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><circle cx="8" cy="8" r="6" stroke="#00d4aa" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  warning:    `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M8 2L1 14h14L8 2z" stroke="#fbbf24" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  mail:       `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#00d4aa" stroke-width="1.5"/><path d="M1 5.5l7 4 7-4" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  clock:      `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><circle cx="8" cy="8" r="6" stroke="#00d4aa" stroke-width="1.5"/><path d="M8 5v3l2 2" stroke="#00d4aa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chat:       `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><path d="M13 8a5 5 0 01-5 5 4.97 4.97 0 01-2.56-.71L1 14l.71-4.44A4.97 4.97 0 013 8a5 5 0 0110 0z" stroke="#00d4aa" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  admin:      `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;flex-shrink:0;"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/><path d="M5 7h6M5 10h3.5" stroke="rgba(255,255,255,.3)" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

function toFirst(name: string): string {
  if (!name || name.includes('@')) return 'there';
  return name.split(' ')[0];
}

function lbl(text: string, iconType = '', color = 'rgba(0,212,170,.75)'): string {
  const svg = iconType && ICONS[iconType] ? ICONS[iconType] : '';
  return `<div style="margin-bottom:10px;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${color};line-height:1.4;">${svg}${svg ? '<span style="display:inline-block;width:5px;"></span>' : ''}${text}</div>`;
}

function statsCard(completed: number, total: number): string {
  const remaining = total - completed;
  const pct = Math.round((completed / total) * 100);
  return `
    <div style="border:1px solid rgba(0,212,170,.15);border-radius:12px;overflow:hidden;margin:0 0 24px;background:rgba(0,212,170,.04);">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td width="33%" style="padding:14px 8px;text-align:center;border-right:1px solid rgba(0,212,170,.1);">
            <div style="font-size:22px;font-weight:900;color:#00d4aa;line-height:1;">${completed}</div>
            <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-top:5px;">Done</div>
          </td>
          <td width="33%" style="padding:14px 8px;text-align:center;border-right:1px solid rgba(0,212,170,.1);">
            <div style="font-size:22px;font-weight:900;color:rgba(255,255,255,.7);line-height:1;">${remaining}</div>
            <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-top:5px;">Remaining</div>
          </td>
          <td width="34%" style="padding:14px 8px;text-align:center;">
            <div style="font-size:22px;font-weight:900;color:rgba(255,255,255,.7);line-height:1;">${pct}%</div>
            <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-top:5px;">Progress</div>
          </td>
        </tr>
      </table>
    </div>`;
}

// ─── Shared layout ─────────────────────────────────────────────────────────

function layout(title: string, body: string, compact = false): string {
  const year = new Date().getFullYear();
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
    .tagline { font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.2); margin-top:8px; }
    .card { background:#0b1929; border-radius:20px; border:1px solid rgba(0,212,170,.1); border-top:3px solid #00d4aa; padding:${compact ? '28px 28px' : '40px 36px'}; }
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
    .footer-links { font-size:13px; color:rgba(255,255,255,.3); margin:0 0 8px; line-height:1.6; }
    .footer-links a { color:rgba(0,212,170,.55); text-decoration:none; }
    .footer-brand { font-size:12px; color:rgba(255,255,255,.22); margin:0 0 6px; line-height:1.6; }
    .footer-legal { font-size:11px; color:rgba(255,255,255,.15); line-height:1.6; margin:0; }
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
        ${!compact ? '<div class="tagline">Future clarity. Smarter decisions.</div>' : ''}
      </div>

      <div class="card">${body}</div>

      <div class="footer">
        <p class="footer-links">
          <a href="https://plainvest.app">plainvest.app</a>
          &nbsp;·&nbsp;
          <a href="mailto:hello@plainvest.app">hello@plainvest.app</a>
        </p>
        ${compact ? `<p class="footer-legal">Plainvest admin notification</p>` : `
        <p class="footer-brand">
          Educational investing platform.<br />
          Helping people invest with clarity and confidence.
        </p>
        <p class="footer-legal">
          &copy; ${year} Plainvest &nbsp;·&nbsp; Not financial advice.<br />
          You're receiving this because you created a Plainvest account or subscribed to Plainvest updates.
        </p>`}
      </div>

    </div>
  </div>
</body>
</html>`;
}

// ─── 1. Welcome ──────────────────────────────────────────────────────────────

export function welcomeEmail(name: string): string {
  const firstName = toFirst(name);
  const roadmap = [
    { title: 'Welcome Guide', active: true },
    { title: 'Investment Paths', active: false },
    { title: 'DCA Method', active: false },
    { title: 'Bitcoin &amp; ETF Basics', active: false },
    { title: 'Build Your Portfolio', active: false },
  ];

  const roadmapRows = roadmap.map((step, i) => `
    <tr>
      <td style="padding:9px 18px;${i > 0 ? 'border-top:1px solid rgba(255,255,255,.04);' : ''}vertical-align:middle;" width="28">
        <div style="width:22px;height:22px;border-radius:50%;background:${step.active ? '#00d4aa' : 'rgba(255,255,255,.07)'};text-align:center;font-size:11px;font-weight:900;color:${step.active ? '#04120e' : 'rgba(255,255,255,.2)'};line-height:22px;">${i + 1}</div>
      </td>
      <td style="padding:9px 0 9px 10px;${i > 0 ? 'border-top:1px solid rgba(255,255,255,.04);' : ''}vertical-align:middle;font-size:14px;color:${step.active ? 'rgba(255,255,255,.88)' : 'rgba(255,255,255,.35)'};">${step.title}</td>
      ${step.active ? '<td style="padding:9px 18px 9px 0;text-align:right;font-size:12px;color:#00d4aa;font-weight:700;white-space:nowrap;vertical-align:middle;">Start here</td>' : '<td style="padding:9px 18px 9px 0;"></td>'}
    </tr>`).join('');

  return layout('Welcome to Plainvest', `
    ${lbl('Welcome', 'welcome')}
    <h1>Welcome to Plainvest, ${firstName}.</h1>
    <span class="sub">Your account is ready. Your journey starts now.</span>
    <p>You're now part of a platform built to help you understand investing — clearly, step by step, without the noise.</p>
    <p>Follow the learning path below. Each guide builds on the last.</p>
    ${lbl('Your Learning Path', '')}
    <div style="background:rgba(0,212,170,.05);border:1px solid rgba(0,212,170,.12);border-radius:12px;overflow:hidden;margin:0 0 28px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${roadmapRows}</table>
    </div>
    ${lbl('What\'s inside', '')}
    <ul class="checklist">
      <li>Beginner-friendly investing guides</li>
      <li>Portfolio planning tools</li>
      <li>Future projections &amp; Freedom Score</li>
      <li>Plain-English explanations — no jargon</li>
    </ul>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Open My Dashboard →</a></div>
    <p class="hint">Questions? Reply to this email anytime — we're happy to help.</p>
  `);
}

// ─── 2. Newsletter confirmation ───────────────────────────────────────────────

export function newsletterConfirmationEmail(email: string): string {
  return layout("You're subscribed to Plainvest Insights", `
    ${lbl('Subscribed', 'newsletter')}
    <h1>You're on the list.</h1>
    <p>Thanks for joining the Plainvest insights list. We'll occasionally send:</p>
    <ul class="checklist">
      <li>Investing education</li>
      <li>Market insights</li>
      <li>Platform updates</li>
      <li>New guides and resources</li>
    </ul>
    <p style="font-size:13px;color:rgba(255,255,255,.35);margin-bottom:24px;">No spam. Unsubscribe anytime.</p>
    ${lbl('Confirmed address', '')}
    <div class="email-pill">${email}</div>
    <div class="btn-wrap"><a href="https://plainvest.app" class="btn">Explore Plainvest →</a></div>
  `);
}

// ─── 3. Password reset ────────────────────────────────────────────────────────

export function passwordResetEmail(name: string, resetLink: string): string {
  const firstName = toFirst(name);
  return layout('Reset your Plainvest password', `
    ${lbl('Password reset', 'lock')}
    <h1>Reset your password, ${firstName}.</h1>
    <p>We received a request to reset the password on your Plainvest account. Click the button below to choose a new one.</p>
    <p>If you didn't request this, you can safely ignore this email — your account remains secure.</p>
    <div class="btn-wrap"><a href="${resetLink}" class="btn">Reset Password →</a></div>
    <div class="security-note">
      <p>⏱ This link expires in 30 minutes. After that, you'll need to request a new one.</p>
    </div>
    <p class="hint">Need help? Reply to this email or contact hello@plainvest.app.</p>
  `);
}

// ─── 4. Password changed ──────────────────────────────────────────────────────

export function passwordChangedEmail(name: string): string {
  const firstName = toFirst(name);
  return layout('Your password was updated — Plainvest', `
    ${lbl('Security notice', 'shield')}
    <h1>Your password was updated, ${firstName}.</h1>
    <p>Your Plainvest password has been successfully changed. You can now log in with your new password.</p>
    <p>If you did <strong>not</strong> make this change, contact us immediately at hello@plainvest.app and reset your password right away.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Open Account →</a></div>
  `);
}

// ─── 5. Pro activated ─────────────────────────────────────────────────────────

export function proWelcomeEmail(name: string, email: string): string {
  const firstName = toFirst(name);
  return layout('Welcome to Plainvest Pro', `
    ${lbl('Pro membership confirmed', 'star')}
    <h1>Ready for the next step, ${firstName}?</h1>
    <span class="sub">See where your money could be in 20 years.</span>
    <p>Your Pro membership is now active. You have access to the complete Plainvest platform — portfolio tracking, future projections, and your personal Freedom Score.</p>
    ${lbl('Account', '')}
    <div class="email-pill">${email}</div>
    ${lbl('Your Pro access includes', '')}
    <ul class="checklist">
      <li>Portfolio tracking dashboard</li>
      <li>20-year future projections</li>
      <li>Freedom Score™ — your financial independence tracker</li>
      <li>Goal tracking &amp; investing insights</li>
      <li>All investing guides — current &amp; future</li>
      <li>60-minute onboarding Zoom call (included)</li>
    </ul>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Open Pro Dashboard →</a></div>
    <div class="divider"></div>
    ${lbl('Your included Zoom call', 'video')}
    <p>Your plan includes a 60-minute onboarding call. Once you've completed the first 2–3 guides, reply to this email to schedule it.</p>
    <p class="hint">Questions? Reply to this email anytime.</p>
  `);
}

// ─── 6. Lifetime (Premium) activated ─────────────────────────────────────────

export function premiumWelcomeEmail(name: string, email: string): string {
  const firstName = toFirst(name);
  return layout('Welcome to Plainvest Lifetime', `
    ${lbl('Lifetime access confirmed', 'gem')}
    <h1>Welcome to Plainvest Lifetime, ${firstName}.</h1>
    <span class="sub">Permanent access · One-time payment · No recurring fees.</span>
    <p>Your Lifetime access is now active. Everything is unlocked and ready for you — today, and every day after.</p>
    ${lbl('Account', '')}
    <div class="email-pill">${email}</div>
    ${lbl('Your Lifetime access includes', '')}
    <ul class="checklist">
      <li>All investing guides — forever</li>
      <li>Bitcoin &amp; ETF education</li>
      <li>Beginner roadmap &amp; structured learning path</li>
      <li>Included 60-minute Zoom support call</li>
      <li>Lifetime access to all new guides</li>
    </ul>
    <p style="font-size:13px;color:rgba(255,255,255,.4);margin-bottom:24px;">No recurring fees. Ever.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Start Learning →</a></div>
    <div class="divider"></div>
    ${lbl('Your included Zoom call', 'video')}
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
  const firstName = toFirst(name);
  return layout('Your Plainvest receipt', `
    ${lbl('Payment confirmed', 'receipt')}
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
  const firstName = toFirst(name);
  const hasDetails = data?.date || data?.time || data?.meetingLink;
  return layout('Your Plainvest support call is confirmed', `
    ${lbl('Zoom call confirmed', 'video')}
    <h1>Your call is booked, ${firstName}.</h1>
    <span class="sub">60-minute 1-on-1 session</span>
    <p>Your Plainvest support call is confirmed. ${hasDetails ? '' : "We'll be in touch within 24 hours to send your Zoom link and scheduled time."}</p>
    ${hasDetails ? `
    <div class="highlight">
      <p>
        ${data?.date ? `<strong>Date:</strong> ${data.date}<br />` : ''}
        ${data?.time ? `<strong>Time:</strong> ${data.time}<br />` : ''}
        ${data?.meetingLink ? `<strong>Meeting Link:</strong> <a href="${data.meetingLink}" style="color:#00d4aa;">${data.meetingLink}</a>` : ''}
      </p>
    </div>` : ''}
    ${lbl('Topics to explore', '')}
    <ul class="checklist">
      <li>ETFs and how to use them</li>
      <li>Bitcoin basics and custody</li>
      <li>Dollar-cost averaging (DCA)</li>
      <li>Portfolio construction</li>
      <li>Getting started — where to begin</li>
    </ul>
    ${lbl('Confirmed address', '')}
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
  const firstName = toFirst(name);
  return layout('Reminder: your Plainvest support call', `
    ${lbl('Call reminder', 'video')}
    <h1>Your call is tomorrow, ${firstName}.</h1>
    <div class="highlight">
      <p>
        <strong>Date:</strong> ${data.date}<br />
        <strong>Time:</strong> ${data.time}<br />
        <strong>Meeting Link:</strong> <a href="${data.meetingLink}" style="color:#00d4aa;">${data.meetingLink}</a>
      </p>
    </div>
    <p>We'll make the most of the 60 minutes — the more you bring, the more we can cover.</p>
    ${lbl('What to bring', '')}
    <ul class="checklist">
      <li>Questions you've been thinking about</li>
      <li>Your current investments (optional)</li>
      <li>Goals you're trying to achieve</li>
      <li>Areas you feel unsure about</li>
    </ul>
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
  const firstName = toFirst(name);
  return layout('New guide available on Plainvest', `
    ${lbl('New guide', 'book')}
    <h1>${firstName}, a new guide is ready for you.</h1>
    <p>We've added a new guide to help you continue building your investing knowledge.</p>
    <div class="highlight">
      <p><strong>${guide.title}</strong><br />${guide.description}</p>
    </div>
    <div class="btn-wrap"><a href="${guide.url}" class="btn">Read Guide →</a></div>
    <div class="divider"></div>
    ${lbl('Recommended next', '')}
    <div style="margin:0 0 24px;">
      <div style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:14px;color:rgba(255,255,255,.55);">→&nbsp; Investment Paths Guide</div>
      <div style="padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:14px;color:rgba(255,255,255,.55);">→&nbsp; DCA Method Guide</div>
      <div style="padding:9px 0;font-size:14px;color:rgba(255,255,255,.55);">→&nbsp; Build Your Portfolio</div>
    </div>
    <p class="hint">Questions about the guide? Reply to this email anytime.</p>
  `);
}

// ─── 11. Progress milestone ───────────────────────────────────────────────────

export function milestoneEmail(name: string, data: {
  completed: number;
  total: number;
  milestone: string;
}): string {
  const firstName = toFirst(name);
  const remaining = data.total - data.completed;
  const pct = Math.round((data.completed / data.total) * 100);
  const motivation = data.completed <= 3
    ? "You're building real investing knowledge."
    : data.completed <= 8
      ? "You're ahead of where most beginners stop."
      : "You're in the top tier of learners on this platform.";

  return layout("You've reached a new milestone — Plainvest", `
    ${lbl('Milestone reached', 'trophy')}
    <h1>Great work, ${firstName}.</h1>
    <span class="sub">${motivation}</span>
    ${statsCard(data.completed, data.total)}
    <p>You've completed <strong>${data.completed} of ${data.total} guides</strong> — ${remaining} remaining until you've built your full investing foundation.</p>
    <p>Keep going. The knowledge compounds just like the investments will.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Continue Learning →</a></div>
    <p class="hint">${pct >= 50 ? "You're over halfway there — the hardest part is done." : "Every guide you complete puts you further ahead than most people ever get."}</p>
  `);
}

// ─── 12. Re-engagement ───────────────────────────────────────────────────────

export function reengagementEmail(name: string, data?: {
  completed?: number;
  total?: number;
  nextGuide?: string;
}): string {
  const firstName = toFirst(name);
  const hasStats = data?.completed !== undefined && data?.total !== undefined;
  const nextGuide = data?.nextGuide || 'Investment Paths';

  return layout('Your learning path is waiting — Plainvest', `
    ${lbl('We miss you', 'refresh')}
    <h1>Your learning path is waiting, ${firstName}.</h1>
    ${hasStats && data!.completed !== undefined && data!.total !== undefined
      ? `<p>You've already completed <strong>${data!.completed} guides</strong> — that's real progress. Your path, tools, and everything else are right where you left them.</p>
         ${statsCard(data!.completed, data!.total)}`
      : `<p>You've already made real progress inside Plainvest. Your guides, tools, and learning path are right where you left them.</p>`
    }
    ${lbl('Pick up where you left off', '')}
    <div class="highlight">
      <p><strong>Next recommended:</strong> ${nextGuide}<br />
      <span style="font-size:13px;color:rgba(255,255,255,.45);">Continue building your investing foundation.</span></p>
    </div>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Continue where you left off →</a></div>
    <p class="hint">Questions or need help getting started again? Reply to this email anytime.</p>
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
    ${lbl('Plainvest', 'rocket')}
    <h1>${data.headline}</h1>
    <p>${data.body}</p>
    ${data.subtext ? `<p style="font-size:13px;color:rgba(255,255,255,.4);">${data.subtext}</p>` : ''}
    <div class="btn-wrap"><a href="${data.ctaUrl}" class="btn">${data.ctaText} →</a></div>
    <p class="hint">Questions? Reply to this email anytime.</p>
  `);
}

// ─── 14. Subscription cancelled ──────────────────────────────────────────────

export function subscriptionCancelledEmail(name: string): string {
  const firstName = toFirst(name);
  return layout('Your Pro subscription has been cancelled — Plainvest', `
    ${lbl('Subscription update', 'cancel', 'rgba(255,255,255,.35)')}
    <h1>Your subscription has been cancelled, ${firstName}.</h1>
    <p>Your Plainvest Pro subscription has been cancelled. You'll retain full access until the end of your current billing period.</p>
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
  const firstName = toFirst(name);
  return layout('Your Pro subscription renewed — Plainvest', `
    ${lbl('Subscription renewed', 'check')}
    <h1>Your subscription renewed, ${firstName}.</h1>
    <span class="sub">Your Pro access continues uninterrupted.</span>
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
  const firstName = toFirst(name);
  return layout('Payment issue — Plainvest', `
    ${lbl('Payment notice', 'warning', 'rgba(251,191,36,.75)')}
    <h1>We couldn't process your payment, ${firstName}.</h1>
    <p>We were unable to process your most recent Plainvest payment. This can happen if your card has expired or has insufficient funds.</p>
    <p>Please update your payment details to keep your access active.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Update Payment →</a></div>
    <p class="hint">Need help? Reply to this email or contact hello@plainvest.app.</p>
  `);
}

// ─── 17. Email verification ───────────────────────────────────────────────────

export function emailVerificationEmail(name: string, verifyLink: string): string {
  const firstName = toFirst(name);
  return layout('Verify your email — Plainvest', `
    ${lbl('Verify your email', 'mail')}
    <h1>Almost there, ${firstName}.</h1>
    <p>Click the button below to verify your email address and activate your Plainvest account.</p>
    <div class="btn-wrap"><a href="${verifyLink}" class="btn">Verify Email →</a></div>
    <div class="security-note">
      <p>⏱ This link expires in 24 hours. If you didn't create a Plainvest account, you can safely ignore this email.</p>
    </div>
  `);
}

// ─── 18. Waitlist confirmation ────────────────────────────────────────────────

export function waitlistConfirmationEmail(email: string): string {
  return layout("You're on the waitlist — Plainvest", `
    ${lbl('Waitlist', 'clock')}
    <h1>You're on the list.</h1>
    <p>Thanks for your interest in Plainvest. We'll notify you as soon as a spot opens up.</p>
    ${lbl('Confirmed address', '')}
    <div class="email-pill">${email}</div>
    <p class="hint">Questions? Reply to this email anytime.</p>
  `);
}

// ─── 19. Contact confirmation ─────────────────────────────────────────────────

export function contactConfirmationEmail(name: string): string {
  const firstName = toFirst(name);
  return layout('Message received — Plainvest', `
    ${lbl('Support', 'chat')}
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
    ${lbl('New account', 'admin', 'rgba(255,255,255,.35)')}
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
  date?: string;
  country?: string;
  utmSource?: string;
}): string {
  return layout('New newsletter signup — Plainvest', `
    ${lbl('Newsletter signup', 'admin', 'rgba(255,255,255,.35)')}
    <h1>New subscriber.</h1>
    <div class="highlight">
      <p>
        <strong>Email:</strong> ${data.email}<br />
        <strong>Source:</strong> ${data.page}<br />
        <strong>Language:</strong> ${data.language}<br />
        ${data.date ? `<strong>Date:</strong> ${data.date}<br />` : ''}
        ${data.country ? `<strong>Country:</strong> ${data.country}<br />` : ''}
        ${data.utmSource ? `<strong>UTM Source:</strong> ${data.utmSource}` : ''}
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
    ${lbl('New Pro purchase', 'admin', 'rgba(255,255,255,.35)')}
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
    ${lbl('New Lifetime purchase', 'admin', 'rgba(255,255,255,.35)')}
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
    ${lbl('New Zoom booking', 'admin', 'rgba(255,255,255,.35)')}
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
    ${lbl(data.formType, 'admin', 'rgba(255,255,255,.35)')}
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
    ${lbl('Message', '')}
    <p style="white-space:pre-wrap;font-size:14px;">${data.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
  `, true);
}

// ─── Newsletter lead sequence ─────────────────────────────────────────────────

export function newsletterWelcomeEmail(email: string): string {
  return layout('Start here: the most important investing lesson', `
    ${lbl('Education · Day 1', 'book')}
    <h1>Most people invest before understanding what they're buying.</h1>
    <span class="sub">That's where the anxiety comes from — not the market.</span>
    <p>They see friends getting gains, headlines about crypto, or someone online showing their portfolio — and they jump in. No plan, no foundation, no understanding of what they own or why.</p>
    <p>That's where most mistakes come from. Not bad luck. Not bad timing. Just a lack of the basics.</p>
    <div class="highlight">
      <p><strong>Start with these fundamentals:</strong><br /><br />
      ✓ What investing actually is — not speculation<br />
      ✓ Why long-term thinking changes everything<br />
      ✓ The most common beginner mistakes and how to avoid them<br />
      ✓ Building confidence before risking real money</p>
    </div>
    <p>Start with the foundation. Everything else gets easier from there.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Read the Foundation Guide →</a></div>
    <p class="hint">More lessons coming over the next few days.</p>
  `);
}

export function newsletterEdu1Email(email: string): string {
  return layout('Why most beginners lose money', `
    ${lbl('Education · Lesson 1', 'book')}
    <h1>The #1 reason beginners lose money isn't bad luck.</h1>
    <span class="sub">It's emotion.</span>
    <p>The pattern is always the same: buy when everyone is excited (markets are high), sell when everyone is panicking (markets drop).</p>
    <p>That's called buying high and selling low — the exact opposite of what builds wealth. And almost every beginner does it at least once.</p>
    <div class="highlight">
      <p><strong>The lesson:</strong> Markets go up and down. That's normal. The investors who build wealth are the ones who don't react to every headline — because they understand what they own and why they own it.</p>
    </div>
    <p style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.18);border-radius:10px;padding:14px 18px;font-size:14px;color:rgba(255,255,255,.7);line-height:1.65;">
      <strong style="color:rgba(251,191,36,.9);">Your takeaway:</strong> Knowledge is the cure for emotional investing. When you understand why markets move, you stop reacting to every dip.
    </p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Start Learning →</a></div>
  `);
}

export function newsletterEdu2Email(email: string): string {
  return layout('The simplest investing strategy most people ignore', `
    ${lbl('Education · Lesson 2', 'book')}
    <h1>The simplest strategy most people ignore.</h1>
    <span class="sub">Dollar-cost averaging (DCA) — and it actually works.</span>
    <p>Instead of trying to time the market, you invest a fixed amount on a regular schedule — regardless of price. Weekly, monthly, whatever suits you.</p>
    <div class="highlight">
      <p>
        <strong>When prices are high</strong> → you buy less units.<br />
        <strong>When prices are low</strong> → you buy more units.<br /><br />
        Over time, this averages out your cost and removes the pressure of "is now the right time?"
      </p>
    </div>
    <p>It's not exciting. It doesn't require charts, predictions, or market knowledge. It just requires consistency.</p>
    <p style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.18);border-radius:10px;padding:14px 18px;font-size:14px;color:rgba(255,255,255,.7);line-height:1.65;">
      <strong style="color:rgba(251,191,36,.9);">Your takeaway:</strong> Set a fixed amount → Set a recurring date → Automate it → Stop watching it daily. That's it.
    </p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Read the DCA Guide →</a></div>
  `);
}

export function newsletterEdu3Email(email: string): string {
  return layout("Stocks, ETFs, Bitcoin: what's the difference?", `
    ${lbl('Education · Lesson 3', 'book')}
    <h1>Stocks, ETFs, Bitcoin — what's actually different?</h1>
    <span class="sub">Three asset classes, briefly explained.</span>
    <div class="highlight">
      <p>
        <strong>Stocks</strong> — Ownership in a single company. High potential, high risk. Your outcome depends entirely on that one company doing well.<br /><br />
        <strong>ETFs</strong> — A basket of many assets in one. Built-in diversification, lower cost, lower risk. You don't pick winners — you own all of them.<br /><br />
        <strong>Bitcoin</strong> — Digital scarcity. High volatility, but a real long-term thesis for many investors. Not for everyone, but worth understanding.
      </p>
    </div>
    <p style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.18);border-radius:10px;padding:14px 18px;font-size:14px;color:rgba(255,255,255,.7);line-height:1.65;">
      <strong style="color:rgba(251,191,36,.9);">Your takeaway:</strong> Most beginners do best starting with broad ETFs — diversified, low cost, and no need to pick individual winners.
    </p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Explore the Asset Guides →</a></div>
  `);
}

export function newsletterEdu4Email(email: string): string {
  return layout('How much do you actually need to retire?', `
    ${lbl('Education · Lesson 4', 'book')}
    <h1>There's a number that tells you when you're financially free.</h1>
    <span class="sub">It's called the 4% rule — and it's simpler than it sounds.</span>
    <p>If you can withdraw 4% of your portfolio per year, you can live off it indefinitely without running out. That means your <strong>Freedom Number</strong> is:</p>
    <div style="text-align:center;padding:20px;background:rgba(0,212,170,.06);border:1px solid rgba(0,212,170,.14);border-radius:12px;margin:0 0 24px;">
      <div style="font-size:13px;color:rgba(255,255,255,.4);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;">Your Freedom Number</div>
      <div style="font-size:22px;font-weight:900;color:#00d4aa;">Annual expenses ÷ 4%</div>
    </div>
    <div class="highlight">
      <p>
        Need <strong>$30,000/year</strong> → target <strong>$750,000</strong><br />
        Need <strong>$50,000/year</strong> → target <strong>$1,250,000</strong><br />
        Need <strong>$80,000/year</strong> → target <strong>$2,000,000</strong>
      </p>
    </div>
    <p style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.18);border-radius:10px;padding:14px 18px;font-size:14px;color:rgba(255,255,255,.7);line-height:1.65;">
      <strong style="color:rgba(251,191,36,.9);">Your takeaway:</strong> Calculate your number. That's your target. Every dollar you invest is a step toward it.
    </p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Calculate Your Freedom Score →</a></div>
  `);
}

export function newsletterEdu5Email(email: string): string {
  return layout("What I'd learn first if I were starting from zero", `
    ${lbl('Education · Lesson 5', 'book')}
    <h1>What I'd learn first if I were starting from zero.</h1>
    <span class="sub">The learning order matters more than most people realise.</span>
    <p>There's no shortage of investing information. The problem is noise — not lack of content. Here's the exact order I'd follow if I were starting today:</p>
    <div style="background:rgba(0,212,170,.05);border:1px solid rgba(0,212,170,.12);border-radius:12px;overflow:hidden;margin:0 0 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${[
          'What investing actually is — not speculation',
          'How compound growth works over 20–30 years',
          'ETFs and why they beat most active strategies',
          'Dollar-cost averaging to remove emotional decisions',
          'Bitcoin basics — why it exists and what it\'s for',
          'How to build a simple, durable portfolio',
        ].map((step, i) => `<tr>
          <td style="padding:10px 18px;${i > 0 ? 'border-top:1px solid rgba(255,255,255,.04);' : ''}vertical-align:middle;" width="28">
            <div style="width:22px;height:22px;border-radius:50%;background:rgba(0,212,170,.15);text-align:center;font-size:11px;font-weight:900;color:#00d4aa;line-height:22px;">${i + 1}</div>
          </td>
          <td style="padding:10px 0 10px 10px;${i > 0 ? 'border-top:1px solid rgba(255,255,255,.04);' : ''}font-size:14px;color:rgba(255,255,255,.7);">${step}</td>
        </tr>`).join('')}
      </table>
    </div>
    <p style="background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.18);border-radius:10px;padding:14px 18px;font-size:14px;color:rgba(255,255,255,.7);line-height:1.65;">
      <strong style="color:rgba(251,191,36,.9);">Your takeaway:</strong> You don't need to know everything. These six things give you everything you need to start investing with confidence.
    </p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Start the Plainvest Roadmap →</a></div>
  `);
}

export function newsletterProductEmail(email: string): string {
  return layout('Want help building your roadmap?', `
    ${lbl('Introducing Plainvest', 'star')}
    <h1>Want help building your roadmap?</h1>
    <span class="sub">Over the past two weeks, you've been building a foundation.</span>
    <p>Plainvest was built to help you put it all together — structured learning paths, investing tools, portfolio tracking, and future projections in one place, built for beginners.</p>
    <ul class="checklist">
      <li>Structured learning paths — guided, step by step</li>
      <li>Beginner roadmap — know exactly where you are</li>
      <li>Portfolio planning tools</li>
      <li>20-year future projections</li>
      <li>Freedom Score™ — your financial independence tracker</li>
    </ul>
    <p style="font-size:13px;color:rgba(255,255,255,.4);margin-bottom:24px;">Free account available. No credit card required.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app/signup" class="btn">Create Free Account →</a></div>
    <p class="hint">Questions? Reply to this email anytime.</p>
  `);
}

export function newsletterLifetimeEmail(email: string): string {
  return layout('Build your investing foundation for life', `
    ${lbl('Plainvest Lifetime', 'gem')}
    <h1>Build your investing foundation for life.</h1>
    <span class="sub">One investment in your financial education. No subscriptions. No monthly fees.</span>
    <p>Lifetime access gives you everything Plainvest offers — all current guides, all future guides, tools, and resources — with a single one-time payment.</p>
    <ul class="checklist">
      <li>All investing guides — now and forever</li>
      <li>Bitcoin &amp; ETF education</li>
      <li>Structured beginner roadmap</li>
      <li>Included 60-minute Zoom onboarding call</li>
      <li>Every guide added in the future — included</li>
    </ul>
    <p style="font-size:13px;color:rgba(255,255,255,.4);margin-bottom:24px;">No recurring fees. Ever.</p>
    <div class="btn-wrap"><a href="https://plainvest.app" class="btn">Get Lifetime Access →</a></div>
    <p class="hint">Questions about what's included? Reply to this email.</p>
  `);
}

export function newsletterProEmail(email: string): string {
  return layout('See where your future wealth could go', `
    ${lbl('Plainvest Pro', 'rocket')}
    <h1>See where your future wealth could go.</h1>
    <span class="sub">Portfolio tracking, 20-year projections, and your Freedom Score.</span>
    <p>Plainvest Pro adds the tools that let you visualise your financial future — not just learn about it.</p>
    <ul class="checklist">
      <li>Live portfolio tracking dashboard</li>
      <li>20-year wealth projection charts</li>
      <li>Freedom Score™ — see how close you are to financial independence</li>
      <li>Goal tracking &amp; investing milestones</li>
      <li>All guides — current &amp; future</li>
    </ul>
    <div class="btn-wrap"><a href="https://plainvest.app" class="btn">Start Pro →</a></div>
    <p class="hint">Questions? Reply to this email anytime.</p>
  `);
}
