import type { BoardFaqItem } from '@/components/custom-ui/board-faq';

export const JUGENDTRAINER_PAGE_PATH = '/fuer-jugendtrainer';

export interface YouthBenefit {
  number: number;
  title: string;
  text: string;
}

/** Written for the coach who is also the taxi driver, the tape guy and the referee. */
export const YOUTH_BENEFITS: YouthBenefit[] = [
  {
    number: 1,
    title: 'Ein Tap, während du eigentlich coachst',
    text: 'Du stehst an der Bank, wechselst, redest, korrigierst – und sollst nebenbei mitschreiben. Deshalb ist jede Aktion genau ein Tap: Tor, Fehlwurf, Parade, Zeitstrafe. Kein Stift, kein Klemmbrett, kein Abtippen am Abend.',
  },
  {
    number: 2,
    title: 'Vierzehnjährige sehen ihre eigene Entwicklung',
    text: '„Du wirst besser" glaubt kein Jugendlicher. „Deine Wurfquote von außen ist von 41 auf 58 Prozent gestiegen" schon. Zahlen aus echten Spielen machen Fortschritt sichtbar – auch bei denen, die nicht die meisten Tore werfen.',
  },
  {
    number: 3,
    title: 'Der Kader als Kartenalbum',
    text: 'Spielerkarten mit Werten aus echten Spielen, Sticker für besondere Leistungen und ein Taktikboard zum Aufstellen. Für die Jungs und Mädels ist es ein Sammelalbum – für dich ist es der Kader mit Zahlen dahinter.',
  },
  {
    number: 4,
    title: 'Eltern verfolgen das Spiel im Live-Ticker',
    text: 'Ein Link oder ein QR-Code genügt, und wer auswärts nicht mitfahren konnte, sieht Spielstand und Verlauf live im Browser. Das nimmt dir die zwölf WhatsApp-Nachrichten in der Halbzeit ab.',
  },
  {
    number: 5,
    title: 'Spielzeit fair verteilen – und es belegen können',
    text: 'Im Jugendbereich ist Einsatzzeit ein Dauerthema. Wer erfasst, wie oft wer geworfen hat und wie die Spielanteile liegen, kann in einem Elterngespräch etwas zeigen, statt sich zu rechtfertigen.',
  },
  {
    number: 6,
    title: 'Umfragen ohne Account der Spieler',
    text: 'Wer kann Samstag? Du erstellst eine Umfrage und teilst einen Link – die Spieler antworten ohne Anmeldung. Niemand muss eine App installieren, nur weil du wissen willst, wer im Bus sitzt.',
  },
];

export interface YouthObjection {
  question: string;
  answer: string;
}

export const YOUTH_OBJECTIONS: YouthObjection[] = [
  {
    question: '„Ich habe während des Spiels keine Hand frei."',
    answer:
      'Das ist der Grund, warum die Erfassung so gebaut ist, wie sie ist: Eine Aktion ist ein Tap, ohne Menü und ohne Nachfrage. Und du musst nicht alles erfassen. Fang mit Toren und Fehlwürfen an – das ist schon mehr, als eine Strichliste am Ende hergibt. Wenn es hektisch wird, ergänzt du Aktionen nach dem Spiel.',
  },
  {
    question: '„Für D-Jugend ist das doch Leistungsdenken."',
    answer:
      'Kommt darauf an, was du mit den Zahlen machst. Wenn du sie nutzt, um zu ranken, ja. Wenn du sie nutzt, um einem Kind zu zeigen, dass sein Training etwas bringt, ist es das Gegenteil. Deshalb liegt der Fokus auf Entwicklung über eine Saison und nicht auf einer Bestenliste.',
  },
  {
    question: '„Ich bin nicht der Typ für Software."',
    answer:
      'Musst du auch nicht sein. Es gibt keine Einrichtung, keine Schulung und kein Handbuch: Kader anlegen, Spiel starten, tippen. Wer es vorher sehen will, öffnet die Live-Demo – ohne Account, direkt im Browser.',
  },
  {
    question: '„Kostet das den Verein Geld?"',
    answer:
      'Aktuell nicht. Statix ist kostenlos nutzbar, ohne Kreditkarte und ohne Bezahlvorgang in der App. Du brauchst also niemanden zu fragen, um am Samstag anzufangen.',
  },
];

export const JUGENDTRAINER_FAQS: BoardFaqItem[] = [
  {
    question: 'Ab welcher Altersklasse lohnen sich Statistiken im Jugendhandball?',
    answer:
      'Sinnvoll wird es dort, wo Kinder ihre eigene Entwicklung verstehen können – etwa ab der D-Jugend. In der E- und F-Jugend geht es um Ballgefühl und Spielfreude; da reicht es, wenn du für dich mitläufst, ohne die Zahlen zum Thema zu machen.',
  },
  {
    question: 'Wie erfasse ich Statistiken, wenn ich gleichzeitig coache?',
    answer:
      'Mit einem Tap pro Aktion. Erfasse zuerst nur Tore und Fehlwürfe – daraus entsteht schon die Wurfquote. Alles Weitere kannst du nach dem Spiel ergänzen, weil sich Aktionen nachträglich bearbeiten lassen.',
  },
  {
    question: 'Wie zeige ich einem Jugendlichen seine Entwicklung?',
    answer:
      'Über den Verlauf statt über ein einzelnes Spiel. In Statix siehst du Wurfquoten und Werte über mehrere Spiele hinweg, dazu die Spielerkarte im Kartenalbum. Ein Gespräch über eine Kurve, die nach oben zeigt, funktioniert deutlich besser als eines über ein schlechtes Spiel.',
  },
  {
    question: 'Können Eltern die Spiele verfolgen?',
    answer:
      'Ja, über den öffentlichen Live-Ticker. Du veröffentlichst das Spiel, teilst Link oder QR-Code, und Eltern sehen Spielstand und Spielverlauf live im Browser – ohne App und ohne Account.',
  },
  {
    question: 'Ist eine Handball-Statistik-App für Jugendtrainer kostenlos?',
    answer:
      'Ja, aktuell kostet Statix nichts: kein Bezahlvorgang, keine Kreditkarte, keine Testphase mit Ablaufdatum. Die Live-Demo läuft sogar ganz ohne Account.',
  },
  {
    question: 'Was mache ich mit den Zahlen im Training?',
    answer:
      'Verbinde sie mit dem Wurfbild: Sinkt die Quote nur aus einer Zone, kennst du das Übungsziel. Und sprich Zahlen positiv an – „aus dem Rückraum bist du bei 58 Prozent, lass uns die Sprungwürfe schärfen" wirkt besser als reine Kritik.',
  },
];
