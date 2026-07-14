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
        // Brand terms
        'statix',
        'statix handball',
        'statix app',
        'statix handball statistik',
        // Conversational / chatbot-style intent queries
        'welche app zum handball statistiken erfassen',
        'beste handball statistik app für trainer',
        'kostenlose handball statistik app',
        'handball statistik app für vereine',
        'handball statistik app tablet',
        'handball statistik app ipad',
        'app für handball spielanalyse',
        'handball statistik software für trainer',
        'handball statistik app offline',
        'handball wurfquote berechnen app',
        'handball spielanalyse',
        'handball statistik erfassen kostenlos',
        'handball statistik app kostenlos testen',
        'handball statistik demo',
        'handball wurfbilder erstellen',
        'handball analyse tool',
        'handball statistik excel alternative',
        'handball ki analyse',
        'handball statistik software kostenlos',
    ]),
);

export const SITE_LINKS = [
    {
        name: 'Startseite',
        path: '/',
        description:
            'Statix – die Statistik-App für Trainer, Vereine und Handball-Teams. Mit Live-Demo ohne Account.',
    },
    {
        name: 'Impressum',
        path: '/impressum',
        description: 'Anbieterkennzeichnung und rechtliche Informationen.',
    },
    {
        name: 'AGB',
        path: '/agb',
        description:
            'Allgemeine Geschäftsbedingungen für die Nutzung der Statix App.',
    },
    {
        name: 'Ratgeber',
        path: '/ratgeber',
        description:
            'Handball-Ratgeber für Trainer: Wurfquote berechnen, Training planen, Abwehrsysteme, Spielanalyse und mehr – praxisnah erklärt.',
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
 * Devices Statix runs on. Surfaced in SoftwareApplication schema so answer
 * engines can respond to "läuft die App auf dem iPad / Tablet?" style queries.
 */
export const SUPPORTED_DEVICES = [
    'Smartphone',
    'Tablet',
    'iPad',
    'Laptop',
    'Desktop',
] as const;

/**
 * Machine-readable screenshots for SoftwareApplication schema. Answer engines
 * and app-style rich results use these to illustrate the product.
 */
export const APP_SCREENSHOTS = [
    '/heroImage.png',
    '/recordStatsInGame.png',
    '/statsTableInGame.png',
    '/shotMaps.png',
    '/gameListOverview.png',
] as const;

/**
 * Fallback "how it works" steps for the HowTo structured data. Kept in sync
 * with `productPage.how.steps` in the message catalogues; the live schema
 * prefers the translated strings when available.
 */
export const HOWTO_STEPS = [
    {
        name: 'Spiel anlegen',
        text: 'Wähle dein Team, den Gegner und leg in Sekunden los – auch offline in der Halle.',
    },
    {
        name: 'Live erfassen',
        text: 'Tippe jede Aktion während des Spiels. Statix berechnet alle Statistiken automatisch.',
    },
    {
        name: 'Analysieren & besser coachen',
        text: 'Werte Wurfbilder und Spielertrends aus und triff datenbasierte Entscheidungen.',
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
        question: 'Was ist Statix?',
        answer:
            'Statix ist eine Handball-Statistik-App für Trainer, Vereine und Teams. Du erfasst ein Spiel live per Tap – Tore, Würfe, Paraden, Strafen und Wechsel – und Statix berechnet daraus automatisch Wurfquoten, Spieler- und Mannschaftsstatistiken, Wurfbilder und Entwicklungsverläufe. Alles lässt sich sofort mit dem Team teilen.',
    },
    {
        question: 'Kann ich Statix ohne Anmeldung testen?',
        answer:
            'Ja. Die Live-Demo ist eine voll ausgestattete Version von Statix mit echten Spieldaten: Live-Statistiken, Wurfbilder und KI-Analyse direkt im Browser – ganz ohne Account. Du siehst in zwei Minuten, wie Statix in der Halle funktioniert.',
    },
    {
        question: 'Welche App eignet sich, um Handball-Statistiken live zu erfassen?',
        answer:
            'Statix ist eine Handball-Statistik-App, die speziell für das Live-Erfassen am Spielfeldrand gebaut ist. Jede Aktion ist einen Tap entfernt, die Auswertung passiert automatisch, und die App funktioniert offline in der Halle. Sie richtet sich an Trainer, Co-Trainer, Vereine und Teams im Amateur-, Jugend- und Leistungsbereich.',
    },
    {
        question: 'Für wen ist Statix geeignet?',
        answer:
            'Statix richtet sich an Handball-Trainer, Co-Trainer, Vereine und Mannschaften aller Spielklassen – vom Jugend- und Amateurhandball bis zum Leistungssport. Technisches Vorwissen ist nicht nötig; du bist in wenigen Minuten startklar.',
    },
    {
        question: 'Auf welchen Geräten läuft Statix?',
        answer:
            'Statix läuft direkt im Browser auf Smartphone, Tablet (iPad und Android) und Laptop – am Spielfeldrand genauso wie zur Nachbereitung zu Hause. Eine Installation aus dem App Store ist nicht erforderlich.',
    },
    {
        question: 'Welche Statistiken kann ich mit Statix erfassen?',
        answer:
            'Du erfasst Tore, Würfe und Wurfquoten, Paraden, Tempogegenstöße, technische Fehler, Strafen (2 Minuten, Gelb, Rot) und Wechsel. Daraus entstehen automatisch Spieler- und Mannschaftsstatistiken, Wurfbilder, Heatmaps und Entwicklungsverläufe über die ganze Saison.',
    },
    {
        question: 'Gibt es eine kostenlose Handball-Statistik-App?',
        answer:
            'Ja. Mit Statix startest du kostenlos und erfasst dein erstes Spiel ohne Verpflichtung und ohne Kreditkarte. Für ganze Teams und Vereine gibt es zusätzlich faire, planbare Abos.',
    },
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
            'Du startest kostenlos: Probiere zuerst die Live-Demo ohne Account aus und erfasse dann dein erstes Spiel ohne Verpflichtung und ohne Kreditkarte. Für ganze Teams und Vereine gibt es faire Abos – trag dich in den Newsletter ein und sichere dir das exklusive Launch-Angebot.',
    },
    {
        question: 'Wer steckt hinter Statix?',
        answer:
            'Hinter Statix steht Arkadiusz Weiss – ein Handballer aus Deutschland, der die App aus der eigenen Praxis am Spielfeldrand heraus entwickelt. Kein anonymes Tool: Feedback aus der Halle fließt direkt in die Entwicklung ein.',
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
    /**
     * OpenGraph object type. Defaults to 'website'. Use 'article' for blog /
     * Ratgeber pages so social + answer engines treat them as articles.
     */
    ogType?: 'website' | 'article';
    /**
     * Article-specific OpenGraph fields, applied only when `ogType` is
     * 'article'. Dates are ISO 8601 strings.
     */
    article?: {
        publishedTime?: string;
        modifiedTime?: string;
        authors?: string[];
        section?: string;
        tags?: string[];
    };
};

export function createPageMetadata({
    title,
    description,
    path = '/',
    keywords = [],
    imagePath = DEFAULT_OG_IMAGE,
    noIndex = false,
    absoluteTitle = false,
    ogType = 'website',
    article,
}: CreatePageMetadataArgs): Metadata {
    const canonical = absoluteUrl(path);
    const imageUrl = absoluteUrl(imagePath);
    const combinedKeywords = Array.from(new Set([...SEO_KEYWORDS, ...keywords]));

    const ogImages = [
        {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${title} | ${SITE_NAME}`,
        },
    ];

    const openGraph: Metadata['openGraph'] =
        ogType === 'article'
            ? {
                type: 'article',
                locale: 'de_DE',
                url: canonical,
                title,
                description,
                siteName: SITE_NAME,
                images: ogImages,
                publishedTime: article?.publishedTime,
                modifiedTime: article?.modifiedTime,
                authors: article?.authors,
                section: article?.section,
                tags: article?.tags,
            }
            : {
                type: 'website',
                locale: 'de_DE',
                url: canonical,
                title,
                description,
                siteName: SITE_NAME,
                images: ogImages,
            };

    return {
        title: absoluteTitle ? { absolute: title } : title,
        description,
        keywords: combinedKeywords,
        alternates: {
            canonical,
        },
        openGraph,
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