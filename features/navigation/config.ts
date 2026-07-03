import { CLUB_CONFIG } from '@/lib/club-config';
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
  {
    ident: 6,
    href: CLUB_CONFIG.website.demoUrl,
    labelKey: 'demo',
    external: true,
  },
];

/** In-page section ids tracked by the navbar scroll-spy, in document order. */
export const scrollSpySectionIds = siteNavigationItems
  .map((item) => item.sectionId)
  .filter((id): id is string => Boolean(id));
