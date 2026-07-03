import { CLUB_CONFIG } from '@/lib/club-config';
import { NavigationItem } from './interfaces';

export const SITE_NAVBAR_OFFSET = 96;

export const siteNavigationItems: NavigationItem[] = [
  {
    ident: 0,
    href: '/',
    labelKey: 'home',
  },
  {
    ident: 1,
    href: '/#features',
    labelKey: 'features',
  },
  {
    ident: 2,
    href: '/#how-it-works',
    labelKey: 'howItWorks',
  },
  {
    ident: 6,
    href: CLUB_CONFIG.website.demoUrl,
    labelKey: 'demo',
    external: true,
  },
  {
    ident: 3,
    href: '/#faq',
    labelKey: 'faq',
  },
  {
    ident: 4,
    href: '/#contact',
    labelKey: 'contact',
  },
  {
    ident: 5,
    href: '/impressum',
    labelKey: 'impressum',
  },
];
