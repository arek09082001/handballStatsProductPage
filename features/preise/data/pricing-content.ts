import type { BoardFaqItem } from '@/components/custom-ui/board-faq';

export const PRICING_PAGE_PATH = '/preise';

/**
 * The planned subscription price. Statix is currently free in full; there is no
 * checkout, no subscription tab and nothing to buy. This number is therefore
 * announced as a plan, never as an active offer — and it must NOT appear in an
 * `Offer` node until it is actually purchasable (see `app/preise/page.tsx`).
 */
export const PLANNED_MONTHLY_PRICE = '3,99 €';

/** What a coach gets today, at no cost. Every entry is a shipping feature. */
export const FREE_INCLUDED = [
  'Spiele live per Tap erfassen – Tore, Würfe, Paraden, Strafen, Wechsel',
  'Wurfquoten, Spieler- und Mannschaftsstatistiken, automatisch berechnet',
  'Wurfbilder und Heatmaps über Spiel und Saison',
  'KI-Analysen für Spiel, Team, einzelne Spieler und Turniere',
  'Turniermodus mit automatischer Tabelle und Spieltagskader',
  'Öffentlicher Live-Ticker per Link und QR-Code',
  'Trainer-Zusammenarbeit, Spieler-Umfragen und Gegner-Bilanz',
  'Kader als Kartenalbum mit Spielerkarten und Stickern',
  'Offline in der Halle erfassen, PDF-Export und Teilen-Links',
] as const;

export interface LimitRow {
  label: string;
  value: string;
}

export interface LimitGroup {
  title: string;
  note: string;
  rows: LimitRow[];
}

/**
 * The real limits that apply inside the app today, exactly as the app reports
 * them. Numbers here are product truth — never round, pad or invent them.
 */
export const FREE_LIMITS: LimitGroup[] = [
  {
    title: 'KI-Analysen',
    note: 'Rollierende Zeitfenster: Eine Analyse zählt genau 24 Stunden bzw. 30 Tage nach ihrem Start nicht mehr mit – es gibt keinen festen Reset um Mitternacht. Einen Bericht zu löschen gibt das Kontingent nicht zurück.',
    rows: [
      { label: 'Letzte 24 Stunden', value: '10 Analysen' },
      { label: 'Letzte 30 Tage', value: '25 Analysen' },
      { label: 'Gleichzeitig laufend', value: '1 Analyse' },
    ],
  },
  {
    title: 'Geteilte Berichte',
    note: 'Jedes Teilen erzeugt ein PDF und kann eine E-Mail verschicken. Deshalb ist die Anzahl in einem rollierenden 24-Stunden-Fenster begrenzt.',
    rows: [{ label: 'Letzte 24 Stunden', value: '3 geteilte Berichte' }],
  },
  {
    title: 'Pro Team',
    note: 'Gesamtzahlen, keine Zeitfenster – gelöschte Einträge geben den Platz wieder frei. Zu den Trainern zählen auch offene Einladungen.',
    rows: [
      { label: 'Spieler', value: '25' },
      { label: 'Spiele', value: '200' },
      { label: 'Turniere', value: '10' },
      { label: 'Gegner', value: '60' },
      { label: 'Umfragen', value: '20' },
      { label: 'Trainer & offene Einladungen', value: '5' },
    ],
  },
  {
    title: 'Pro Konto',
    note: 'Ein Konto trägt mehrere Mannschaften – Männer, Frauen, Jugend – jede mit eigenem Kader und eigener Saison.',
    rows: [{ label: 'Teams auf deinem Konto', value: '3' }],
  },
];

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
    statix: 'Aktuell 0 €',
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
    answer:
      'Aktuell nichts. Statix ist mit dem vollen Funktionsumfang kostenlos nutzbar – es gibt derzeit keinen Bezahlvorgang und kein Abo in der App. Geplant ist später ein Abo für 3,99 € im Monat; einzelne Funktionen wandern dann in dieses Abo. Was genau im kostenlosen Zugang bleibt, gebe ich rechtzeitig vor dem Start bekannt.',
  },
  {
    question: 'Brauche ich eine Kreditkarte, um Statix zu testen?',
    answer:
      'Nein. Es gibt keinen Bezahlvorgang, also auch keine Zahlungsdaten. Die Live-Demo läuft sogar ganz ohne Account im Browser; für ein eigenes Team legst du nur ein Konto mit E-Mail-Adresse an.',
  },
  {
    question: 'Was kostet Statix für einen Verein?',
    answer:
      'Für einen einzelnen Trainer heute nichts: Er legt sein Konto an und führt bis zu drei Mannschaften, pro Team kommen fünf Trainer inklusive offener Einladungen dazu. Wer den Verein als Ganzes einbinden will – alle Mannschaften unter einem Dach, vereinsweite Auswertung, Spielerlaufbahnen über die Jugenden hinweg –, bekommt den Vereinsbereich, und der wird für den Verein eingerichtet. Dafür gibt es bewusst keinen Listenpreis: Was ein Verein mit zwölf Jugendmannschaften braucht, ist etwas anderes als bei zwei. Kurze Anfrage über die Seite für Vereine genügt, dann bekommt ihr ein passendes Angebot.',
  },
  {
    question: 'Gibt es versteckte Kosten oder eine Testphase, die ausläuft?',
    answer:
      'Nein. Es gibt keine Testphase mit Ablaufdatum und keine Karte, die irgendwann belastet wird – schlicht deshalb, weil es aktuell keinen Bezahlvorgang gibt. Wenn sich das ändert, erfährst du es vorher, nicht per Rechnung.',
  },
  {
    question: 'Welche Grenzen hat der kostenlose Zugang?',
    answer:
      'In der App gelten echte Kontingente: 10 KI-Analysen in 24 Stunden und 25 in 30 Tagen (rollierend, eine gleichzeitig), 3 geteilte Berichte in 24 Stunden sowie pro Team 25 Spieler, 200 Spiele, 10 Turniere, 60 Gegner, 20 Umfragen und 5 Trainer inklusive offener Einladungen. Pro Konto führst du bis zu 3 Teams.',
  },
  {
    question: 'Wie erfahre ich, wenn die Preise feststehen?',
    answer:
      'Über den Newsletter. Wer dort eingetragen ist, erfährt die Konditionen für Teams und Vereine, bevor sie hier auf der Seite stehen.',
  },
];
