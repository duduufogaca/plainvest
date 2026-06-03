// ─── Icons ──────────────────────────────────────────────────────────────────

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  bg:        '#07111D', // email body background
  card:      '#101C2B', // main card background
  panel:     '#102B2B', // inner box background
  text:      '#F3F7FB', // main text
  body:      '#A9B8CA', // secondary text
  muted:     '#6F8194', // muted text
  accent:    '#1FD3AA', // brand teal — labels, icons, checks, top accent, left borders, links
  cta:       '#22D3AA', // button background
  ctaText:   '#04131F', // button text
  warning:   '#F4C95D', // gold accent
  border:    '#1C3242', // subtle hairline borders / dividers
  checkText: '#C8D4E3', // "What's inside" list text
  footSlogan:'#356276', // footer slogan
  footMuted: '#5F7082', // footer disclaimer
  unsub:     '#7F8FA3', // unsubscribe text
} as const;

const ICONS: Record<string, string> = {
  welcome:    `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><circle cx="8" cy="5" r="3" stroke="${C.accent}" stroke-width="1.5"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="${C.accent}" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  newsletter: `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><rect x="1" y="3" width="14" height="10" rx="2" stroke="${C.accent}" stroke-width="1.5"/><path d="M1 6l7 4 7-4" stroke="${C.accent}" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  lock:       `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><rect x="3" y="7" width="10" height="8" rx="2" stroke="${C.accent}" stroke-width="1.5"/><path d="M5 7V5a3 3 0 016 0v2" stroke="${C.accent}" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  shield:     `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><path d="M8 1.5L2 4.5v3.5c0 3 2.5 5 6 6.5 3.5-1.5 6-3.5 6-6.5V4.5L8 1.5z" stroke="${C.accent}" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  star:       `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><path d="M8 1.5l2 4 4.5.7-3.25 3.1.77 4.5L8 11.6 3.98 13.8l.77-4.5L1.5 6.2l4.5-.7L8 1.5z" stroke="${C.accent}" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  gem:        `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><path d="M8 14L1 6l2-4h10l2 4-7 8z" stroke="${C.accent}" stroke-width="1.5" stroke-linejoin="round"/><path d="M1 6h14M5.5 2L7 6M10.5 2L9 6" stroke="${C.accent}" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  receipt:    `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><rect x="2" y="1" width="12" height="14" rx="2" stroke="${C.accent}" stroke-width="1.5"/><path d="M5 5.5h6M5 8.5h6M5 11.5h3" stroke="${C.accent}" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  video:      `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><rect x="1" y="4" width="9" height="8" rx="2" stroke="${C.accent}" stroke-width="1.5"/><path d="M10 7.5l5-3v7l-5-3" stroke="${C.accent}" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  book:       `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><path d="M8 13S4.5 11.5 1.5 11.5V2C4.5 2 8 3.5 8 3.5S11.5 2 14.5 2v9.5C11.5 11.5 8 13 8 13z" stroke="${C.accent}" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 3.5V13" stroke="${C.accent}" stroke-width="1.5"/></svg>`,
  trophy:     `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><path d="M8 10c-2.761 0-5-2.239-5-5V2h10v3c0 2.761-2.239 5-5 5z" stroke="${C.accent}" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 10v4M5.5 14h5" stroke="${C.accent}" stroke-width="1.5" stroke-linecap="round"/><path d="M3 4H1.5M13 4h1.5" stroke="${C.accent}" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  refresh:    `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><path d="M13.5 8A5.5 5.5 0 112.5 5.5" stroke="${C.accent}" stroke-width="1.5" stroke-linecap="round"/><path d="M2.5 2.5v3h3" stroke="${C.accent}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  rocket:     `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><path d="M8 1c2.5 0 5 2 5.5 5 .25 1.5 0 3-.5 4L8 15 2.5 10c-.5-1-.75-2.5-.5-4C2.5 3 5.5 1 8 1z" stroke="${C.accent}" stroke-width="1.5" stroke-linejoin="round"/><circle cx="8" cy="7" r="1.5" fill="${C.accent}"/></svg>`,
  cancel:     `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><circle cx="8" cy="8" r="6" stroke="#4A5A6A" stroke-width="1.5"/><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#4A5A6A" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  check:      `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><circle cx="8" cy="8" r="6" stroke="${C.accent}" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="${C.accent}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  warning:    `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><path d="M8 2L1 14h14L8 2z" stroke="${C.warning}" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6.5v3M8 11v.5" stroke="${C.warning}" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  mail:       `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="${C.accent}" stroke-width="1.5"/><path d="M1 5.5l7 4 7-4" stroke="${C.accent}" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  clock:      `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><circle cx="8" cy="8" r="6" stroke="${C.accent}" stroke-width="1.5"/><path d="M8 5v3l2 2" stroke="${C.accent}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chat:       `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><path d="M13 8a5 5 0 01-5 5 4.97 4.97 0 01-2.56-.71L1 14l.71-4.44A4.97 4.97 0 013 8a5 5 0 0110 0z" stroke="${C.accent}" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  admin:      `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="#4A6A7A" stroke-width="1.5"/><path d="M5 7h6M5 10h3.5" stroke="#4A6A7A" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

function toFirst(name: string): string {
  if (!name || name.includes('@')) return 'there';
  return name.split(' ')[0];
}

function esc(s: string): string {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function lbl(text: string, iconType = '', color: string = C.accent): string {
  const svg = iconType && ICONS[iconType] ? ICONS[iconType] : '';
  return `<div style="margin-bottom:10px;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${color};line-height:1.4;background-color:transparent;">${svg}${svg ? '<span style="display:inline-block;width:5px;"></span>' : ''}${text}</div>`;
}

function statsCard(completed: number, total: number): string {
  const remaining = total - completed;
  const pct = Math.round((completed / total) * 100);
  return `
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.panel}"
      style="background-color:${C.panel};border:1px solid ${C.border};border-radius:10px;border-collapse:collapse;margin:0 0 24px;">
      <tr>
        <td width="33%" bgcolor="${C.panel}" style="padding:14px 8px;text-align:center;border-right:1px solid ${C.border};background-color:${C.panel};">
          <div style="font-size:22px;font-weight:900;color:${C.accent};line-height:1;">${completed}</div>
          <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};margin-top:5px;">Done</div>
        </td>
        <td width="33%" bgcolor="${C.panel}" style="padding:14px 8px;text-align:center;border-right:1px solid ${C.border};background-color:${C.panel};">
          <div style="font-size:22px;font-weight:900;color:${C.body};line-height:1;">${remaining}</div>
          <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};margin-top:5px;">Remaining</div>
        </td>
        <td width="34%" bgcolor="${C.panel}" style="padding:14px 8px;text-align:center;background-color:${C.panel};">
          <div style="font-size:22px;font-weight:900;color:${C.body};line-height:1;">${pct}%</div>
          <div style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};margin-top:5px;">Progress</div>
        </td>
      </tr>
    </table>`;
}

// ─── Shared layout ─────────────────────────────────────────────────────────

function layout(title: string, body: string, compact = false, unsubscribeUrl?: string): string {
  const year    = new Date().getFullYear();
  const padCard = compact ? '24px 20px' : '36px 30px';
  const h1size  = compact ? '20px'      : '26px';
  const h1mob   = compact ? '18px'      : '22px';

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${title}</title>
  <style>
    :root { color-scheme: dark; supported-color-schemes: dark; }
    body,table,td,a { -webkit-text-size-adjust:100%; text-size-adjust:100%; }
    img { -ms-interpolation-mode:bicubic; border:0; }
    body { margin:0; padding:0; background-color:${C.bg}; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif; }
    /* Backup class styles — inline styles on each element are the primary source */
    .pv-h1 { margin:0 0 8px; font-size:${h1size}; font-weight:800; color:${C.text}; line-height:1.25; }
    .pv-p  { margin:0 0 16px; font-size:16px; color:${C.body}; line-height:1.65; }
    .pv-sub { display:block; font-size:14px; color:${C.muted}; margin:0 0 24px; line-height:1.5; }
    .pv-hint { font-size:13px; color:${C.muted}; margin-top:4px; line-height:1.6; }
    .pv-btn { display:inline-block; background-color:${C.cta}; color:${C.ctaText}; font-size:16px; font-weight:800; padding:18px 28px; border-radius:14px; text-decoration:none; letter-spacing:.01em; }
    .pv-divider { height:1px; background-color:${C.border}; margin:24px 0; }
    .pv-panel { background-color:${C.panel}; border:1px solid ${C.border}; border-left:3px solid ${C.accent}; border-radius:8px; padding:14px 16px; margin:0 0 20px; }
    .pv-pill { display:inline-block; background-color:${C.panel}; border:1px solid ${C.border}; border-radius:6px; padding:8px 14px; font-size:14px; color:${C.body}; margin:0 0 20px; word-break:break-all; }
    .pv-alert { background-color:${C.panel}; border:1px solid ${C.border}; border-radius:8px; padding:12px 16px; margin:0 0 20px; }
    /* Force dark in BOTH schemes — Apple Mail / Gmail iOS must not invert */
    @media (prefers-color-scheme: dark), (prefers-color-scheme: light) {
      body, #pv-bg, #pv-card { background-color:${C.bg} !important; }
      #pv-card-inner { background-color:${C.card} !important; color:${C.body} !important; }
      .pv-h1, h1 { color:${C.text} !important; }
      .pv-p, p { color:${C.body} !important; }
      strong { color:${C.text} !important; }
      a { color:${C.accent} !important; }
      .pv-sub { color:${C.muted} !important; }
      .pv-hint { color:${C.muted} !important; }
      .pv-panel, .pv-pill, .pv-alert { background-color:${C.panel} !important; }
      .pv-pill { color:${C.body} !important; }
      .pv-btn { background-color:${C.cta} !important; color:${C.ctaText} !important; }
    }
    @media screen and (max-width:480px) {
      #pv-card-inner { padding:${compact ? '20px 16px' : '24px 18px'} !important; }
      .pv-h1 { font-size:${h1mob} !important; }
      .pv-btn { padding:16px 24px !important; font-size:15px !important; }
    }
  </style>
</head>
<body id="pv-bg" bgcolor="${C.bg}" style="margin:0;padding:0;background-color:${C.bg};-webkit-text-size-adjust:100%;text-size-adjust:100%;">
<!--[if mso]><table width="100%" bgcolor="${C.bg}"><tr><td><![endif]-->
<table id="pv-card" role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0"
  bgcolor="${C.bg}" style="background-color:${C.bg};border-collapse:collapse;width:100%;">
  <tr>
    <td align="center" bgcolor="${C.bg}"
      style="background-color:${C.bg};padding:${compact ? '16px 8px 24px' : '32px 8px 44px'};">

      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0"
        style="max-width:640px;width:100%;border-collapse:collapse;">

        <!-- Logo row -->
        <tr>
          <td align="center" bgcolor="${C.bg}"
            style="background-color:${C.bg};padding-bottom:20px;text-align:center;">
            <a href="https://plainvest.app"
              style="display:inline-block;text-decoration:none;border:0;">
              <img src="https://members.plainvest.app/assets/plainvest_horizontal_lockup.png"
                alt="Plainvest" width="210"
                style="display:block;width:210px;height:auto;border:0;max-width:210px;border-radius:8px;" />
            </a>
            ${!compact ? `<div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${C.footSlogan};margin-top:8px;">Future clarity. Smarter decisions.</div>` : ''}
          </td>
        </tr>

        <!-- Top accent bar -->
        <tr>
          <td bgcolor="${C.accent}" height="3"
            style="background-color:${C.accent};height:3px;line-height:3px;font-size:0;border-radius:3px 3px 0 0;">&#8203;</td>
        </tr>

        <!-- Card -->
        <tr>
          <td id="pv-card-inner" bgcolor="${C.card}"
            style="background-color:${C.card};border:1px solid ${C.border};border-top:0;border-radius:0 0 14px 14px;padding:${padCard};">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" bgcolor="${C.bg}"
            style="background-color:${C.bg};padding-top:24px;text-align:center;">
            ${!compact ? `<div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${C.footSlogan};margin-bottom:8px;">Future Clarity. Smarter Decisions.</div>` : ''}
            <div style="font-size:13px;color:${C.footMuted};margin-bottom:6px;line-height:1.7;">
              <a href="https://plainvest.app" style="color:${C.accent};text-decoration:none;">plainvest.app</a>
              &nbsp;·&nbsp;
              <a href="mailto:hello@plainvest.app" style="color:${C.accent};text-decoration:none;">hello@plainvest.app</a>
            </div>
            <div style="font-size:12px;color:${C.footMuted};margin-bottom:6px;line-height:1.5;">Questions? Contact <a href="mailto:hello@plainvest.app" style="color:${C.accent};text-decoration:none;">hello@plainvest.app</a></div>
            <div style="font-size:12px;color:${C.footMuted};margin-bottom:4px;line-height:1.5;">Educational platform. Not financial advice.</div>
            <div style="font-size:11px;color:${C.footMuted};line-height:1.5;">&copy; ${year} Plainvest</div>
            ${unsubscribeUrl ? `<div style="margin-top:12px;font-size:12px;line-height:1.6;color:${C.unsub};max-width:440px;margin-left:auto;margin-right:auto;">You are receiving this because you joined Plainvest or subscribed to Plainvest updates. <a href="${unsubscribeUrl}" style="color:${C.unsub};text-decoration:underline;">Unsubscribe anytime.</a></div>` : ''}
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`;

  // ── Post-process: inject inline styles on class-based elements ────────────
  return html
    // Buttons: fully inline, bulletproof colors
    .replace(
      /<a([^>]*?)class="btn"([^>]*?)>/g,
      `<a$1class="pv-btn"$2 style="display:inline-block;background-color:${C.cta};color:${C.ctaText};font-size:16px;font-weight:800;padding:18px 28px;border-radius:14px;text-decoration:none;letter-spacing:.01em;">`,
    )
    // btn-wrap → centering table
    .replace(
      /<div class="btn-wrap">([\s\S]*?)<\/div>/g,
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;border-collapse:collapse;"><tr><td align="center" bgcolor="${C.card}" style="text-align:center;background-color:${C.card};">$1</td></tr></table>`,
    )
    // checklist → table with inline ✓ + readable text (fixes "What's inside" invisible bug)
    .replace(/<ul class="checklist">([\s\S]*?)<\/ul>/g, (_m, inner: string) => {
      const rows = inner.replace(/<li>([\s\S]*?)<\/li>/g, (_mm, item: string) =>
        `<tr><td width="24" valign="top" style="padding:5px 0;font-size:15px;font-weight:900;color:${C.cta};line-height:1.5;">&#10003;</td><td style="padding:5px 0;font-size:15px;color:${C.checkText};line-height:1.55;">${item}</td></tr>`,
      );
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-collapse:collapse;">${rows}</table>`;
    })
    // receipt-table → inline readable rows
    .replace(/<table class="receipt-table">([\s\S]*?)<\/table>/g, (_m, inner: string) => {
      const rows = inner.replace(/<tr><td>([\s\S]*?)<\/td><td([^>]*)>([\s\S]*?)<\/td><\/tr>/g,
        (_mm, label: string, attrs: string, val: string) =>
        `<tr><td style="padding:10px 0;font-size:14px;color:${C.body};border-bottom:1px solid ${C.border};line-height:1.5;">${label}</td><td${attrs} style="padding:10px 0;font-size:14px;color:${C.text};border-bottom:1px solid ${C.border};text-align:right;font-weight:600;line-height:1.5;">${val}</td></tr>`,
      );
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border-collapse:collapse;">${rows}</table>`;
    })
    // sub
    .replace(/<span class="sub">/g, `<span class="pv-sub" style="display:block;font-size:14px;color:${C.muted};margin:0 0 24px;line-height:1.5;">`)
    .replace(/<span class="pv-sub">/g, `<span style="display:block;font-size:14px;color:${C.muted};margin:0 0 24px;line-height:1.5;">`)
    // hint
    .replace(/<p class="hint">/g, `<p class="pv-hint" style="font-size:13px;color:${C.muted};margin-top:4px;line-height:1.6;margin-bottom:0;">`)
    // divider
    .replace(/<div class="divider"><\/div>/g, `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;border-collapse:collapse;"><tr><td bgcolor="${C.border}" height="1" style="background-color:${C.border};height:1px;line-height:1px;font-size:0;">&#8203;</td></tr></table>`)
    // highlight panel
    .replace(/<div class="highlight">/g, `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-collapse:collapse;border-radius:8px;border:1px solid ${C.border};border-left:3px solid ${C.accent};"><tr><td bgcolor="${C.panel}" style="background-color:${C.panel};padding:14px 16px;border-radius:8px;color:${C.body};">`)
    .replace(/<\/div>\s*(?=\s*\$\{lbl|<div class="btn-wrap"|<div class="divider"|<table class="receipt-table")/g, '</td></tr></table>')
    // email pill
    .replace(/<div class="email-pill">/g, `<div style="display:inline-block;background-color:${C.panel};border:1px solid ${C.border};border-radius:6px;padding:8px 14px;font-size:14px;color:${C.body};margin:0 0 20px;word-break:break-all;">`)
    // security note
    .replace(/<div class="security-note">/g, `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-collapse:collapse;border-radius:8px;border:1px solid ${C.border};"><tr><td bgcolor="${C.panel}" style="background-color:${C.panel};padding:12px 16px;border-radius:8px;color:${C.body};">`)
    // bare <p> tags — add body text color inline
    .replace(/<p(?! class| style)>/g, `<p style="margin:0 0 16px;font-size:16px;color:${C.body};line-height:1.65;">`)
    // bare <h1> tags
    .replace(/<h1(?! class| style)>/g, `<h1 style="margin:0 0 8px;font-size:${h1size};font-weight:800;color:${C.text};line-height:1.25;">`)
    // bare <strong>
    .replace(/<strong(?! style)>/g, `<strong style="color:${C.text};">`);
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
      <td bgcolor="${C.panel}" style="background-color:${C.panel};padding:9px 18px;${i > 0 ? `border-top:1px solid ${C.border};` : ''}vertical-align:middle;" width="28">
        <div style="width:22px;height:22px;border-radius:50%;background-color:${step.active ? C.accent : C.border};text-align:center;font-size:11px;font-weight:900;color:${step.active ? C.bg : C.muted};line-height:22px;">${i + 1}</div>
      </td>
      <td bgcolor="${C.panel}" style="background-color:${C.panel};padding:9px 0 9px 10px;${i > 0 ? `border-top:1px solid ${C.border};` : ''}vertical-align:middle;font-size:14px;color:${step.active ? C.text : C.muted};">${step.title}</td>
      ${step.active ? `<td bgcolor="${C.panel}" style="background-color:${C.panel};padding:9px 18px 9px 0;text-align:right;font-size:12px;color:${C.accent};font-weight:700;white-space:nowrap;vertical-align:middle;">Start here</td>` : `<td bgcolor="${C.panel}" style="background-color:${C.panel};padding:9px 18px 9px 0;"></td>`}
    </tr>`).join('');

  const greeting = firstName === 'there' ? 'Welcome to Plainvest.' : `Welcome to Plainvest, ${firstName}.`;
  return layout('Welcome to Plainvest', `
    ${lbl('Welcome', 'welcome')}
    <h1>${greeting}</h1>
    <span class="sub">Your account is ready. Your journey starts now.</span>
    <p>You're now part of a platform built to help you understand investing — clearly, step by step, without the noise.</p>
    <p>Follow the learning path below. Each guide builds on the last.</p>
    ${lbl('Your Learning Path', '')}
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.panel}" style="background-color:${C.panel};border:1px solid ${C.border};border-radius:12px;border-collapse:collapse;overflow:hidden;margin:0 0 28px;">
      ${roadmapRows}
    </table>
    ${lbl('What\'s inside', '')}
    <ul class="checklist">
      <li>Beginner-friendly investing guides</li>
      <li>Portfolio planning tools</li>
      <li>Future projections &amp; Freedom Score</li>
      <li>Plain-English explanations — no jargon</li>
    </ul>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Start Learning →</a></div>
    <p class="hint">Questions? Reply to this email anytime — we're happy to help.</p>
  `);
}

// ─── 2. Newsletter confirm request (double opt-in) ────────────────────────────

export function newsletterConfirmRequestEmail(email: string, confirmUrl: string): string {
  return layout('Confirm your Plainvest subscription', `
    ${lbl('One more step', 'mail')}
    <h1>Confirm your email to join.</h1>
    <p>Click the button below to confirm your subscription and start receiving Plainvest investing insights.</p>
    ${lbl('Confirming address', '')}
    <div class="email-pill">${email}</div>
    <div class="btn-wrap"><a href="${confirmUrl}" class="btn">Confirm my email →</a></div>
    <div class="security-note">
      <p>⏱ This link expires in 24 hours. If you didn't sign up for Plainvest updates, you can safely ignore this email.</p>
    </div>
    <p style="font-size:13px;color:#7F90A3;line-height:1.6;margin-bottom:0;">If the button doesn't work, copy and paste this link into your browser:<br /><a href="${confirmUrl}" style="color:#00D6A3;word-break:break-all;font-size:12px;">${confirmUrl}</a></p>
  `, true);
}

// ─── 3. Newsletter confirmed ("You're on the list") ───────────────────────────

export function newsletterConfirmationEmail(email: string, unsubscribeUrl?: string): string {
  return layout("You're on the Plainvest list", `
    ${lbl('Confirmed', 'check')}
    <h1>You're confirmed. Welcome.</h1>
    <p>You're now subscribed to Plainvest Insights — calm, practical investing education delivered to your inbox. No hype, no spam.</p>
    <ul class="checklist">
      <li>Investing fundamentals</li>
      <li>Market insights — plain English</li>
      <li>New guides and platform updates</li>
      <li>Long-term wealth strategies</li>
    </ul>
    ${lbl('Your address', '')}
    <div class="email-pill">${email}</div>
    <div class="btn-wrap"><a href="https://plainvest.app" class="btn">Explore Plainvest →</a></div>
    <p style="font-size:13px;color:#7F90A3;margin-bottom:0;">No spam. Unsubscribe anytime.</p>
  `, false, unsubscribeUrl);
}

// ─── 3. Password reset ────────────────────────────────────────────────────────

export function passwordResetEmail(name: string, resetLink: string): string {
  const firstName = toFirst(name);
  return layout('Reset your Plainvest password', `
    ${lbl('Password reset', 'lock')}
    <h1>Reset your password.</h1>
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
    <h1>Welcome to Pro.</h1>
    <span class="sub">Your full investing dashboard is ready, ${firstName}.</span>
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
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Open Dashboard →</a></div>
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
    <h1>Your Premium access is ready.</h1>
    <span class="sub">Everything is unlocked, ${firstName}. No recurring fees. Ever.</span>
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
    <p style="font-size:13px;color:#7F90A3;margin-bottom:24px;">No recurring fees. Ever.</p>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Open Member Hub →</a></div>
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

// ─── 7b. Refund processed ─────────────────────────────────────────────────────

export function refundProcessedEmail(name: string, data: {
  product: string;
  amount: string;
  date: string;
  transactionId: string;
}): string {
  const firstName = toFirst(name);
  return layout('Your Plainvest refund has been processed', `
    ${lbl('Refund processed', 'refresh')}
    <h1>Your refund is on its way, ${firstName}.</h1>
    <span class="sub">We've processed your refund in full.</span>
    <p>Your refund has been issued back to your original payment method. It typically takes <strong>5–10 business days</strong> to appear, depending on your bank or card provider.</p>
    <table class="receipt-table">
      <tr><td>Product</td><td>${data.product}</td></tr>
      <tr><td>Amount refunded</td><td>${data.amount}</td></tr>
      <tr><td>Date</td><td>${data.date}</td></tr>
      <tr><td>Transaction ID</td><td style="font-size:12px;font-family:monospace;">${data.transactionId}</td></tr>
    </table>
    <p>Your Plainvest access tied to this purchase has now ended. You're always welcome back — your account stays open and you can re-subscribe anytime.</p>
    <p class="hint">Questions about your refund? Just reply to this email or contact hello@plainvest.app.</p>
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
    <h1>Your support call is confirmed.</h1>
    <span class="sub">60-minute 1-on-1 session</span>
    <p>Your Plainvest support call is confirmed. ${hasDetails ? '' : "We'll be in touch within 24 hours to send your Zoom link and scheduled time."}</p>
    ${hasDetails ? `
    <div class="highlight">
      <p>
        ${data?.date ? `<strong>Date:</strong> ${data.date}<br />` : ''}
        ${data?.time ? `<strong>Time:</strong> ${data.time}<br />` : ''}
        ${data?.meetingLink ? `<strong>Meeting Link:</strong> <a href="${data.meetingLink}" style="color:#00D6A3;">${data.meetingLink}</a>` : ''}
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
    <h1>Your call is tomorrow.</h1>
    <div class="highlight">
      <p>
        <strong>Date:</strong> ${data.date}<br />
        <strong>Time:</strong> ${data.time}<br />
        <strong>Meeting Link:</strong> <a href="${data.meetingLink}" style="color:#00D6A3;">${data.meetingLink}</a>
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
}, unsubscribeUrl?: string): string {
  const firstName = toFirst(name);
  return layout('New guide available on Plainvest', `
    ${lbl('New guide', 'book')}
    <h1>A new guide is available.</h1>
    <p>We've added a new guide to help you continue building your investing knowledge.</p>
    <div class="highlight">
      <p><strong>${guide.title}</strong><br />${guide.description}</p>
    </div>
    <div class="btn-wrap"><a href="${guide.url}" class="btn">Read Guide →</a></div>
    <div class="divider"></div>
    ${lbl('Recommended next', '')}
    <div style="margin:0 0 24px;">
      <div style="padding:9px 0;border-bottom:1px solid #173246;font-size:14px;color:#7F90A3;">→&nbsp; Investment Paths Guide</div>
      <div style="padding:9px 0;border-bottom:1px solid #173246;font-size:14px;color:#7F90A3;">→&nbsp; DCA Method Guide</div>
      <div style="padding:9px 0;font-size:14px;color:#7F90A3;">→&nbsp; Build Your Portfolio</div>
    </div>
    <p class="hint">Questions about the guide? Reply to this email anytime.</p>
  `, false, unsubscribeUrl);
}

// ─── 11. Progress milestone ───────────────────────────────────────────────────

export function milestoneEmail(name: string, data: {
  completed: number;
  total: number;
  milestone: string;
}, unsubscribeUrl?: string): string {
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
    <p class="hint">${pct >= 50 ? "You're over halfway — the hardest part is done." : "Every guide you complete puts you further ahead than most people ever get."}</p>
  `, false, unsubscribeUrl);
}

// ─── 12. Re-engagement ───────────────────────────────────────────────────────

export function reengagementEmail(name: string, data?: {
  completed?: number;
  total?: number;
  nextGuide?: string;
}, unsubscribeUrl?: string): string {
  const firstName = toFirst(name);
  const hasStats = data?.completed !== undefined && data?.total !== undefined;
  const nextGuide = data?.nextGuide || 'Investment Paths';

  return layout('Continue where you left off', `
    ${lbl('We miss you', 'refresh')}
    <h1>Ready to continue, ${firstName}?</h1>
    ${hasStats && data!.completed !== undefined && data!.total !== undefined
      ? `<p>You've already completed <strong>${data!.completed} guides</strong> — that's real progress. Your path, tools, and everything else are right where you left them.</p>
         ${statsCard(data!.completed, data!.total)}`
      : `<p>You've already made real progress inside Plainvest. Your guides, tools, and learning path are right where you left them.</p>`
    }
    ${lbl('Pick up where you left off', '')}
    <div class="highlight">
      <p><strong>Next recommended:</strong> ${nextGuide}<br />
      <span style="font-size:13px;color:#7F90A3;">Continue building your investing foundation.</span></p>
    </div>
    <div class="btn-wrap"><a href="https://members.plainvest.app" class="btn">Resume Learning →</a></div>
    <p class="hint">Questions or need help getting started again? Reply to this email anytime.</p>
  `, false, unsubscribeUrl);
}

// ─── 13. Promotion ───────────────────────────────────────────────────────────

export function promotionEmail(data: {
  subject: string;
  headline: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  subtext?: string;
}, unsubscribeUrl?: string): string {
  return layout(data.subject, `
    ${lbl('Plainvest', 'rocket')}
    <h1>${data.headline}</h1>
    <p>${data.body}</p>
    ${data.subtext ? `<p style="font-size:13px;color:${C.muted};">${data.subtext}</p>` : ''}
    <div class="btn-wrap"><a href="${data.ctaUrl}" class="btn">${data.ctaText} →</a></div>
    <p class="hint">Questions? Reply to this email anytime.</p>
  `, false, unsubscribeUrl);
}

// ─── 14. Subscription cancelled ──────────────────────────────────────────────

export function subscriptionCancelledEmail(name: string): string {
  const firstName = toFirst(name);
  return layout('Your Pro subscription has been cancelled — Plainvest', `
    ${lbl('Subscription update', 'cancel', C.muted)}
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
    ${lbl('Payment notice', 'warning', C.warning)}
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
  return layout('Verify your Plainvest email', `
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
    <h1>We received your message.</h1>
    <p>We'll get back to you within 3–5 business days.</p>
    <p>In the meantime, feel free to explore the guides and tools at your own pace.</p>
    <div class="btn-wrap"><a href="https://plainvest.app" class="btn">Explore Plainvest →</a></div>
    <p class="hint">Questions? Reply to this email anytime.</p>
  `);
}

// ─── Admin notification emails ───────────────────────────────────────────────

export function adminRefundEmail(data: {
  customer: string;
  email: string;
  amount: string;
  transactionId: string;
  date: string;
}): string {
  return layout('Refund processed — Plainvest', `
    ${lbl('Admin Notification', 'admin', C.muted)}
    <h1>Refund processed.</h1>
    <div class="highlight">
      <p>
        <strong>Customer:</strong> ${esc(data.customer)}<br />
        <strong>Email:</strong> ${esc(data.email)}<br />
        <strong>Amount refunded:</strong> ${esc(data.amount)}<br />
        <strong>Transaction ID:</strong> <span style="font-family:monospace;font-size:12px;">${esc(data.transactionId)}</span><br />
        <strong>Date:</strong> ${esc(data.date)}
      </p>
    </div>
  `, true);
}

export function adminNewUserEmail(data: {
  name: string;
  email: string;
  date: string;
}): string {
  return layout('New user — Plainvest', `
    ${lbl('Admin Notification', 'admin', C.muted)}
    <h1>New user registered.</h1>
    <div class="highlight">
      <p>
        <strong>Name:</strong> ${esc(data.name || '—')}<br />
        <strong>Email:</strong> ${esc(data.email)}<br />
        <strong>Date:</strong> ${esc(data.date)}
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
    ${lbl('Admin Notification', 'admin', C.muted)}
    <h1>New subscriber.</h1>
    <div class="highlight">
      <p>
        <strong>Email:</strong> ${esc(data.email)}<br />
        <strong>Source:</strong> ${esc(data.page)}<br />
        <strong>Language:</strong> ${esc(data.language)}<br />
        ${data.date ? `<strong>Date:</strong> ${esc(data.date)}<br />` : ''}
        ${data.country ? `<strong>Country:</strong> ${esc(data.country)}<br />` : ''}
        ${data.utmSource ? `<strong>UTM Source:</strong> ${esc(data.utmSource)}` : ''}
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
    ${lbl('Admin Notification', 'admin', C.muted)}
    <h1>New Pro purchase.</h1>
    <div class="highlight">
      <p>
        <strong>Customer:</strong> ${esc(data.customer)}<br />
        <strong>Amount:</strong> ${esc(data.amount)}<br />
        <strong>Transaction ID:</strong> <span style="font-family:monospace;font-size:12px;">${esc(data.transactionId)}</span><br />
        <strong>Date:</strong> ${esc(data.date)}
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
    ${lbl('Admin Notification', 'admin', C.muted)}
    <h1>New Lifetime purchase.</h1>
    <div class="highlight">
      <p>
        <strong>Customer:</strong> ${esc(data.customer)}<br />
        <strong>Amount:</strong> ${esc(data.amount)}<br />
        <strong>Transaction ID:</strong> <span style="font-family:monospace;font-size:12px;">${esc(data.transactionId)}</span><br />
        <strong>Date:</strong> ${esc(data.date)}
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
    ${lbl('Admin Notification', 'admin', C.muted)}
    <h1>New support call booked.</h1>
    <div class="highlight">
      <p>
        <strong>Customer:</strong> ${esc(data.customer)}<br />
        <strong>Email:</strong> ${esc(data.email)}<br />
        ${data.date ? `<strong>Date:</strong> ${esc(data.date)}<br />` : ''}
        ${data.time ? `<strong>Time:</strong> ${esc(data.time)}` : ''}
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
    ${lbl('Admin Notification', 'admin', C.muted)}
    <h1>New ${data.formType}.</h1>
    <div class="highlight">
      <p>
        <strong>Name:</strong> ${esc(data.name)}<br />
        <strong>Email:</strong> ${esc(data.email)}<br />
        ${data.company ? `<strong>Company:</strong> ${esc(data.company)}<br />` : ''}
        ${data.topic ? `<strong>Topic:</strong> ${esc(data.topic)}<br />` : ''}
        <strong>Language:</strong> ${esc(data.language)}<br />
        <strong>Page:</strong> ${esc(data.page)}
      </p>
    </div>
    ${lbl('Message', '')}
    <p style="white-space:pre-wrap;font-size:14px;">${esc(data.message)}</p>
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
    <p style="background-color:#0F2A2E;border:1px solid #173246;border-radius:10px;padding:14px 18px;font-size:14px;color:#B7C6D8;line-height:1.65;">
      <strong style="color:#E8B84B;">Your takeaway:</strong> Knowledge is the cure for emotional investing. When you understand why markets move, you stop reacting to every dip.
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
    <p style="background-color:#0F2A2E;border:1px solid #173246;border-radius:10px;padding:14px 18px;font-size:14px;color:#B7C6D8;line-height:1.65;">
      <strong style="color:#E8B84B;">Your takeaway:</strong> Set a fixed amount → Set a recurring date → Automate it → Stop watching it daily. That's it.
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
    <p style="background-color:#0F2A2E;border:1px solid #173246;border-radius:10px;padding:14px 18px;font-size:14px;color:#B7C6D8;line-height:1.65;">
      <strong style="color:#E8B84B;">Your takeaway:</strong> Most beginners do best starting with broad ETFs — diversified, low cost, and no need to pick individual winners.
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
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#0F2A2E" style="background-color:#0F2A2E;border:1px solid #173246;border-radius:12px;border-collapse:collapse;margin:0 0 24px;"><tr><td style="padding:20px;text-align:center;">
      <div style="font-size:13px;color:#7F90A3;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;">Your Freedom Number</div>
      <div style="font-size:22px;font-weight:900;color:#00D6A3;">Annual expenses ÷ 4%</div>
    </td></tr></table>
    <div class="highlight">
      <p>
        Need <strong>$30,000/year</strong> → target <strong>$750,000</strong><br />
        Need <strong>$50,000/year</strong> → target <strong>$1,250,000</strong><br />
        Need <strong>$80,000/year</strong> → target <strong>$2,000,000</strong>
      </p>
    </div>
    <p style="background-color:#0F2A2E;border:1px solid #173246;border-radius:10px;padding:14px 18px;font-size:14px;color:#B7C6D8;line-height:1.65;">
      <strong style="color:#E8B84B;">Your takeaway:</strong> Calculate your number. That's your target. Every dollar you invest is a step toward it.
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
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#0F2A2E" style="background-color:#0F2A2E;border:1px solid #173246;border-radius:12px;border-collapse:collapse;margin:0 0 24px;overflow:hidden;">
        ${[
          'What investing actually is — not speculation',
          'How compound growth works over 20–30 years',
          'ETFs and why they beat most active strategies',
          'Dollar-cost averaging to remove emotional decisions',
          'Bitcoin basics — why it exists and what it\'s for',
          'How to build a simple, durable portfolio',
        ].map((step, i) => `<tr>
          <td style="padding:10px 18px;${i > 0 ? 'border-top:1px solid #173246;' : ''}vertical-align:middle;" width="28">
            <div style="width:22px;height:22px;border-radius:50%;background-color:#0F2A2E;text-align:center;font-size:11px;font-weight:900;color:#00D6A3;line-height:22px;">${i + 1}</div>
          </td>
          <td style="padding:10px 0 10px 10px;${i > 0 ? 'border-top:1px solid #173246;' : ''}font-size:14px;color:#B7C6D8;">${step}</td>
        </tr>`).join('')}
    </table>
    <p style="background-color:#0F2A2E;border:1px solid #173246;border-radius:10px;padding:14px 18px;font-size:14px;color:#B7C6D8;line-height:1.65;">
      <strong style="color:#E8B84B;">Your takeaway:</strong> You don't need to know everything. These six things give you everything you need to start investing with confidence.
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
    <p style="font-size:13px;color:#7F90A3;margin-bottom:24px;">Free account available. No credit card required.</p>
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
    <p style="font-size:13px;color:#7F90A3;margin-bottom:24px;">No recurring fees. Ever.</p>
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
