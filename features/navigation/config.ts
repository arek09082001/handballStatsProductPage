import { NavigationItem } from './interfaces';

export const SITE_NAVBAR_OFFSET = 96;

export const siteNavigationItems: NavigationItem[] = [
  {
    ident: 0,
    href: '/',
    labelKey: 'home',
    sectionId: 'home',
  },
  {
    ident: 1,
    href: '/#features',
    labelKey: 'features',
    sectionId: 'features',
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
    ident: 3,
    href: '/#faq',
    labelKey: 'faq',
    sectionId: 'faq',
  },
  {
    ident: 4,
    href: '/#contact',
    labelKey: 'contact',
    sectionId: 'contact',
  },
];

/** In-page section ids tracked by the navbar scroll-spy, in document order. */
export const scrollSpySectionIds = siteNavigationItems
  .map((item) => item.sectionId)
  .filter((id): id is string => Boolean(id));
