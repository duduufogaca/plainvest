<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Plainvest. Here is a summary of all changes made:

- **`instrumentation-client.ts`** (new): Initializes `posthog-js` client-side via Next.js instrumentation. Uses a reverse proxy at `/ingest` and enables exception capture.
- **`lib/posthog-server.ts`** (new): Server-side PostHog helper using `posthog-node`. Used across all API routes and server actions.
- **`next.config.ts`** (updated): Added reverse proxy rewrites for `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` to route PostHog requests through the app, improving reliability.
- **`app/actions/auth.ts`** (updated): Added server-side event capture and user identification for login, signup, logout, password reset, and password update flows.
- **`app/auth/callback/route.ts`** (updated): Added `email_confirmed` event and `identify` call when a user confirms their email.
- **`app/api/stripe/checkout/route.ts`** (updated): Added `checkout_started` event when a user initiates the premium checkout session.
- **`app/api/stripe/confirm/route.ts`** (updated): Added `payment_confirmed` event after successful Stripe payment redirect and database activation.
- **`app/api/stripe/webhook/route.ts`** (updated): Added `premium_access_activated` and `support_call_purchased` events when Stripe webhook confirms completed checkout sessions.
- **`app/api/stripe/support-call/route.ts`** (updated): Added `support_call_checkout_started` event when a user initiates the support call checkout.

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully created an account | `app/actions/auth.ts` |
| `user_logged_in` | User successfully logged in | `app/actions/auth.ts` |
| `user_logged_out` | User signed out from the dashboard | `app/actions/auth.ts` |
| `password_reset_requested` | User requested a password reset link | `app/actions/auth.ts` |
| `password_updated` | User updated their password | `app/actions/auth.ts` |
| `email_confirmed` | User confirmed their email via the auth callback | `app/auth/callback/route.ts` |
| `checkout_started` | User initiated the Stripe checkout for Premium | `app/api/stripe/checkout/route.ts` |
| `payment_confirmed` | Premium access confirmed after Stripe redirect | `app/api/stripe/confirm/route.ts` |
| `premium_access_activated` | Premium access granted via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `support_call_purchased` | Support call purchase recorded via Stripe webhook | `app/api/stripe/webhook/route.ts` |
| `support_call_checkout_started` | User initiated the support call checkout | `app/api/stripe/support-call/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1591563)
- [Signups & Logins over time](/insights/uHoWg47x)
- [Signup → Checkout → Premium Conversion Funnel](/insights/Jt8cxIBD)
- [Premium Activations over time](/insights/ga9LEIqV)
- [Revenue Events Comparison](/insights/qW4svEpS)
- [User Logouts (Churn Signal)](/insights/WlKKGXw9)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
