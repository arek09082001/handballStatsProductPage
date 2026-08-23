import type { BoardFaqItem } from '@/components/custom-ui/board-faq';

/** Route of the Handball-Statistiken pillar page. */
export const STATS_PAGE_PATH = '/handball-statistiken';

export interface StatDefinition {
  /** The metric as a coach names it – also the `DefinedTerm` in the schema. */
  term: string;
  /** One sentence: what it counts, and what it is good for. */
  definition: string;
}

export interface StatGroup {
  /** Group name, used as the card heading. */
  name: string;
  /** What the group as a whole answers. */
  intro: string;
  stats: StatDefinition[];
}

/**
 * The catalogue of handball statistics, grouped the way a coach reads a game:
 * attack first, then the goal that has to be defended, then rhythm, discipline
 * and the season. Every term here is one Statix records – nothing aspirational.
 */
export const STAT_GROUPS: StatGroup[] = [
  {
    name: 'Angriff',
    intro:
      'Die Zahlen, die beantworten, was aus euren Ballbesitzen wird – und warum ein Angriff ohne Abschluss endet.',
    stats: [
      {
        term: 'Tore',
        definition:
          'Erfolgreiche Abschlüsse je Spieler und Mannschaft, die Basis jeder weiteren Rechnung.',
      },
      {
        term: 'Würfe',
        definition:
          'Alle echten Torabschlüsse – Tor, Parade, Fehlwurf und Pfostentreffer zählen mit, ein technischer Fehler nicht.',
      },
      {
        term: 'Wurfquote',
        definition:
          'Anteil der Würfe, die im Tor landen. Die erste Zahl, auf die Trainer schauen, und die am häufigsten falsch gelesene.',
      },
      {
        term: 'Angriffe (Ballbesitze)',
        definition:
          'Abschlüsse plus technische Fehler plus Siebenmeter – die Bezugsgröße, ohne die keine Quote vergleichbar ist.',
      },
      {
        term: 'Angriffseffektivität',
        definition:
          'Tore je Angriff. Anders als die Wurfquote bestraft sie verlorene Bälle mit.',
      },
      {
        term: 'Technische Fehler & Fehlerquote',
        definition:
          'Schritt-, Prell- und Passfehler pro Angriff – die Zahl, die zeigt, wie viele Angriffe ihr verschenkt.',
      },
      {
        term: 'Siebenmeter-Quote',
        definition:
          'Getroffene je ausgeführtem Siebenmeter, getrennt von der Wurfquote geführt.',
      },
      {
        term: 'Wurfpositionen & Wurfbild',
        definition:
          'Wo geworfen wurde und was dabei herauskam – als Karte statt als Liste, inklusive Heatmap.',
      },
    ],
  },
  {
    name: 'Abwehr & Torwart',
    intro:
      'Was am eigenen Tor passiert – aufgeschlüsselt genug, um Abwehr und Torwart nicht zu verwechseln.',
    stats: [
      {
        term: 'Paraden',
        definition: 'Gehaltene Bälle, die Grundlage jeder Torwartauswertung.',
      },
      {
        term: 'Paradenquote',
        definition:
          'Paraden im Verhältnis zu allen Würfen aufs Tor. Vorbeiwürfe zählen nicht mit.',
      },
      {
        term: 'Paradenquote nach Wurfzone',
        definition:
          'Dieselbe Quote je Zone – erst sie trennt die Torwartleistung von der Abwehrleistung.',
      },
      {
        term: 'Gegentore',
        definition:
          'Gegentore insgesamt, nach Spielabschnitt und nach Spielsituation.',
      },
      {
        term: 'Blocks & Ballgewinne',
        definition:
          'Geblockte Würfe und eroberte Bälle – die Abwehraktionen, die kein Spielbericht ausweist.',
      },
      {
        term: 'Tordifferenz',
        definition:
          'Tore minus Gegentore, über das Spiel und über die Saison – die einfachste Fortschrittskurve.',
      },
    ],
  },
  {
    name: 'Tempo & Spielrhythmus',
    intro:
      'Die Kennzahlen, die erklären, warum zwei Spiele mit identischem Endstand völlig verschieden waren.',
    stats: [
      {
        term: 'Tempogegenstöße',
        definition:
          'Abschlüsse aus der ersten und zweiten Welle, getrennt vom Positionsangriff gezählt.',
      },
      {
        term: 'Tempoanteil an den Toren',
        definition:
          'Wie viel eurer Ausbeute aus dem Tempospiel kommt – und wie viel der Positionsangriff wirklich trägt.',
      },
      {
        term: 'Angriffe je Spiel',
        definition:
          'Das Tempo der Partie. Über 60 Angriffe heißt offenes Spiel, unter 48 ein zähes.',
      },
      {
        term: 'Verlauf je Spielabschnitt',
        definition:
          'Tore und Gegentore in Fünf- oder Zehn-Minuten-Fenstern, damit Einbrüche sichtbar werden.',
      },
    ],
  },
  {
    name: 'Disziplin & Sondersituationen',
    intro:
      'Die Zahlen, die im Spielbericht stehen, aber selten ausgewertet werden.',
    stats: [
      {
        term: 'Zeitstrafen',
        definition:
          'Zwei-Minuten-Strafen je Spieler und Mannschaft, mit Zeitpunkt im Spiel.',
      },
      {
        term: 'Verwarnungen und Disqualifikationen',
        definition:
          'Gelbe Karten, Rot und Blau – die Eskalationsstufen, die eine Rotation erzwingen.',
      },
      {
        term: 'Über- und Unterzahlbilanz',
        definition:
          'Tore und Gegentore während einer Hinausstellung – oft die entscheidenden vier Minuten einer Partie.',
      },
      {
        term: 'Verursachte Siebenmeter',
        definition: 'Wer eure Strafwürfe herausholt und wer sie verschuldet.',
      },
    ],
  },
  {
    name: 'Saison & Entwicklung',
    intro: 'Alles, was erst über mehrere Spiele hinweg zur Aussage wird.',
    stats: [
      {
        term: 'Quotenverlauf je Spieler',
        definition:
          'Dieselbe Kennzahl über acht, zwölf, zwanzig Spiele – der einzige faire Vergleich ist der mit dem eigenen Vorwert.',
      },
      {
        term: 'Spielanteile und Einsätze',
        definition:
          'Wer wie viel gespielt hat, damit Absolutzahlen nicht die Einsatzzeit abbilden.',
      },
      {
        term: 'Torschützenverteilung',
        definition:
          'Auf wie viele Schultern sich eure Tore verteilen – ein Frühwarnwert für Ausrechenbarkeit.',
      },
      {
        term: 'Gegner-Bilanz',
        definition:
          'Head-to-Head gegen jeden Gegner: Siege, Unentschieden, Niederlagen und Tore.',
      },
      {
        term: 'Trainingsbeteiligung',
        definition:
          'Zu- und Absagen je Spieler – die Zahl, die die Spielzeitdiskussion versachlicht.',
      },
    ],
  },
];

export interface StatFormula {
  metric: string;
  formula: string;
  benchmark: string;
}

/**
 * The formulas a coach actually needs, with the reference ranges the Ratgeber
 * articles use. The ranges are experience values from the amateur game, not a
 * measured data set – keep them identical to `wurfquote-berechnen`,
 * `handball-torwart-statistik` and `handball-ballbesitz-tempo` so the site
 * never quotes two different numbers for the same metric.
 */
export const STAT_FORMULAS: StatFormula[] = [
  {
    metric: 'Wurfquote',
    formula: 'Tore ÷ Würfe × 100',
    benchmark: 'Team über 60 %, Kreis 65–75 %, Rückraum 45–55 %',
  },
  {
    metric: 'Angriffe (Ballbesitze)',
    formula: 'Abschlüsse + technische Fehler + Siebenmeter',
    benchmark: '46–60 je Mannschaft und Spiel',
  },
  {
    metric: 'Angriffseffektivität',
    formula: 'Tore ÷ Angriffe × 100',
    benchmark: '48–58 %',
  },
  {
    metric: 'Fehlerquote',
    formula: 'Technische Fehler ÷ Angriffe × 100',
    benchmark: '12–18 %',
  },
  {
    metric: 'Paradenquote',
    formula: 'Paraden ÷ (Paraden + Gegentore) × 100',
    benchmark: '30–40 % über alle Zonen',
  },
  {
    metric: 'Siebenmeter-Quote',
    formula: 'Getroffene ÷ ausgeführte Siebenmeter × 100',
    benchmark: '75–85 %',
  },
  {
    metric: 'Tempoanteil',
    formula: 'Tore aus Tempogegenstoß ÷ Tore × 100',
    benchmark: '15–25 %',
  },
  {
    metric: 'Tordifferenz',
    formula: 'Tore − Gegentore',
    benchmark: 'als Verlauf über die Saison lesen',
  },
];

export interface StatWay {
  name: string;
  effort: string;
  good: string;
  bad: string;
  /** Internal route this way links to, if the site has a page for it. */
  href?: string;
  linkLabel?: string;
}

/** The three ways a coach really keeps handball statistics. */
export const STAT_WAYS: StatWay[] = [
  {
    name: 'Zettel und Strichliste',
    effort: 'Null Vorbereitung',
    good: 'Fällt nie aus, braucht keinen Akku, jeder im Trainerteam kann es sofort.',
    bad: 'Wer coacht, schreibt nicht mit. Ausgerechnet wird der Stapel selten – und ein Wurfbild entsteht daraus nie.',
  },
  {
    name: 'Excel-Vorlage',
    effort: 'Einmal einrichten',
    good: 'Rechnet Quoten selbst aus, gehört dir, lässt sich beliebig erweitern.',
    bad: 'In der Halle unbedienbar, also tippst du abends ab. Kein Verlauf pro Spieler, und der Co-Trainer hat die falsche Version.',
    href: '/handball-statistik-excel-vorlage',
    linkLabel: 'Kostenlose Excel-Vorlage laden',
  },
  {
    name: 'Statistik-App',
    effort: 'Ein Tap pro Aktion',
    good: 'Erfassen und Auswerten fallen zusammen: Beim Schlusspfiff stehen Quoten, Wurfbild und Spielerwerte fertig da – auch offline in der Halle.',
    bad: 'Du brauchst ein Handy oder Tablet und ein Konto. Die ersten zehn Minuten Spielzeit fühlen sich ungewohnt an.',
    href: '/handball-statistik-app-kostenlos',
    linkLabel: 'Was der kostenlose Zugang enthält',
  },
];

export interface StatStep {
  title: string;
  text: string;
}

/**
 * How a coach gets from nothing to a usable statistic. Rendered as a numbered
 * list and mirrored into `HowTo` schema by the route.
 */
export const STAT_STEPS: StatStep[] = [
  {
    title: 'Entscheide, was du wirklich auswertest',
    text: 'Fang mit drei Werten an: Tore, Würfe und technische Fehler je Spieler. Daraus fallen Wurfquote, Angriffe und Angriffseffektivität von selbst ab. Alles Weitere kommt dazu, wenn die drei sitzen – nicht vorher.',
  },
  {
    title: 'Schreib deine Zählregeln auf',
    text: 'Pfosten zählt als Wurf, technischer Fehler nicht, Siebenmeter laufen getrennt, geblockte Bälle behandelst du die ganze Saison gleich. Ohne notierte Regel erfasst der Co-Trainer am dritten Spieltag etwas anderes als du.',
  },
  {
    title: 'Erfasse während des Spiels, nicht danach',
    text: 'Aus der Erinnerung fehlen vor allem Fehlwürfe und technische Fehler – also genau die Aktionen, die deine Quoten ehrlich machen. Wer live erfasst, hat beim Schlusspfiff einen vollständigen Datensatz.',
  },
  {
    title: 'Rechne die Quoten und ordne sie ein',
    text: 'Vergleiche zuerst mit dem eigenen Vorwert, erst danach mit einer Richtwerttabelle. Unter fünf Abschlüssen im Spiel und dreißig über die Saison kommentierst du eine Quote gar nicht erst.',
  },
  {
    title: 'Leite genau eine Entscheidung ab',
    text: 'Eine Kennzahl, ein Trainingsschwerpunkt, ein Gespräch. Drei Spiele in dieselbe Richtung sind ein Thema, ein Ausreißer ist keins. Danach fängst du wieder bei Schritt drei an.',
  },
];

/**
 * The Ratgeber articles this page hands off to, in reading order: the metric a
 * coach starts with, then the ones that put it in context. Resolved against
 * the article data at render time so titles never drift.
 */
export const STAT_GUIDE_SLUGS = [
  'handball-statistik-fuehren',
  'wurfquote-berechnen',
  'handball-torwart-statistik',
  'handball-ballbesitz-tempo',
  'handball-expected-goals-xg',
  'handball-spielanalyse',
  'handball-statistik-zettel-excel-app',
  'handball-spielerentwicklung-messen',
  'handball-statistik-verein-einfuehren',
] as const;

export const STATS_FAQS: BoardFaqItem[] = [
  {
    question: 'Welche Statistiken gibt es im Handball?',
    answer:
      'Im Angriff: Tore, Würfe, Wurfquote, Angriffe, Angriffseffektivität, technische Fehler, Siebenmeter und Wurfpositionen. In der Abwehr: Paraden, Paradenquote, Gegentore, Blocks und Ballgewinne. Dazu Tempogegenstöße und Tempoanteil, Zeitstrafen mit Über- und Unterzahlbilanz sowie über die Saison Quotenverläufe, Spielanteile und die Gegner-Bilanz.',
  },
  {
    question: 'Welche Kennzahlen sollte ein Trainer mindestens erfassen?',
    answer:
      'Tore, Würfe und technische Fehler je Spieler. Aus diesen drei Werten ergeben sich Wurfquote, Angriffe und Angriffseffektivität – damit lässt sich bereits entscheiden, ob euer Problem der Abschluss oder die Ballsicherheit ist. Paraden je Torwart sind der nächste sinnvolle Schritt.',
  },
  {
    question: 'Wie berechnet man die Wurfquote im Handball?',
    answer:
      'Tore geteilt durch Würfe, mal 100. Sieben Tore aus zwölf Würfen ergeben 58,3 %. Als Wurf zählt jeder echte Torabschluss inklusive Pfosten- und Lattentreffer, ein technischer Fehler ohne Abschluss dagegen nicht. Siebenmeter führst du getrennt, sonst schönt eine sichere Schützin die Quote der ganzen Mannschaft.',
  },
  {
    question: 'Was ist eine gute Wurfquote im Handball?',
    answer:
      'Das hängt von der Position ab: am Kreis 65–75 %, aus dem Rückraum von neun Metern 45–55 %, beim Siebenmeter 75–85 % und im Tempogegenstoß 85–95 %. Eine Team-Wurfquote über 60 % ist im Amateurbereich ein solider Wert. Es sind Orientierungswerte aus der Praxis, keine erhobene Statistik.',
  },
  {
    question: 'Wie erfasse ich Handball-Statistiken während des Spiels?',
    answer:
      'Entweder per Strichliste auf einem vorbereiteten Bogen mit einer Zeile je Spieler, oder per App mit einem Tap pro Aktion. Entscheidend ist, dass die Erfassung live passiert: Aus der Erinnerung fehlen vor allem Fehlwürfe und technische Fehler, und damit werden die Quoten systematisch zu gut.',
  },
  {
    question: 'Kann ich Handball-Statistiken kostenlos erfassen?',
    answer:
      'Ja. Statix ist aktuell mit vollem Funktionsumfang kostenlos, inklusive Live-Erfassung, Wurfquoten, Wurfbildern und Auswertung. Wer lieber auf Papier startet, nimmt die kostenlose Excel-Vorlage. Beides ohne Kreditkarte; die Live-Demo läuft sogar ohne Account.',
  },
  {
    question: 'Brauche ich eine zweite Person am Spielfeldrand?',
    answer:
      'Für Tore, Würfe und technische Fehler reicht eine Person, die auch coacht. Sobald Wurfzonen, Blocks und Ballgewinne dazukommen, wird es zu zweit deutlich sauberer – üblicherweise erfasst dann ein Co-Trainer oder ein verletzter Spieler.',
  },
  {
    question: 'Ab wann sind die Zahlen aussagekräftig?',
    answer:
      'Einzelne Quoten aus einem Spiel sind Rauschen. Als Faustregel: mindestens fünf Abschlüsse für eine Spielquote, rund dreißig über die Saison, und für den Torwart etwa acht erfasste Spiele, bevor sein eigener Durchschnitt zur Referenz taugt.',
  },
  {
    question: 'Gibt es hier Statistiken der Handball-Bundesliga?',
    answer:
      'Nein. Diese Seite erklärt Handball-Statistiken und Statix erfasst die Daten deiner eigenen Mannschaft. Tabellen und Werte aus Bundesliga oder Verbandsligen findest du bei den Ligen und Landesverbänden selbst.',
  },
];
