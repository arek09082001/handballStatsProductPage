'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';
function subscribe(notify: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
}

/** A calm server snapshot prevents motion-dependent hydration differences. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => true);
}
