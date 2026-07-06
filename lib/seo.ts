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
        // Core recording intent (primary German search terms)
        'handball statistik erfassen',
        'handball statistik aufnehmen',
        'handball statistik aufzeichnen',
        'handball spielstatistik erfassen',
        'handball statistik führen',
        'handball stats erfassen',
        'handball live statistik erfassen',
        'spielstatistik handball app',
        // Product / category terms
        'handball statistik app',
        'handball stats app',
        'handball scouting app',
        'handball live statistik',
        'handball spielanalyse app',
        'handball trainer software',
        'spielerstatistik handball',
        'wurfquote handball',
        'handball team app',
        'handball verein statistik',
        'handball videoanalyse',
        'handball dashboard',
        'handball app deutsch',
        'beste handball app',
    ]),
);

export const SITE_LINKS = [
    {
        name: 'Startseite',
        path: '/',
        description:
            'Statix – die Statistik-App für Trainer, Vereine und Handball-Teams.',
    },
    {
        name: 'Impressum',
        path: '/impressum',
        description: 'Anbieterkennzeichnung und rechtliche Informationen.',
    },
] as const;

export const SERVICE_AREAS = Array.from(new Set([...CLUB_CONFIG.seo.focusRegions]));

export const APP_FEATURES = [
    {
        slug: 'live-tracking',
        name: 'Live-Erfassung',
        description:
            'Erfasse Tore, Würfe, Paraden, Strafen und Wechsel in Echtzeit – mit nur einem Tap, direkt von der Bank.',
    },
    {
        slug: 'player-stats',
        name: 'Spielerstatistiken',
        description:
            'Wurfquoten, Effizienz, Spielanteile und Entwicklungsverläufe für jeden Spieler auf einen Blick.',
    },
    {
        slug: 'shot-maps',
        name: 'Wurfbilder & Analyse',
        description:
            'Visualisiere Würfe und Tore auf dem Spielfeld und erkenne Muster, die Spiele entscheiden.',
    },
    {
        slug: 'team-management',
        name: 'Team-Management',
        description:
            'Verwalte Kader, Spiele und Saisons an einem Ort und teile Auswertungen mit dem ganzen Team.',
    },
] as const;

/**
 * Fallback FAQ used for structured data when translations are unavailable.
 * The live FAQ schema in `components/seo/structured-data.tsx` is generated
 * from the same translations as the visible FAQ section, so the rich-result
 * markup always matches the on-page content (a Google requirement). Keep this
 * text in sync with `productPage.faq.items` in `messages/de.json`.
 */
export const HOMEPAGE_FAQS = [
    {
        question: 'Brauche ich technisches Vorwissen?',
        answer:
            'Nein. Statix ist so gestaltet, dass du nach wenigen Minuten dein erstes Spiel live erfassen kannst. Jede Aktion ist nur einen Tap entfernt – ganz ohne Schulung.',
    },
    {
        question: 'Funktioniert die App offline in der Halle?',
        answer:
            'Ja. Du kannst Spiele komplett offline erfassen. Sobald wieder Internet verfügbar ist, werden deine Daten automatisch synchronisiert.',
    },
    {
        question: 'Kann ich Statistiken mit meinem Team teilen?',
        answer:
            'Selbstverständlich. Spieler und Co-Trainer erhalten Zugriff auf Auswertungen, Wurfbilder und Entwicklungsverläufe – als Link oder PDF-Export.',
    },
    {
        question: 'Was kostet Statix?',
        answer:
            'Du startest kostenlos und erfasst dein erstes Spiel ohne Verpflichtung. Für ganze Teams und Vereine gibt es faire Abos – trag dich in den Newsletter ein und sichere dir das Launch-Angebot.',
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
    /**
     * When true, the title is used as-is and the parent layout's title
     * template (`%s | Statix`) is NOT appended. Use this for the
     * home page, whose title already contains the brand – otherwise the
     * brand would be duplicated ("… | Statix | Statix").
     */
    absoluteTitle?: boolean;
};

export function createPageMetadata({
    title,
    description,
    path = '/',
    keywords = [],
    imagePath = DEFAULT_OG_IMAGE,
    noIndex = false,
    absoluteTitle = false,
}: CreatePageMetadataArgs): Metadata {
    const canonical = absoluteUrl(path);
    const imageUrl = absoluteUrl(imagePath);
    const combinedKeywords = Array.from(new Set([...SEO_KEYWORDS, ...keywords]));

    return {
        title: absoluteTitle ? { absolute: title } : title,
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