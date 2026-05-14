# Plainvest Next.js Member App

This app is the Supabase-ready member area for Plainvest Premium.

## Setup

1. Copy `.env.local.example` to `.env.local`.
2. Add your Supabase project URL and anon/publishable key. The project URL is already set in the example as `https://pegxgzcvqrckjadsoksn.supabase.co`.
3. Set `NEXT_PUBLIC_SITE_URL` to `http://localhost:3000` locally and later to `https://plainvest.app`.
4. Add the Supabase service-role key to `SUPABASE_SERVICE_ROLE_KEY`. Keep it server-only.
5. In Supabase, enable Email authentication.
6. Add these redirect URLs in Supabase Authentication settings:
   - `http://localhost:3000/auth/callback`
   - `https://plainvest.app/auth/callback`
7. Run `supabase/member_access.sql` in the Supabase SQL editor.
8. Add Stripe test keys:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `STRIPE_PRICE_ID`
9. Install dependencies and run:

```bash
npm install
npm run dev
```

## Routes

- `/signup` creates a member account.
- `/login` signs in existing members.
- `/dashboard` is protected and shows purchase access until Stripe marks the member as active.
- `/auth/callback` receives Supabase email confirmation callbacks.
- `/api/stripe/checkout` creates Stripe Checkout sessions.
- `/api/stripe/webhook` receives Stripe payment events.

Use the public anon key only. Never place the Supabase service-role key in this app.
