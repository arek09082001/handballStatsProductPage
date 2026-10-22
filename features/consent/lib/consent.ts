/**
 * The visitor's answer to the analytics banner, kept in localStorage.
 *
 * Remembering a choice the visitor made is strictly necessary storage
 * (§ 25 Abs. 2 Nr. 2 TDDDG), so it needs no consent of its own — unlike
 * PostHog, which only ever loads after `granted`.
 */
export type AnalyticsConsent = 'granted' | 'denied';

const STORAGE_KEY = 'statix-analytics-consent';

/** Fired by the footer link so the banner can come back after a choice. */
export const OPEN_CONSENT_EVENT = 'statix:open-consent';

const CHANGE_EVENT = 'statix:consent-change';

/** Fallback for blocked storage, so the banner does not reappear at once. */
let pageChoice: AnalyticsConsent | null = null;

/** For `useSyncExternalStore`: other tabs (`storage`) and this one. */
export function subscribeConsent(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function readConsent(): AnalyticsConsent | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : pageChoice;
  } catch {
    // Blocked storage: ask again on the next load, never assume a yes.
    return pageChoice;
  }
}

export function writeConsent(value: AnalyticsConsent) {
  pageChoice = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage blocked: the choice applies to this page view only.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
