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
