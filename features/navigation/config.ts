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
    href: '/leistungen',
    labelKey: 'services',
  },
  {
    ident: 2,
    href: '/unternehmen',
    labelKey: 'company',
  },
  {
    ident: 3,
    href: '/impressum',
    labelKey: 'contact',
  },
];
