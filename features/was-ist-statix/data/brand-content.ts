import { CLUB_CONFIG } from '@/lib/club-config';

/**
 * Content for the dedicated brand page `/was-ist-statix`. The page targets
 * brand-intent searches ("statix", "was ist statix", "statix app",
 * "statix handball") so people who hear about Statix and google the name land
 * here or on the home page. Facts mirror `lib/seo.ts` (HOMEPAGE_FAQS,
 * APP_FEATURES) and `lib/club-config.ts` – keep them in sync when the product
 * changes.
 */

export const BRAND_PAGE_PATH = '/was-ist-statix';

/** Quick facts shown in the "Statix in 30 Sekunden" overview. */
export const BRAND_FACTS = [
  {
    label: 'Produkt',
    value: 'Statix – Handball-Statistik-App',
  },
  {
    label: 'Kategorie',
    value: 'Live-Statistik, Spielanalyse & Team-Management für Handball',
  },
  {
    label: 'Zielgruppe',
    value: 'Trainer, Co-Trainer, Vereine und Handball-Teams aller Spielklassen',
  },
  {
    label: 'Plattform',
    value:
      'Web-App im Browser – Smartphone, Tablet/iPad und Laptop, offline-fähig',
  },
  {
    label: 'Preis',
    value:
      'Kostenlos starten, erstes Spiel ohne Verpflichtung – faire Abos für Teams und Vereine',
  },
  {
    label: 'Entwickler',
    value: 'Arkadiusz Weiss, Handballer aus Deutschland (Made in Germany)',
  },
  {
    label: 'Website',
    value: CLUB_CONFIG.website.domain,
  },
] as const;

/** Who Statix is built for – rendered as audience cards. */
export const BRAND_AUDIENCES = [
  {
    title: 'Trainer & Co-Trainer',
    description:
      'Erfassen Spiele live per Tap von der Bank und treffen Entscheidungen auf Basis echter Zahlen statt Bauchgefühl.',
  },
  {
    title: 'Vereine',
    description:
      'Bündeln Statistiken, Kader und Saisons aller Mannschaften an einem Ort – vom Jugendbereich bis zur ersten Mannschaft.',
  },
  {
    title: 'Spielerinnen & Spieler',
    description:
      'Sehen ihre Wurfquoten, Entwicklungsverläufe und Spielerkarten und erkennen, woran sie arbeiten können.',
  },
  {
    title: 'Eltern & Fans',
    description:
      'Verfolgen Spiele über den öffentlichen Live-Ticker mit Link oder QR-Code – direkt im Browser, ohne Account.',
  },
] as const;

/**
 * Brand-intent FAQ. Deliberately phrased around the brand name (not around
 * generic "handball app" queries, which the home page FAQ already covers) so
 * the page answers what people googling "statix" actually want to know. Also
 * emitted as FAQPage JSON-LD from the route.
 */
export const BRAND_FAQS = [
  {
    question: 'Was ist Statix?',
    answer:
      'Statix ist eine Handball-Statistik-App aus Deutschland. Trainer, Vereine und Teams erfassen Spiele live per Tap – Tore, Würfe, Paraden, Strafen und Wechsel – und Statix berechnet daraus automatisch Wurfquoten, Spieler- und Mannschaftsstatistiken, Wurfbilder und KI-Analysen.',
  },
  {
    question: 'Ist Statix kostenlos?',
    answer:
      'Du startest kostenlos: Das erste Spiel erfasst du ohne Verpflichtung und ohne Kreditkarte. Für ganze Teams und Vereine gibt es zusätzlich faire, planbare Abos.',
  },
  {
    question: 'Wie kann ich Statix testen?',
    answer:
      'Am schnellsten über die Live-Demo: eine voll ausgestattete Version von Statix mit echten Spieldaten, direkt im Browser und ganz ohne Account. So siehst du in zwei Minuten, wie Statix in der Halle funktioniert.',
  },
  {
    question: 'Auf welchen Geräten läuft Statix?',
    answer:
      'Statix läuft direkt im Browser auf Smartphone, Tablet (iPad und Android) und Laptop. Eine Installation aus dem App Store ist nicht nötig – die App lässt sich aber als PWA auf dem Homescreen installieren und funktioniert offline in der Halle.',
  },
  {
    question: 'Wer steckt hinter Statix?',
    answer:
      'Hinter Statix steht Arkadiusz Weiss – ein Handballer aus Deutschland, der die App aus der eigenen Praxis am Spielfeldrand heraus entwickelt. Kein anonymes Tool: Feedback aus der Halle fließt direkt in die Entwicklung ein.',
  },
  {
    question: 'Wo finde ich Statix im Internet?',
    answer: `Die offizielle Website von Statix ist ${CLUB_CONFIG.website.domain}. Dort findest du alle Funktionen, den Handball-Ratgeber und die Live-Demo ohne Account. Auf Instagram ist Statix als ${CLUB_CONFIG.social.instagram.handle} aktiv.`,
  },
] as const;
