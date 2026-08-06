import type { BoardFaqItem } from '@/components/custom-ui/board-faq';

export const VEREINE_PAGE_PATH = '/fuer-vereine';

export interface ClubBenefit {
  number: number;
  title: string;
  text: string;
}

/** What changes for a club when every team records the same way. */
export const CLUB_BENEFITS: ClubBenefit[] = [
  {
    number: 1,
    title: 'Ein Standard über alle Mannschaften',
    text: 'Wenn A-Jugend, Damen und Herren dieselben Aktionen erfassen, sind ihre Zahlen zum ersten Mal vergleichbar. Wechselt eine Spielerin von der Jugend zu den Damen, kommt ihre Entwicklung mit – statt im Ordner des alten Trainers zu bleiben.',
  },
  {
    number: 2,
    title: 'Trainer teilen Spiele untereinander',
    text: 'Ein Spiel lässt sich per Link oder E-Mail an Trainerkollegen geben; es landet in deren Statix-Posteingang. Wer im Trainerteam fest zusammenarbeitet, lädt Co-Trainer direkt ins Team ein – bis zu fünf pro Mannschaft, offene Einladungen mitgezählt.',
  },
  {
    number: 3,
    title: 'Der Vorstand sieht Entwicklung statt Ergebnisse',
    text: 'Tabellenplätze erzählen wenig über Arbeit. Wurfquoten, Spielanteile und Entwicklungsverläufe über eine Saison zeigen, ob im Training etwas passiert – auch bei einer Mannschaft, die gerade Lehrjahre hat.',
  },
  {
    number: 4,
    title: 'Eltern und Fans bleiben dran',
    text: 'Jedes Spiel lässt sich als öffentlicher Live-Ticker veröffentlichen – Link oder QR-Code, im Browser verfolgbar. Wer sonntags nicht in die Halle kommt, sieht trotzdem, wie es steht.',
  },
  {
    number: 5,
    title: 'Trainerwechsel kosten keine Daten',
    text: 'Hört ein Trainer auf, bleiben Kader, Spiele und Auswertungen im Verein bestehen, statt mit einem privaten Laptop zu verschwinden. Der Nachfolger übernimmt eine Saison mit Vorgeschichte.',
  },
];

export interface ClubObjection {
  question: string;
  answer: string;
}

/** The two sentences a board actually says – answered without dodging. */
export const CLUB_OBJECTIONS: ClubObjection[] = [
  {
    question: '„Wir haben kein Budget."',
    answer:
      'Dann kostet es auch nichts. Statix ist aktuell kostenlos nutzbar, es gibt keinen Bezahlvorgang in der App und keine Rechnung, die im Kassenbericht auftauchen würde. Kein Trainer muss einen Antrag stellen, kein Vorstand einen Beschluss fassen – wer anfangen will, fängt an. Später ist ein Abo für 3,99 € im Monat geplant; die Vereinskonditionen gebe ich vor dem Start bekannt, rechtzeitig genug für eure Haushaltsplanung.',
  },
  {
    question: '„Unsere Trainer sind nicht technikaffin."',
    answer:
      'Das ist der Normalfall, nicht die Ausnahme. Statix ist für einen Trainer gebaut, der nebenbei coacht: Jede Aktion ist ein Tap, es gibt keine Schulung und keine Einrichtung, die jemand für den Verein übernehmen müsste. Wer will, fängt mit dem Nötigsten an – Tore und Würfe – und lässt alles andere liegen. Und wer erstmal nur zuschauen will, öffnet die Live-Demo ohne Account.',
  },
  {
    question: '„Wir dürfen Spielerdaten nicht einfach irgendwo eingeben."',
    answer:
      'Richtig, und deshalb ist das geregelt. Für Spielerdaten, die ihr eigenverantwortlich eingebt, ist Statix Auftragsverarbeiter nach Art. 28 DSGVO; einen Vertrag zur Auftragsverarbeitung (AVV) stellen wir auf Anforderung bereit. Vor KI-Analysen werden Spielernamen pseudonymisiert, geteilte Berichte lassen sich zurückziehen, und welche Dienstleister beteiligt sind, steht vollständig in den AGB und der Datenschutzerklärung.',
  },
  {
    question: '„Und wenn wir nach einer Saison wieder aufhören?"',
    answer:
      'Dann hört ihr auf. Es gibt keine Mindestlaufzeit und nichts zu kündigen. Auswertungen könnt ihr als PDF exportieren und behalten, geteilte Links wieder deaktivieren.',
  },
];

export const VEREINE_FAQS: BoardFaqItem[] = [
  {
    question: 'Was kostet eine Handball-Statistik-App für einen Verein?',
    answer:
      'Statix kostet aktuell nichts – es gibt keinen Bezahlvorgang in der App. Jeder Trainer legt sein Konto an und führt bis zu drei Mannschaften, pro Team kommen bis zu fünf Trainer inklusive offener Einladungen dazu. Geplant ist später ein Abo für 3,99 € im Monat; Vereinskonditionen werden vor dem Start bekannt gegeben.',
  },
  {
    question: 'Wie bekommen wir alle Mannschaften auf denselben Stand?',
    answer:
      'Jeder Trainer legt sein eigenes Konto und seine Mannschaft an – es braucht keine zentrale Einrichtung durch den Verein. Weil alle dieselben Aktionen erfassen, sind die Auswertungen trotzdem vergleichbar. Spiele lassen sich zwischen Trainern teilen, ein Trainerteam kann fest zusammenarbeiten.',
  },
  {
    question: 'Wie ist der Datenschutz für Spielerdaten geregelt?',
    answer:
      'Für die Spielerdaten, die ihr eingebt, handelt Statix als Auftragsverarbeiter im Sinne von Art. 28 DSGVO und stellt auf Anforderung einen AVV bereit. Vor KI-Analysen werden Spielernamen pseudonymisiert, sodass die Auswertung mit neutralen Kürzeln arbeitet. Eingesetzte Dienstleister und Drittlandübermittlungen sind in den AGB und der Datenschutzerklärung benannt.',
  },
  {
    question: 'Können mehrere Trainer gleichzeitig an einer Mannschaft arbeiten?',
    answer:
      'Ja. Du lädst Co-Trainer fest in dein Team ein – bis zu fünf pro Mannschaft, offene Einladungen zählen mit. Zusätzlich kannst du einzelne Spiele mit Trainerkollegen teilen, die dann nur dieses Spiel sehen.',
  },
  {
    question: 'Brauchen unsere Trainer eine Schulung?',
    answer:
      'Nein. Die Erfassung ist ein Tap pro Aktion, ein Konto ist in zwei Minuten angelegt. Wer sich das vorher ansehen möchte, startet die Live-Demo ohne Account – die läuft mit echten Spieldaten im Browser.',
  },
  {
    question: 'Was passiert, wenn ein Trainer den Verein verlässt?',
    answer:
      'Die Mannschaft und ihre Spiele bleiben in Statix bestehen. Über das Trainerteam kann ein Nachfolger übernehmen, statt bei null anzufangen – und ihr seid nicht darauf angewiesen, dass jemand einen alten Laptop herausrückt.',
  },
];
