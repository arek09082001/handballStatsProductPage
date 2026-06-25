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
    ident: 3,
    href: '/#faq',
    labelKey: 'faq',
  },
  {
    ident: 4,
    href: '/impressum',
    labelKey: 'impressum',
  },
];
