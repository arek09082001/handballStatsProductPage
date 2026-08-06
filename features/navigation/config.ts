import { CLUB_CONFIG } from '@/lib/club-config';
import { NavigationItem } from './interfaces';

export const SITE_NAVBAR_OFFSET = 96;

/**
 * Site navigation in display order. The four `primary` items form the desktop
 * row (plus the demo button); the rest are reachable from the mobile menu and
 * the footer. Real routes come before in-page anchors so the commercial pages
 * are not buried behind landing-page sections.
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

/** The desktop row: four links, then the demo button. */
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
