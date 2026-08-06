import type { BoardFaqItem } from '@/components/custom-ui/board-faq';
import type { ArrowKind, MagnetKind } from '../interfaces';

export const TAKTIKBOARD_PAGE_PATH = '/handball-taktikboard';
export const TAKTIKBOARD_EMBED_PATH = '/handball-taktikboard/embed';

/**
 * Label used for the footer's Produkt column. It lives here rather than in
 * `messages/*.json` for the reason the wurfquote-rechner established: those two
 * files already ship 155 KB to every visitor, and one tool name does not
 * justify growing them. "Taktikboard" reads the same in both site languages.
 */
export const TAKTIKBOARD_NAV_LABEL = 'Taktikboard';

/**
 * How much fits on one board. These are capacities, not a paywall: a handball
 * squad is fourteen players and this holds more than two full squads. They
 * exist so the share link stays short enough to survive a chat app.
 */
export const BOARD_CAPACITY = {
  magnets: 32,
  arrows: 20,
  labels: 12,
} as const;

export const LABEL_MAX_CHARS = 24;

/** The mark burned into every exported PNG. Stated openly on the page. */
export const EXPORT_WATERMARK = 'statix-app.de';

export const EXPORT_FILE_NAME = 'handball-taktikboard';

export interface MagnetKindOption {
  kind: MagnetKind;
  label: string;
  /** Screen-reader wording for the add button. */
  action: string;
}

export const MAGNET_KIND_OPTIONS: MagnetKindOption[] = [
  { kind: 'home', label: 'Eigene', action: 'Eigenen Spieler aufs Feld setzen' },
  { kind: 'away', label: 'Gegner', action: 'Gegenspieler aufs Feld setzen' },
  { kind: 'keeper', label: 'Torwart', action: 'Torwart aufs Feld setzen' },
  { kind: 'ball', label: 'Ball', action: 'Ball aufs Feld legen' },
];

export interface ArrowKindOption {
  kind: ArrowKind;
  label: string;
  hint: string;
}

/** The three lines a handball coach actually draws. */
export const ARROW_KIND_OPTIONS: ArrowKindOption[] = [
  { kind: 'laufweg', label: 'Laufweg', hint: 'Durchgezogene Linie – ein Spieler bewegt sich.' },
  { kind: 'pass', label: 'Pass', hint: 'Gestrichelte Linie – der Ball wechselt den Besitzer.' },
  { kind: 'wurf', label: 'Wurf', hint: 'Dicke Linie mit voller Spitze – der Abschluss.' },
];

export interface CourtFact {
  element: string;
  measure: string;
  /** What that measurement looks like on this board. */
  onBoard: string;
}

/**
 * Straight out of the Ratgeber article `handball-spielfeld-masse`. Same
 * numbers, same wording for the elements — a coach who checks both pages must
 * not find two versions of the court.
 */
export const COURT_FACTS: CourtFact[] = [
  {
    element: 'Länge',
    measure: '40 Meter',
    onBoard: 'Im Ganzfeld komplett, im Halbfeld die vorderen 15 Meter.',
  },
  {
    element: 'Breite',
    measure: '20 Meter',
    onBoard: 'Immer vollständig, in beiden Ansichten.',
  },
  {
    element: 'Torraumlinie (6-Meter-Linie)',
    measure: '6 Meter vom Tor',
    onBoard: 'Zwei Viertelkreise an den Pfosten plus gerades Stück – kein Halbkreis.',
  },
  {
    element: 'Freiwurflinie (gestrichelt)',
    measure: '9 Meter vom Tor',
    onBoard: 'Gestrichelt und exakt an der Seitenlinie abgeschnitten.',
  },
  {
    element: 'Siebenmeterlinie',
    measure: '7 Meter vor Tormitte',
    onBoard: 'Ein Meter lange Marke in der Feldmitte.',
  },
  {
    element: 'Torwart-Grenzlinie',
    measure: '4 Meter vom Tor',
    onBoard: 'Der kurze Strich zwischen Tor und Siebenmeterpunkt.',
  },
  {
    element: 'Tor (Breite × Höhe)',
    measure: '3 Meter × 2 Meter',
    onBoard: 'Von oben ist nur die Breite sichtbar – als Kasten hinter der Torlinie.',
  },
];

export interface BoardStep {
  title: string;
  text: string;
}

export const BOARD_STEPS: BoardStep[] = [
  {
    title: 'Aufstellung wählen',
    text: 'Oben im Board liegt schon eine 6:0 gegen einen 3:3-Angriff. Über die Auswahl holst du dir stattdessen 5:1, 3:2:1, den 4:2-Angriff oder ein leeres Feld.',
  },
  {
    title: 'Magnete ziehen',
    text: 'Jeden Magneten mit dem Finger oder der Maus an seinen Platz schieben. Orange ist deine Mannschaft, blau der Gegner, türkis der Torwart. Die Rückennummer änderst du, sobald ein Magnet ausgewählt ist.',
  },
  {
    title: 'Wege einzeichnen',
    text: 'Pfeil hinzufügen, Anfang und Ende ziehen, mit dem mittleren Griff die Kurve biegen. Kurze Notizen legst du frei auf dem Feld ab.',
  },
  {
    title: 'Teilen oder speichern',
    text: 'Der Link enthält das komplette Board – wer ihn öffnet, sieht genau deine Aufstellung und kann sie weiterschieben. Alternativ lädst du ein PNG herunter, etwa für die Mannschafts-Gruppe.',
  },
];

export interface FormationNote {
  /** Matches the id in `data/formations.ts`. */
  id: string;
  title: string;
  text: string;
  articleHref: string;
  articleLabel: string;
}

/**
 * What each ready-made setup is for. The wording follows the matching Ratgeber
 * articles; each note links to the long version rather than repeating it here.
 */
export const FORMATION_NOTES: FormationNote[] = [
  {
    id: '6-0',
    title: '6:0 gegen 3:3',
    text: 'Die Standardsituation im Amateur- und Jugendbereich: sechs Abwehrspieler auf einer Linie am Sechsmeter, gegenüber drei Rückraumspieler, zwei Außen und ein Kreisläufer. Wenn du eine Sperre oder ein Kreuzen besprechen willst, fängst du hier an.',
    articleHref: '/ratgeber/handball-6-0-abwehr',
    articleLabel: 'Die 6:0-Abwehr im Handball',
  },
  {
    id: '5-1',
    title: '5:1 mit dem Vorgezogenen',
    text: 'Fünferkette am Kreis, ein Spieler auf Höhe der Freiwurflinie. Auf dem Board sieht man sofort, welchen Raum der Vorgezogene aufmacht – und wo der Angriff ihn umspielen kann.',
    articleHref: '/ratgeber/handball-5-1-abwehr',
    articleLabel: 'Die 5:1-Abwehr im Handball',
  },
  {
    id: '3-2-1',
    title: '3:2:1 in drei Reihen',
    text: 'Drei Spieler am Sechsmeter, zwei davor, einer vorgezogen am Neunmeter. Die Staffelung ist der ganze Punkt dieses Systems, und Staffelung lässt sich schlecht erzählen, aber gut zeigen.',
    articleHref: '/ratgeber/handball-3-2-1-abwehr',
    articleLabel: 'Die 3:2:1-Abwehr im Handball',
  },
  {
    id: '4-2',
    title: '4:2 mit zwei Kreisläufern',
    text: 'Die Außen rücken ein, zwei Kreisläufer arbeiten an der Abwehr. Besonders gegen offensive Abwehrformationen ein Mittel – und auf dem Board die schnellste Art zu zeigen, wer wen bindet.',
    articleHref: '/ratgeber/handball-angriffssysteme-einsteiger',
    articleLabel: 'Angriffssysteme im Handball einfach erklärt',
  },
  {
    id: 'tempogegenstoss',
    title: 'Tempogegenstoß über das ganze Feld',
    text: 'Die einzige Aufstellung, für die das Halbfeld nicht reicht. Erste Welle über die Außen, zweite Welle hinterher, der Gegner im Rückzug – auf 40 mal 20 Metern.',
    articleHref: '/ratgeber/handball-tempogegenstoss',
    articleLabel: 'Tempogegenstoß im Handball trainieren',
  },
];

/**
 * Snippet for club sites. The height is measured, not guessed: at 760 px the
 * board and its controls stack to about 1 950 px. An iframe cannot size itself
 * to its content, so the number has to cover the tallest case.
 */
export const EMBED_SNIPPET = `<iframe
  src="https://www.statix-app.de/handball-taktikboard/embed"
  title="Handball-Taktikboard von Statix"
  width="100%"
  height="1960"
  loading="lazy"
  style="border:0;max-width:760px"
></iframe>`;

/** The wide variant, where board and controls sit side by side. */
export const EMBED_SNIPPET_WIDE_HINT =
  'Habt ihr auf eurer Seite mehr Platz? Dann setzt max-width auf 1100px und height auf 1450 – ab 1024 Pixel Breite liegen Board und Bedienung nebeneinander und der Rahmen wird deutlich flacher.';

export const TAKTIKBOARD_FAQS: BoardFaqItem[] = [
  {
    question: 'Wie erstelle ich eine Handball-Aufstellung online?',
    answer:
      'Du wählst oben im Taktikboard eine fertige Aufstellung – zum Beispiel 6:0, 5:1 oder 3:2:1 – und ziehst die Magnete anschließend auf ihre Positionen. Laufwege, Pässe und Würfe zeichnest du als Pfeile ein, kurze Notizen legst du daneben. Danach lädst du das Bild als PNG herunter oder teilst den Link.',
  },
  {
    question: 'Ist das Taktikboard kostenlos?',
    answer:
      'Ja, vollständig. Es gibt keine Anmeldung, keinen Account, kein Zeitlimit und keine Begrenzung, wie viele Boards du speicherst oder teilst. Auch der PNG-Download und der Teilen-Link funktionieren ohne E-Mail-Adresse.',
  },
  {
    question: 'Werden meine Aufstellungen gespeichert?',
    answer:
      'Nein. Das Board rechnet komplett in deinem Browser. Wenn du auf „Link kopieren“ tippst, steckt die ganze Aufstellung im Link selbst – hinter dem Rautezeichen. Dieser Teil einer Adresse wird von Browsern nie an einen Server geschickt. Es gibt also keine Datenbank, in der deine Taktik liegt.',
  },
  {
    question: 'Stimmen die Maße des Spielfelds?',
    answer:
      'Ja. Das Feld ist maßstabsgetreu gezeichnet: 40 mal 20 Meter, die Torraumlinie 6 Meter vom Tor, die gestrichelte Freiwurflinie 9 Meter, dazu Siebenmeter- und Torwart-Grenzlinie. Der 6-Meter-Kreis ist wie in der Halle aus zwei Viertelkreisen an den Pfosten und einem geraden Stück gebaut, nicht als Halbkreis.',
  },
  {
    question: 'Funktioniert das Taktikboard auf dem Tablet in der Halle?',
    answer:
      'Dafür ist es gebaut. Alle Magnete und Griffe sind mindestens 44 Pixel groß, es gibt nichts, was nur mit einer Maus erreichbar wäre, und das Board läuft im Hoch- wie im Querformat. Der Browser ist alles, was du brauchst.',
  },
  {
    question: 'Warum steht auf dem exportierten Bild „statix-app.de“?',
    answer:
      'Das ist die kleine Zeile in der Ecke des PNGs – die einzige Gegenleistung für ein Werkzeug ohne Anmeldung. Sie lässt sich nicht gegen Bezahlung entfernen, weil es dafür keine Bezahlversion gibt. Die Anzahl der Exporte ist nicht begrenzt.',
  },
  {
    question: 'Darf ich das Taktikboard auf unserer Vereinsseite einbinden?',
    answer:
      'Ja, gerne. Kopier dir den iframe-Code von dieser Seite auf eure Homepage. Das Board läuft dann in eurem Layout, mit demselben Funktionsumfang, kostenlos und ohne Anmeldung. Unter dem Board steht ein Hinweis mit Link auf diese Seite.',
  },
];
