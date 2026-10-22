import type { PostHog } from 'posthog-js';

/**
 * PostHog (EU cloud) for product analytics and session replay.
 *
 * Nothing here runs before the visitor agrees in the consent banner: the SDK is
 * imported dynamically on `startPostHog()`, so a visitor who never says yes
 * downloads no PostHog code, gets no cookie and sends no request.
 *
 * Requests go through `/ingest` on our own domain (see the rewrites in
 * next.config.mjs) so ad blockers do not swallow them.
 */
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

let client: PostHog | null = null;
let starting: Promise<void> | null = null;

export function startPostHog(): Promise<void> {
  if (!POSTHOG_KEY) return Promise.resolve();
  if (client) {
    // Consent given again after a revoke on the same page.
    client.opt_in_capturing();
    return Promise.resolve();
  }
  starting ??= import('posthog-js').then(({ default: posthog }) => {
    posthog.init(POSTHOG_KEY, {
      api_host: '/ingest',
      ui_host: 'https://eu.posthog.com',
      // Pageviews on client-side navigation, pageleave with scroll depth.
      defaults: '2026-08-30',
      person_profiles: 'identified_only',
      enable_heatmaps: true,
      session_recording: {
        // Contact, newsletter and feedback forms carry names and emails.
        maskAllInputs: true,
      },
    });
    // A revoke on an earlier visit leaves PostHog's opt-out flag behind.
    if (posthog.has_opted_out_capturing()) posthog.opt_in_capturing();
    client = posthog;
  });
  return starting;
}

/** Revoked consent: stop recording and drop the PostHog cookie and ids. */
export function stopPostHog() {
  if (!client) return;
  client.opt_out_capturing();
  client.reset();
}

/** Custom events from `lib/analytics.ts`; a no-op until consent. */
export function capturePostHog(event: string, properties?: Record<string, unknown>) {
  client?.capture(event, properties);
}
