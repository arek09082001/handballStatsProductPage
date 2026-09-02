import type { BoardFaqItem } from '@/components/custom-ui/board-faq';

export const PRICING_PAGE_PATH = '/preise';

/**
 * Commercial truth of `/preise`, in one module.
 *
 * Until 2026-09 this file deliberately carried NO price at all: nothing was
 * buyable, and a figure that is not decided anchors an expectation somebody
 * then has to honour or walk back. That reason has expired — the tiers, their
 * limits and their prices are decided (`docs/pricing.md` in the app repo) and
 * the payment start is dated (`docs/monetarisierung-januar.md`). So the page
 * now names figures, and every figure in here is one of those two documents'.
 *
 * Rules that survive the switch:
 *  - **Never round, pad or invent a number.** Every limit below is a plan limit
 *    the app will enforce; every price is an end price.
 *  - **Nothing is buyable yet.** No CTA may read like a checkout — the action
 *    on this page is registration, and registration before the deadline is what
 *    the founder guarantee rewards.
 *  - **No VAT is shown.** Under the small-business rule (§ 19 UStG) none may be
 *    stated; showing it anyway would be owed under § 14c UStG.
 */

/** The day the paid plans start. Nothing is charged before it. */
export const LAUNCH_DATE_LABEL = '1. Januar 2027';

/** Last day a registration still earns the founder guarantee. */
export const FOUNDER_DEADLINE_LABEL = '31. Dezember 2026';

/** How long a founder account keeps the Trainer plan at no cost. */
export const FOUNDER_FREE_UNTIL_LABEL = '30. Juni 2028';

/** Coaches using Statix today — the reason the hosting bill stopped being small. */
export const COACH_COUNT_LABEL = 'über 50 Trainer';

/** The two ways to pay. A "year" is a season here: 1 July – 30 June. */
export type BillingPeriod = 'monat' | 'jahr';

export type TierId = 'basis' | 'trainer' | 'pro';

export interface TierPrice {
  /** The figure itself, pre-formatted in German so SSR and client agree. */
  amount: string;
  /** What the figure buys, e.g. "im Monat". */
  unit: string;
  /** One line under the price — the per-month equivalent or the commitment. */
  note: string;
}

export interface Tier {
  id: TierId;
  name: string;
  /** Who this is, in one line. */
  audience: string;
  price: Record<BillingPeriod, TierPrice>;
  /** Two or three sentences on what the tier is for. */
  summary: string;
  /** The short list on the card — the differences, not the catalogue. */
  highlights: readonly string[];
  /** Label of the card's action. */
  ctaLabel: string;
  /** Marked as the one most coaches want. */
  recommended?: boolean;
}

export const TIERS: readonly Tier[] = [
  {
    id: 'basis',
    name: 'Basis',
    audience: 'Für den Trainer einer Mannschaft',
    price: {
      monat: {
        amount: '0 €',
        unit: 'dauerhaft',
        note: 'Keine Karte, kein Ablaufdatum.',
      },
      jahr: {
        amount: '0 €',
        unit: 'dauerhaft',
        note: 'Keine Karte, kein Ablaufdatum.',
      },
    },
    summary:
      'Eine Mannschaft, eine Saison, kein Konto bei irgendeinem Zahlungsdienst. Erfassen, auswerten, Termine planen – der Kern bleibt kostenlos, damit Statix für die Masse benutzbar bleibt.',
    highlights: [
      'Live-Erfassung ohne jede Beschneidung',
      'Terminplan und Kaderkarten vollständig',
      '1 Mannschaft, 20 Spieler:innen, 10 Spiele',
      'Die letzten 5 Spiele in voller Tiefe',
      '4 KI-Analysen und 4 geteilte Berichte im Monat',
    ],
    ctaLabel: 'Kostenlos registrieren',
  },
  {
    id: 'trainer',
    name: 'Trainer',
    audience: 'Für alle, die nach dem Spiel wirklich auswerten',
    price: {
      monat: {
        amount: '9,90 €',
        unit: 'im Monat',
        note: 'Monatlich kündbar.',
      },
      jahr: {
        amount: '79 €',
        unit: 'je Saison',
        note: 'Entspricht 6,58 € im Monat – 39,80 € gespart.',
      },
    },
    summary:
      'Die Stufe, für die Statix gebaut wurde: die ganze Saison bleibt sichtbar, Wurfbilder und Formkurven inklusive, bis zu drei Mannschaften mit je zwei Co-Trainern.',
    highlights: [
      'Jedes erfasste Spiel bleibt in voller Tiefe sichtbar',
      'Wurfbilder, Heatmaps, Formkurve, Team-Rekorde',
      '3 Mannschaften mit je 2 Co-Trainern',
      'Gegner-Bilanz, Umfragen, PDF-Spielbericht',
      'Sponsorenslots im öffentlichen Live-Ticker',
      '20 KI-Analysen und 30 geteilte Berichte im Monat',
    ],
    ctaLabel: 'Registrieren und sichern',
    recommended: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    audience: 'Für Videoanalyse als Wochenroutine',
    price: {
      monat: {
        amount: '19,90 €',
        unit: 'im Monat',
        note: 'Monatlich kündbar.',
      },
      jahr: {
        amount: '159 €',
        unit: 'je Saison',
        note: 'Entspricht 13,25 € im Monat – 79,80 € gespart.',
      },
    },
    summary:
      'Alles aus Trainer, plus das Video: 100 GB Aufnahmen, die sich selbst mit der Spieluhr synchronisieren. Jedes erfasste Ereignis findet seine Stelle im Video, ohne dass jemand sucht.',
    highlights: [
      '100 GB Video mit Tagging und Playlists',
      'Video läuft automatisch synchron zur Spieluhr',
      'Zusammenschnitte an einzelne Spielerinnen senden',
      '5 Mannschaften, 5 Co-Trainer, 500 Spiele',
      'Spieler-Accounts für den ganzen Kader',
      '40 KI-Analysen und 60 geteilte Berichte im Monat',
    ],
    ctaLabel: 'Registrieren und sichern',
  },
] as const;

/** Labels and sub-lines of the billing switch. */
export const BILLING_OPTIONS: ReadonlyArray<{
  id: BillingPeriod;
  label: string;
  badge?: string;
}> = [
  { id: 'monat', label: 'Monatlich' },
  { id: 'jahr', label: 'Jährlich', badge: '−33 %' },
];

/** `true` = enthalten, `false` = nicht enthalten, string = die Zahl dahinter. */
export type CompareValue = boolean | string;

export interface CompareRow {
  label: string;
  /** Reads under the label — what a number counts, or what a limit really does. */
  hint?: string;
  basis: CompareValue;
  trainer: CompareValue;
  pro: CompareValue;
}

export interface CompareGroup {
  id: string;
  title: string;
  /** One sentence on why this block is cut the way it is. */
  note: string;
  rows: readonly CompareRow[];
}

/**
 * The plan comparison, grouped along the four feature groups the rest of the
 * site already uses (`features/funktionen/data/features.ts`).
 *
 * The cut follows one rule from `docs/pricing.md`: what costs real money — AI
 * calls, video storage, PDF and email — sits behind the paid plans, and what
 * creates the habit (recording, calendar, squad cards) does not. Recording
 * itself is never limited in any plan; a paywall in the 58th minute costs the
 * match record, not the customer.
 */
export const COMPARE_GROUPS: readonly CompareGroup[] = [
  {
    id: 'erfassen',
    title: 'Erfassen',
    note: 'In keinem Plan beschnitten. Was während des Spiels passiert, ist nie eine Preisfrage.',
    rows: [
      {
        label: 'Spiel live per Tap erfassen',
        hint: 'Tore, Würfe, Paraden, Fehler, 7 m, Zeitstrafen',
        basis: true,
        trainer: true,
        pro: true,
      },
      {
        label: 'Wurfposition und Torzone auf dem Feld',
        basis: true,
        trainer: true,
        pro: true,
      },
      {
        label: 'Spieluhr, Wechselbank, Spielassistent',
        basis: true,
        trainer: true,
        pro: true,
      },
      {
        label: 'Offline in der Halle erfassen',
        hint: 'Synchronisiert sich draußen von selbst',
        basis: true,
        trainer: true,
        pro: true,
      },
      {
        label: 'Als App auf dem Startbildschirm',
        basis: true,
        trainer: true,
        pro: true,
      },
      {
        label: 'Aktionen nach dem Spiel korrigieren',
        basis: true,
        trainer: true,
        pro: true,
      },
    ],
  },
  {
    id: 'auswerten',
    title: 'Auswerten',
    note: 'Hier sitzt die Rechenzeit – und die Tiefe, mit der du auf deine Saison zurückschaust.',
    rows: [
      {
        label: 'Spielübersicht und Spielerwerte je Spiel',
        basis: true,
        trainer: true,
        pro: true,
      },
      {
        label: 'Spiele in voller Tiefe sichtbar',
        hint: 'Ältere bleiben gespeichert und werden unscharf angezeigt – gelöscht wird nichts',
        basis: '5',
        trainer: 'alle',
        pro: 'alle',
      },
      {
        label: 'Wurfbilder und Heatmaps',
        basis: false,
        trainer: true,
        pro: true,
      },
      {
        label: 'Saisonverlauf, Formkurve, Team-Rekorde',
        basis: false,
        trainer: true,
        pro: true,
      },
      {
        label: 'Spieler:in des Spiels mit Award-Poster',
        basis: false,
        trainer: true,
        pro: true,
      },
      {
        label: 'Gegner-Bilanz und Scouting-Formguide',
        basis: false,
        trainer: true,
        pro: true,
      },
      {
        label: 'KI-Analysen',
        hint: 'im Monat, je Konto über alle Mannschaften zusammen',
        basis: '4',
        trainer: '20',
        pro: '40',
      },
      {
        label: 'Videoanalyse mit Tagging und Playlists',
        hint: '100 GB sind rund 16 Spiele in 1080p',
        basis: false,
        trainer: false,
        pro: '100 GB',
      },
      {
        label: 'Video läuft synchron zur Spieluhr',
        hint: 'Jedes erfasste Ereignis findet seine Stelle im Video',
        basis: false,
        trainer: false,
        pro: true,
      },
    ],
  },
  {
    id: 'organisieren',
    title: 'Organisieren',
    note: 'Der Terminplan ist die meistgenutzte Funktion der App. Er bleibt überall vollständig.',
    rows: [
      {
        label: 'Terminplan mit Serien und Zu-/Absagen',
        hint: 'inklusive Push-Erinnerungen und Antwortfrist',
        basis: true,
        trainer: true,
        pro: true,
      },
      {
        label: 'Abwesenheiten, Kalenderabo, Hallen, Gäste',
        basis: true,
        trainer: true,
        pro: true,
      },
      {
        label: 'Kader als Kartenalbum',
        hint: 'HPI und OVR, Tiers, Radar, Sticker',
        basis: true,
        trainer: true,
        pro: true,
      },
      {
        label: 'Mannschaften',
        hint: 'je Konto',
        basis: '1',
        trainer: '3',
        pro: '5',
      },
      {
        label: 'Co-Trainer je Mannschaft',
        hint: 'offene Einladungen zählen mit',
        basis: '0',
        trainer: '2',
        pro: '5',
      },
      {
        label: 'Spieler:innen je Mannschaft',
        basis: '20',
        trainer: '30',
        pro: '40',
      },
      {
        label: 'Gespeicherte Spiele je Mannschaft',
        basis: '10',
        trainer: '200',
        pro: '500',
      },
      {
        label: 'Turniere je Mannschaft',
        basis: '3',
        trainer: '20',
        pro: '50',
      },
      {
        label: 'Spieler-Accounts für den Kader',
        basis: false,
        trainer: false,
        pro: true,
      },
    ],
  },
  {
    id: 'teilen',
    title: 'Teilen',
    note: 'Jedes Teilen rendert ein PDF und verschickt oft eine E-Mail – der zweite Posten, der echtes Geld kostet.',
    rows: [
      {
        label: 'Öffentlicher Live-Ticker per Link und QR',
        basis: true,
        trainer: true,
        pro: true,
      },
      {
        label: 'Sponsorenslots im Live-Ticker',
        hint: 'Ein Bandenpartner refinanziert das Abo im Verein',
        basis: false,
        trainer: true,
        pro: true,
      },
      {
        label: 'PDF-Spielbericht und Teilen-Links',
        hint: 'im Monat, je Konto',
        basis: '4',
        trainer: '30',
        pro: '60',
      },
      {
        label: 'Spiele mit anderen Trainern teilen',
        hint: 'Landet in deren Statix-Postfach',
        basis: false,
        trainer: true,
        pro: true,
      },
      {
        label: 'Spieler-Umfragen ohne Account',
        basis: false,
        trainer: true,
        pro: true,
      },
      {
        label: 'Zusammenschnitte an Spielerinnen senden',
        hint: 'Sie sehen ihre Szenen ohne eigenen Account',
        basis: false,
        trainer: false,
        pro: true,
      },
    ],
  },
] as const;

/** The three steps between "gelesen" and "Bestandsschutz gesichert". */
export const FOUNDER_STEPS = [
  {
    number: 1,
    title: `Bis zum ${FOUNDER_DEADLINE_LABEL} registrieren`,
    text: 'Eine E-Mail-Adresse genügt. Es gibt kein Feld für Zahlungsdaten, weil es bis Januar keinen Bezahlvorgang gibt.',
  },
  {
    number: 2,
    title: 'Dein Konto steht auf Trainer',
    text: 'Nicht als Testphase, sondern als gesetzter Wert. Am 1. Januar wechselt nur die Voreinstellung für Neuregistrierungen – dein Konto behält, was es hat.',
  },
  {
    number: 3,
    title: `Kostenlos bis zum ${FOUNDER_FREE_UNTIL_LABEL}`,
    text: 'Die laufende Saison zu Ende und die komplette Saison 27/28 obendrauf. Danach entscheidest du, ob du bleibst – ohne dass vorher etwas abgebucht wird.',
  },
] as const;

export interface ComparisonRow {
  aspect: string;
  paper: string;
  excel: string;
  statix: string;
}

/**
 * The honest comparison against what coaches actually use today. Qualitative on
 * purpose: no invented time savings, no invented percentages.
 */
export const ALTERNATIVE_COMPARISON: ComparisonRow[] = [
  {
    aspect: 'Kosten',
    paper: 'Ein Block, ein Stift',
    excel: 'Meist schon vorhanden',
    statix: '0 € oder 79 € je Saison',
  },
  {
    aspect: 'Während des Spiels',
    paper: 'Striche machen, während du coachst',
    excel: 'Am Tablet in der Halle praktisch unbedienbar',
    statix: 'Ein Tap pro Aktion, auch offline',
  },
  {
    aspect: 'Auswertung',
    paper: 'Abends abtippen – oder nie',
    excel: 'Formeln pflegen, Fehler suchen',
    statix: 'Fertig, sobald die Sirene geht',
  },
  {
    aspect: 'Wurfbilder',
    paper: 'Von Hand auf einen Feldausdruck',
    excel: 'Nicht vorgesehen',
    statix: 'Automatisch aus jedem erfassten Wurf',
  },
  {
    aspect: 'Verlauf über die Saison',
    paper: 'Ordner im Keller',
    excel: 'Eine Datei pro Spiel, kein Trend',
    statix: 'Entwicklung pro Spieler über alle Spiele',
  },
  {
    aspect: 'Team einbinden',
    paper: 'Gar nicht',
    excel: 'Datei per Mail, Version unklar',
    statix: 'Teilen-Link, PDF, Live-Ticker',
  },
];

export const PRICING_FAQS: BoardFaqItem[] = [
  {
    question: 'Was kostet Statix?',
    answer: `Bis zum ${FOUNDER_DEADLINE_LABEL} nichts. Ab dem ${LAUNCH_DATE_LABEL} gibt es drei Stufen: Basis bleibt dauerhaft kostenlos, Trainer kostet 79 € je Saison oder 9,90 € im Monat, Pro 159 € je Saison oder 19,90 € im Monat. Alle Preise sind Endpreise; als Kleinunternehmer nach § 19 UStG weise ich keine Umsatzsteuer aus.`,
  },
  {
    question: 'Ich nutze Statix schon – muss ich ab Januar zahlen?',
    answer: `Nein. Jedes Konto, das vor dem ${LAUNCH_DATE_LABEL} angelegt wurde, behält den Trainer-Plan kostenlos bis zum ${FOUNDER_FREE_UNTIL_LABEL} – also die laufende Saison zu Ende und die komplette Saison 27/28 dazu. Du musst dafür nichts tun, nichts anklicken und keine Zahlungsdaten hinterlegen. Wer mitten in der Saison in eine Paywall läuft, verliert sein Spielprotokoll, und das wäre der schlechteste denkbare Start.`,
  },
  {
    question: 'Warum wird Statix überhaupt kostenpflichtig?',
    answer: `Statix ist als Hobbyprojekt für die eigene Mannschaft entstanden und wird inzwischen von ${COACH_COUNT_LABEL} benutzt. Server, Datenbank, KI-Analysen und Videospeicher kosten mit jeder Mannschaft mehr, und diese Rechnung kann ich auf Dauer nicht privat tragen. Die Alternative wäre, das Projekt einzustellen – die schlechtere Lösung für alle Beteiligten.`,
  },
  {
    question: 'Was bleibt kostenlos?',
    answer:
      'Die ganze Live-Erfassung, der komplette Terminplan mit Zu- und Absagen, Abwesenheiten und Kalenderabo, die Kaderkarten mit HPI, Tiers und Stickern, der öffentliche Live-Ticker und die Auswertung deiner Spiele. Begrenzt sind in der Basis eine Mannschaft, 20 Spieler:innen, 10 gespeicherte Spiele, die letzten fünf Spiele in voller Tiefe sowie vier KI-Analysen und vier geteilte Berichte im Monat.',
  },
  {
    question: 'Monatlich oder jährlich – was ist der Unterschied?',
    answer:
      'Nur der Preis und der Rhythmus. Jährlich heißt bei uns eine Saison, vom 1. Juli bis zum 30. Juni, und kostet rund ein Drittel weniger: 79 € statt 118,80 € bei Trainer, 159 € statt 238,80 € bei Pro. Monatlich ist teurer, dafür jederzeit kündbar. Wer im Januar einsteigt, zahlt nur die Rumpfsaison bis zum 30. Juni: 39 € statt 79 € bei Trainer, 79 € statt 159 € bei Pro.',
  },
  {
    question: 'Verliere ich Daten, wenn ich in der Basis bleibe?',
    answer:
      'Nein. Gelöscht wird nichts. In der Basis siehst du die fünf zuletzt erfassten Spiele in voller Tiefe; ältere bleiben in der Liste und werden unscharf angezeigt, mit einem Hinweis, was sie wieder freischaltet. Und die Zehn-Spiele-Grenze wird beim Anlegen eines Spiels geprüft, nie während eines laufenden: Eine begonnene Erfassung läuft immer zu Ende und wird immer gespeichert.',
  },
  {
    question: 'Was kostet Statix für einen Verein?',
    answer:
      'Ein einzelner Trainer bleibt bei den Stufen oben. Wer den Verein als Ganzes einbinden will – alle Mannschaften unter einem Dach, vereinsweite Auswertung, Spielerlaufbahnen über die Jugenden hinweg –, bekommt den Vereinsbereich, und der wird für den Verein eingerichtet. Als Anhaltspunkt liegt das bei rund 390 € je Saison für fünf Mannschaften, gestaffelt nach Größe. Einen Listenpreis gibt es bewusst nicht: Was ein Verein mit zwölf Jugendmannschaften braucht, ist etwas anderes als bei zweien.',
  },
  {
    question: 'Wie kann ich kündigen?',
    answer:
      'Jederzeit im Konto, mit einem Klick – ein Kündigungsbutton gehört ab dem ersten Tag der Bezahlung dazu. Ein monatliches Abo endet zum nächsten Monat, ein Saisonabo zum 30. Juni. Danach läuft dein Konto in der Basis weiter; deine Daten bleiben, wo sie sind.',
  },
];
