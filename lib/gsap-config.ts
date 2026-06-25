/**
 * Global GSAP Configuration
 *
 * This file initializes GSAP and registers plugins globally.
 * Import this instead of registering plugins in individual components.
 *
 * Usage:
 * import { gsap, ScrollTrigger } from '@/lib/gsap-config';
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins only once, globally
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Export for use in components
export { gsap, ScrollTrigger };
