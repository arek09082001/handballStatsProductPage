import type { BoardFaqItem } from '@/components/custom-ui/board-faq';

export const VEREINE_PAGE_PATH = '/fuer-vereine';

/**
 * Where every club CTA on this page goes.
 *
 * Deliberately the contact route and not the app registration: the club level
 * is not self-service. A club is set up by hand, its administrators are
 * appointed by hand, and the join code is handed over personally — so the next
 * step for a club is a conversation, not a sign-up form. The `thema` parameter
 * pre-fills the subject line of the contact form (see the contact form
 * section), so a club enquiry arrives labelled as one.
 */
export const VEREINE_CONTACT_TOPIC = 'Vereinsanfrage';
export const VEREINE_CONTACT_HREF = `/kontakt?thema=${encodeURIComponent(
  VEREINE_CONTACT_TOPIC,
)}`;

/** Anchor of the enquiry band at the foot of the page. */
export const VEREINE_CONTACT_ANCHOR = 'vereinsanfrage';

export interface ClubBenefit {
  number: number;
  title: string;
  text: string;
}

/**
 * What changes for a club when every squad records the same way.
 *
 * Each item earns its place by naming something a club cannot do today, and
 * each one says it once: the hero already states the ten-systems problem, so
 * no entry restates it, and no entry closes on a summary of itself. Three
 * sentences is the ceiling.
 */
export const CLUB_BENEFITS: ClubBenefit[] = [
  {
    number: 1,
    title: 'Zehn Jugendmannschaften, ein Schema',
    text: 'Alle Mannschaften erfassen dieselben Aktionen nach denselben Zählregeln, weil die App keine zweiten anbietet. E-Jugend, A-Jugend und Damen stehen danach in einer Tabelle nebeneinander, ohne dass jemand etwas umrechnet.',
  },
  {
    number: 2,
    title: 'Eine Spielerin, eine Laufbahn',
    text: 'Wechselt eine Spielerin von der C- in die B-Jugend und später zu den Damen, ist sie in Statix dieselbe Person mit allen Stationen untereinander. Was drei Trainer über sie gelernt haben, bleibt im Verein.',
  },
  {
    number: 3,
    title: 'Spieler in mehreren Kadern',
    text: 'Eine A-Jugendliche, die bei den Damen aushilft, steht in beiden Kadern: eigene Rückennummer, eigener Terminplan, eigene Zahlen. Für den Spieltag stellt der Trainer daraus seinen Spieltagskader zusammen.',
  },
  {
    number: 4,
    title: 'Termine im selben Werkzeug',
    text: 'Trainingszeiten und Serientermine liegen dort, wo auch die Spiele liegen. Die Spieler sagen selbst zu oder ab und tragen längere Abwesenheiten als Zeitraum ein; der Trainer sieht vorher, wer kommt.',
  },
  {
    number: 5,
    title: 'Ihr seht früh, wo etwas fehlt',
    text: 'Die Vereinsauswertung stellt Mannschaft neben Mannschaft und Saison neben Saison. Eine Jugend, deren Wurfquote seit zwei Jahren steht, fällt damit auf, bevor der Jahrgang durch ist; die Spielerentwicklung dahinter steht auf der Seite der Spielerin.',
  },
  {
    number: 6,
    title: 'Trainerwechsel kosten keine Daten',
    text: 'Hört ein Trainer auf, bleiben Kader, Spiele, Termine und Auswertungen im Verein. Sein Nachfolger übernimmt eine Mannschaft mit Vorgeschichte statt einen leeren Ordner.',
  },
];

export interface ClubCapability {
  /** The screen it is, named the way the club's own navigation names it. */
  term: string;
  text: string;
}

/**
 * The club area, screen by screen — the eight rows of the club's team sheet.
 *
 * One line each, on purpose. The band used to carry a paragraph per item in a
 * card grid, which is three sentences to say "die Auswertung vergleicht
 * Mannschaften"; a club reading this is scanning for whether its own question
 * is on the list, not reading prose. The paragraph belongs in the FAQ, where
 * somebody has asked for it.
 */
export const CLUB_CAPABILITIES: ClubCapability[] = [
  {
    term: 'Übersicht',
    text: 'Die Ergebnisse aller Mannschaften vom Wochenende, die nächsten Spiele und die Tabelle aller Kader.',
  },
  {
    term: 'Mannschaften',
    text: 'Jeder Kader mit Cheftrainer, Trainerstab, letztem und nächstem Spiel. Ein Klick führt hinein.',
  },
  {
    term: 'Spieler',
    text: 'Alle Spielerinnen und Spieler des Vereins in einer Liste, durchsuchbar nach Name oder Mannschaft.',
  },
  {
    term: 'Auswertung',
    text: 'Wurfquote, Paradenquote und Siegquote je Mannschaft, dazu der Vergleich Saison gegen Saison.',
  },
  {
    term: 'Laufbahnen',
    text: 'Wer schon in zwei Mannschaften des Vereins gespielt hat, steht mit seinen Stationen im Dashboard.',
  },
  {
    term: 'KI-Analysen',
    text: 'Die Berichte aller Mannschaften an einer Stelle. Spielernamen sind vorher pseudonymisiert.',
  },
  {
    term: 'Rollen',
    text: 'Die Vereinsverwaltung darf alles, die sportliche Leitung liest mit, Trainer bleiben in ihrer Mannschaft.',
  },
  {
    term: 'Sponsoren',
    text: 'Vereinslogo und Sponsoren laufen auf dem Live-Ticker jeder Mannschaft, die keine eigenen hinterlegt hat.',
  },
];

export interface RolloutStep {
  number: number;
  title: string;
  text: string;
}

/** How a club actually gets started. Four steps, none of them a project. */
export const ROLLOUT_STEPS: RolloutStep[] = [
  {
    number: 1,
    title: 'Ihr schreibt uns',
    text: 'Vereinsname, ungefähre Zahl der Mannschaften und wer den Verein verwalten soll. Mehr brauchen wir nicht, um euch zu sagen, ob und wie das bei euch passt.',
  },
  {
    number: 2,
    title: 'Wir legen den Verein an',
    text: 'Der Vereinsbereich wird von uns eingerichtet – inklusive der Personen, die ihn verwalten. Ihr bekommt den Beitrittscode, ein zehnstelliges Geheimnis, das ihr jederzeit neu erzeugen könnt.',
  },
  {
    number: 3,
    title: 'Die Trainer tragen ihre Mannschaft ein',
    text: 'Jeder Cheftrainer legt sein Konto an, kostenlos und in zwei Minuten, und trägt den Beitrittscode in den Mannschaftseinstellungen ein. Damit gehört seine Mannschaft zum Verein. Kein Import, kein Stichtag, keine Schulung.',
  },
  {
    number: 4,
    title: 'Ab dem ersten Spiel steht die Übersicht',
    text: 'Sobald eine Mannschaft ein Spiel beendet, füllt sich die Vereinsübersicht. Nichts muss nachgetragen werden, niemand pflegt eine zweite Tabelle – die Vereinsebene ist eine Sicht auf die Daten, die die Trainer ohnehin erfassen.',
  },
];

export interface ClubObjection {
  question: string;
  answer: string;
}

/** The sentences that actually get said in a Vorstandssitzung – with answers. */
export const CLUB_OBJECTIONS: ClubObjection[] = [
  {
    question: '„Was kostet das denn?“',
    answer:
      'Auf dieser Seite steht bewusst kein Preisschild. Ein Verein mit zwölf Jugendmannschaften braucht etwas anderes als einer mit zwei, und eine Zahl, die für beide gilt, wäre für einen von beiden falsch. Schreibt uns, wie viele Mannschaften ihr einbinden wollt und was ihr damit vorhabt – dann bekommt ihr ein Angebot, das zu eurem Verein passt, rechtzeitig genug für eure Haushaltsplanung. Für den einzelnen Trainer bleibt der Einstieg unabhängig davon kostenlos.',
  },
  {
    question: '„Unsere Trainer sind nicht technikaffin.“',
    answer:
      'Statix ist für einen Trainer gebaut, der nebenbei coacht. Jede Aktion ist ein Tap, es gibt keine Schulung und keine Einrichtung, die jemand für den Verein übernehmen müsste. Wer will, fängt mit Toren und Würfen an und lässt alles andere liegen. Und wer sich das vorher ansehen möchte, öffnet die Live-Demo ohne Account.',
  },
  {
    question: '„Wir haben doch schon eine Vereinssoftware.“',
    answer:
      'Vermutlich eine für Mitglieder, Beiträge und Abteilungen – und die soll bleiben, wo sie ist. Statix macht das Gegenteil davon: was auf dem Feld und im Training passiert. Kader statt Mitgliederliste, Trainingsbeteiligung statt Beitragsstand, Wurfquote statt Rechnungslauf. Beides nebeneinander ist die Regel, nicht die Ausnahme.',
  },
  {
    question: '„Wir dürfen Spielerdaten nicht einfach irgendwo eingeben.“',
    answer:
      'Richtig, und deshalb ist das geregelt. Für Spielerdaten, die ihr eigenverantwortlich eingebt, ist Statix Auftragsverarbeiter nach Art. 28 DSGVO; einen Vertrag zur Auftragsverarbeitung (AVV) stellen wir auf Anforderung bereit. Vor KI-Analysen werden Spielernamen pseudonymisiert, im öffentlichen Live-Ticker stehen sie standardmäßig abgekürzt, geteilte Berichte lassen sich zurückziehen, und welche Dienstleister beteiligt sind, steht vollständig in den AGB und der Datenschutzerklärung.',
  },
  {
    question: '„Und wenn wir nach einer Saison wieder aufhören?“',
    answer:
      'Dann hört ihr auf. Auswertungen könnt ihr als PDF exportieren und behalten, geteilte Links wieder deaktivieren, und die Mannschaften bleiben ihren Trainern erhalten – der Vereinsbereich ist eine Sicht darauf, kein Käfig darum.',
  },
];

export const VEREINE_FAQS: BoardFaqItem[] = [
  {
    question: 'Was ist der Vereinsbereich von Statix?',
    answer:
      'Eine Ebene über den einzelnen Mannschaften. In der Handball-Statistik-App hängen alle Kader eines Vereins unter einem Dach: eine Vereinsübersicht mit den Ergebnissen und der Tabelle aller Mannschaften, eine vereinsweite Spielerliste, eine Auswertung mit Saisonvergleich, die Laufbahnen der Spieler über mehrere Mannschaften und gesammelte KI-Analysen. Die einzelnen Trainer arbeiten dabei weiter in ihrer eigenen Mannschaft wie bisher.',
  },
  {
    question: 'Für welche Vereine lohnt sich das?',
    answer:
      'Vor allem für eine Jugendabteilung mit vielen Mannschaften, die einheitlich Statistiken führen will – von den Minis bis zur A-Jugend und weiter in den Seniorenbereich. Je mehr Mannschaften und je mehr Übergänge zwischen ihnen es gibt, desto mehr entsteht erst durch den gemeinsamen Standard: vergleichbare Zahlen, durchgehende Spielerlaufbahnen und eine Abteilungsleitung, die nicht bei acht Trainern einzeln nachfragen muss.',
  },
  {
    question: 'Was kostet Statix für einen Verein?',
    answer:
      'Dafür gibt es kein Preisschild von der Stange. Was ein Verein braucht, hängt an der Zahl der Mannschaften und daran, was ihr damit vorhabt – deshalb machen wir euch nach einer kurzen Anfrage ein Angebot, statt hier eine Zahl zu nennen, die für die meisten Vereine falsch wäre. Für einzelne Trainerinnen und Trainer bleibt der Einstieg kostenlos, ohne Kreditkarte.',
  },
  {
    question: 'Wie bekommen wir alle Mannschaften in den Verein?',
    answer:
      'Über einen Beitrittscode. Wir legen den Verein an und geben euch den Code; jeder Cheftrainer trägt ihn in den Einstellungen seiner Mannschaft ein und gehört damit dazu. Der Weg geht bewusst vom Trainer aus – die Mannschaft gehört ihm, also holt ihn niemand von außen hinein. Den Code könnt ihr jederzeit neu erzeugen.',
  },
  {
    question: 'Können Spieler in mehreren Mannschaften stehen?',
    answer:
      'Ja. Eine A-Jugendliche, die bei den Damen aushilft, steht in beiden Kadern – jeweils mit eigener Rückennummer, eigenem Terminplan und eigenen Zahlen. Weil beide Kaderplätze zur selben Person gehören, laufen ihre Stationen trotzdem als eine Laufbahn zusammen, und beim Wechsel in die nächste Altersklasse geht nichts verloren.',
  },
  {
    question: 'Wie behalten wir die Trainingsbeteiligung im Blick?',
    answer:
      'Jede Mannschaft führt ihre Termine in Statix: Training, Spiele und alles dazwischen, auch als Serie. Die Spieler sagen selbst zu oder ab – über einen Beitrittslink, ohne eigene Trainer-App – und tragen längere Abwesenheiten wie Urlaub, Krankheit oder Verletzung als Zeitraum ein, statt jeden einzelnen Termin abzusagen. Der Trainerstab sieht die vollständige Teilnahmeliste inklusive derer, von denen noch keine Rückmeldung kam; Absagegründe bleiben zwischen Spieler und Trainerteam.',
  },
  {
    question: 'Wer im Verein darf welche Daten sehen?',
    answer:
      'Es gibt drei Rollen. Die Vereinsverwaltung hat Zugriff auf alle Mannschaften des Vereins, die sportliche Leitung liest alles und ändert nichts, und ein Trainer erreicht die Mannschaften des Vereins, arbeitet aber weiter in seiner eigenen. Wer keine dieser Rollen hat, sieht den Vereinsbereich nicht.',
  },
  {
    question: 'Wie ist der Datenschutz für Spielerdaten geregelt?',
    answer:
      'Für die Spielerdaten, die ihr eingebt, handelt Statix als Auftragsverarbeiter im Sinne von Art. 28 DSGVO und stellt auf Anforderung einen AVV bereit. Vor KI-Analysen werden Spielernamen pseudonymisiert, sodass die Auswertung mit neutralen Kürzeln arbeitet. Im öffentlichen Live-Ticker erscheinen Namen standardmäßig abgekürzt – bei Jugendmannschaften sind es die Namen von Minderjährigen. Eingesetzte Dienstleister und Drittlandübermittlungen sind in den AGB und der Datenschutzerklärung benannt.',
  },
  {
    question: 'Ersetzt Statix unsere Vereinsverwaltung?',
    answer:
      'Nein, und das soll es auch nicht. Mitgliederverwaltung, Beiträge und Abteilungsorganisation bleiben in eurer bestehenden Software. Statix deckt ab, was dort nicht vorkommt: Kader, Termine und Trainingsbeteiligung, die Live-Erfassung der Spiele und alle Auswertungen daraus.',
  },
  {
    question: 'Was passiert, wenn ein Trainer den Verein verlässt?',
    answer:
      'Die Mannschaft und ihre Spiele bleiben bestehen. Über den Trainerstab oder die Vereinsverwaltung bekommt der Nachfolger Zugriff; ihr seid nicht darauf angewiesen, dass jemand eine private Datei herausgibt.',
  },
  {
    question: 'Brauchen unsere Trainer eine Schulung?',
    answer:
      'Nein. Die Erfassung ist ein Tap pro Aktion, ein Konto ist in zwei Minuten angelegt, und der Beitritt zum Verein ist ein Code in einem Eingabefeld. Wer sich das vorher ansehen möchte, startet die Live-Demo ohne Account – die läuft mit echten Spieldaten im Browser.',
  },
  {
    question: 'Funktioniert das auch in Hallen ohne Netz?',
    answer:
      'Ja. Spiele werden offline erfasst und synchronisieren sich, sobald das Gerät wieder online ist. Statix lässt sich außerdem als App auf dem Homescreen installieren, ohne den Umweg über einen App Store.',
  },
];
