'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';
import { trackPreferredSourceClick } from '@/lib/analytics';

/**
 * "Als bevorzugte Quelle bei Google hinzufügen".
 *
 * Google's preferred-sources feature lets a reader tell Search to show a site
 * more often in Top Stories, Discover and News. Google offers publishers two
 * ways to place it, and this is deliberately neither one nor the other:
 *
 *  - Their drop-in widget (`publisher.js` + `[google-add-preferred-source-btn]`)
 *    renders Google's OWN button. It cannot be restyled beyond a light/dark
 *    flag, so in this footer it would read as a pasted-in foreign object — and
 *    it costs a third-party script on every page of the site.
 *  - Their plain deeplink is fully styleable and free, but sends the reader to
 *    a Google page they then have to navigate back from.
 *
 * So: OUR button, with the deeplink as its real `href` — server-rendered, no
 * JavaScript required, works with the script blocked — enhanced at click time
 * into Google's seamless flow, which adds the source and returns the reader to
 * this page.
 *
 * The module is fetched on the first hover or focus, not on mount. This button
 * sits in the footer of every page and almost nobody will touch it; paying a
 * third-party request on every page load to save one back-press is the wrong
 * trade. Pointing at it is enough lead time in practice, and when the module is
 * not ready by the time the click lands, the anchor's own href does the job.
 *
 * Docs: https://developers.google.com/search/docs/appearance/preferred-sources
 */

/** Google's ES module. Loaded through an injected `<script type="module">`. */
const GOOGLE_MODULE = 'https://news.google.com/swg/js/v1/publisher.mjs';

/** Fires once the injected module has initialised and parked its API. */
const READY_EVENT = 'statix:preferred-source-ready';

/** Where the injected module parks the API for us. */
const API_KEY = '__statixPreferredSource';

/**
 * The deeplink, and the button's real `href`.
 *
 * `q` takes the bare DOMAIN, not the canonical host: Google's own example is
 * `q=example.com` and the docs say to pass "your publication's domain name".
 * `www.` would be a subdomain-level source — narrower, and a second spelling of
 * the site next to the one Google already resolves, since `statix-app.de`
 * redirects to `www.statix-app.de` anyway.
 */
const DEEPLINK = `https://www.google.com/preferences/source?q=${encodeURIComponent(
  CLUB_CONFIG.website.domain,
)}`;

interface PreferredSourceApi {
  addPreferredSource: () => void;
}

declare global {
  interface Window {
    [API_KEY]?: PreferredSourceApi;
  }
}

export default function PreferredSourceButton() {
  const t = useTranslations('footerSection.preferredSource');
  const locale = useLocale();
  const requested = useRef(false);
  const api = useRef<PreferredSourceApi | null>(null);

  useEffect(() => {
    const capture = () => {
      api.current = window[API_KEY] ?? null;
    };
    window.addEventListener(READY_EVENT, capture);
    // A second instance on the page (or a client-side navigation back to a
    // page that already loaded it) finds the API parked and ready.
    capture();
    return () => window.removeEventListener(READY_EVENT, capture);
  }, []);

  /**
   * Injects the module on first intent. Written as a module script rather than
   * a dynamic `import()` on purpose: a bare remote specifier in `import()` is
   * something the bundler tries to resolve at build time, and the ignore
   * comments for that differ between webpack and turbopack — both of which this
   * project builds with. A script tag is bundler-agnostic and fails silently
   * into the deeplink when the request is blocked.
   */
  const warm = useCallback(() => {
    if (requested.current || typeof document === 'undefined') return;
    requested.current = true;
    if (window[API_KEY]) {
      api.current = window[API_KEY];
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = [
      `import { preferredSource } from ${JSON.stringify(GOOGLE_MODULE)};`,
      `preferredSource.init(${JSON.stringify({ theme: 'dark', lang: locale })});`,
      `window[${JSON.stringify(API_KEY)}] = preferredSource;`,
      `window.dispatchEvent(new Event(${JSON.stringify(READY_EVENT)}));`,
    ].join('\n');
    document.head.appendChild(script);
  }, [locale]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    trackPreferredSourceClick();

    // Let the browser do what it was going to do for a modified click — a
    // middle click or ⌘-click is a request for a new tab, not for a dialog.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }

    const ready = api.current;
    if (!ready) return; // No module: the href is the fallback, and it works.

    try {
      event.preventDefault();
      ready.addPreferredSource();
    } catch {
      // Whatever went wrong inside Google's flow, the deeplink still leads
      // somewhere useful — so take it rather than swallowing the click.
      window.location.href = DEEPLINK;
    }
  };

  return (
    <a
      href={DEEPLINK}
      target='_blank'
      rel='noopener noreferrer'
      title={t('title')}
      onPointerEnter={warm}
      onFocus={warm}
      onClick={handleClick}
      className='group inline-flex h-11 shrink-0 items-center justify-center gap-2.5 rounded-full border border-white/25 bg-white/5 px-5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-court active:translate-y-0 active:scale-95'>
      <Star
        aria-hidden='true'
        className='size-4 shrink-0 text-[#f97316] transition-transform duration-200 group-hover:scale-110'
      />
      {t('cta')}
    </a>
  );
}
