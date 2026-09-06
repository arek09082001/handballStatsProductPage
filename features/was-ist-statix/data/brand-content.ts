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
      'Basis dauerhaft kostenlos – bezahlte Stufen ab dem 1. Januar 2027, ab 79 € je Saison',
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

/**
 * Visual product highlights for the brand page. Each entry pairs a real
 * in-app screenshot (pinned to the board via BoardScreenshot) with a short
 * pitch, so the page shows the product instead of only describing it.
 * Screenshot dimensions mirror the ones used by the landing-page showcase so
 * Next.js can reserve the correct aspect ratio.
 */
export const BRAND_HIGHLIGHTS = [
  {
    icon: 'record',
    badge: 'Live erfassen',
    title: 'Das ganze Spiel per Tap – direkt von der Bank',
    description:
      'Tore, Würfe, Paraden, Strafen und Wechsel erfasst du in Echtzeit mit einem Tap. Kein Zettel, keine Strichliste – und trotzdem hast du nach dem Schlusspfiff jede Aktion sauber dokumentiert.',
    src: '/recordStatsInGame.png',
    width: 2560,
    height: 1600,
  },
  {
    icon: 'stats',
    badge: 'Automatisch auswerten',
    title: 'Spieler- und Mannschaftsstatistiken in Sekunden',
    description:
      'Wurfquoten, Effizienz, Spielanteile und Entwicklungsverläufe berechnet Statix automatisch im Hintergrund – für jeden Spieler und das ganze Team, sofort teilbar als Link oder PDF.',
    src: '/statsTableInGame.png',
    width: 2560,
    height: 2000,
  },
  {
    icon: 'shots',
    badge: 'Wurfbilder',
    title: 'Sieh, wo Tore fallen – und wo nicht',
    description:
      'Jeder Wurf landet visuell auf dem Spielfeld. So erkennst du Muster, Lieblingsecken und Schwächen, die in einer reinen Zahlentabelle untergehen.',
    src: '/shotMaps.png',
    width: 2560,
    height: 2000,
  },
  {
    icon: 'ai',
    badge: 'KI-Analyse',
    title: 'KI-Auswertung für Spiele, Spieler und Turniere',
    description:
      'Statix fasst Spiele, Spieler und ganze Turniere in verständlichen Analysen zusammen – mit pseudonymisierten Spielernamen. Stärken, Schwächen und Ansatzpunkte fürs nächste Training auf einen Blick.',
    src: '/aiAnalyze.png',
    width: 2560,
    height: 2000,
  },
] as const;

/** Who Statix is built for – rendered as audience cards. */
export const BRAND_AUDIENCES = [
  {
    icon: 'coach',
    title: 'Trainer & Co-Trainer',
    description:
      'Erfassen Spiele live per Tap von der Bank und treffen Entscheidungen auf Basis echter Zahlen statt Bauchgefühl.',
  },
  {
    icon: 'club',
    title: 'Vereine',
    description:
      'Bündeln Statistiken, Kader und Saisons aller Mannschaften an einem Ort – vom Jugendbereich bis zur ersten Mannschaft.',
  },
  {
    icon: 'player',
    title: 'Spielerinnen & Spieler',
    description:
      'Sehen ihre Wurfquoten, Entwicklungsverläufe und Spielerkarten und erkennen, woran sie arbeiten können.',
  },
  {
    icon: 'fans',
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
    answer: `Bis zum 31. Dezember 2026 nichts: Registriere dich unter ${CLUB_CONFIG.website.appUrlWithoutProtocol} und erfasse dein erstes Spiel ohne Verpflichtung und ohne Kreditkarte. Ab dem 1. Januar 2027 gibt es drei Stufen – Basis bleibt 0 €, Trainer kostet 79 € je Saison, Pro 159 €. Wer sich vorher registriert, behält den Trainer-Plan die Saison 26/27 über kostenlos, also bis zum 30. Juni 2027.`,
  },
  {
    question: 'Wie kann ich Statix testen?',
    answer: `Statix ist verfügbar: Du registrierst dich kostenlos unter ${CLUB_CONFIG.website.appUrlWithoutProtocol} und legst direkt mit deinem Team los. Wenn du erst schauen willst, öffnest du die Live-Demo – eine voll ausgestattete Version mit echten Spieldaten, direkt im Browser und ganz ohne Account.`,
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
    answer: `Die offizielle Website von Statix ist ${CLUB_CONFIG.website.domain}. Dort findest du alle Funktionen, den Handball-Ratgeber und die Live-Demo ohne Account. Die App selbst läuft unter ${CLUB_CONFIG.website.appUrlWithoutProtocol}. Auf Instagram ist Statix als ${CLUB_CONFIG.social.instagram.handle} aktiv.`,
  },
] as const;
