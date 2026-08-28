import { track } from '@vercel/analytics';

export type DemoClickLocation =
  | 'hero'
  | 'navbar'
  | 'showcase'
  | 'pros'
  | 'final_cta'
  | 'footer';

export type RegisterClickLocation =
  | 'hero'
  | 'navbar'
  | 'pros'
  | 'final_cta'
  | 'footer';

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
 * Google's preferred-sources button. Same reasoning as the two above: the
 * click leaves this origin — either into Google's confirmation flow or, when
 * their module did not load, straight to the deeplink — so nothing about it
 * shows up in page views.
 */
export function trackPreferredSourceClick() {
  track('preferred_source_click');
}
