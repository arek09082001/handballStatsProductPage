# Newsletter Double-Opt-In (self-hosted)

Double opt-in is implemented **inside this app** — we don't rely on Brevo's
built-in DOI template. The flow:

1. **Signup** — `POST /api/newsletter` validates the email, then sends a
   confirmation email via the Brevo **transactional** API
   (`sendTransacEmail`). The contact is **not** added to the list yet.
2. **Confirmation link** — the email links to
   `/newsletter/confirm?token=…`. The token is an HMAC-signed value
   containing the email + a 48h expiry (`lib/utils/newsletter-token.ts`).
3. **Confirm page** — `app/newsletter/confirm/page.tsx` shows a card with a
   "Anmeldung bestätigen" button. Clicking it calls
   `POST /api/newsletter/confirm`, which verifies the token and adds the
   contact to the Brevo list. Doing nothing = no subscription.

## Required environment variables

In Vercel → Project → Settings → Environment Variables:

| Variable | Required | Value |
| --- | --- | --- |
| `BREVO_API_KEY` | yes | API key from Brevo → SMTP & API → API Keys |
| `NEXT_PUBLIC_BASE_URL` | yes | e.g. `https://www.statix-app.de` (used to build the confirm link) |
| `BREVO_NEWSLETTER_LIST_ID` | optional | contact list ID for confirmed subscribers (default `4`) |
| `NEWSLETTER_CONFIRM_SECRET` | optional | HMAC secret for the token; falls back to `BREVO_API_KEY` |

> The sender address (`noreply@statix-app.de`, from `lib/club-config.ts`)
> must be a **verified** Brevo sender/domain, otherwise the confirmation email
> won't be delivered.

No Brevo DOI template needs to be created — the confirmation email is rendered
by `generateNewsletterConfirmationEmail` in `lib/utils/email-templates.ts`.

## Unsubscribe

Unsubscribing is the mirror image of the confirmation step:

1. **Unsubscribe page** — `app/newsletter/unsubscribe/page.tsx` renders a card
   at `/newsletter/unsubscribe`. It works two ways:
   - **One-click** — a `?token=…` link (same HMAC token as the confirm flow,
     `lib/utils/newsletter-token.ts`) shows a single "Newsletter abmelden"
     button.
   - **Manual** — without a token (e.g. linked from the site footer), the
     visitor types their email address. If a token link is expired, the page
     falls back to this manual form automatically.
2. **API** — `POST /api/newsletter/unsubscribe` resolves the email (from the
   token or the typed address) and calls Brevo `removeContactFromList` on
   `BREVO_NEWSLETTER_LIST_ID` — the exact inverse of confirm's
   `createContact`. Unknown / already-removed contacts are treated as success,
   so the request is idempotent and never reveals whether an address was on
   the list.

To put a one-click link into an email, append
`?token=${createNewsletterToken(email)}` to
`${NEXT_PUBLIC_BASE_URL}/newsletter/unsubscribe`.

## Test

1. Submit the newsletter form → "Bestätigungs-E-Mail gesendet", inline success
   panel appears.
2. Open the email → click "Anmeldung bestätigen" → confirm page shows success
   and the contact appears in the Brevo list.
3. Visit `/newsletter/unsubscribe`, enter the same address → success panel and
   the contact is removed from the Brevo list.
