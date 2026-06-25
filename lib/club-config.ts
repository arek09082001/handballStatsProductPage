/**
 * Site Configuration
 *
 * Central configuration file for all business and website information.
 * Edit these values to change brand, legal, and SEO-relevant data globally.
 */

export const CLUB_CONFIG = {
  // ============================================
  // BASIC BUSINESS INFORMATION
  // ============================================
  name: 'Arkadiusz Weiss Webentwicklung',
  shortName: 'Arkadiusz Weiss', // For abbreviated displays
  fullName: 'Arkadiusz Weiss Webentwicklung',
  foundingYear: 2026,

  // ============================================
  // BUSINESS PROFILE
  // ============================================
  business: {
    primaryService: 'Webdesign',
    description: 'Webdesign, Webentwicklung und lokale SEO',
    audience: 'Unternehmen, Handwerker und Dienstleister',
  },

  // ============================================
  // CONTACT INFORMATION
  // ============================================
  email: {
    main: 'kontakt@webdesign-weiss.de',
    info: 'kontakt@webdesign-weiss.de',
    noreply: 'noreply@webdesign-weiss.de',
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
    domain: 'webdesign-weiss.de',
    url: 'https://www.webdesign-weiss.de',
    get urlWithoutProtocol() {
      return this.url.replace('https://', '');
    },
  },

  // ============================================
  // SOCIAL MEDIA
  // ============================================
  social: {
    instagram: {
      url: 'https://www.instagram.com/webdesignweiss/',
      handle: '@webdesignweiss',
      username: 'webdesignweiss',
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
    position: 'Inhaber & Webdesigner',
    chairman: 'Arkadiusz Weiss',
    chairmanTitle: 'Inhaber',
    chairmanImage: '/arkadiusz_weiss.jpg',
  },

  // ============================================
  // CONTACT PERSONS
  // ============================================
  contacts: {
    primary: {
      name: 'Arkadiusz Weiss',
      position: 'Projektanfragen',
      email: 'kontakt@webdesign-weiss.de',
      phone: '+49-0179-2630093',
      image: '/arkadiusz_weiss.jpg',
    },
  },

  // ============================================
  // BRANDING / DESIGN
  // ============================================
  branding: {
    // Primary theme color (used in manifest, meta tags, etc.)
    themeColor: '#2563eb',
    backgroundColor: '#ffffff',

    // Logo configuration
    logo: {
      filename: 'logo.png',
      get path() {
        return `/${this.filename}`;
      },
      alt: 'Arkadiusz Weiss Webentwicklung Logo',
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
      'Arkadiusz Weiss Webentwicklung entwickelt moderne Webseiten, starke Markenauftritte und digitale Erlebnisse für Unternehmen, die klar auftreten und mehr Anfragen gewinnen wollen.',

    // Short description for social media
    shortDescription:
      'Moderne Websites und digitale Markenauftritte von Arkadiusz Weiss.',

    focusRegions: [
      'Dortmund',
      'Unna',
      'Recklinghausen',
      'Gladbeck',
      'Kamen',
      'Castrop-Rauxel',
      'Bochum',
      'Herne',
      'Gelsenkirchen',
      'Essen',
      'Ruhrgebiet',
      'Nordrhein-Westfalen',
    ],

    // Keywords for SEO
    keywords: [
      'Webdesign',
      'Arkadiusz Weiss Webentwicklung',
      'Arkadiusz Weiss',
      'Webagentur',
      'Portfolio Website',
      'Unternehmenswebsite',
      'Landingpage',
      'UI Design',
      'Branding',
      'Webentwicklung',
      'Responsive Design',
      'Conversion Optimierung',
      'Digitale Präsenz',
    ],

    // Page-specific titles and descriptions
    pages: {
      home: {
        title: 'Arkadiusz Weiss Webentwicklung',
        description:
          'Arkadiusz Weiss Webentwicklung erstellt moderne Webseiten, starke Markenauftritte und digitale Erlebnisse für Unternehmen.',
      },
      leistungen: {
        title: 'Leistungen',
        description:
          'Webdesign, Entwicklung, SEO und Wartung für Unternehmen, die online sichtbar werden und mehr Anfragen gewinnen wollen.',
      },
      unternehmen: {
        title: 'Unternehmen',
        description:
          'Erfahre mehr über Arkadiusz Weiss Webentwicklung, Arbeitsweise, Referenzen und den strategischen Fokus auf messbare Ergebnisse.',
      },
      impressum: {
        title: 'Impressum',
        description:
          'Impressum und rechtliche Informationen von Arkadiusz Weiss Webentwicklung.',
      },
    },

    // Structured data / Schema.org
    schema: {
      organizationType: 'ProfessionalService',
      serviceType: 'Webdesign',
    },
  },

  // ============================================
  // DISPLAY NAMES (for UI contexts)
  // ============================================
  display: {
    // For page titles
    pageTitle: 'Arkadiusz Weiss Webentwicklung',

    // For admin areas
    adminTitle: 'Arkadiusz Weiss Webentwicklung Admin',

    // For emails and formal contexts
    emailSender: 'Arkadiusz Weiss Webentwicklung',

    // For navigation
    navLabel: 'Arkadiusz Weiss Webentwicklung Hauptnavigation',
    navAriaLabel: 'Arkadiusz Weiss Webentwicklung',

    // For logos and headers
    logoAlt: 'Arkadiusz Weiss Webentwicklung Logo',

    brandTagline: 'Webdesign by Arkadiusz Weiss',

    footerDescription:
      'Wir entwickeln performante digitale Erlebnisse für Unternehmen, die online gewinnen wollen.',

    footerLocation: 'Remote, Deutschland',

    footerPhoneLabel: 'Projektgespräche auf Anfrage',

    contactCtaLabel: 'Lass uns sprechen',

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
