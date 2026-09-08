import { DE_MESSAGES } from '@/lib/messages';

/**
 * The Statix feature catalogue — the single source of truth for every surface
 * that names a feature.
 *
 * It feeds four things at once, which is the whole point of it existing:
 *  - the `/funktionen` index and one route per entry (`/funktionen/<slug>`),
 *  - `APP_FEATURES` in `lib/seo.ts`, and through it the `SoftwareApplication`
 *    schema and `/llms.txt`,
 *  - the feature list on `/was-ist-statix`,
 *  - the sitemap.
 *
 * Before this file those four lists were maintained separately, which is how
 * "Termine & Trainingsbeteiligung" ended up in the schema with no page behind
 * it and no screenshot anywhere on the site.
 *
 * The catalogue is split in two halves. What a reader reads — every name,
 * paragraph, fact row, step, caption, limit and FAQ answer — lives in the
 * `featureCatalog` namespace of the message bundles, in all five languages.
 * What does not translate stays here: the slug that is the URL, the group, the
 * state, the screenshot files with their measured dimensions, the related
 * slugs, and the German page metadata. `FEATURES` below joins the two on the
 * slug and is therefore always German — the server renders metadata, JSON-LD,
 * `llms.txt` and the sitemap, and German is what the canonical URLs serve. The
 * translated catalogue reaches the page through `useFeatures()`.
 *
 * Rules for editing:
 *  - **Only real, shipping behaviour.** Everything not generally available
 *    carries a `status` other than `live` and says so in its own copy — see
 *    `video-tagging`, which is a closed beta.
 *  - **No price, ever.** Not in copy, not in a fact row, not in an FAQ answer.
 *    See PRODUCT.md, "Commercial truth".
 *  - Screenshots are real app captures from `scripts/screenshots/capture.mjs`.
 *    `width`/`height` must match the file on disk — `npm run check-images`
 *    fails the build's honesty check otherwise.
 *  - A new entry needs a record here **and** an entry under the same slug in
 *    every one of the five bundles. `scripts/merge-messages.js` refuses to
 *    write a set of bundles whose keys differ, which is what keeps the two
 *    halves in step.
 *  - Keep it pure data: this module is imported by `lib/seo.ts`, which every
 *    route's metadata pulls in. No React, no client-only imports.
 */

/** Route of the feature index. */
export const FEATURES_PAGE_PATH = '/funktionen';

/** Route of one feature page. */
export function featurePath(slug: string): string {
  return `${FEATURES_PAGE_PATH}/${slug}`;
}

/**
 * How far along a feature is.
 *
 * `live` is the default and the only one that needs no explanation. The other
 * two exist because the site would otherwise have to either hide a feature a
 * coach can already see in the app, or claim it is finished when it is not.
 */
export type FeatureStatus = 'live' | 'beta' | 'onRequest';

export type FeatureGroupId =
  | 'erfassen'
  | 'auswerten'
  | 'organisieren'
  | 'teilen';

export interface FeatureGroup {
  id: FeatureGroupId;
  /** Heading on the index. */
  name: string;
  /** The question this group of features answers. */
  intro: string;
}

export interface FeatureShot {
  /** Path under `public/`. */
  src: string;
  alt: string;
  /** Hand-written note under the shot. */
  label: string;
  width: number;
  height: number;
}

export interface FeatureStep {
  title: string;
  body: string;
}

/** One row of the "Kurz gesagt" panel — a fact a coach scans for. */
export interface FeatureFact {
  term: string;
  value: string;
}

export interface FeatureFaqItem {
  question: string;
  answer: string;
}

/**
 * Everything about a feature that is written rather than measured — one entry
 * of the `featureCatalog.items` list, in whichever language the bundle is.
 */
export interface FeatureCopy {
  slug: string;
  name: string;
  short: string;
  headline: string;
  summary: string;
  tagline: string;
  intro: string[];
  facts: FeatureFact[];
  steps: FeatureStep[];
  /** In the order of the record's `shots`; joined by position. */
  shots: { alt: string; label: string }[];
  limits: string[];
  faq: FeatureFaqItem[];
}

/** Everything about a feature that stays the same in every language. */
export interface FeatureRecord {
  slug: string;
  group: FeatureGroupId;
  status: FeatureStatus;
  shots: { src: string; width: number; height: number }[];
  /** Slugs of the features that answer the next question. Two or three. */
  related: string[];
  /** Social card for the route. Falls back to the site default. */
  ogImage?: string;
  /**
   * Renders the drawn tagging bench instead of a screenshot band. Set only for
   * `video-tagging`: the workbench is real and captured, but the moving picture
   * behind it lives in object storage the screenshot machine cannot reach, and
   * a doctored screenshot is not an option.
   */
  mock?: 'tagging-bench';
  /**
   * Title, description and keywords of the route — German, because the server
   * renders the head and the canonical URL is the German page.
   */
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface Feature extends FeatureRecord {
  /** Full name, used as the `<h1>` and in the schema. */
  name: string;
  /** Short label for cards, navigation and breadcrumbs. */
  short: string;
  /** One sentence. Also the description in the `SoftwareApplication` schema. */
  summary: string;
  /** The standfirst under the `<h1>`. Longer than `summary`, never a repeat. */
  tagline: string;
  /**
   * The `<h2>` of the overview band — a short claim, not a summary.
   * Separate from `summary` because that one is written for a card and a schema
   * field, and a sentence built to fit both reads terribly at display size.
   */
  headline: string;
  /** Two or three paragraphs: what it is, why it works that way. */
  intro: string[];
  facts: FeatureFact[];
  steps: FeatureStep[];
  shots: FeatureShot[];
  /**
   * What it deliberately does NOT do. Every feature has some — a page without
   * them reads like a brochure, and a coach finds out on matchday instead.
   */
  limits: string[];
  faq: FeatureFaqItem[];
}

export const FEATURE_RECORDS: FeatureRecord[] = [
  /* ────────────────────────────────────────────────────── erfassen ── */
  {
    slug: 'live-erfassung',
    group: 'erfassen',
    status: 'live',
    shots: [
      { src: '/recordStatsInGame.png', width: 2560, height: 1600 },
      { src: '/aufstellung-feld.png', width: 2560, height: 1600 },
      { src: '/mobil-live-erfassung.png', width: 780, height: 1688 },
    ],
    related: ['offline-und-app', 'wurfbilder', 'spielerstatistiken'],
    ogImage: '/recordStatsInGame.png',
    meta: {
      title: 'Handball live erfassen: Statistik per Tap von der Bank',
      description:
        'Tore, Würfe, Paraden, Strafen und Wechsel live per Tap erfassen — mit Wurfposition, Zeitstrafen-Timer und Korrektur nach dem Spiel. Offline in der Halle, sofort ausgewertet.',
      keywords: [
        'handball statistik live erfassen',
        'handball statistik app',
        'handball spielstatistik erfassen',
        'handball live erfassung',
        'handball statistik tablet',
      ],
    },
  },
  {
    slug: 'offline-und-app',
    group: 'erfassen',
    status: 'live',
    shots: [
      { src: '/mobil-live-erfassung.png', width: 780, height: 1688 },
      { src: '/mobil-spielliste.png', width: 780, height: 1688 },
    ],
    related: ['live-erfassung', 'live-ticker', 'termine-und-teilnahme'],
    ogImage: '/mobil-live-erfassung.png',
    meta: {
      title:
        'Handball-Statistik offline erfassen & Statix als App installieren',
      description:
        'Statix erfasst ein ganzes Spiel ohne Netz und synchronisiert automatisch, sobald wieder Empfang da ist — ohne doppelte Einträge. Als PWA in zwei Tipps auf dem Homescreen, ohne App-Store.',
      keywords: [
        'handball statistik app offline',
        'handball app ohne internet',
        'handball statistik pwa',
        'statix app installieren',
      ],
    },
  },
  {
    slug: 'live-ticker',
    group: 'erfassen',
    status: 'live',
    shots: [{ src: '/gameListOverview.png', width: 2560, height: 2000 }],
    related: ['live-erfassung', 'trainer-zusammenarbeit', 'turniere'],
    meta: {
      title: 'Handball Live-Ticker: Spiel per Link & QR-Code live übertragen',
      description:
        'Veröffentliche ein Handballspiel als öffentlichen Live-Ticker: Spielstand, Spielzeit und Verlauf in Echtzeit, per Link oder QR-Code, ohne Konto für Zuschauer. Kein zusätzliches Tippen.',
      keywords: [
        'handball live ticker',
        'handball live ticker app',
        'handball spiel live verfolgen',
        'handball liveticker verein',
      ],
    },
  },
  /* ───────────────────────────────────────────────────── auswerten ── */
  {
    slug: 'spielerstatistiken',
    group: 'auswerten',
    status: 'live',
    shots: [
      { src: '/statsTableInGame.png', width: 2560, height: 2000 },
      { src: '/spielerprofil-verlauf.png', width: 2560, height: 2000 },
      { src: '/mobil-spielerstatistiken.png', width: 780, height: 1688 },
    ],
    related: ['wurfbilder', 'ki-analyse', 'kader-kartenalbum'],
    ogImage: '/statsTableInGame.png',
    meta: {
      title: 'Handball Spielerstatistiken: Wurfquote, Effizienz & Verlauf',
      description:
        'Wurfquote, Siebenmeter, Assists, technische Fehler, Paradenquote — je Spieler, je Spiel und über die ganze Saison als Verlauf. Jede Zahl bis zur einzelnen Aktion nachvollziehbar.',
      keywords: [
        'spielerstatistik handball',
        'handball wurfquote spieler',
        'handball spielerentwicklung messen',
        'handball statistik pro spieler',
      ],
    },
  },
  {
    slug: 'wurfbilder',
    group: 'auswerten',
    status: 'live',
    shots: [
      { src: '/shotMaps.png', width: 2560, height: 2000 },
      { src: '/mobil-wurfbild.png', width: 780, height: 1688 },
    ],
    related: ['spielerstatistiken', 'ki-analyse', 'video-tagging'],
    ogImage: '/shotMaps.png',
    meta: {
      title: 'Handball Wurfbild & Heatmap: Würfe auf dem Feld auswerten',
      description:
        'Wurfbilder und Heatmaps aus der Live-Erfassung: acht Wurfzonen, neun Torzonen, Tore und Fehlwürfe getrennt — für ein Spiel, eine Spielerin oder die ganze Saison.',
      keywords: [
        'handball wurfbild',
        'handball heatmap',
        'handball wurfbilder erstellen',
        'handball wurfpositionen auswerten',
      ],
    },
  },
  {
    slug: 'ki-analyse',
    group: 'auswerten',
    status: 'live',
    shots: [
      { src: '/aiAnalyze.png', width: 2560, height: 2000 },
      { src: '/aiAnalyze2.png', width: 2560, height: 2000 },
      { src: '/spielerprofil-ki.png', width: 1360, height: 562 },
    ],
    related: ['spielerstatistiken', 'turniere', 'wurfbilder'],
    ogImage: '/aiAnalyze.png',
    meta: {
      title: 'KI-Analyse für Handball: Spiel, Team, Spieler und Turnier',
      description:
        'KI-Berichte für einzelne Spiele, die Mannschaft, einzelne Spielerinnen und ganze Turniere — mit Wendepunkten, Fehlerverteilung und Wurfzonen-Effizienz. Namen werden vorher pseudonymisiert.',
      keywords: [
        'handball ki analyse',
        'handball spielanalyse app',
        'ki handball statistik',
        'handball scouting profil',
      ],
    },
  },
  {
    slug: 'gegner-bilanz',
    group: 'auswerten',
    status: 'live',
    shots: [{ src: '/gegner-uebersicht.png', width: 2560, height: 1600 }],
    related: ['spielerstatistiken', 'termine-und-teilnahme', 'ki-analyse'],
    meta: {
      title: 'Handball Gegner-Bilanz & Scouting-Notizen je Verein',
      description:
        'Automatische Head-to-Head-Bilanz gegen jeden Gegner: Siege, Unentschieden, Niederlagen, Tore und Form — dazu eigene Scouting-Notizen je Verein, auch vor dem ersten Spiel.',
      keywords: [
        'handball gegner bilanz app',
        'handball scouting app',
        'handball gegneranalyse',
        'handball head to head',
      ],
    },
  },
  {
    slug: 'video-tagging',
    group: 'auswerten',
    status: 'beta',
    shots: [
      { src: '/video-tagging-spuren.png', width: 2500, height: 1132 },
      { src: '/video-tagging-katalog.png', width: 768, height: 1560 },
    ],
    related: ['live-erfassung', 'wurfbilder', 'trainer-zusammenarbeit'],
    ogImage: '/video-tagging-spuren.png',
    mock: 'tagging-bench',
    meta: {
      title:
        'Handball Videoanalyse & Tagging (Beta) – Szenen, Spuren, Playlists',
      description:
        'Spielaufnahmen hochladen, Szenen mit Aktion, Spielerin, Phase und Abwehr taggen, nach allem filtern und Zusammenschnitte an einzelne Spielerinnen schicken. Die Funktion ist im Aufbau und noch nicht für alle Konten freigeschaltet.',
      keywords: [
        'handball videoanalyse',
        'handball video tagging',
        'handball szenen taggen',
        'handball videoanalyse software',
        'handball spielanalyse video',
      ],
    },
  },
  /* ────────────────────────────────────────────────── organisieren ── */
  {
    slug: 'termine-und-teilnahme',
    group: 'organisieren',
    status: 'live',
    shots: [
      { src: '/termine-liste.png', width: 2560, height: 2000 },
      { src: '/termine-kalender.png', width: 2560, height: 2000 },
      { src: '/termine-detail.png', width: 2560, height: 2000 },
      { src: '/termine-teilnahme.png', width: 2560, height: 1600 },
      { src: '/termine-abwesenheiten.png', width: 2560, height: 1600 },
      { src: '/mobil-termine.png', width: 780, height: 1688 },
    ],
    related: ['team-management', 'spieler-umfragen', 'gegner-bilanz'],
    ogImage: '/termine-kalender.png',
    meta: {
      title:
        'Handball Terminverwaltung & Trainingsbeteiligung für Mannschaften',
      description:
        'Mannschaftskalender mit Trainings-Serien, Spielterminen, Zu- und Absagen, Abwesenheiten als Zeitraum, Push-Erinnerungen und Kalender-Abo. Der Trainerstab sieht die vollständige Teilnahmeliste.',
      keywords: [
        'handball terminverwaltung',
        'handball mannschaftskalender',
        'handball trainingsbeteiligung erfassen',
        'handball zusagen absagen app',
        'handball team app termine',
        'handball trainingsplanung app',
      ],
    },
  },
  {
    slug: 'team-management',
    group: 'organisieren',
    status: 'live',
    shots: [
      { src: '/teamManagement.png', width: 2560, height: 2000 },
      { src: '/gameListOverview.png', width: 2560, height: 2000 },
    ],
    related: ['kader-kartenalbum', 'termine-und-teilnahme', 'vereinsbereich'],
    ogImage: '/teamManagement.png',
    meta: {
      title: 'Handball Team-Management: Kader, Spiele, Saisons & Trainerstab',
      description:
        'Kader mit Nummern und Positionen, Spiele über die ganze Saison, Saisonwechsel ohne Datenverlust und ein eingeladener Trainerstab, der im selben Team arbeitet.',
      keywords: [
        'handball kader verwalten app',
        'handball team app',
        'handball mannschaft verwalten',
        'handball saison verwalten',
      ],
    },
  },
  {
    slug: 'kader-kartenalbum',
    group: 'organisieren',
    status: 'live',
    shots: [
      { src: '/teamManagement.png', width: 2560, height: 2000 },
      { src: '/mobil-kader.png', width: 780, height: 1688 },
    ],
    related: ['spielerstatistiken', 'team-management', 'ki-analyse'],
    ogImage: '/teamManagement.png',
    meta: {
      title: 'Handball Kader als Kartenalbum mit Performance Index',
      description:
        'Der Kader als Sammelalbum: Spielerkarten mit Werten aus echten Spielen, Handball Performance Index, Stickern und einem Taktikboard, auf dem die Karten zur Aufstellung werden.',
      keywords: [
        'handball spielerkarten',
        'handball kader app',
        'handball performance index',
        'handball taktikboard aufstellung',
      ],
    },
  },
  {
    slug: 'turniere',
    group: 'organisieren',
    status: 'live',
    shots: [
      { src: '/turnier-uebersicht.png', width: 2560, height: 2000 },
      { src: '/turnier-spielplan-ergebnisse.jpg', width: 2560, height: 1505 },
      { src: '/turnier-ki-analyse.png', width: 2560, height: 2000 },
    ],
    related: ['live-erfassung', 'ki-analyse', 'live-ticker'],
    ogImage: '/turnier-uebersicht.png',
    meta: {
      title: 'Handball Turniermodus: Spielplan, Tabelle & Live-Erfassung',
      description:
        'Turniere mit mehreren Mannschaften: Spielplan anlegen, eigene Spiele live erfassen, fremde Ergebnisse eintragen, automatische Tabelle und eine KI-Analyse über das ganze Turnier.',
      keywords: [
        'handball turnier app',
        'handball turniertabelle',
        'handball turnier spielplan',
        'handball turnier statistik',
      ],
    },
  },
  {
    slug: 'vereinsbereich',
    group: 'organisieren',
    status: 'onRequest',
    shots: [
      { src: '/verein-uebersicht.png', width: 2560, height: 2000 },
      { src: '/verein-auswertung.png', width: 2560, height: 2000 },
      { src: '/verein-laufbahnen.png', width: 2048, height: 650 },
    ],
    related: ['team-management', 'spielerstatistiken', 'termine-und-teilnahme'],
    ogImage: '/verein-uebersicht.png',
    meta: {
      title: 'Handball Vereinsbereich: alle Mannschaften einer Abteilung',
      description:
        'Die Ebene über den Mannschaften: Ergebnisse aller Kader, vereinsweite Spielerliste, Auswertung mit Saisonvergleich und Spielerlaufbahnen über mehrere Jugendmannschaften.',
      keywords: [
        'handball statistik verein',
        'handball vereinssoftware statistik',
        'handball jugendabteilung statistik',
        'handball statistik mehrere mannschaften',
      ],
    },
  },
  /* ──────────────────────────────────────────────────────── teilen ── */
  {
    slug: 'trainer-zusammenarbeit',
    group: 'teilen',
    status: 'live',
    shots: [
      { src: '/exportShare.png', width: 2560, height: 1600 },
      { src: '/posteingang-geteilte-spiele.png', width: 2560, height: 1600 },
    ],
    related: ['ki-analyse', 'live-ticker', 'spieler-umfragen'],
    ogImage: '/exportShare.png',
    meta: {
      title: 'Handball Spiele teilen: Freigaben, Posteingang & PDF-Bericht',
      description:
        'Spiele mit Trainerkollegen teilen — per Link ohne Konto oder direkt in deren Statix-Posteingang, mit wählbarem Umfang und jederzeit widerrufbar. Dazu Co-Trainer fest ins Team einladen.',
      keywords: [
        'handball trainer zusammenarbeit app',
        'handball spielbericht teilen',
        'handball statistik teilen',
        'handball spielbericht pdf',
      ],
    },
  },
  {
    slug: 'spieler-umfragen',
    group: 'teilen',
    status: 'live',
    shots: [{ src: '/spielerumfragen.png', width: 2560, height: 1600 }],
    related: [
      'termine-und-teilnahme',
      'trainer-zusammenarbeit',
      'team-management',
    ],
    ogImage: '/spielerumfragen.png',
    meta: {
      title: 'Handball Spieler-Umfragen: Verfügbarkeit & Feedback per Link',
      description:
        'Umfragen an die Mannschaft mit Freitext, Auswahl, Skala und Ja/Nein — geteilt über einen Link, beantwortbar ohne Konto. Für alles, was keine Termin-Zusage ist.',
      keywords: [
        'handball team umfrage app',
        'handball verfügbarkeit abfragen',
        'handball mannschaft umfrage',
        'handball feedback spieler',
      ],
    },
  },
];

/* ──────────────────────────────────────────────────────── the German read ── */

const DE_CATALOG = DE_MESSAGES.featureCatalog;

export const FEATURE_STATUS_LABEL: Record<FeatureStatus, string> =
  DE_CATALOG.statusLabel;

export const FEATURE_STATUS_HINT: Record<FeatureStatus, string> =
  DE_CATALOG.statusHint;

/**
 * The four questions a coach's season asks, in the order they come up: get the
 * game down, read it afterwards, run the squad around it, hand it to somebody
 * else.
 */
export const FEATURE_GROUPS: FeatureGroup[] =
  DE_CATALOG.groups as FeatureGroup[];

/**
 * Puts a record and its copy together.
 *
 * Exported because the client hook joins the very same way against the bundle
 * of the reader's language — one function, so a page and its metadata cannot
 * end up assembled differently.
 *
 * The screenshots are joined by position rather than by a key: a shot has no
 * id, and giving it one would mean a second thing to keep in step. That is safe
 * because `scripts/merge-messages.js` compares the shape of all five bundles
 * down to the array index and refuses to write a set where one is shorter.
 */
export function withCopy(record: FeatureRecord, copy: FeatureCopy): Feature {
  return {
    ...record,
    name: copy.name,
    short: copy.short,
    headline: copy.headline,
    summary: copy.summary,
    tagline: copy.tagline,
    intro: copy.intro,
    facts: copy.facts,
    steps: copy.steps,
    shots: record.shots.map((shot, index) => ({
      ...shot,
      alt: copy.shots[index]?.alt ?? '',
      label: copy.shots[index]?.label ?? '',
    })),
    limits: copy.limits,
    faq: copy.faq,
  };
}

/** Indexes a catalogue's copy by slug, for the join. */
export function copyBySlug(
  items: readonly FeatureCopy[],
): Map<string, FeatureCopy> {
  return new Map(items.map((item) => [item.slug, item]));
}

/**
 * The catalogue in German — what the server renders and what a crawler reads.
 * The page itself uses `useFeatures()`, which is the same join against the
 * bundle of the active language.
 */
export const FEATURES: Feature[] = (() => {
  const copy = copyBySlug(DE_CATALOG.items as FeatureCopy[]);

  return FEATURE_RECORDS.map((record) => {
    const entry = copy.get(record.slug);

    if (!entry) {
      throw new Error(
        `Feature "${record.slug}" has no entry in messages/de.json → featureCatalog.items`,
      );
    }

    return withCopy(record, entry);
  });
})();

/* ─────────────────────────────────────────────────────────────── helpers ── */

const BY_SLUG = new Map(FEATURES.map((feature) => [feature.slug, feature]));

/** One feature, or `undefined` for an unknown slug. */
export function getFeature(slug: string): Feature | undefined {
  return BY_SLUG.get(slug);
}

/** Every slug — the source for `generateStaticParams` and the sitemap. */
export function allFeatureSlugs(): string[] {
  return FEATURE_RECORDS.map((record) => record.slug);
}

/** The features of one group, in catalogue order. */
export function featuresOfGroup(group: FeatureGroupId): Feature[] {
  return FEATURES.filter((feature) => feature.group === group);
}

/**
 * The feature's state as a clause for the machine-readable surfaces —
 * `llms.txt` and the `ItemList` schema — where no badge can carry it.
 *
 * Empty for `live`, so a finished feature reads as a plain sentence. It lives
 * here rather than at each call site because the alternative was the state
 * appearing twice on one line: once as a prefix and once because somebody had
 * written it into the summary as well.
 *
 * German like everything else those two surfaces carry, and taken from the
 * bundle so it says the same as the badge a German reader sees.
 */
export function featureStateNote(status: FeatureStatus): string {
  return status === 'live' ? '' : ` ${DE_CATALOG.stateNote[status]}`;
}

/** Short label for cards and navigation. */
export function featureLabel(feature: Feature): string {
  return feature.short || feature.name;
}

/** The related features of one entry, resolved and with unknown slugs dropped. */
export function relatedFeatures(feature: Feature): Feature[] {
  return feature.related
    .map((slug) => BY_SLUG.get(slug))
    .filter((entry): entry is Feature => Boolean(entry));
}

/** How many features are generally available — used in the index standfirst. */
export const LIVE_FEATURE_COUNT = FEATURE_RECORDS.filter(
  (record) => record.status === 'live',
).length;
