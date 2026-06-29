# Newsletter Double-Opt-In (Brevo) – Setup

The newsletter endpoint (`app/api/newsletter/route.ts`) requires a Brevo
double-opt-in (DOI) template. Without it the endpoint returns `503` and no
contact is added (we never subscribe someone without a confirmation email).

## 1. Create the DOI template in Brevo

1. Brevo dashboard → **Campaigns → Templates → New template**.
2. Editor: **"Paste your code (HTML)"**.
3. Paste the contents of [`brevo-doi-template.html`](./brevo-doi-template.html).
4. **Subject:** `Bitte bestätige deine Newsletter-Anmeldung – MatchPulse`
5. **Sender:** a *verified* sender/domain (e.g. `noreply@handballwebseite.de`).
   Unverified senders are silently dropped by Brevo.
6. Save and **activate** the template.
7. Note its **numeric Template ID** (shown in the template list / URL).

> The template must keep the `{{ doubleOptin }}` merge tag — Brevo swaps it for
> the unique confirmation link at send time.

## 2. Set the environment variables

In your deployment (Vercel → Project → Settings → Environment Variables):

| Variable | Value |
| --- | --- |
| `BREVO_API_KEY` | API key from Brevo → SMTP & API → API Keys |
| `BREVO_NEWSLETTER_LIST_ID` | ID of the contact list (default `4`) |
| `BREVO_DOI_TEMPLATE_ID` | the numeric template ID from step 1 |
| `BREVO_DOI_REDIRECT_URL` | *(optional)* page after confirmation; defaults to `${NEXT_PUBLIC_BASE_URL}/?newsletter=confirmed` |

Redeploy after saving.

## 3. Test

Submit the newsletter form → confirmation email arrives → clicking
"Anmeldung bestätigen" confirms the subscription and redirects back to the site.

> If a test address was added earlier under the old single-opt-in behaviour,
> Brevo returns "already exists" and won't resend. Delete it from the list in
> Brevo first, then re-test.
