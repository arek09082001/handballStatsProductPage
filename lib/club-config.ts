/**
 * Site Configuration
 *
 * Central configuration file for all product, brand and legal information.
 * Edit these values to change brand, legal, and SEO-relevant data globally.
 */

export const CLUB_CONFIG = {
  // ============================================
  // BASIC PRODUCT INFORMATION
  // ============================================
  name: 'HandballStats',
  shortName: 'HandballStats', // For abbreviated displays
  fullName: 'HandballStats',
  foundingYear: 2026,

  // ============================================
  // PRODUCT PROFILE
  // ============================================
  business: {
    primaryService: 'Handball-Statistik-App',
    description: 'Live-Statistiken, Spieleranalyse und Team-Management für Handball',
    audience: 'Trainer, Vereine und Handball-Teams',
  },

  // ============================================
  // CONTACT INFORMATION
  // ============================================
  email: {
    main: 'kontakt@handballstats.app',
    info: 'kontakt@handballstats.app',
    noreply: 'noreply@handballstats.app',
  },

  phone: {
    main: '+49-0179-2630093',
  },

  // ============================================
  // LEGAL ADDRESS INFORMATION
  // ============================================
  address: {
    contactName: 'Arkadiusz Weiss',
    careOf: 'c/o MDC#arkadiusz_weiss',
    street: 'Welserstraße 3',
    postalCode: '87463',
    city: 'Dietmannsried',
    district: '', // Stadtteil
    country: 'Deutschland',
    region: 'Bayern',
    countryCode: 'DE',

    // Formatted address strings
    get full() {
      return `${CLUB_CONFIG.fullName}\n${this.contactName}\n${this.careOf}\n${this.street}\n${this.postalCode} ${this.city}\n${this.country}`;
    },
    get oneLine() {
      return `${this.street}, ${this.postalCode} ${this.city}`;
    },
    get cityWithPostal() {
      return `${this.postalCode} ${this.city}`;
    },
    get legalStreet() {
      return `${this.careOf}, ${this.street}`;
    },
  },

  // ============================================
  // PUBLIC SERVICE REGIONS
  // ============================================
  serviceRegions: {
    primary: ['Dortmund', 'Unna', 'Recklinghausen', 'Gladbeck', 'Kamen'],
    extended: [
      'Castrop-Rauxel',
      'Bochum',
      'Herne',
      'Gelsenkirchen',
      'Essen',
      'Ruhrgebiet',
      'Nordrhein-Westfalen',
      'Deutschland',
    ],
  },

  // ============================================
  // WEBSITE AND DOMAIN
  // ============================================
  website: {
    domain: 'handballstats.app',
    url: 'https://www.handballstats.app',
    get urlWithoutProtocol() {
      return this.url.replace('https://', '');
    },
  },

  // ============================================
  // SOCIAL MEDIA
  // ============================================
  social: {
    instagram: {
      url: 'https://www.instagram.com/handballstats.app/',
      handle: '@handballstats.app',
      username: 'handballstats.app',
    },
    // Weitere Social Media können hier hinzugefügt werden
    // facebook: { url: '', handle: '' },
    // twitter: { url: '', handle: '' },
  },

  // ============================================
  // LEGAL INFORMATION / IMPRESSUM
  // ============================================
  legal: {
    responsiblePerson: 'Arkadiusz Weiss',
    position: 'Inhaber',
    chairman: 'Arkadiusz Weiss',
    chairmanTitle: 'Inhaber',
    chairmanImage: '/arkadiusz_weiss.jpg',
  },

  // ============================================
  // CONTACT PERSONS
  // ============================================
  contacts: {
    primary: {
      name: 'HandballStats Team',
      position: 'Support & Anfragen',
      email: 'kontakt@handballstats.app',
      phone: '+49-0179-2630093',
      image: '/arkadiusz_weiss.jpg',
    },
  },

  // ============================================
  // BRANDING / DESIGN
  // ============================================
  branding: {
    // Primary theme color (used in manifest, meta tags, etc.)
    themeColor: '#ea6a1d',
    backgroundColor: '#ffffff',

    // Logo configuration
    logo: {
      filename: 'logo.png',
      get path() {
        return `/${this.filename}`;
      },
      alt: 'HandballStats Logo',
      width: 768,
      height: 768,
    },

    // Favicon paths (relative to /public)
    favicons: {
      ico: '/favicon.ico',
      png: '/favicon.png',
      appleTouchIcon: '/favicon.png',
      shortcut: '/favicon.ico',
    },
  },

  // ============================================
  // SEO CONFIGURATION
  // ============================================
  seo: {
    // Default meta description
    description:
      'HandballStats ist die Statistik-App für Handball-Teams: Erfasse Spielzüge live, analysiere Spieler- und Mannschaftsleistung und triff bessere Entscheidungen – direkt von der Bank.',

    // Short description for social media
    shortDescription:
      'Live-Statistiken und Analyse für dein Handball-Team – einfach, schnell, präzise.',

    focusRegions: [
      'Deutschland',
      'Österreich',
      'Schweiz',
    ],

    // Keywords for SEO
    keywords: [
      'Handball Statistik App',
      'Handball Stats',
      'Handball App',
      'Handball Analyse',
      'Spielerstatistik Handball',
      'Live Scouting Handball',
      'Handball Trainer App',
      'Handball Team Management',
      'Wurfbilder Handball',
      'Handball Spielanalyse',
      'Handball Verein App',
      'Statistik für Trainer',
    ],

    // Page-specific titles and descriptions
    pages: {
      home: {
        title: 'HandballStats – Die Statistik-App für dein Handball-Team',
        description:
          'Erfasse Spielzüge live, analysiere Spieler- und Mannschaftsleistung und gewinne mehr Spiele mit datenbasierten Entscheidungen.',
      },
      impressum: {
        title: 'Impressum',
        description:
          'Impressum und rechtliche Informationen zur HandballStats App.',
      },
    },

    // Structured data / Schema.org
    schema: {
      organizationType: 'Organization',
      serviceType: 'SportsApplication',
    },
  },

  // ============================================
  // DISPLAY NAMES (for UI contexts)
  // ============================================
  display: {
    // For page titles
    pageTitle: 'HandballStats',

    // For admin areas
    adminTitle: 'HandballStats Admin',

    // For emails and formal contexts
    emailSender: 'HandballStats',

    // For navigation
    navLabel: 'HandballStats Hauptnavigation',
    navAriaLabel: 'HandballStats',

    // For logos and headers
    logoAlt: 'HandballStats Logo',

    brandTagline: 'Statistik-App für Handball',

    footerDescription:
      'HandballStats hilft Trainern und Teams, jedes Spiel in präzise Statistiken zu verwandeln und besser zu werden.',

    footerLocation: 'Made in Germany',

    footerPhoneLabel: 'Support auf Anfrage',

    contactCtaLabel: 'Jetzt starten',

    // Copyright text
    get copyright() {
      return `© ${new Date().getFullYear()} ${CLUB_CONFIG.fullName}`;
    },
  },

  // ============================================
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getClubName = () => CLUB_CONFIG.name;
export const getClubFullName = () => CLUB_CONFIG.fullName;
export const getClubEmail = (type: keyof typeof CLUB_CONFIG.email = 'main') =>
  CLUB_CONFIG.email[type];
export const getClubAddress = (
  format: 'full' | 'oneLine' | 'cityWithPostal' = 'full',
) => CLUB_CONFIG.address[format];
export const getClubWebsite = () => CLUB_CONFIG.website.url;
export const getLogoPath = () => CLUB_CONFIG.branding.logo.path;
export const getThemeColor = () => CLUB_CONFIG.branding.themeColor;

// SEO Helpers
export const getPageTitle = (page?: string) => {
  if (!page) return CLUB_CONFIG.seo.pages.home.title;
  return `${page} | ${CLUB_CONFIG.name}`;
};

export const getFullPageTitle = (subtitle?: string) => {
  if (!subtitle) return CLUB_CONFIG.display.pageTitle;
  return `${subtitle} | ${CLUB_CONFIG.display.pageTitle}`;
};

export const getCanonicalUrl = (path: string = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${CLUB_CONFIG.website.url}${cleanPath}`;
};

export const getLogoUrl = () => {
  return `${CLUB_CONFIG.website.url}${CLUB_CONFIG.branding.logo.path}`;
};

// ============================================
// TYPE EXPORTS
// ============================================
export type ClubConfig = typeof CLUB_CONFIG;
export type EmailType = keyof typeof CLUB_CONFIG.email;
export type PhoneType = keyof typeof CLUB_CONFIG.phone;
export type ContactPerson = keyof typeof CLUB_CONFIG.contacts;
export type SeoPage = keyof typeof CLUB_CONFIG.seo.pages;
