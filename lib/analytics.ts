import { track } from '@vercel/analytics';

export type DemoClickLocation =
  | 'hero'
  | 'navbar'
  | 'showcase'
  | 'pros'
  | 'final_cta'
  | 'footer';

/**
 * The live demo is the primary conversion goal, but it lives on an external
 * domain – without an explicit event every demo click is invisible in
 * Vercel Analytics.
 */
export function trackDemoClick(location: DemoClickLocation) {
  track('demo_click', { location });
}
