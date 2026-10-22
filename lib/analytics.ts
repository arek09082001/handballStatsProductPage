import { track as vercelTrack } from '@vercel/analytics';
import { capturePostHog } from '@/lib/posthog';

/**
 * Every custom event goes to Vercel Analytics (cookieless, always on) and to
 * PostHog (only after consent), so funnels and replays there can filter on
 * the same conversions.
 */
function track(event: string, properties?: Record<string, string>) {
  vercelTrack(event, properties);
  capturePostHog(event, properties);
}

export type DemoClickLocation =
  | 'hero'
  | 'navbar'
  | 'showcase'
  | 'ticker'
  | 'ai'
  | 'pros'
  | 'final_cta'
  | 'footer'
  | 'template';

export type RegisterClickLocation =
  | 'hero'
  | 'navbar'
  | 'showcase'
  | 'ticker'
  | 'ai'
  | 'pros'
  | 'final_cta'
  | 'footer'
  | 'pricing'
  | 'template';

/**
 * The live demo is the secondary conversion goal, but it lives on an external
 * domain – without an explicit event every demo click is invisible in
 * Vercel Analytics.
 */
export function trackDemoClick(location: DemoClickLocation) {
  track('demo_click', { location });
}

/**
 * Registration on the app domain is the primary conversion goal since launch.
 * Same reasoning as the demo event: the click leaves this origin, so it has to
 * be reported explicitly.
 */
export function trackRegisterClick(location: RegisterClickLocation) {
  track('register_click', { location });
}

/**
 * The buy button on `/preise`. It hands over to the app's checkout on another
 * domain, so — like registration — the click is invisible unless reported.
 * The selection travels along to show which combinations people actually pick.
 */
export function trackCheckoutClick(selection: {
  app: string;
  video: string;
  cadence: string;
}) {
  track('checkout_click', selection);
}

/**
 * Google's preferred-sources button. Same reasoning as the two above: the
 * click leaves this origin — either into Google's confirmation flow or, when
 * their module did not load, straight to the deeplink — so nothing about it
 * shows up in page views.
 */
export function trackPreferredSourceClick() {
  track('preferred_source_click');
}
