import type { Metadata } from 'next';
import { CLUB_CONFIG } from '@/lib/club-config';

export const SITE_URL = (
    process.env.NEXT_PUBLIC_BASE_URL || CLUB_CONFIG.website.url
).replace(/\/$/, '');

export const SITE_NAME = CLUB_CONFIG.fullName;
export const DEFAULT_OG_IMAGE = '/defaultOgImage.png';

export const SEO_KEYWORDS = Array.from(
    new Set([
        ...CLUB_CONFIG.seo.keywords,
        'webdesign für unternehmen',
        'webdesign für handwerker',
        'webdesign für dienstleister',
        'webdesign dortmund',
        'webdesign unna',
        'webdesign recklinghausen',
        'webdesign gladbeck',
        'webdesign ruhrgebiet',
        'webagentur dortmund',
        'webseite erstellen lassen dortmund',
        'seo dortmund',
        'seo für unternehmen im ruhrgebiet',
        'website erstellen lassen',
        'neue website erstellen lassen',
        'homepage für handwerksbetrieb',
        'webseite für lokale unternehmen',
        'lokale seo',
        'seo für handwerker',
        'website relaunch',
        'webdesigner deutschland',
        'webdesigner nrw',
        'webdesigner dortmund',
        'webdesigner unna',
        'webdesigner recklinghausen',
        'webdesigner gladbeck',
        'professionelle unternehmenswebsite',
        'website für kleinunternehmen',
        'mehr anfragen über google',
        'website für dienstleister',
        'webdesign kamen',
        'webdesigner castrop-rauxel',
        'webagentur ruhrgebiet',
    ]),
);

export const SITE_LINKS = [
    {
        name: 'Startseite',
        path: '/',
        description:
            'Strategisches Webdesign für Unternehmen, Handwerker und Dienstleister.',
    },
    {
        name: 'Leistungen',
        path: '/leistungen',
        description: 'Webdesign, Entwicklung, SEO und Wartung im Leistungsüberblick.',
    },
    {
        name: 'Unternehmen',
        path: '/unternehmen',
        description: 'Arbeitsweise, Positionierung und Profil von Arkadiusz Weiss.',
    },
    {
        name: 'Impressum',
        path: '/impressum',
        description: 'Anbieterkennzeichnung und rechtliche Informationen.',
    },
] as const;

export const SERVICE_AREAS = Array.from(
    new Set([...CLUB_CONFIG.seo.focusRegions, ...CLUB_CONFIG.serviceRegions.extended]),
);

export const SERVICE_OFFERS = [
    {
        slug: 'webdesign',
        name: 'Webdesign',
        description:
            'Individuelle Unternehmenswebsites mit klarer Nutzerführung, starkem Markenauftritt und Fokus auf Anfragen.',
    },
    {
        slug: 'entwicklung',
        name: 'Webentwicklung',
        description:
            'Performante technische Umsetzung mit sauberer Architektur, responsivem Frontend und stabilen Nutzerflüssen.',
    },
    {
        slug: 'seo',
        name: 'SEO und lokale SEO',
        description:
            'Onpage-SEO, technische SEO und lokale Sichtbarkeit für Suchanfragen mit echter Kaufabsicht.',
    },
    {
        slug: 'wartung',
        name: 'Wartung',
        description:
            'Laufende technische Betreuung, Updates, Monitoring und schnelle Anpassungen für professionelle Websites.',
    },
] as const;

export const HOMEPAGE_FAQS = [
    {
        question: 'Ist eine individuelle Website nicht zu teuer für kleine Unternehmen?',
        answer:
            'Eine professionelle Website ist kein Kostenpunkt ohne Rücklauf, sondern ein Vertriebskanal. Schon wenige zusätzliche qualifizierte Anfragen pro Monat können den Aufwand schnell amortisieren.',
    },
    {
        question: 'Nimmt ein Website-Projekt nicht zu viel Zeit im Tagesgeschäft ein?',
        answer:
            'Der Prozess ist so aufgebaut, dass nach einem klaren Kickoff möglichst wenig Abstimmungsaufwand auf Kundenseite entsteht. Strategie, Struktur, Design und Umsetzung werden effizient vorbereitet und umgesetzt.',
    },
    {
        question: 'Wie können Inhalte später gepflegt werden, wenn ich nicht technisch bin?',
        answer:
            'Die Website wird auf einer verständlichen technischen Basis aufgebaut. Für spätere Anpassungen sind klare Prozesse vorgesehen, auf Wunsch inklusive laufender Wartung und Betreuung.',
    },
] as const;

export function absoluteUrl(path = '/') {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    if (normalizedPath === '/') {
        return SITE_URL;
    }

    return `${SITE_URL}${normalizedPath}`;
}

type CreatePageMetadataArgs = {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
    imagePath?: string;
    noIndex?: boolean;
};

export function createPageMetadata({
    title,
    description,
    path = '/',
    keywords = [],
    imagePath = DEFAULT_OG_IMAGE,
    noIndex = false,
}: CreatePageMetadataArgs): Metadata {
    const canonical = absoluteUrl(path);
    const imageUrl = absoluteUrl(imagePath);
    const combinedKeywords = Array.from(new Set([...SEO_KEYWORDS, ...keywords]));

    return {
        title,
        description,
        keywords: combinedKeywords,
        alternates: {
            canonical,
        },
        openGraph: {
            type: 'website',
            locale: 'de_DE',
            url: canonical,
            title,
            description,
            siteName: SITE_NAME,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: `${title} | ${SITE_NAME}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        robots: noIndex
            ? {
                index: false,
                follow: false,
                googleBot: {
                    index: false,
                    follow: false,
                },
            }
            : undefined,
    };
}