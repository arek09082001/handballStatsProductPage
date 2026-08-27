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
 * Rules for editing:
 *  - **Only real, shipping behaviour.** Everything not generally available
 *    carries a `status` other than `live` and says so in its own copy — see
 *    `video-tagging`, which is a closed beta.
 *  - **No price, ever.** Not in copy, not in a fact row, not in an FAQ answer.
 *    See PRODUCT.md, "Commercial truth".
 *  - Screenshots are real app captures from `scripts/screenshots/capture.mjs`.
 *    `width`/`height` must match the file on disk — `npm run check-images`
 *    fails the build's honesty check otherwise.
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

export const FEATURE_STATUS_LABEL: Record<FeatureStatus, string> = {
  live: 'Verfügbar',
  beta: 'In Arbeit',
  onRequest: 'Auf Anfrage',
};

export const FEATURE_STATUS_HINT: Record<FeatureStatus, string> = {
  live: 'Fertig und für jedes Konto freigeschaltet.',
  beta: 'Wird gerade gebaut. Für ausgewählte Teams schon nutzbar, für alle anderen noch nicht sichtbar.',
  onRequest: 'Fertig, wird aber für euch eingerichtet statt selbst angelegt.',
};

export type FeatureGroupId = 'erfassen' | 'auswerten' | 'organisieren' | 'teilen';

export interface FeatureGroup {
  id: FeatureGroupId;
  /** Heading on the index. */
  name: string;
  /** The question this group of features answers. */
  intro: string;
}

/**
 * The four questions a coach's season asks, in the order they come up: get the
 * game down, read it afterwards, run the squad around it, hand it to somebody
 * else.
 */
export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'erfassen',
    name: 'Erfassen',
    intro:
      'Was in der Halle passiert, während das Spiel läuft — mit einem Daumen, ohne Netz, und für alle sichtbar, die nicht dabei sind.',
  },
  {
    id: 'auswerten',
    name: 'Auswerten',
    intro:
      'Was aus den erfassten Aktionen wird: Quoten, Wurfbilder, Verläufe, KI-Berichte und die Szenen auf dem Video.',
  },
  {
    id: 'organisieren',
    name: 'Organisieren',
    intro:
      'Alles rund um das eine Spiel: Kader, Termine, Turniere und die Ebene über allen Mannschaften eines Vereins.',
  },
  {
    id: 'teilen',
    name: 'Teilen',
    intro:
      'Was aus der Mannschaft herausgeht — an Trainerkollegen, an die Spielerinnen und Spieler, an Eltern.',
  },
];

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

export interface Feature {
  slug: string;
  /** Full name, used as the `<h1>` and in the schema. */
  name: string;
  /** Short label for cards, navigation and breadcrumbs. Defaults to `name`. */
  short?: string;
  group: FeatureGroupId;
  status: FeatureStatus;
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
  /** Slugs of the features that answer the next question. Two or three. */
  related: string[];
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  /** Social card for the route. Falls back to the site default. */
  ogImage?: string;
  /**
   * Renders the drawn tagging bench instead of a screenshot band. Set only for
   * `video-tagging`: the workbench is real and captured, but the moving picture
   * behind it lives in object storage the screenshot machine cannot reach, and
   * a doctored screenshot is not an option.
   */
  mock?: 'tagging-bench';
}

export const FEATURES: Feature[] = [
  /* ───────────────────────────────────────────────────────────── erfassen ── */
  {
    slug: 'live-erfassung',
    name: 'Live-Erfassung',
    short: 'Live erfassen',
    group: 'erfassen',
    status: 'live',
    headline: 'Der Zettel, der mitrechnet',
    summary:
      'Erfasse Tore, Würfe, Paraden, Strafen und Wechsel in Echtzeit – mit nur einem Tap, direkt von der Bank.',
    tagline:
      'Ein Tap pro Aktion. Am Ende des Spiels ist die Statistik fertig, nicht die Abtipperei.',
    intro: [
      'Die Live-Erfassung ist der Kern von Statix. Auf dem Bildschirm steht dein Kader auf dem Feld, wie auf der Taktiktafel. Du tippst die Spielerin an, die gerade geworfen hat, und wählst die Aktion — Tor, gehalten, vorbei, geblockt, Pfosten, Siebenmeter, technischer Fehler, Zeitstrafe. Das war der ganze Vorgang.',
      'Alles Weitere rechnet die App: Wurfquote, Angriffseffektivität, Paradenquote, Spielanteile, Tordifferenz, Verlauf. Du siehst sie in derselben Sekunde, in der du sie brauchst — nicht am Sonntagabend, wenn der Zettel schon in der Sporttasche verschwunden ist.',
      'Weil ein Spiel schneller ist als jede Eingabemaske, gibt es einen Schnellmodus für alles, was man ohne Hinsehen tippen muss, und einen geführten Modus für Co-Trainer, die zum ersten Mal erfassen. Wurfposition und Torzone sind zwei zusätzliche Tipps auf ein Feldbild — nicht Pflicht, aber die Voraussetzung fürs Wurfbild.',
    ],
    facts: [
      { term: 'Aufwand pro Aktion', value: 'Ein Tap, zwei mit Wurfposition' },
      { term: 'Läuft auf', value: 'Handy, Tablet, iPad, Laptop' },
      { term: 'Ohne Netz', value: 'Ja — die Halle hat selten WLAN' },
      { term: 'Nachträglich korrigierbar', value: 'Jede Aktion, auch nach Abpfiff' },
    ],
    steps: [
      {
        title: 'Kader aufs Feld stellen',
        body: 'Die Aufstellung kommt aus dem gespeicherten Kader. Wechsel sind ein Tausch von zwei Karten, Zeitstrafen laufen als eigener Timer mit und melden sich, wenn die zwei Minuten vorbei sind.',
      },
      {
        title: 'Aktion tippen, während der Ball läuft',
        body: 'Spielerin antippen, Aktion wählen. Die Torschützenliste, die Quoten und der Spielverlauf aktualisieren sich sofort — mit demselben Tap, der die Aktion erfasst.',
      },
      {
        title: 'Wurfposition setzen, wenn Zeit ist',
        body: 'Ein Tipp auf die Feldgrafik legt fest, woher geworfen wurde, ein zweiter, in welche Torecke. Beides ist optional: ohne die Position fehlt nur das Wurfbild, keine Zahl.',
      },
      {
        title: 'Nach dem Spiel geradeziehen',
        body: 'Falsche Spielerin erwischt, eine Parade vergessen? Jede erfasste Aktion lässt sich nachträglich ändern oder löschen, und alle abgeleiteten Werte rechnen sich neu.',
      },
    ],
    shots: [
      {
        src: '/recordStatsInGame.png',
        alt: 'Live-Erfassung in Statix: der Kader auf dem Feld, für eine angetippte Spielerin öffnet sich die Aktionsauswahl',
        label: 'Spielerin antippen — die Aktionen liegen direkt darunter',
        width: 2560,
        height: 1600,
      },
      {
        src: '/aufstellung-feld.png',
        alt: 'Die aktuelle Aufstellung auf dem Spielfeld, wie auf einer Taktiktafel',
        label: 'Die Aufstellung ist das Feld, nicht eine Liste',
        width: 2560,
        height: 1600,
      },
      {
        src: '/mobil-live-erfassung.png',
        alt: 'Live-Erfassung auf dem Handy während des Spiels',
        label: 'So hält ein Trainer das Handy auf der Bank',
        width: 780,
        height: 1688,
      },
    ],
    limits: [
      'Statix erfasst dein Team. Die Aktionen des Gegners werden nur so weit mitgeschrieben, wie sie euer Spiel beschreiben — Gegentore, gegnerische Strafen, Ballgewinne.',
      'Ein Spiel erfasst eine Person. Zwei Geräte gleichzeitig am selben Spiel sind nicht vorgesehen, weil zwei Erfassungen zwangsläufig auseinanderlaufen.',
      'Automatische Erkennung aus dem Videobild gibt es nicht. Jede Aktion kommt von einem Menschen, der sie gesehen hat.',
    ],
    faq: [
      {
        question: 'Wie viele Taps sind ein Spiel?',
        answer:
          'Ungefähr so viele, wie du Aktionen erfassen willst. Ein Handballspiel hat je nach Klasse 100 bis 160 Aktionen, die eine Statistik bewegen. Wer nur Tore und Würfe erfassen will, tippt entsprechend weniger — die Quoten rechnen mit dem, was da ist.',
      },
      {
        question: 'Kann ein Co-Trainer erfassen, der die App nicht kennt?',
        answer:
          'Ja. Der geführte Modus fragt Schritt für Schritt ab, statt alles gleichzeitig anzubieten. Für den ersten Einsatz reicht das; nach zwei Spielen tippt fast jeder im Schnellmodus.',
      },
      {
        question: 'Was passiert, wenn ich mich vertippe?',
        answer:
          'Die letzte Aktion lässt sich sofort zurücknehmen, jede ältere im Spielprotokoll bearbeiten oder löschen. Alle Quoten und das Wurfbild rechnen sich danach neu — es gibt keinen Stand, der „schon gespeichert“ und deshalb falsch bleibt.',
      },
      {
        question: 'Brauche ich ein Tablet?',
        answer:
          'Nein. Statix läuft auf dem Handy genauso wie auf Tablet, iPad oder Laptop. Ein Tablet ist bequemer, weil mehr Kader auf einmal sichtbar ist — nötig ist es nicht.',
      },
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
    name: 'Offline & App-Installation',
    short: 'Offline & PWA',
    group: 'erfassen',
    status: 'live',
    headline: 'Gebaut für Hallen ohne Empfang',
    summary:
      'Erfasse Spiele offline in der Halle mit automatischer Synchronisation und installiere Statix als App auf dem Homescreen.',
    tagline:
      'Die Halle hat kein Netz. Das ist kein Sonderfall, sondern die Voraussetzung, unter der Statix gebaut wurde.',
    intro: [
      'Statix erfasst ein Spiel vollständig auf dem Gerät. Jeder Tap landet zuerst im lokalen Speicher des Browsers und erst danach — irgendwann, wenn es wieder Netz gibt — auf dem Server. Für dich sieht beides gleich aus: die Zahlen sind sofort da, ob der Balken oben rechts nun ein Funkzeichen zeigt oder nicht.',
      'Der Weg zurück ist der eigentliche Punkt. Beim Synchronisieren werden die gesammelten Aktionen der Reihe nach gegen Endpunkte gespielt, die eine doppelt gesendete Aktion erkennen und verwerfen. Ein Netz, das dreimal kurz kommt und wieder geht, erzeugt deshalb keine drei Tore.',
      'Installiert wird Statix als PWA: „Zum Home-Bildschirm“ auf dem iPhone, „App installieren“ im Chrome-Menü. Danach startet die App im Vollbild ohne Browserleiste, hat ein eigenes Symbol und funktioniert im Flugmodus genauso wie mit Netz. Ein App-Store-Download ist nicht nötig.',
    ],
    facts: [
      { term: 'Ohne Netz erfassbar', value: 'Ganzes Spiel, inklusive Wechsel und Uhr' },
      { term: 'Synchronisation', value: 'Automatisch, sobald wieder Netz da ist' },
      { term: 'Doppelte Einträge', value: 'Ausgeschlossen — jede Aktion zählt einmal' },
      { term: 'Installation', value: 'Direkt aus dem Browser, ohne App-Store' },
    ],
    steps: [
      {
        title: 'Vor dem Spiel einmal laden',
        body: 'Kader und Spiel einmal mit Netz öffnen. Danach liegt alles, was die Erfassung braucht, auf dem Gerät.',
      },
      {
        title: 'In der Halle einfach erfassen',
        body: 'Kein Warten, keine Fehlermeldung, keine ausgegraute Schaltfläche. Offline sieht in Statix aus wie online.',
      },
      {
        title: 'Draußen synchronisiert es sich selbst',
        body: 'Sobald das Handy wieder Netz hat, werden die gesammelten Aktionen übertragen — auch wenn du die App schon geschlossen hast.',
      },
      {
        title: 'Als App auf dem Startbildschirm',
        body: 'Einmal installieren, danach startet Statix im Vollbild mit eigenem Symbol. Auf dem iPhone geht das über das Teilen-Menü, auf Android über „App installieren“.',
      },
    ],
    shots: [
      {
        src: '/mobil-live-erfassung.png',
        alt: 'Statix als installierte App auf dem Handy während der Live-Erfassung',
        label: 'Installiert, im Vollbild, ohne Browserleiste',
        width: 780,
        height: 1688,
      },
      {
        src: '/mobil-spielliste.png',
        alt: 'Spielliste in der installierten Statix-App auf dem Handy',
        label: 'Die Spielliste, auch ohne Empfang lesbar',
        width: 780,
        height: 1688,
      },
    ],
    limits: [
      'Neu angelegt werden kann ein Spiel offline nicht — es muss einmal mit Netz existieren, bevor du in der Halle darauf tippst.',
      'KI-Analysen, der Live-Ticker und geteilte Berichte brauchen eine Verbindung. Sie sind Antworten vom Server, nicht Rechnungen auf dem Gerät.',
      'Wer dasselbe Spiel offline auf zwei Geräten erfasst, bekommt zwei Erfassungen. Das ist kein Fehler, den die Synchronisation heilen kann.',
    ],
    faq: [
      {
        question: 'Was passiert, wenn das Handy mitten im Spiel abstürzt?',
        answer:
          'Die erfassten Aktionen liegen im Speicher des Browsers, nicht im Arbeitsspeicher der Seite. Nach dem Neustart öffnest du das Spiel wieder und erfasst weiter — der Stand ist da.',
      },
      {
        question: 'Ist Statix im App Store oder bei Google Play?',
        answer:
          'Statix wird als PWA direkt aus dem Browser installiert. Das ist ein Vorgang von zwei Tipps, und die App aktualisiert sich danach von selbst, ohne dass jemand ein Update herunterlädt.',
      },
      {
        question: 'Verbraucht das viel Speicher auf dem Handy?',
        answer:
          'Nein. Gespeichert werden Ereignisse, keine Videos — ein ganzes Spiel ist ein paar Dutzend Kilobyte.',
      },
    ],
    related: ['live-erfassung', 'live-ticker', 'termine-und-teilnahme'],
    ogImage: '/mobil-live-erfassung.png',
    meta: {
      title: 'Handball-Statistik offline erfassen & Statix als App installieren',
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
    name: 'Live-Ticker',
    short: 'Live-Ticker',
    group: 'erfassen',
    status: 'live',
    headline: 'Die Anzeigetafel für alle draußen',
    summary:
      'Veröffentliche Spiele als öffentlichen Live-Ticker mit Link und QR-Code – Eltern und Fans verfolgen Spielstand und Spielverlauf live im Browser.',
    tagline:
      'Wer nicht in der Halle ist, liest trotzdem mit — ohne Konto, ohne App, ohne dass du etwas Zusätzliches tippst.',
    intro: [
      'Der Live-Ticker ist dieselbe Erfassung, nur von außen gesehen. Du schaltest ein Spiel frei und bekommst einen Link und einen QR-Code. Wer den Link öffnet, sieht Spielstand, Spielzeit und den Verlauf in Echtzeit — jede Aktion erscheint dort in der Sekunde, in der du sie erfasst.',
      'Gedacht ist er für die Leute, die sonst per WhatsApp nachfragen: Eltern, die arbeiten, der Rest des Vereins, die zweite Mannschaft, die parallel spielt. Der QR-Code funktioniert auf einem ausgedruckten Zettel am Hallen­eingang genauso wie auf dem Beamer beim Vereinsabend.',
      'Der Ticker zeigt bewusst nicht alles. Er zeigt, was auf einer Anzeigetafel steht — Stand, Zeit, Torschützen, Strafen. Die vollständige Statistik mit Quoten und Wurfbild bleibt bei dir, bis du sie ausdrücklich teilst.',
    ],
    facts: [
      { term: 'Zugang für Zuschauer', value: 'Link oder QR-Code, ohne Konto' },
      { term: 'Verzögerung', value: 'Praktisch keine — es ist derselbe Tap' },
      { term: 'Zusätzlicher Aufwand', value: 'Keiner. Einmal freischalten, fertig' },
      { term: 'Abschaltbar', value: 'Jederzeit, auch mitten im Spiel' },
    ],
    steps: [
      {
        title: 'Spiel freischalten',
        body: 'Im Spiel auf Veröffentlichen tippen. Statix erzeugt einen Link und einen QR-Code dazu.',
      },
      {
        title: 'Link streuen',
        body: 'In die Mannschafts- oder Elterngruppe schicken, den QR-Code an die Hallentür hängen oder auf den Beamer legen.',
      },
      {
        title: 'Erfassen wie immer',
        body: 'Der Ticker hängt an derselben Erfassung. Du tippst kein zweites Mal und pflegst nichts nach.',
      },
      {
        title: 'Nach dem Spiel stoppen',
        body: 'Ein Tipp beendet die Veröffentlichung. Der Link ist danach tot — nicht nur unauffällig, sondern wirklich zu.',
      },
    ],
    shots: [
      {
        src: '/gameListOverview.png',
        alt: 'Spielübersicht in Statix mit laufendem und beendeten Spielen',
        label: 'Aus der Spielliste heraus wird ein Spiel veröffentlicht',
        width: 2560,
        height: 2000,
      },
    ],
    limits: [
      'Der Ticker zeigt den Spielverlauf, nicht die Auswertung. Wurfquoten, Wurfbilder und KI-Berichte gehören dir und werden über eine eigene Freigabe geteilt.',
      'Es gibt keine Kommentarfunktion und keinen Textticker mit eigenen Sätzen. Was dort steht, kommt aus den erfassten Aktionen.',
      'Ohne Netz in der Halle läuft die Erfassung weiter, der Ticker aber steht still, bis die Verbindung zurück ist.',
    ],
    faq: [
      {
        question: 'Sehen Zuschauer die Namen unserer Spielerinnen?',
        answer:
          'Der Ticker zeigt den Spielverlauf so, wie er in der Halle angesagt wird — mit Torschützen. Wenn du das nicht möchtest, veröffentliche das Spiel nicht; einen halb geöffneten Ticker gibt es bewusst nicht.',
      },
      {
        question: 'Wie viele Leute können gleichzeitig zuschauen?',
        answer:
          'Der Ticker ist eine normale Webseite. Ob zwei Eltern oder die halbe Halle darauf schauen, ändert für dich nichts.',
      },
      {
        question: 'Bleibt der Ticker nach dem Spiel online?',
        answer:
          'Nur, solange du ihn freigeschaltet lässt. Beendest du die Veröffentlichung, ist der Link sofort ungültig — auch der, den schon jemand weitergeleitet hat.',
      },
    ],
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

  /* ──────────────────────────────────────────────────────────── auswerten ── */
  {
    slug: 'spielerstatistiken',
    name: 'Spielerstatistiken',
    short: 'Spielerwerte',
    group: 'auswerten',
    status: 'live',
    headline: 'Eine Saison, die man lesen kann',
    summary:
      'Wurfquoten, Effizienz, Spielanteile und Entwicklungsverläufe für jeden Spieler auf einen Blick.',
    tagline:
      'Jede erfasste Aktion landet bei einer Person. Daraus wird eine Saison, die man lesen kann.',
    intro: [
      'Aus der Live-Erfassung fällt für jede Spielerin ein vollständiges Konto heraus: Tore, Würfe, Wurfquote, Siebenmeter getrennt gezählt, Assists, technische Fehler, Ballgewinne, Blocks, Zeitstrafen. Bei Torhüterinnen Paraden, Gegentore und Paradenquote.',
      'Interessant wird das erst über die Zeit. Statix legt die Spiele einer Saison übereinander und zeigt den Verlauf — welche Quote steigt, welche kippt, wer nach der Winterpause ein anderer Spieler ist. Das ist die Zahl, die eine Trainingsentscheidung trägt, nicht die eine Wurfquote aus dem einen Spiel.',
      'Jede Zahl bleibt aufklappbar bis zur einzelnen Aktion. Wer wissen will, warum eine Quote bei 38 % steht, kommt in zwei Tipps auf die Liste der Würfe, aus denen sie gerechnet ist.',
    ],
    facts: [
      { term: 'Pro Spielerin', value: 'Wurf, Tor, Quote, Assist, Fehler, Strafen' },
      { term: 'Torhüterinnen', value: 'Eigene Werte: Paraden, Gegentore, Quote' },
      { term: 'Zeitraum', value: 'Einzelspiel, Saison und Verlauf' },
      { term: 'Nachvollziehbar', value: 'Jede Quote bis zur einzelnen Aktion' },
    ],
    steps: [
      {
        title: 'Erfassen',
        body: 'Jeder Tap trägt die Spielerin, die ihn ausgelöst hat. Mehr Zuordnung braucht es nicht.',
      },
      {
        title: 'Nach dem Spiel lesen',
        body: 'Die Spielertabelle steht direkt neben dem Endstand: wer wie viele Würfe hatte, was daraus wurde, wie lange jemand auf dem Feld stand.',
      },
      {
        title: 'Über die Saison vergleichen',
        body: 'Das Spielerprofil legt alle Spiele übereinander und zeichnet den Verlauf. Ausreißer nach oben und unten stehen dort nebeneinander statt einzeln.',
      },
      {
        title: 'Im Gespräch benutzen',
        body: 'Ein Profil lässt sich aufmachen und zeigen. Über eine Zahl zu reden, die beide sehen, ist ein anderes Gespräch als über einen Eindruck.',
      },
    ],
    shots: [
      {
        src: '/statsTableInGame.png',
        alt: 'Spielertabelle eines beendeten Spiels mit Würfen, Toren und Quoten je Spieler',
        label: 'Die Spielertabelle eines beendeten Spiels',
        width: 2560,
        height: 2000,
      },
      {
        src: '/spielerprofil-verlauf.png',
        alt: 'Spielerprofil mit Entwicklungsverlauf über die Saison',
        label: 'Ein Spielerprofil über die Saison gelesen',
        width: 2560,
        height: 2000,
      },
      {
        src: '/mobil-spielerstatistiken.png',
        alt: 'Spielerstatistiken auf dem Handy',
        label: 'Dieselben Werte am Sonntagabend auf dem Sofa',
        width: 780,
        height: 1688,
      },
    ],
    limits: [
      'Statix rechnet aus dem, was erfasst wurde. Wer nur Tore tippt, bekommt keine Wurfquote — das ist keine Lücke, sondern Arithmetik.',
      'Laufwege, Distanzen und Belastung misst Statix nicht. Dafür braucht es Sensoren, nicht einen Daumen an der Seitenlinie.',
      'Ein Vergleich mit anderen Vereinen gibt es nicht. Die Bezugsgröße ist eure eigene Saison.',
    ],
    faq: [
      {
        question: 'Ab wann sind die Zahlen aussagekräftig?',
        answer:
          'Für eine Wurfquote reichen ein paar Spiele; für eine Entwicklung braucht es eine halbe Saison. Statix zeigt deshalb immer die Anzahl mit an, aus der eine Quote gerechnet ist — 100 % aus zwei Würfen sieht dann aus wie das, was es ist.',
      },
      {
        question: 'Sehen die Spielerinnen ihre eigenen Werte?',
        answer:
          'Nur, wenn du sie zeigst oder teilst. Standardmäßig sind die Auswertungen im Trainerbereich, und das Profil einer Spielerin sieht nur, wer im Trainerteam ist.',
      },
      {
        question: 'Was ist mit Spielerinnen, die die Mannschaft wechseln?',
        answer:
          'Innerhalb eines Vereins bleibt die Laufbahn über die Mannschaften hinweg sichtbar — siehe Vereinsbereich. Ohne Verein gehört ein Kadereintrag zu genau einer Mannschaft.',
      },
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
    name: 'Wurfbilder & Wurfanalyse',
    short: 'Wurfbilder',
    group: 'auswerten',
    status: 'live',
    headline: 'Nicht wie viele, sondern von wo',
    summary:
      'Visualisiere Würfe und Tore auf dem Spielfeld und erkenne Muster, die Spiele entscheiden.',
    tagline:
      'Eine Tabelle sagt, wie viele. Ein Wurfbild sagt, von wo — und das ist die Frage, aus der ein Training wird.',
    intro: [
      'Wenn du beim Erfassen die Wurfposition mit antippst, zeichnet Statix daraus das Wurfbild: jeder Wurf als Punkt auf dem Feld, Tor und Fehlwurf unterscheidbar, verdichtet zur Heatmap. Dazu die zweite Karte, die Torzone — in welche Ecke geworfen wurde und was dort ankam.',
      'Der Nutzen liegt nicht im einzelnen Punkt, sondern im Muster. Dass ihr von halblinks aus neun Metern trefft und von rechts nicht, steht in keiner Quote; auf der Karte sieht man es in zwei Sekunden. Dasselbe gilt für die Abwehrseite: wo der Gegner zum Abschluss kommt, ist eine Aussage über euer Verschieben.',
      'Wurfbilder gibt es für ein einzelnes Spiel, für eine Spielerin über die Saison und für die Mannschaft insgesamt. Der interessante Vergleich ist meistens der letzte gegen den ersten.',
    ],
    facts: [
      { term: 'Wurfpositionen', value: 'Acht Zonen plus Siebenmeter und Fernwurf' },
      { term: 'Torzonen', value: 'Neun Felder im Tor' },
      { term: 'Darstellung', value: 'Einzelwürfe und Heatmap' },
      { term: 'Bezug', value: 'Spiel, Spielerin oder ganze Saison' },
    ],
    steps: [
      {
        title: 'Position mit erfassen',
        body: 'Beim Wurf ein zusätzlicher Tipp auf die Feldgrafik. Wer es einmal nicht schafft, verliert nur diesen einen Punkt auf der Karte.',
      },
      {
        title: 'Das Bild lesen',
        body: 'Grün getroffen, rot daneben, dichter Fleck heißt: hier passiert euer Spiel. Die Heatmap glättet das zu einer Fläche.',
      },
      {
        title: 'Mit der Torzone kreuzen',
        body: 'Wo im Tor die Bälle landen, ist die Frage an die Torhüterin des Gegners — und an eure eigene, wenn du die Gegentore anschaust.',
      },
      {
        title: 'Ins Training übersetzen',
        body: 'Eine leere Zone ist entweder eine Schwäche oder eine Entscheidung. Das Wurfbild sagt nicht, welche von beiden — aber es stellt die Frage.',
      },
    ],
    shots: [
      {
        src: '/shotMaps.png',
        alt: 'Wurfbild eines Handballspiels: Würfe und Tore auf dem Spielfeld verteilt, dazu die Heatmap',
        label: 'Das Wurfbild eines Spiels, Tore und Fehlwürfe getrennt',
        width: 2560,
        height: 2000,
      },
      {
        src: '/mobil-wurfbild.png',
        alt: 'Wurfbild auf dem Handy',
        label: 'Auch auf dem Handy in der Kabine lesbar',
        width: 780,
        height: 1688,
      },
    ],
    limits: [
      'Ohne erfasste Wurfposition kein Wurfbild. Die Zahlen stimmen trotzdem — nur die Karte bleibt leer.',
      'Die Position ist eine Zone, keine Koordinate auf den Zentimeter. Für die Frage „woher werfen wir“ reicht das; für Ballistik nicht.',
      'Expected Goals rechnet Statix nicht. Die Karte zeigt, was passiert ist, nicht was hätte passieren sollen.',
    ],
    faq: [
      {
        question: 'Wie lange dauert das Erfassen mit Wurfposition?',
        answer:
          'Ein zusätzlicher Tipp pro Wurf. In der Praxis erfassen viele Trainer die Position bei den eigenen Angriffen und lassen sie beim Gegner weg — auch das ergibt eine brauchbare Karte.',
      },
      {
        question: 'Kann ich das Wurfbild der Mannschaft zeigen?',
        answer:
          'Ja. Es steht im Spielbericht, lässt sich als PDF exportieren und über einen widerrufbaren Link teilen.',
      },
      {
        question: 'Gibt es Wurfbilder für Torhüterinnen?',
        answer:
          'Ja — als Gegentor- und Paradenverteilung über die Torzonen. Das ist die Karte, die zeigt, wo eine Torhüterin stark ist und wo nicht.',
      },
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
    name: 'KI-Analyse',
    short: 'KI-Analyse',
    group: 'auswerten',
    status: 'live',
    headline: 'Ein zweiter Blick auf eure Zahlen',
    summary:
      'KI-Auswertungen für einzelne Spiele, das ganze Team, einzelne Spieler und komplette Turniere – mit pseudonymisierten Spielernamen.',
    tagline:
      'Die Zahlen stehen ohnehin da. Die KI schreibt auf, was in ihnen steht — und wo sie sich widersprechen.',
    intro: [
      'Statix schickt die erfassten Spieldaten in vier Zuschnitten durch eine Analyse: ein einzelnes Spiel, die ganze Mannschaft über die Saison, eine einzelne Spielerin als Scouting-Profil, und ein komplettes Turnier. Heraus kommt kein Fließtext, sondern ein Bericht aus Blöcken — Wendepunkte, Fehlerverteilung, Wurfzonen-Effizienz, Spielerleistung, konkrete Ansatzpunkte.',
      'Vor der Analyse werden die Namen ersetzt. Was das Modell sieht, sind Rollen und Zahlen — „Rückraum links, 14 Würfe, 5 Tore“ —, keine Personen. Die Namen kommen erst beim Anzeigen wieder dazu, auf deinem Gerät.',
      'Ein Bericht wird im Hintergrund erstellt und bleibt gespeichert, bis du ihn löschst. Der Verlauf ist Absicht: der interessante Vergleich ist der Bericht von heute neben dem von vor drei Monaten.',
    ],
    facts: [
      { term: 'Vier Zuschnitte', value: 'Spiel, Mannschaft, Spielerin, Turnier' },
      { term: 'Namen', value: 'Vor der Analyse pseudonymisiert' },
      { term: 'Dauer', value: 'Ein bis zwei Minuten, im Hintergrund' },
      { term: 'Aufbewahrung', value: 'Bleibt im Verlauf, jederzeit löschbar' },
    ],
    steps: [
      {
        title: 'Spiel beenden',
        body: 'Spielberichte gibt es für beendete Spiele. Für ein laufendes Spiel gibt es stattdessen eine Live-Einschätzung.',
      },
      {
        title: 'Analyse anstoßen',
        body: 'Ein Tipp. Statix bereitet die Daten auf, pseudonymisiert sie und schickt sie los — du kannst die Seite zwischendurch benutzen.',
      },
      {
        title: 'Bericht lesen',
        body: 'Kennzahlen, Wendepunkte, Muster und Empfehlungen als eigene Blöcke, jeder mit den Zahlen, auf denen er steht.',
      },
      {
        title: 'Im Verlauf vergleichen',
        body: 'Alte Berichte bleiben stehen. Ob sich etwas geändert hat, beantwortet der Vergleich, nicht der neueste Bericht allein.',
      },
    ],
    shots: [
      {
        src: '/aiAnalyze.png',
        alt: 'KI-Spielbericht in Statix mit Spielverlauf und Wurfzonen-Effizienz',
        label: 'Ein KI-Spielbericht: Verlauf und Wurfzonen-Effizienz',
        width: 2560,
        height: 2000,
      },
      {
        src: '/aiAnalyze2.png',
        alt: 'KI-Spielbericht mit Wendepunkten, Fehlerverteilung und Spielerleistung',
        label: 'Wendepunkte, Fehlerverteilung, Spielerleistung',
        width: 2560,
        height: 2000,
      },
      {
        src: '/spielerprofil-ki.png',
        alt: 'KI-Spieler-Intelligenz im Spielerprofil',
        label: 'Dieselbe Analyse, auf eine Spielerin zugeschnitten',
        width: 1360,
        height: 562,
      },
    ],
    limits: [
      'Die KI liest nur, was erfasst wurde. Ein Spiel ohne Wurfpositionen bekommt keine Wurfzonen-Analyse.',
      'Ein Bericht ist eine Lesart, kein Urteil. Er kennt weder die Verletzung in der 20. Minute noch den Schiedsrichter.',
      'Videoanalyse durch die KI gibt es nicht. Das Modell sieht Zahlen, keine Bilder.',
    ],
    faq: [
      {
        question: 'Welche Daten verlassen dabei Statix?',
        answer:
          'Aggregierte Spieldaten mit ersetzten Namen: Positionen, Aktionen, Zeiten, Zahlen. Klarnamen, E-Mail-Adressen und Kontodaten sind nicht dabei. Die Zuordnung passiert erst wieder bei der Anzeige.',
      },
      {
        question: 'Kann ich einen Bericht löschen?',
        answer:
          'Ja, jeden einzelnen. Gelöscht heißt gelöscht — der Bericht verschwindet aus dem Verlauf und wird nicht anderswo aufbewahrt.',
      },
      {
        question: 'Warum dauert eine Analyse ein bis zwei Minuten?',
        answer:
          'Weil ein Bericht aus mehreren Durchgängen entsteht und am Ende gegen ein festes Schema geprüft wird. Fällt ein Block durch die Prüfung, wird er noch einmal angefordert, statt halb ausgefüllt angezeigt zu werden.',
      },
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
    name: 'Gegner-Bilanz & Scouting',
    short: 'Gegner',
    group: 'auswerten',
    status: 'live',
    headline: 'Was ihr über jeden Gegner wisst',
    summary:
      'Automatische Head-to-Head-Bilanz gegen jeden Gegner – Siege, Unentschieden, Niederlagen und Tore.',
    tagline:
      'Jeder Verein, gegen den ihr je gespielt habt, mit Bilanz, Form und den Notizen, die du dir gemacht hast.',
    intro: [
      'Sobald du ein Spiel gegen einen Verein erfasst, legt Statix ihn an und führt die Bilanz mit: Siege, Unentschieden, Niederlagen, Tore und Gegentore, dazu die Form der letzten Begegnungen. Du pflegst dafür nichts — die Liste entsteht aus den Spielen, die ohnehin da sind.',
      'Daneben steht Platz für das, was keine Zahl ist: Scouting-Notizen je Verein. Welche Abwehr sie spielen, wer den Kreis anspielt, wo ihre Torhüterin schwach ist. Notizen lassen sich auch anlegen, bevor ihr das erste Mal gegeneinander spielt.',
      'Am Spieltag ist das die Seite, die du zwei Stunden vorher öffnest — Bilanz, letzte Ergebnisse, eigene Notizen an einer Stelle statt in drei Chatverläufen.',
    ],
    facts: [
      { term: 'Anlegen', value: 'Automatisch aus erfassten Spielen' },
      { term: 'Bilanz', value: 'S · U · N, Tore, Tordifferenz, Form' },
      { term: 'Notizen', value: 'Frei, je Verein, auch vor dem ersten Spiel' },
      { term: 'Sortierung', value: 'Zuletzt gespielt, Name oder beste Bilanz' },
    ],
    steps: [
      {
        title: 'Spielen',
        body: 'Ein erfasstes Spiel legt den Verein an. Ab dem zweiten steht eine Bilanz da.',
      },
      {
        title: 'Notizen sammeln',
        body: 'Nach dem Spiel drei Sätze aufschreiben, solange es frisch ist. Beim Rückspiel ist das mehr wert als jede Statistik.',
      },
      {
        title: 'Vor dem Spieltag nachschlagen',
        body: 'Bilanz, letzte Begegnungen und Notizen stehen zusammen — auch auf dem Handy in der Umkleide.',
      },
    ],
    shots: [
      {
        src: '/gegner-uebersicht.png',
        alt: 'Gegnerübersicht in Statix mit Bilanz und Form je Verein',
        label: 'Jeder Verein mit Bilanz, Form und Notiz-Hinweis',
        width: 2560,
        height: 1600,
      },
    ],
    limits: [
      'Die Bilanz kennt nur eure eigenen Spiele. Wie der Gegner gegen andere spielt, weiß Statix nicht.',
      'Es gibt keinen Import von Ligadaten oder Tabellen aus Verbandsportalen.',
      'Scouting-Notizen sind Text. Videoclips zum Gegner gehören in die Videobibliothek, nicht hierher.',
    ],
    faq: [
      {
        question: 'Kann ich einen Verein anlegen, gegen den wir noch nie gespielt haben?',
        answer:
          'Ja. Genau dafür gibt es das Anlegen von Hand — damit die Scouting-Notizen schon stehen, wenn der Spieltag kommt.',
      },
      {
        question: 'Sehen andere Trainer meine Notizen?',
        answer:
          'Nur dein eigenes Trainerteam. Notizen sind nicht Teil einer Spielfreigabe.',
      },
    ],
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
    name: 'Video & Tagging',
    short: 'Video-Tagging',
    group: 'auswerten',
    status: 'beta',
    mock: 'tagging-bench',
    headline: 'Aus einer Aufnahme wird eine Frage',
    summary:
      'Spielaufnahmen hochladen, Szenen taggen, nach Aktion und Spielerin filtern und Zusammenschnitte an einzelne Spielerinnen schicken.',
    tagline:
      'Die Aufnahme liegt ohnehin auf dem Handy. Getaggt wird daraus eine Frage, die man stellen kann: „alle Gegenstöße gegen 5:1“.',
    intro: [
      'Video-Tagging ist die Werkbank neben der Statistik. Du lädst die Aufnahme eines Spiels hoch und legst Szenen darauf ab: Abschluss, Ballverlust, Abwehraktion, Parade, Strafe, Spielsituation. Jede Szene ist ein Intervall im Video plus die Angabe, was darin passiert ist — und wer.',
      'Über dem Code liegt eine zweite Ebene: Qualifikatoren. Aus welcher Phase heraus (Positionsangriff, 1./2./3. Welle, Durchbruch), gegen welche Abwehr (6:0, 5:1, 3:2:1), in Über- oder Unterzahl, mit welcher Auslösehandlung, aus welcher Wurfposition. Deshalb lässt sich später fragen: alle Außenwürfe gegen 5:1 aus der zweiten Welle. Das Vokabular ist gegen die Legende eines offiziellen IHF-Spielberichts geprüft, nicht aus dem Gedächtnis gebaut.',
      'Eine Playlist speichert keine Clipliste, sondern die Frage. Wird eine vergessene Szene nachgetaggt, fällt sie von selbst hinein — man muss nichts noch einmal zusammenstellen. Dieselbe Mechanik trägt die Sendungen: eine Spielerin bekommt genau ihre Szenen und sieht das restliche Spiel nicht.',
    ],
    facts: [
      { term: 'Stand', value: 'Beta — im Aufbau, noch nicht für alle Konten' },
      { term: 'Szenen', value: 'Intervall + Aktion + Spielerin + Qualifikatoren' },
      { term: 'Spuren', value: 'Nach Aktion oder nach Spielerin gruppiert' },
      { term: 'Playlists', value: 'Gespeicherte Filter, keine Clipordner' },
      { term: 'Sendungen', value: 'Eine Spielerin sieht nur ihre Szenen' },
      { term: 'Ohne Spiel nutzbar', value: 'Ja — auch Trainingsaufnahmen' },
    ],
    steps: [
      {
        title: 'Aufnahme hochladen',
        body: 'MP4, MOV oder WebM, gern in 1080p statt 4K. Der Upload läuft im Hintergrund weiter und lässt sich fortsetzen, wenn er abbricht. Ein Video kann zu einem Spiel gehören — muss es aber nicht.',
      },
      {
        title: 'Video und Spieluhr abgleichen',
        body: 'Zwei Zahlen, einmal pro Video: der Anwurf beider Halbzeiten. Danach ist jede live erfasste Aktion eine Sprungmarke im Video — die Statistik und die Aufnahme reden über dieselbe Minute.',
      },
      {
        title: 'Szenen taggen',
        body: 'Seite wählen, Spielerin antippen, Aktion drücken — mit Tastaturkürzeln im Videotempo. Kontext wie Phase, Abwehr und Wurfposition kommt im zweiten Schritt dazu und bleibt gesetzt, bis sich die Situation ändert.',
      },
      {
        title: 'Filtern, Playlist sichern, senden',
        body: 'Der Filter läuft über Tags und erfasste Ereignisse gleichzeitig. Was passt, spielt als Zusammenschnitt ab, lässt sich als Playlist sichern und an eine Spielerin schicken — die sieht dann genau diese Szenen und nicht das Spiel dahinter.',
      },
    ],
    shots: [
      {
        src: '/video-tagging-spuren.png',
        alt: 'Die Spuren der Tagging-Werkbank in Statix: jede Aktion eine Zeile, jede Szene ein Block auf der Zeitachse',
        label: 'Die Spuren: eine Halbzeit, nach Aktion sortiert',
        width: 2500,
        height: 1132,
      },
      {
        src: '/video-tagging-katalog.png',
        alt: 'Der Tagging-Katalog in Statix mit Seitenwahl, Kader und Aktionsknöpfen',
        label: 'Seite, Kader, Aktion — je ein Tipp, jeder mit Kürzel',
        width: 768,
        height: 1560,
      },
    ],
    limits: [
      'Das Feature ist im Aufbau. Es ist auf ausgewählte Konten begrenzt, solange es gebaut wird — nicht als Verkaufsstufe, sondern weil ein unfertiger Upload-Weg vor jedem Team echtes Geld und verwaiste Dateien produziert.',
      'Ein Tag bewegt keine Zahl. Die Statistik kommt aus der Live-Erfassung; getaggte Szenen sind eine Lesart des Videos und ändern die Torschützenliste nicht.',
      'Erfasste Ereignisse werden nur dann zu Sprungmarken, wenn das Video mit der Spieluhr abgeglichen wurde.',
      'Automatische Erkennung von Aktionen im Videobild gibt es nicht und ist nicht geplant.',
    ],
    faq: [
      {
        question: 'Kann ich Video-Tagging heute schon nutzen?',
        answer:
          'Nur, wenn dein Konto dafür freigeschaltet ist. Die Funktion wird gerade gebaut und läuft mit wenigen Teams, die Rückmeldung geben. Schreib uns, wenn ihr dabei sein wollt — die Warteliste ist eine E-Mail.',
      },
      {
        question: 'Was ist der Unterschied zwischen einem Tag und einer erfassten Aktion?',
        answer:
          'Eine erfasste Aktion ist das Protokoll des Spiels und speist jede Statistik. Ein Tag ist ein Intervall auf dem Video mit einer Lesart. Deshalb kannst du eine Szene taggen, ohne dass sich eine Quote verändert — und deshalb zeigt die Werkbank beide nebeneinander.',
      },
      {
        question: 'Sieht eine Spielerin das ganze Spiel, wenn ich ihr Szenen schicke?',
        answer:
          'Nein. Eine Sendung liefert nur die Stücke des Videos, die ihre Szenen abdecken. Für alles andere gibt es keine Adresse — nicht nur keinen Knopf, sondern keinen erreichbaren Ort.',
      },
      {
        question: 'Wie viel Speicher braucht ein Spiel?',
        answer:
          'In 1080p ungefähr zwei bis drei Gigabyte pro Spiel. In 4K ein Vielfaches davon, ohne dass man auf der Werkbank mehr erkennt — deshalb die Empfehlung, in 1080p zu filmen.',
      },
    ],
    related: ['live-erfassung', 'wurfbilder', 'trainer-zusammenarbeit'],
    ogImage: '/video-tagging-spuren.png',
    meta: {
      title: 'Handball Videoanalyse & Tagging (Beta) – Szenen, Spuren, Playlists',
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

  /* ────────────────────────────────────────────────────────── organisieren ── */
  {
    slug: 'termine-und-teilnahme',
    name: 'Termine & Trainingsbeteiligung',
    short: 'Termine',
    group: 'organisieren',
    status: 'live',
    headline: 'Der Kalender, der die Gruppe entlastet',
    summary:
      'Trainings, Spiele und Serientermine im Mannschaftskalender: Spieler sagen selbst zu oder ab, tragen Urlaub, Krankheit oder Verletzung als Zeitraum ein, und der Trainerstab sieht die vollständige Teilnahmeliste.',
    tagline:
      'Der Mannschaftskalender, der die Frage „wer kommt eigentlich Dienstag?“ aus der WhatsApp-Gruppe holt.',
    intro: [
      'Termine ist der Kalender deiner Mannschaft: Trainings als Serie, Spiele mit Treffpunkt und Anwurf, Mannschaftsabende, Athletik. Jeder Termin hat eine Halle aus dem Adressbuch — einmal eingetragen, danach mit Navigation in Google Maps oder Apple Karten.',
      'Zusagen macht die Mannschaft selbst. Jede Spielerin sieht ihre nächsten Termine und antwortet mit zwei Tipps; wer absagt, kann in einem Satz sagen, warum. Du siehst die vollständige Liste — zugesagt, vielleicht, abgesagt, keine Rückmeldung — und kannst für jemanden eintragen, der die App nicht benutzt.',
      'Der Teil, der den Alltag wirklich ändert, sind Abwesenheiten. Urlaub, Krankheit oder eine Verletzung werden einmal als Zeitraum eingetragen und gelten für jeden Termin darin — auch für den, den du erst morgen anlegst. Vorher hat niemand neun Trainings einzeln abgesagt, also hat niemand abgesagt.',
      'Dazu kommen die Kleinigkeiten, an denen es sonst hängt: eine Zusagefrist mit Erinnerung, Push-Benachrichtigungen, wenn ein Termin dazukommt, sich verschiebt oder ausfällt, und ein Kalender-Abo, mit dem alle Termine im eigenen Handykalender stehen und dort aktuell bleiben.',
    ],
    facts: [
      { term: 'Terminarten', value: 'Training, Spiel, sonstiger Termin' },
      { term: 'Serien', value: 'Wöchentlich oder 14-tägig, mehrere Wochentage' },
      { term: 'Rückmeldung', value: 'Zusagen, vielleicht, absagen — mit Grund' },
      { term: 'Abwesenheiten', value: 'Urlaub, krank, verletzt als Zeitraum' },
      { term: 'Erinnerungen', value: 'Push vor Zusage-Schluss und bei Änderungen' },
      { term: 'Kalender-Abo', value: 'Ein Link für Apple, Google und Outlook' },
    ],
    steps: [
      {
        title: 'Trainings als Serie anlegen',
        body: 'Dienstag und Donnerstag 19:30 sind eine Serie, nicht zwei. Einzelne Termine daraus lassen sich trotzdem verschieben, absagen oder mit einer eigenen Notiz versehen.',
      },
      {
        title: 'Spieltermine mit Treffpunkt',
        body: 'Treffen, Anwurf, Ende — dazu Heim oder auswärts, die Spielart und die Halle mit Adresse. Was die Mannschaft am Spieltag wissen muss, steht auf einer Karte.',
      },
      {
        title: 'Die Mannschaft antwortet selbst',
        body: 'Jede Spielerin bekommt den Zugang über einen Beitrittslink und sieht danach ihre eigenen Termine. Zwei Tipps für zu oder ab, ein Satz als Grund, wenn es einer ist.',
      },
      {
        title: 'Abwesenheiten einmal eintragen',
        body: 'Zwei Wochen Urlaub sind ein Eintrag. Jeder Termin darin gilt als abgesagt, und wer doch kommt, sagt für diesen einen Termin trotzdem zu.',
      },
      {
        title: 'Beteiligung im Blick behalten',
        body: 'Der Trainerstab sieht die vollständige Teilnahmeliste je Termin, inklusive derer, die gar nicht geantwortet haben — und im Kalender, wie viele an welchem Tag fehlen.',
      },
    ],
    shots: [
      {
        src: '/termine-liste.png',
        alt: 'Terminliste in Statix mit Trainings, Spielen, Treffpunkt-Zeitleiste und Rückmeldungen',
        label: 'Die Wochenliste: Serie, Treffen–Beginn–Ende, wer dabei ist',
        width: 2560,
        height: 2000,
      },
      {
        src: '/termine-kalender.png',
        alt: 'Monatskalender der Mannschaft in Statix mit Trainings, Spielen und Abwesenheiten',
        label: 'Der Monat: Trainings, Spiele — und wie viele fehlen',
        width: 2560,
        height: 2000,
      },
      {
        src: '/termine-detail.png',
        alt: 'Ein Spieltermin in Statix mit Halle, Adresse, Navigation, Notiz und Teilnahmeliste',
        label: 'Ein Spieltermin mit Halle, Navigation und Notiz',
        width: 2560,
        height: 2000,
      },
      {
        src: '/termine-teilnahme.png',
        alt: 'Teilnahmeliste eines Termins mit zugesagten und abgesagten Spielern samt Abwesenheitsgrund',
        label: 'Wer kommt — und bei wem der Grund ein Zeitraum ist',
        width: 2560,
        height: 1600,
      },
      {
        src: '/termine-abwesenheiten.png',
        alt: 'Abwesenheiten in Statix: Urlaub, Krankheit und Verletzung als Zeiträume',
        label: 'Urlaub, krank, verletzt — einmal als Zeitraum',
        width: 2560,
        height: 1600,
      },
      {
        src: '/mobil-termine.png',
        alt: 'Terminliste auf dem Handy einer Spielerin',
        label: 'So sagt eine Spielerin zu: zwei Tipps auf dem Handy',
        width: 780,
        height: 1688,
      },
    ],
    limits: [
      'Statix plant keine Hallenbelegung und stimmt sich nicht mit anderen Mannschaften über freie Zeiten ab. Der Kalender gehört einer Mannschaft.',
      'Serien sind wöchentlich oder 14-tägig. „Jeden dritten Dienstag“ gibt es nicht, weil es niemand so plant.',
      'Push-Benachrichtigungen brauchen auf dem iPhone die installierte App auf dem Home-Bildschirm — das ist eine Regel von iOS, keine von Statix.',
      'Das Kalender-Abo zeigt Zeiten und Orte, keine Namen und keine Rückmeldungen. Wer den Link hat, kann ihn lesen.',
    ],
    faq: [
      {
        question: 'Brauchen die Spielerinnen ein eigenes Konto?',
        answer:
          'Für die eigene Zu- und Absage ja — der Zugang kommt über einen Beitrittslink vom Trainerteam, das dauert eine Minute. Wer keinen Zugang will, wird vom Trainerstab eingetragen; die Zeile ist dieselbe.',
      },
      {
        question: 'Was passiert, wenn ich einen Termin verschiebe?',
        answer:
          'Alle, die Benachrichtigungen aktiviert haben, bekommen eine Meldung mit dem neuen Datum, und im abonnierten Kalender rückt der Eintrag von selbst. Die bereits gegebenen Rückmeldungen bleiben stehen.',
      },
      {
        question: 'Wie funktioniert der Urlaubseintrag genau?',
        answer:
          'Ein Zeitraum mit Anfang und Ende, beide Tage eingeschlossen, plus Grund und optional eine Notiz, die nur der Trainerstab sieht. Jeder Termin darin zählt als abgesagt — auch die, die es zum Zeitpunkt des Eintrags noch gar nicht gibt. Für einen einzelnen Termin darin kann man trotzdem zusagen.',
      },
      {
        question: 'Werden Spiele automatisch zu Terminen?',
        answer:
          'Ja. Ein angelegtes Spiel erscheint im Kalender mit Datum, Gegner und Ort — und wenn du das Spiel verschiebst, verschiebt sich der Termin mit. Es gibt keine zweite Stelle, an der dasselbe Datum gepflegt wird.',
      },
      {
        question: 'Sehen die Spielerinnen, warum jemand abgesagt hat?',
        answer:
          'Nein. Der Grund und die Notiz zu einer Abwesenheit sind zwischen ihr und dem Trainerteam. Die Mannschaft sieht die Zahl, nicht den Satz.',
      },
    ],
    related: ['team-management', 'spieler-umfragen', 'gegner-bilanz'],
    ogImage: '/termine-kalender.png',
    meta: {
      title: 'Handball Terminverwaltung & Trainingsbeteiligung für Mannschaften',
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
    name: 'Team-Management',
    short: 'Team & Saison',
    group: 'organisieren',
    status: 'live',
    headline: 'Kader, Saison und Trainerstab an einem Ort',
    summary:
      'Verwalte Kader, Spiele und Saisons an einem Ort und teile Auswertungen mit dem ganzen Team.',
    tagline:
      'Kader, Spielplan, Saison und Trainerstab an einer Stelle — statt in einer Tabelle, die nur einer hat.',
    intro: [
      'Eine Mannschaft in Statix hat einen Kader, eine Saison und einen Trainerstab. Der Kader trägt Namen, Rückennummer, Position und Zugehörigkeit; wer die Mannschaft verlässt, wird nicht gelöscht, sondern als ausgeschieden geführt — sonst verschwände die halbe Saison mit ihm.',
      'Spiele werden mit Gegner, Datum, Heim oder auswärts und Spielart angelegt und laufen dann durch die Zustände geplant, läuft, beendet. Der Saisonwechsel legt eine neue Saison an, ohne die alte zu verlieren: die Vorsaison bleibt vollständig lesbar.',
      'Co-Trainer bekommen eine Einladung per E-Mail und arbeiten danach im selben Team — mit denselben Spielen und derselben Auswertung, nicht mit einer Kopie.',
    ],
    facts: [
      { term: 'Kader', value: 'Name, Nummer, Position, Zu- und Abgänge' },
      { term: 'Saisons', value: 'Mehrere, die alte bleibt vollständig lesbar' },
      { term: 'Trainerstab', value: 'Einladung per E-Mail, gemeinsames Team' },
      { term: 'Spiele', value: 'Geplant, laufend, beendet — inklusive Spielart' },
    ],
    steps: [
      {
        title: 'Mannschaft anlegen',
        body: 'Name, Saison, Altersklasse. Danach steht der Statistik-Katalog schon bereit — du musst keine Aktionstypen definieren.',
      },
      {
        title: 'Kader eintragen',
        body: 'Einmal pro Saison. Rückennummer und Position sind das, was die Erfassung später braucht.',
      },
      {
        title: 'Trainerstab einladen',
        body: 'Co-Trainer per E-Mail dazuholen. Sie sehen dieselben Spiele und können mit erfassen.',
      },
      {
        title: 'Saison wechseln',
        body: 'Neue Saison anlegen, Kader übernehmen und anpassen. Die Vorsaison bleibt in voller Länge stehen.',
      },
    ],
    shots: [
      {
        src: '/teamManagement.png',
        alt: 'Kaderübersicht in Statix mit Spielerkarten',
        label: 'Der Kader einer Saison',
        width: 2560,
        height: 2000,
      },
      {
        src: '/gameListOverview.png',
        alt: 'Saisonübersicht in Statix mit Bilanz, Form und allen Spielen',
        label: 'Die Saison: Bilanz, Form, Quoten, jedes Spiel',
        width: 2560,
        height: 2000,
      },
    ],
    limits: [
      'Beitrags- und Mitgliederverwaltung macht Statix nicht. Das ist Vereinsverwaltung, keine Spielstatistik.',
      'Es gibt keinen Import aus Verbandsportalen — Kader und Spielplan werden angelegt, nicht übernommen.',
      'Eine Kaderzeile gehört zu genau einer Mannschaft. Wer in zwei Mannschaften spielt, hat zwei Zeilen — im Vereinsbereich stehen sie als eine Laufbahn zusammen.',
    ],
    faq: [
      {
        question: 'Wie viele Mannschaften kann ich verwalten?',
        answer:
          'So viele, wie du brauchst — du wechselst zwischen ihnen. Wenn mehrere Mannschaften zu einem Verein gehören, ist der Vereinsbereich die Ebene darüber.',
      },
      {
        question: 'Was passiert mit einer Spielerin, die den Verein verlässt?',
        answer:
          'Sie wird als ausgeschieden geführt, nicht gelöscht. Ihre Spiele, Quoten und Wurfbilder bleiben Teil der Saison, in der sie gespielt hat.',
      },
      {
        question: 'Können zwei Trainer gleichzeitig arbeiten?',
        answer:
          'Am selben Team ja — an derselben laufenden Erfassung nicht. Ein Spiel erfasst eine Person, weil zwei parallele Erfassungen zwangsläufig auseinanderlaufen.',
      },
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
    name: 'Kader als Kartenalbum',
    short: 'Kartenalbum',
    group: 'organisieren',
    status: 'live',
    headline: 'Der Kader, den die Mannschaft freiwillig öffnet',
    summary:
      'Spielerkarten mit Werten aus echten Spielen, Handball Performance Index, Stickern und Taktikboard.',
    tagline:
      'Der Kader als Sammelalbum: jede Spielerin eine Karte, deren Werte aus echten Spielen kommen.',
    intro: [
      'Statt einer Namensliste zeigt Statix den Kader als Kartenalbum. Jede Karte trägt Nummer, Position und die Werte, die diese Spielerin in echten Spielen produziert hat — keine geschätzten Attribute, sondern gerechnete.',
      'Auf der Karte steht auch der Handball Performance Index: ein Wert, der Abschluss, Effizienz, Fehler und Spielanteil zusammenfasst, damit man Spielerinnen mit unterschiedlichen Rollen nebeneinanderlegen kann. Er ersetzt kein Trainerauge — er ist ein Einstieg in ein Gespräch.',
      'Dazu kommen Sticker für Besonderes und das Taktikboard, auf dem sich die Karten zu einer Aufstellung schieben lassen. Das ist der Teil, den Jugendmannschaften am liebsten mögen — und der Grund, warum ein Kader auch mal freiwillig geöffnet wird.',
    ],
    facts: [
      { term: 'Karteninhalt', value: 'Nummer, Position, gerechnete Werte' },
      { term: 'Index', value: 'Handball Performance Index über alle Rollen' },
      { term: 'Sticker', value: 'Für Marken und Besonderes einer Saison' },
      { term: 'Taktikboard', value: 'Karten zu einer Aufstellung schieben' },
    ],
    steps: [
      {
        title: 'Spielen und erfassen',
        body: 'Die Werte auf der Karte entstehen aus erfassten Spielen. Ohne Spiele bleibt die Karte eine Karte.',
      },
      {
        title: 'Album öffnen',
        body: 'Der Kader liegt als Album vor dir. Ein Tipp auf eine Karte führt ins vollständige Spielerprofil.',
      },
      {
        title: 'Aufstellung schieben',
        body: 'Auf dem Taktikboard lassen sich die Karten auf dem Feld anordnen — für die Ansprache oder die Planung.',
      },
    ],
    shots: [
      {
        src: '/teamManagement.png',
        alt: 'Kader als Kartenalbum in Statix',
        label: 'Der Kader als Album statt als Liste',
        width: 2560,
        height: 2000,
      },
      {
        src: '/mobil-kader.png',
        alt: 'Kaderkarten auf dem Handy',
        label: 'Karten auf dem Handy, in der Kabine gezeigt',
        width: 780,
        height: 1688,
      },
    ],
    limits: [
      'Der Index ist ein Statix-Wert, keine Verbandsnorm. Er vergleicht innerhalb eurer Mannschaft, nicht über Vereine hinweg.',
      'Karten lassen sich nicht drucken oder als Sammelbild bestellen.',
      'Ohne erfasste Spiele hat eine Karte keine Werte — Attribute von Hand einzutragen gibt es bewusst nicht.',
    ],
    faq: [
      {
        question: 'Wie wird der Handball Performance Index gerechnet?',
        answer:
          'Aus Abschlussleistung, Effizienz, Fehlern und Spielanteil, gewichtet nach Position, damit eine Torhüterin und eine Rückraumspielerin auf derselben Skala stehen. Die Bestandteile sind auf der Karte aufklappbar — der Wert ist keine Blackbox.',
      },
      {
        question: 'Können die Spielerinnen ihre Karte sehen?',
        answer:
          'Wenn du sie zeigst. In der Praxis ist genau das der Moment, in dem Jugendliche anfangen, sich für ihre eigenen Zahlen zu interessieren.',
      },
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
    name: 'Turniermodus',
    short: 'Turniere',
    group: 'organisieren',
    status: 'live',
    headline: 'Ein Turniertag ohne Zettelwirtschaft',
    summary:
      'Turniere mit mehreren Mannschaften, automatischer Tabelle, Spielplan und Spieltagskader-Auswahl.',
    tagline:
      'Ein Turniertag mit sechs Mannschaften, ohne dass jemand die Tabelle auf einem Zettel führt.',
    intro: [
      'Im Turniermodus legst du die teilnehmenden Mannschaften und den Spielplan an. Ergebnisse tragen sich entweder von selbst ein — weil ihr das Spiel in Statix erfasst habt — oder von Hand, für die Partien, bei denen ihr gar nicht dabei seid. Die Tabelle rechnet sich nach jedem Ergebnis neu.',
      'Eure eigenen Turnierspiele startest du direkt aus dem Spielplan als vollständige Live-Erfassung. Danach hängt das Ergebnis in der Tabelle und die Statistik im Spielbericht — es gibt keinen zweiten Ort, an dem dasselbe Ergebnis gepflegt wird.',
      'Für den Spieltag wählst du den Kader aus, der wirklich da ist. Und wenn das Turnier vorbei ist, gibt es eine KI-Analyse über das ganze Turnier statt über ein einzelnes Spiel.',
    ],
    facts: [
      { term: 'Mannschaften', value: 'Beliebig viele, auch fremde' },
      { term: 'Tabelle', value: 'Rechnet sich nach jedem Ergebnis neu' },
      { term: 'Eigene Spiele', value: 'Aus dem Spielplan heraus live erfassen' },
      { term: 'Fremde Ergebnisse', value: 'Von Hand eintragbar' },
      { term: 'KI-Analyse', value: 'Über das gesamte Turnier' },
    ],
    steps: [
      {
        title: 'Turnier anlegen',
        body: 'Name, Datum, teilnehmende Mannschaften. Der Spielplan entsteht daraus.',
      },
      {
        title: 'Spieltagskader wählen',
        body: 'Wer heute da ist, steht zur Verfügung. Der Rest der Saison bleibt davon unberührt.',
      },
      {
        title: 'Spiele starten und Ergebnisse eintragen',
        body: 'Eigene Spiele live erfassen, fremde Ergebnisse eintippen. Die Tabelle folgt automatisch.',
      },
      {
        title: 'Turnier auswerten',
        body: 'Tabelle, Spielplan, Statistiken und eine KI-Analyse über den ganzen Tag.',
      },
    ],
    shots: [
      {
        src: '/turnier-uebersicht.png',
        alt: 'Turnierübersicht in Statix mit Tabelle und Spielplan',
        label: 'Tabelle und Spielplan nebeneinander',
        width: 2560,
        height: 2000,
      },
      {
        src: '/turnier-spielplan-ergebnisse.jpg',
        alt: 'Turnier-Spielplan mit eingetragenen Ergebnissen',
        label: 'Der Spielplan mit den Ergebnissen des Tages',
        width: 2560,
        height: 1505,
      },
      {
        src: '/turnier-ki-analyse.png',
        alt: 'KI-Analyse eines gesamten Turniers in Statix',
        label: 'Die KI-Analyse über das ganze Turnier',
        width: 2560,
        height: 2000,
      },
    ],
    limits: [
      'Statix erzeugt keinen Spielplan nach Setzliste oder K.-o.-Baum automatisch. Die Partien werden angelegt.',
      'Für fremde Mannschaften gibt es keine Spielerstatistik — nur Ergebnisse. Erfasst wird immer euer eigenes Spiel.',
      'Eine Turnierverwaltung mit Anmeldung, Hallenplan und Zeitplanung für Ausrichter ist es nicht.',
    ],
    faq: [
      {
        question: 'Können mehrere Trainer parallel Ergebnisse eintragen?',
        answer:
          'Ja, wenn sie im selben Team sind. Verschiedene Spiele gleichzeitig sind kein Problem — dasselbe Spiel gleichzeitig zu erfassen dagegen schon.',
      },
      {
        question: 'Funktioniert der Turniermodus auch für ein Vorbereitungsturnier?',
        answer:
          'Ja. Ob Meisterschaftsturnier, Vorbereitung oder Hallenturnier zwischen den Jahren ändert nichts an der Mechanik.',
      },
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
    name: 'Vereinsbereich',
    short: 'Verein',
    group: 'organisieren',
    status: 'onRequest',
    headline: 'Die Ebene über den Mannschaften',
    summary:
      'Eine Ebene über allen Mannschaften eines Vereins: Übersicht über alle Kader, vereinsweite Spielerliste, Auswertung mit Saisonvergleich und Spielerlaufbahnen über mehrere Jugendmannschaften.',
    tagline:
      'Die Ebene über den Mannschaften: alle Kader, alle Ergebnisse, alle Laufbahnen eines Vereins an einer Stelle.',
    intro: [
      'Der Vereinsbereich ist für Abteilungsleitungen und Jugendkoordinatoren gebaut. Er zeigt am Montagmorgen, was am Wochenende in allen Mannschaften passiert ist: Ergebnisse, kommende Spiele, Tabellenstände — ohne dass jemand zwölf Trainer anschreibt.',
      'Darunter liegen drei Dinge, die eine einzelne Mannschaft nicht leisten kann: eine vereinsweite Spielerliste über alle Kader hinweg, eine Auswertung mit Saisonvergleich je Mannschaft, und Laufbahnen — Personen, die in mehr als einer Mannschaft gespielt haben, in der Reihenfolge ihrer Stationen.',
      'Genau die Laufbahn ist das Argument für Jugendabteilungen: dass eine Spielerin von der C- über die B- in die A-Jugend als eine Person sichtbar bleibt, mit ihrer Entwicklung, statt als drei getrennte Kadereinträge.',
    ],
    facts: [
      { term: 'Für wen', value: 'Abteilungsleitung, Jugendkoordination' },
      { term: 'Einrichtung', value: 'Wird für den Verein eingerichtet' },
      { term: 'Beitritt', value: 'Geht von der Mannschaft aus, per Code' },
      { term: 'Auswertung', value: 'Alle Mannschaften, mit Saisonvergleich' },
      { term: 'Laufbahnen', value: 'Über mehrere Mannschaften hinweg' },
    ],
    steps: [
      {
        title: 'Verein einrichten lassen',
        body: 'Der Vereinsbereich wird für euch angelegt — schreib uns über die Vereinsseite, was ihr braucht.',
      },
      {
        title: 'Mannschaften beitreten lassen',
        body: 'Der Beitrittscode geht an die Cheftrainer. Der Beitritt geht von der Mannschaft aus, nicht vom Verein — jede Mannschaft bleibt Herrin ihrer Daten.',
      },
      {
        title: 'Montagmorgen lesen',
        body: 'Ergebnisse aller Mannschaften, offene Punkte, kommende Spiele auf einer Seite.',
      },
      {
        title: 'Laufbahnen verfolgen',
        body: 'Wer über Jahre durch mehrere Mannschaften geht, steht als eine Person mit ihren Stationen da.',
      },
    ],
    shots: [
      {
        src: '/verein-uebersicht.png',
        alt: 'Vereinsübersicht in Statix mit allen Mannschaften und Ergebnissen',
        label: 'Der Montagmorgen: alle Mannschaften auf einer Seite',
        width: 2560,
        height: 2000,
      },
      {
        src: '/verein-auswertung.png',
        alt: 'Vereinsauswertung in Statix mit Kennzahlen aller Mannschaften',
        label: 'Auswertung über alle Mannschaften',
        width: 2560,
        height: 2000,
      },
      {
        src: '/verein-laufbahnen.png',
        alt: 'Spielerlaufbahnen über mehrere Mannschaften eines Vereins',
        label: 'Laufbahnen: eine Person, mehrere Stationen',
        width: 2048,
        height: 650,
      },
    ],
    limits: [
      'Der Vereinsbereich wird eingerichtet, nicht selbst angelegt — deshalb steht er unter „Auf Anfrage“.',
      'Er ersetzt keine Vereinsverwaltung: keine Mitglieder, keine Beiträge, keine Passwesen.',
      'Eine Mannschaft tritt selbst bei. Ein Verein kann sich keine Mannschaft einverleiben, die das nicht will.',
    ],
    faq: [
      {
        question: 'Wie bekommen wir den Vereinsbereich?',
        answer:
          'Über die Vereinsseite melden — was ein Verein mit zwei Mannschaften braucht, ist nicht das, was ein Verein mit zwölf braucht, deshalb wird das besprochen und eingerichtet statt angeklickt.',
      },
      {
        question: 'Sehen alle Trainer alles?',
        answer:
          'Nein. Die Vereinsebene sieht die Auswertung über die Mannschaften; die Detailarbeit bleibt bei der jeweiligen Mannschaft und ihrem Trainerstab.',
      },
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

  /* ─────────────────────────────────────────────────────────────── teilen ── */
  {
    slug: 'trainer-zusammenarbeit',
    name: 'Trainer-Zusammenarbeit & Freigaben',
    short: 'Teilen & Team',
    group: 'teilen',
    status: 'live',
    headline: 'Weitergeben, ohne aus der Hand zu geben',
    summary:
      'Teile Spiele mit Trainerkollegen in deren Posteingang und lade Co-Trainer fest in dein Team ein.',
    tagline:
      'Ein Spiel weitergeben, ohne es zu verschicken — und ohne dass der andere ein Konto anlegen muss.',
    intro: [
      'Es gibt zwei Wege, jemanden mitlesen zu lassen. Der erste ist die Freigabe: du wählst aus, was geteilt wird — Statistik, KI-Analyse oder beides — und bekommst einen Link. Gibst du eine E-Mail an, die zu einem Statix-Konto gehört, landet das Spiel zusätzlich in dessen Posteingang.',
      'Der zweite Weg ist die feste Einladung in den Trainerstab. Wer eingeladen ist, arbeitet dauerhaft im selben Team, mit denselben Spielen und derselben Auswertung — nicht mit einer Kopie, die nach zwei Wochen veraltet ist.',
      'Jede Freigabe ist widerrufbar. Und weil ein Link auch weitergeleitet wird, gilt: widerrufen heißt sofort tot, nicht bloß unauffindbar. Dazu kommt der PDF-Spielbericht für alle, die etwas Gedrucktes brauchen.',
    ],
    facts: [
      { term: 'Freigabe', value: 'Link oder E-Mail, Umfang wählbar' },
      { term: 'Empfänger', value: 'Braucht für den Link kein Konto' },
      { term: 'Posteingang', value: 'Geteilte Spiele landen dort gebündelt' },
      { term: 'Widerruf', value: 'Jederzeit, sofort wirksam' },
      { term: 'PDF', value: 'Spielbericht zum Ausdrucken' },
    ],
    steps: [
      {
        title: 'Umfang wählen',
        body: 'Statistik, KI-Analyse oder beides. Was du nicht auswählst, ist im geteilten Bericht auch nicht enthalten.',
      },
      {
        title: 'Link erstellen oder E-Mail eintragen',
        body: 'Der Link funktioniert ohne Konto. Eine E-Mail mit Statix-Konto bekommt das Spiel zusätzlich in den Posteingang.',
      },
      {
        title: 'Co-Trainer fest einladen',
        body: 'Für Leute, die dauerhaft dabei sind, ist die Einladung ins Team der richtige Weg — nicht eine Freigabe pro Spiel.',
      },
      {
        title: 'Aufräumen',
        body: 'Aktive Freigaben stehen in einer Liste und lassen sich einzeln widerrufen.',
      },
    ],
    shots: [
      {
        src: '/exportShare.png',
        alt: 'Freigabe-Dialog in Statix: Spiel per Link oder E-Mail mit einem anderen Trainer teilen',
        label: 'Teilen: Umfang wählen, Link erzeugen, widerrufbar',
        width: 2560,
        height: 1600,
      },
      {
        src: '/posteingang-geteilte-spiele.png',
        alt: 'Posteingang in Statix mit Spielen, die andere Trainer geteilt haben',
        label: 'Der Posteingang: was andere mit dir geteilt haben',
        width: 2560,
        height: 1600,
      },
    ],
    limits: [
      'Eine Freigabe ist Nur-Lesen. Wer sie öffnet, kann nichts ändern und nichts erfassen.',
      'Geteilt wird ein Spiel, nicht die ganze Saison. Wer alles sehen soll, gehört in den Trainerstab.',
      'Scouting-Notizen zu Gegnern sind nie Teil einer Freigabe.',
    ],
    faq: [
      {
        question: 'Braucht der Empfänger ein Statix-Konto?',
        answer:
          'Für den Link nicht. Mit Konto ist es bequemer, weil geteilte Spiele im Posteingang gesammelt werden statt in Chatverläufen.',
      },
      {
        question: 'Was passiert nach dem Widerruf?',
        answer:
          'Der Link antwortet sofort nicht mehr — auch der, den jemand weitergeleitet hat. Ein bereits heruntergeladenes PDF holt naturgemäß niemand zurück.',
      },
      {
        question: 'Kann ich ein Spiel anonym teilen?',
        answer:
          'Ein reiner Link nennt nicht, wer ihn erstellt hat. Wer über die E-Mail teilt, erscheint beim Empfänger namentlich — das ist der Punkt des Posteingangs.',
      },
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
    name: 'Spieler-Umfragen',
    short: 'Umfragen',
    group: 'teilen',
    status: 'live',
    headline: 'Eine Frage, die nicht im Chat untergeht',
    summary:
      'Erstelle Umfragen zu Verfügbarkeit oder Feedback und teile einen Link – Spieler antworten ohne Account.',
    tagline:
      'Eine Frage an die Mannschaft, deren Antworten nicht in vierzig Chat-Nachrichten untergehen.',
    intro: [
      'Umfragen sind der Weg für alles, was keine Termin-Rückmeldung ist: Trikotgrößen, Mitfahrgelegenheiten, Rückmeldung nach der Vorbereitung, Terminwünsche für das Trainingslager. Du baust die Fragen — Freitext, Einfach- oder Mehrfachauswahl, Skala, Ja/Nein — und teilst einen Link.',
      'Antworten geht ohne Konto. Wer den Link öffnet, wählt sich aus dem Kader aus und antwortet. Das ist der Unterschied, der darüber entscheidet, ob eine Umfrage beantwortet wird oder nicht.',
      'Du kannst festlegen, ob jemand einmal oder mehrfach antworten darf — einmalig für eine Anmeldung, mehrfach für eine wiederkehrende Abfrage.',
    ],
    facts: [
      { term: 'Fragetypen', value: 'Freitext, Auswahl, Skala, Ja/Nein' },
      { term: 'Antworten', value: 'Ohne Konto, über einen Link' },
      { term: 'Mehrfachantworten', value: 'Ein- oder ausschaltbar' },
      { term: 'Status', value: 'Entwurf, aktiv, geschlossen' },
    ],
    steps: [
      {
        title: 'Fragen zusammenstellen',
        body: 'Titel, kurze Beschreibung, dann die Fragen. Pflichtfelder und Hilfetexte je Frage.',
      },
      {
        title: 'Link teilen',
        body: 'In die Mannschaftsgruppe. Wer ihn öffnet, wählt sich aus dem Kader und antwortet.',
      },
      {
        title: 'Antworten lesen',
        body: 'Gesammelt, je Frage ausgewertet. Freitext bleibt Freitext, Auswahl wird gezählt.',
      },
      {
        title: 'Schließen',
        body: 'Eine geschlossene Umfrage nimmt keine Antworten mehr an, bleibt aber lesbar.',
      },
    ],
    shots: [
      {
        src: '/spielerumfragen.png',
        alt: 'Spieler-Umfragen in Statix mit Status und Antwortzahlen',
        label: 'Umfragen mit Status und Antwortzahl',
        width: 2560,
        height: 1600,
      },
    ],
    limits: [
      'Für Zu- und Absagen zu Trainings und Spielen sind die Termine der richtige Ort — dort hängen sie an einem Datum und an der Teilnahmeliste.',
      'Antworten sind nicht anonym: wer antwortet, wählt sich aus dem Kader.',
      'Umfragen erinnern nicht von selbst. Der Anstoß bleibt beim Trainer.',
    ],
    faq: [
      {
        question: 'Wie unterscheidet sich eine Umfrage von einer Termin-Zusage?',
        answer:
          'Eine Termin-Zusage gehört zu einem Datum und speist die Teilnahmeliste. Eine Umfrage ist eine freie Frage an die Mannschaft — Trikotgrößen, Fahrgemeinschaften, Rückmeldung nach der Vorbereitung.',
      },
      {
        question: 'Können Eltern antworten?',
        answer:
          'Jeder mit dem Link kann antworten und wählt sich dabei aus dem Kader aus. Bei Jugendmannschaften ist genau das oft der Elternteil, der das Handy in der Hand hat.',
      },
    ],
    related: ['termine-und-teilnahme', 'trainer-zusammenarbeit', 'team-management'],
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

/* ─────────────────────────────────────────────────────────────── helpers ── */

const BY_SLUG = new Map(FEATURES.map((feature) => [feature.slug, feature]));

/** One feature, or `undefined` for an unknown slug. */
export function getFeature(slug: string): Feature | undefined {
  return BY_SLUG.get(slug);
}

/** Every slug — the source for `generateStaticParams` and the sitemap. */
export function allFeatureSlugs(): string[] {
  return FEATURES.map((feature) => feature.slug);
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
 */
export function featureStateNote(status: FeatureStatus): string {
  if (status === 'beta') {
    return ' In Arbeit — wird gerade gebaut und ist noch nicht für alle Konten freigeschaltet.';
  }
  if (status === 'onRequest') {
    return ' Wird für den Verein eingerichtet statt selbst angelegt.';
  }
  return '';
}

/** Short label for cards and navigation. */
export function featureLabel(feature: Feature): string {
  return feature.short ?? feature.name;
}

/** The related features of one entry, resolved and with unknown slugs dropped. */
export function relatedFeatures(feature: Feature): Feature[] {
  return feature.related
    .map((slug) => BY_SLUG.get(slug))
    .filter((entry): entry is Feature => Boolean(entry));
}

/** How many features are generally available — used in the index standfirst. */
export const LIVE_FEATURE_COUNT = FEATURES.filter(
  (feature) => feature.status === 'live',
).length;
