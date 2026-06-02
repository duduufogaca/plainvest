<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was already partially integrated (packages installed, `instrumentation-client.ts`, server-side client, and reverse proxy in `next.config.ts`). This session verified and corrected the environment variable values, added three new event captures covering the portfolio and upgrade flows, and created a new dashboard with five business-critical insights.

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user registers an account | `app/actions/auth.ts` |
| `user_logged_in` | User successfully logs in (server-side identify also fires) | `app/actions/auth.ts` |
| `user_logged_out` | User signs out | `app/actions/auth.ts` |
| `password_reset_requested` | User requests a password reset email | `app/actions/auth.ts` |
| `password_updated` | User sets a new password | `app/actions/auth.ts` |
| `checkout_started` | User initiates Stripe checkout for Premium or Pro | `app/api/stripe/checkout/route.ts` |
| `support_call_checkout_started` | User initiates checkout for a support call | `app/api/stripe/support-call/route.ts` |
| `premium_access_activated` | Payment confirmed — user's premium/pro access is activated | `app/api/stripe/webhook/route.ts` |
| `support_call_purchased` | Support call payment confirmed via webhook | `app/api/stripe/webhook/route.ts` |
| `position_added` | Pro user adds a portfolio position; properties: `asset_type`, `currency` | `app/actions/portfolio.ts` |
| `position_deleted` | Pro user removes a portfolio position | `app/actions/portfolio.ts` |
| `upgrade_cta_clicked` | Premium member clicks "Upgrade to Pro" CTA; property: `source` | `app/home/components/MemberHomeClient.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1650389)
- [New signups over time](/insights/Xp1jfuXx)
- [Signup to Premium conversion funnel](/insights/FEN2kHkS)
- [Revenue events trend](/insights/hpB4GiJG)
- [Portfolio positions added](/insights/VMjpLfV5)
- [Upgrade CTA clicks](/insights/66CCPAXC)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
