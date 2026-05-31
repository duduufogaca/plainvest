'use client';

export default function EmailPreviewPage() {
  if (process.env.NODE_ENV !== 'development') return null;

  const templates = [
    { type: 'welcome',              label: 'Welcome',                      category: 'Auth' },
    { type: 'newsletter',           label: 'Newsletter Confirmation',       category: 'Auth' },
    { type: 'password_reset',       label: 'Password Reset',                category: 'Auth' },
    { type: 'password_changed',     label: 'Password Changed',              category: 'Auth' },
    { type: 'email_verification',   label: 'Email Verification',            category: 'Auth' },
    { type: 'pro_welcome',          label: 'Pro Activated',                 category: 'Membership' },
    { type: 'lifetime_welcome',     label: 'Lifetime Activated',            category: 'Membership' },
    { type: 'receipt',              label: 'Payment Receipt',               category: 'Membership' },
    { type: 'sub_renewed',          label: 'Subscription Renewed',          category: 'Membership' },
    { type: 'sub_cancelled',        label: 'Subscription Cancelled',        category: 'Membership' },
    { type: 'payment_failed',       label: 'Payment Failed',                category: 'Membership' },
    { type: 'zoom_confirmation',    label: 'Zoom Booking Confirmation',     category: 'Support' },
    { type: 'zoom_reminder',        label: 'Zoom Call Reminder',            category: 'Support' },
    { type: 'contact_confirmation', label: 'Contact Received',              category: 'Support' },
    { type: 'waitlist',             label: 'Waitlist Confirmation',         category: 'Support' },
    { type: 'new_guide',            label: 'New Guide Published',           category: 'Engagement' },
    { type: 'milestone',            label: 'Progress Milestone',            category: 'Engagement' },
    { type: 'reengagement',         label: 'Re-engagement',                 category: 'Engagement' },
    { type: 'promotion',            label: 'Promotion',                     category: 'Engagement' },
    { type: 'nl_welcome',           label: 'NL: Day 1 — Foundation',        category: 'Newsletter' },
    { type: 'nl_edu1',              label: 'NL: Lesson 1 — Lose Money',     category: 'Newsletter' },
    { type: 'nl_edu2',              label: 'NL: Lesson 2 — DCA',            category: 'Newsletter' },
    { type: 'nl_edu3',              label: 'NL: Lesson 3 — Asset Classes',  category: 'Newsletter' },
    { type: 'nl_edu4',              label: 'NL: Lesson 4 — Retirement',     category: 'Newsletter' },
    { type: 'nl_edu5',              label: 'NL: Lesson 5 — Start from Zero',category: 'Newsletter' },
    { type: 'nl_product',           label: 'NL: Product Intro',             category: 'Newsletter' },
    { type: 'nl_lifetime',          label: 'NL: Lifetime Upgrade',          category: 'Newsletter' },
    { type: 'nl_pro',               label: 'NL: Pro Upgrade',               category: 'Newsletter' },
    { type: 'admin_new_user',       label: 'Admin: New User',               category: 'Admin' },
    { type: 'admin_new_subscriber', label: 'Admin: New Subscriber',         category: 'Admin' },
    { type: 'admin_pro_purchase',   label: 'Admin: New Pro Purchase',       category: 'Admin' },
    { type: 'admin_lifetime',       label: 'Admin: New Lifetime Purchase',  category: 'Admin' },
    { type: 'admin_zoom',           label: 'Admin: New Zoom Booking',       category: 'Admin' },
    { type: 'contact_notification', label: 'Admin: Contact Form',           category: 'Admin' },
  ];

  const categories = ['Auth', 'Membership', 'Support', 'Engagement', 'Newsletter', 'Admin'];

  const categoryColors: Record<string, string> = {
    Auth:       '#3b82f6',
    Membership: '#00d4aa',
    Support:    '#a78bfa',
    Engagement: '#f59e0b',
    Newsletter: '#6366f1',
    Admin:      '#64748b',
  };

  return (
    <div style={{ background: '#060d1a', minHeight: '100vh', padding: '40px 24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,212,170,.7)', marginBottom: '8px' }}>
            Dev only
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 900, color: '#fff' }}>
            Email Preview
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,.4)' }}>
            Click any template to preview it in the browser. Not visible in production.
          </p>
        </div>

        {categories.map(category => (
          <div key={category} style={{ marginBottom: '36px' }}>
            <div style={{
              fontSize: '11px', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase',
              color: categoryColors[category], marginBottom: '12px', paddingBottom: '8px',
              borderBottom: `1px solid rgba(255,255,255,.06)`
            }}>
              {category}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
              {templates.filter(t => t.category === category).map(t => (
                <a
                  key={t.type}
                  href={`/api/email-test?type=${t.type}&preview=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#0b1929', border: '1px solid rgba(255,255,255,.08)',
                    borderRadius: '10px', padding: '12px 16px',
                    color: 'rgba(255,255,255,.75)', fontSize: '14px', fontWeight: 500,
                    textDecoration: 'none', transition: 'border-color .15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,212,170,.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)')}
                >
                  <span>{t.label}</span>
                  <span style={{ fontSize: '16px', color: 'rgba(0,212,170,.6)' }}>→</span>
                </a>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,.06)', fontSize: '12px', color: 'rgba(255,255,255,.25)' }}>
          To send a test to your inbox: <code style={{ color: 'rgba(0,212,170,.6)' }}>/api/email-test?type=welcome</code>
        </div>

      </div>
    </div>
  );
}
