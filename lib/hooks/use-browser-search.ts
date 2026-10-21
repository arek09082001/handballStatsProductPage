'use client';

import { useSyncExternalStore } from 'react';

function subscribe(notify: () => void) {
  window.addEventListener('popstate', notify);
  return () => window.removeEventListener('popstate', notify);
}

/** URL-prefilled forms stay static on the server and agree during hydration. */
export function useBrowserSearch() {
  return useSyncExternalStore(subscribe, () => window.location.search, () => '');
}
