import type { BoardFaqItem } from '@/components/custom-ui/board-faq';

export const FREE_PAGE_PATH = '/handball-statistik-app-kostenlos';

export interface FreeScopeRow {
  feature: string;
  /** The real cap, or 'ohne Grenze' when there genuinely is none. */
  limit: string;
}

/**
 * The honest scope table: what a free account gets **until 31.12.2026**. Every
 * cap here is the value the app enforces today.
 *
 * From 1.1.2027 the free tier becomes "Basis" and its caps tighten (one squad,
 * 20 players, 10 games); those numbers live in
 * `features/preise/data/pricing-content.ts` and are stated on `/preise`. Two
 * dates, two tables — do not merge them, and when a limit changes in the app,
 * change it in whichever of the two actually moved.
 */
export const FREE_SCOPE: FreeScopeRow[] = [
  { feature: 'Spiele live erfassen und auswerten', limit: '200 Spiele pro Team' },
  { feature: 'Kader pflegen', limit: '25 Spieler pro Team' },
  { feature: 'Mannschaften auf deinem Konto', limit: '3 Teams' },
  { feature: 'Trainerteam einladen', limit: '5 Trainer pro Team, offene Einladungen mitgezählt' },
  { feature: 'Wurfquoten, Spielerwerte, Wurfbilder', limit: 'ohne Grenze' },
  { feature: 'Turniere mit Tabelle und Spielplan', limit: '10 Turniere pro Team' },
  { feature: 'Gegner-Bilanz (Head-to-Head)', limit: '60 Gegner pro Team' },
  { feature: 'Spieler-Umfragen', limit: '20 Umfragen pro Team' },
  { feature: 'Öffentlicher Live-Ticker', limit: 'ohne Grenze' },
  { feature: 'Offline erfassen und später synchronisieren', limit: 'ohne Grenze' },
  { feature: 'Kader als Kartenalbum mit Spielerkarten', limit: 'ohne Grenze' },
  {
    feature: 'KI-Analysen (Spiel, Team, Spieler, Turnier)',
    limit: '3 in 24 Stunden, 25 in 30 Tagen, 1 gleichzeitig',
  },
  { feature: 'Berichte als PDF teilen', limit: '3 in 24 Stunden' },
  { feature: 'Live-Demo ohne Account', limit: 'ohne Grenze' },
];

export interface FreeAlternative {
  name: string;
  cost: string;
  good: string;
  bad: string;
}

/** What a coach realistically weighs against a free app. */
export const FREE_ALTERNATIVES: FreeAlternative[] = [
  {
    name: 'Zettel und Stift',
    cost: 'Kostet nichts',
    good: 'Fällt nie aus, braucht keinen Akku, jeder kann es sofort.',
    bad: 'Wer coacht, schreibt nicht mit. Und was mitgeschrieben ist, rechnet niemand aus – spätestens im Dezember liegt der Stapel unausgewertet in der Sporttasche.',
  },
  {
    name: 'Excel-Vorlage',
    cost: 'Kostet nichts',
    good: 'Rechnet Wurfquoten selbst aus, lässt sich anpassen, gehört dir.',
    bad: 'In der Halle unbedienbar, also tippst du abends ab. Kein Wurfbild, kein Verlauf pro Spieler, und der Co-Trainer hat immer die falsche Version.',
  },
  {
    name: 'Statix',
    cost: 'Basis dauerhaft 0 €',
    good: 'Ein Tap pro Aktion, Auswertung fertig beim Schlusspfiff, offline nutzbar, teilbar per Link.',
    bad: 'Du brauchst ein Handy oder Tablet und ein Konto. Für die KI-Analysen und geteilte Berichte gelten Tageskontingente.',
  },
];

export const FREE_FAQS: BoardFaqItem[] = [
  {
    question: 'Gibt es eine wirklich kostenlose Handball-Statistik-App?',
    answer:
      'Ja. Bis zum 31. Dezember 2026 ist Statix mit vollem Funktionsumfang kostenlos nutzbar, und danach bleibt die Basis-Stufe dauerhaft kostenlos: Spiele live erfassen, auswerten, Termine planen, Kaderkarten, öffentlicher Live-Ticker. Es gibt keinen Bezahlvorgang in der App und keine Kreditkartenabfrage.',
  },
  {
    question: 'Muss ich für die kostenlose Nutzung Zahlungsdaten hinterlegen?',
    answer:
      'Nein. Es gibt in der App keinen Bezahlvorgang und kein Feld für Karten- oder Bankdaten. Für ein eigenes Team brauchst du nur eine E-Mail-Adresse, für die Live-Demo nicht einmal die.',
  },
  {
    question: 'Was kann ich ohne Account ausprobieren?',
    answer:
      'Die Live-Demo. Sie ist eine voll gefüllte Statix-Version mit echten Spieldaten – Live-Statistiken, Wurfbilder und KI-Analyse direkt im Browser, ohne Anmeldung und ohne Installation.',
  },
  {
    question: 'Welche Grenzen hat der kostenlose Zugang?',
    answer:
      'Bis zum 31. Dezember 2026: pro Team 25 Spieler, 200 Spiele, 10 Turniere, 60 Gegner, 20 Umfragen und 5 Trainer inklusive offener Einladungen; pro Konto 3 Teams. Dazu 3 KI-Analysen in 24 Stunden und 25 in 30 Tagen (eine gleichzeitig) sowie 3 geteilte Berichte in 24 Stunden. Ab dem 1. Januar 2027 gelten für neue Konten die Grenzen der Basis-Stufe: eine Mannschaft, 20 Spieler:innen, 10 Spiele, die letzten fünf davon in voller Tiefe, 3 Turniere sowie 4 KI-Analysen und 4 geteilte Berichte im Monat.',
  },
  {
    question: 'Bleibt Statix kostenlos?',
    answer:
      'Ja. Ab dem 1. Januar 2027 heißt der kostenlose Zugang Basis und bleibt dauerhaft 0 €: die ganze Live-Erfassung, der komplette Terminplan, die Kaderkarten und der öffentliche Live-Ticker, für eine Mannschaft. Bezahlt wird ab dann, was echtes Geld kostet – KI-Analysen in größerer Zahl, Videoanalyse, geteilte Berichte und mehrere Mannschaften. Wer sich vor dem 1. Januar 2027 registriert, behält den Trainer-Plan bis zum Ende der Saison 26/27 am 30. Juni 2027 kostenlos.',
  },
  {
    question: 'Ist eine kostenlose App für den Verein überhaupt sinnvoll?',
    answer:
      'Für den Einstieg schon. Jeder Trainer kann sofort loslegen, ohne dass jemand einen Beschluss fasst oder Geld freigibt. Wenn mehrere Mannschaften nach demselben Schema erfassen sollen, lohnt danach der Blick auf die Vereinsseite.',
  },
];
