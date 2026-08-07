import { CLUB_CONFIG } from '@/lib/club-config';
import {
  TAKTIKBOARD_NAV_LABEL,
  TAKTIKBOARD_PAGE_PATH,
} from '@/features/handball-taktikboard/data/taktikboard-content';
import { NavigationGroup, NavigationItem } from './interfaces';

export const SITE_NAVBAR_OFFSET = 96;

/** Id of the page's `<main>` landmark. The skip link jumps here. */
export const MAIN_CONTENT_ID = 'main-content';

/**
 * Everything the site links to, grouped by what a visitor is looking for.
 * This is the single source of truth behind the footer columns and the mobile
 * menu sections — both used to keep their own hand-maintained list, which is
 * how the footer ended up with seventeen links stacked in one column.
 *
 * Group headings come from `navigationSection.groups`, labels from
 * `navigationSection.items`, unless an entry carries a literal `label`.
 * Real routes come before in-page anchors inside a group so the commercial
 * pages are not buried behind landing-page sections.
 */
const productGroup: NavigationGroup = {
  labelKey: 'product',
  items: [
    { ident: 1, href: '/#features', labelKey: 'features', sectionId: 'features' },
    { ident: 10, href: '/preise', labelKey: 'pricing' },
    {
      ident: 18,
      href: '/handball-statistik-app-kostenlos',
      labelKey: 'freeApp',
    },
    { ident: 7, href: '/#ai', labelKey: 'ai', sectionId: 'ai' },
    // Tournament, live ticker and collaboration used to be three landing-page
    // bands with an entry each. They are one band now (`#mehr`), so they get
    // one entry — the tournament and ticker anchors still resolve inside it.
    { ident: 8, href: '/#mehr', labelKey: 'tournament', sectionId: 'mehr' },
    {
      ident: 4,
      href: CLUB_CONFIG.website.demoUrl,
      labelKey: 'demo',
      external: true,
    },
  ],
};

const audienceGroup: NavigationGroup = {
  labelKey: 'audience',
  items: [
    { ident: 14, href: '/fuer-vereine', labelKey: 'forClubs' },
    { ident: 15, href: '/fuer-jugendtrainer', labelKey: 'forYouthCoaches' },
  ],
};

const toolsGroup: NavigationGroup = {
  labelKey: 'tools',
  items: [
    { ident: 16, href: '/wurfquote-rechner', labelKey: 'shotQuotaCalculator' },
    // Not a translation key on purpose: the tool's own copy lives in its data
    // module so `messages/*.json` — already 155 KB on every page — does not
    // grow for a name that reads the same in German and English.
    { ident: 17, href: TAKTIKBOARD_PAGE_PATH, label: TAKTIKBOARD_NAV_LABEL },
    {
      ident: 19,
      href: '/handball-statistik-excel-vorlage',
      labelKey: 'excelTemplate',
    },
  ],
};

const resourcesGroup: NavigationGroup = {
  labelKey: 'resources',
  items: [
    { ident: 11, href: '/ratgeber', labelKey: 'ratgeber' },
    { ident: 12, href: '/was-ist-statix', labelKey: 'aboutStatix' },
    { ident: 20, href: '/erfahrungen', labelKey: 'experiences' },
    { ident: 22, href: '/kontakt', labelKey: 'contact' },
    { ident: 3, href: '/#faq', labelKey: 'faq', sectionId: 'faq' },
    { ident: 21, href: '/#newsletter', labelKey: 'newsletter' },
  ],
};

export const siteLinkGroups: NavigationGroup[] = [
  productGroup,
  audienceGroup,
  toolsGroup,
  resourcesGroup,
];

/**
 * The desktop header row: five entries, then the language switcher and the
 * register button. It is deliberately kept short — everything else is one tap
 * away in the mobile menu and one scroll away in the footer.
 *
 * The "Für Trainer" dropdown exists so the pages where a visit turns into a
 * registration — the two audience pages and the free tools — are reachable
 * from the header instead of only from the footer. It reuses the taxonomy
 * groups above so header, mobile menu and footer never drift apart.
 */
export const primaryNavigationItems: NavigationItem[] = [
  {
    ident: 1,
    href: '/#features',
    labelKey: 'features',
    sectionId: 'features',
  },
  {
    ident: 10,
    href: '/preise',
    labelKey: 'pricing',
  },
  {
    ident: 13,
    labelKey: 'forCoaches',
    groups: [audienceGroup, toolsGroup],
  },
  {
    ident: 11,
    href: '/ratgeber',
    labelKey: 'ratgeber',
  },
  {
    ident: 3,
    href: '/#faq',
    labelKey: 'faq',
    sectionId: 'faq',
  },
];

/**
 * In-page section ids tracked by the navbar scroll-spy, in **document order**.
 * Kept separate from the link taxonomy because that list is ordered for
 * display — the scroll-spy picks the last section above the probe line, so it
 * only works when this array follows the landing page's real section order.
 */
export const scrollSpySectionIds = [
  'home',
  'features',
  'ai',
  'mehr',
  'faq',
];
