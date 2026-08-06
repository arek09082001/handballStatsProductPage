import { CLUB_CONFIG } from '@/lib/club-config';
import {
  TAKTIKBOARD_NAV_LABEL,
  TAKTIKBOARD_PAGE_PATH,
} from '@/features/handball-taktikboard/data/taktikboard-content';
import { NavigationItem } from './interfaces';

export const SITE_NAVBAR_OFFSET = 96;

/** Id of the page's `<main>` landmark. The skip link jumps here. */
export const MAIN_CONTENT_ID = 'main-content';

/**
 * Site navigation in display order. The `primary` items form the desktop row
 * (plus the demo button); the rest are reachable from the mobile menu and the
 * footer. Real routes come before in-page anchors so the commercial pages are
 * not buried behind landing-page sections.
 *
 * The "Für Trainer" dropdown exists so the pages where a visit turns into a
 * registration — the two audience pages and the two free tools — are reachable
 * from the header instead of only from the footer.
 */
export const siteNavigationItems: NavigationItem[] = [
  {
    ident: 1,
    href: '/#features',
    labelKey: 'features',
    sectionId: 'features',
    primary: true,
  },
  {
    ident: 10,
    href: '/preise',
    labelKey: 'pricing',
    primary: true,
  },
  {
    ident: 13,
    labelKey: 'forCoaches',
    primary: true,
    groups: [
      {
        labelKey: 'audience',
        items: [
          { ident: 14, href: '/fuer-vereine', labelKey: 'forClubs' },
          {
            ident: 15,
            href: '/fuer-jugendtrainer',
            labelKey: 'forYouthCoaches',
          },
        ],
      },
      {
        labelKey: 'tools',
        items: [
          { ident: 16, href: '/wurfquote-rechner', labelKey: 'shotQuotaCalculator' },
          // Not a translation key on purpose: the tool's own copy lives in its
          // data module so `messages/*.json` does not grow for a name that
          // reads the same in German and English.
          {
            ident: 17,
            href: TAKTIKBOARD_PAGE_PATH,
            label: TAKTIKBOARD_NAV_LABEL,
          },
        ],
      },
    ],
  },
  {
    ident: 11,
    href: '/ratgeber',
    labelKey: 'ratgeber',
    primary: true,
  },
  {
    ident: 3,
    href: '/#faq',
    labelKey: 'faq',
    sectionId: 'faq',
    primary: true,
  },
  {
    ident: 0,
    href: '/',
    labelKey: 'home',
    sectionId: 'home',
  },
  {
    ident: 12,
    href: '/was-ist-statix',
    labelKey: 'aboutStatix',
  },
  {
    ident: 7,
    href: '/#ai',
    labelKey: 'ai',
    sectionId: 'ai',
  },
  {
    ident: 8,
    href: '/#tournament',
    labelKey: 'tournament',
    sectionId: 'tournament',
  },
  {
    ident: 9,
    href: '/#liveticker',
    labelKey: 'liveTicker',
    sectionId: 'liveticker',
  },
  {
    ident: 4,
    href: CLUB_CONFIG.website.demoUrl,
    labelKey: 'demo',
    external: true,
  },
];

/** The desktop row: five entries, then the demo button. */
export const primaryNavigationItems = siteNavigationItems.filter(
  (item) => item.primary,
);

/**
 * In-page section ids tracked by the navbar scroll-spy, in **document order**.
 * Kept separate from `siteNavigationItems` because that list is ordered for
 * display — the scroll-spy picks the last section above the probe line, so it
 * only works when this array follows the landing page's real section order.
 */
export const scrollSpySectionIds = [
  'home',
  'features',
  'ai',
  'tournament',
  'liveticker',
  'faq',
  'contact',
];
