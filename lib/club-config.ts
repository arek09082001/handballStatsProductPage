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
  name: 'Statix',
  shortName: 'Statix', // For abbreviated displays
  fullName: 'Statix',
  foundingYear: 2026,

  // ============================================
  // PRODUCT PROFILE
  // ============================================
  business: {
    primaryService: 'Handball-Statistik-App',
    description:
      'Live-Statistiken, Spieleranalyse und Team-Management für Handball',
    audience: 'Trainer, Vereine und Handball-Teams',
  },

  // ============================================
  // CONTACT INFORMATION
  // ============================================
  email: {
    main: 'kontakt@handballwebseite.de',
    info: 'kontakt@handballwebseite.de',
    noreply: 'noreply@handballwebseite.de',
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
    domain: 'handballwebseite.de',
    url: 'https://www.handballwebseite.de',
    demoUrl: 'https://demo.handballwebseite.de',
    get urlWithoutProtocol() {
      return this.url.replace('https://', '');
    },
    get demoUrlWithoutProtocol() {
      return this.demoUrl.replace('https://', '');
    },
  },

  // ============================================
  // SOCIAL MEDIA
  // ============================================
  social: {
    instagram: {
      url: 'https://www.instagram.com/statixapp/',
      handle: '@statixapp',
      username: 'statixapp',
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
      name: 'Statix Team',
      position: 'Support & Anfragen',
      email: 'kontakt@handballwebseite.de',
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
      alt: 'Statix Logo',
      width: 768,
      height: 768,
    },
    logoName: {
      filename: 'statixLogo.png',
      get path() {
        return `/${this.filename}`;
      },
      alt: 'Statix Logo',
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
      'Handball-Statistiken live per Tap erfassen: Wurfquoten, Wurfbilder & Spielerwerte automatisch ausgewertet – offline in der Halle. Live-Demo ohne Account testen.',

    // Short description for social media
    shortDescription:
      'Handball-Statistiken live erfassen und automatisch auswerten – Live-Demo ohne Account testen.',

    focusRegions: ['Deutschland', 'Österreich', 'Schweiz'],

    // Keywords for SEO
    keywords: [
      'Handball Statistiken',
      'Handball Statistiken erfassen',
      'Handball Statistiken App',
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
      'Handball KI-Analyse',
      'Handball Statistik kostenlos',
      'Handball Live-Demo',
    ],

    // Page-specific titles and descriptions
    pages: {
      home: {
        title: 'Handball-Statistiken live erfassen & analysieren | Statix App',
        description:
          'Handball-Statistiken live per Tap erfassen: Wurfquoten, Wurfbilder & Spielerwerte automatisch ausgewertet – offline in der Halle. Live-Demo ohne Account testen.',
      },
      impressum: {
        title: 'Impressum',
        description: 'Impressum und rechtliche Informationen zur Statix App.',
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
    pageTitle: 'Statix',

    // For admin areas
    adminTitle: 'Statix Admin',

    // For emails and formal contexts
    emailSender: 'Statix',

    // For navigation
    navLabel: 'Statix Hauptnavigation',
    navAriaLabel: 'Statix',

    // For logos and headers
    logoAlt: 'Statix Logo',

    brandTagline: 'Statistik-App für Handball',

    footerDescription:
      'Statix verwandelt jedes Spiel in präzise Statistiken – Wurfquoten, Wurfbilder und KI-Analysen, mit denen Trainer und Teams besser werden.',

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
