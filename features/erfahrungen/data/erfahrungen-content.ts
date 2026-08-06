import type { BoardFaqItem } from '@/components/custom-ui/board-faq';

export const ERFAHRUNGEN_PAGE_PATH = '/erfahrungen';

export interface FeedbackStep {
  number: number;
  title: string;
  text: string;
}

/** How feedback from a sports hall actually reaches the product. */
export const FEEDBACK_LOOP: FeedbackStep[] = [
  {
    number: 1,
    title: 'Es fällt in der Halle auf',
    text: 'Fast alles, was in Statix steckt, ist an einem Spieltag entstanden: ein Knopf, der zu klein war, eine Auswertung, die im Bus keiner öffnen konnte, eine Aktion, die im Getümmel zwei Taps zu viel gebraucht hat.',
  },
  {
    number: 2,
    title: 'Es kommt per Mail oder Instagram an',
    text: 'Trainer schreiben mir direkt – meistens ohne Formular, oft am Sonntagabend. Ich lese jede Nachricht selbst; es gibt kein Support-Team, das dazwischensteht.',
  },
  {
    number: 3,
    title: 'Es wird gebaut, wenn es mehr als einer braucht',
    text: 'Was mehrfach kommt, landet oben auf der Liste. Turniermodus, Live-Ticker und die Spieler-Umfragen sind genau so entstanden – nicht aus einem Marktplan, sondern weil Trainer danach gefragt haben.',
  },
  {
    number: 4,
    title: 'Es geht zurück in die Halle',
    text: 'Neue Funktionen laufen zuerst dort, wo sie gebraucht wurden. Wenn sie einen Spieltag überstehen, bleiben sie – und wenn nicht, fliegen sie wieder raus.',
  },
];

export const ERFAHRUNGEN_FAQS: BoardFaqItem[] = [
  {
    question: 'Gibt es Erfahrungsberichte von Trainern zu Statix?',
    answer:
      'Noch nicht öffentlich. Statix ist jung, und ich veröffentliche erst dann Stimmen, wenn echte Trainer sie mit Namen und Verein freigegeben haben. Erfundene oder anonymisierte Zitate wirst du hier nicht finden.',
  },
  {
    question: 'Wie kann ich Statix selbst testen, ohne mich auf Bewertungen zu verlassen?',
    answer:
      'Über die Live-Demo. Sie läuft mit echten Spieldaten im Browser, ohne Account und ohne Installation – du siehst also selbst, wie sich die Erfassung anfühlt, statt dich auf fremde Erfahrungen zu stützen.',
  },
  {
    question: 'Wer entwickelt Statix?',
    answer:
      'Arkadiusz Weiss, ein Handballer aus Deutschland, der die App aus der eigenen Praxis am Spielfeldrand heraus gebaut hat. Kein Konzern, kein anonymes Team – Feedback aus der Halle fließt direkt in die Entwicklung ein.',
  },
  {
    question: 'Wie gebe ich Feedback oder melde einen Fehler?',
    answer:
      'Am einfachsten per Mail an kontakt@statix-app.de oder über Instagram. Schreib gern konkret, in welcher Situation dir etwas gefehlt hat – am Spieltag, im Training oder bei der Nachbereitung.',
  },
  {
    question: 'Kann ich als Trainer ein Zitat beisteuern?',
    answer:
      'Sehr gern. Schreib mir, wie du mit Statix arbeitest und was dir konkret hilft. Wenn du damit einverstanden bist, dass Name, Rolle und Verein dabeistehen, kommt dein Bericht auf diese Seite.',
  },
];
