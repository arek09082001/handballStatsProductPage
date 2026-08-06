import type { BoardFaqItem } from '@/components/custom-ui/board-faq';

export const CALCULATOR_PAGE_PATH = '/wurfquote-rechner';
export const CALCULATOR_EMBED_PATH = '/wurfquote-rechner/embed';

export interface PositionBenchmark {
  id: string;
  label: string;
  /** Lower end of the typical range in percent. */
  min: number;
  /** Upper end; omitted where only a floor is meaningful (team quota). */
  max?: number;
  hint: string;
}

/**
 * Richtwerte aus dem Ratgeber-Artikel `wurfquote-berechnen` – Amateur- bis
 * ambitionierter Ligabereich. Bewusst dieselben Zahlen wie im Artikel: zwei
 * Quellen mit unterschiedlichen Spannen wären für Trainer wertlos.
 */
export const POSITION_BENCHMARKS: PositionBenchmark[] = [
  {
    id: 'tempo',
    label: 'Tempogegenstoß / Konter',
    min: 85,
    max: 95,
    hint: 'Freie Bälle aufs leere oder halb besetzte Tor – hier ist die Erwartung am höchsten.',
  },
  {
    id: 'siebenmeter',
    label: 'Siebenmeter',
    min: 75,
    max: 85,
    hint: 'Eigene Disziplin. Getrennt führen, sonst verzerrt sie die Feldquote.',
  },
  {
    id: 'kreis',
    label: 'Kreis',
    min: 65,
    max: 75,
    hint: 'Kürzeste Distanz, dafür oft im Fallen und mit Körperkontakt.',
  },
  {
    id: 'aussen',
    label: 'Außen',
    min: 55,
    max: 70,
    hint: 'Spitzer Winkel, dafür meist ohne Block vor sich.',
  },
  {
    id: 'rueckraum',
    label: 'Rückraum (9 Meter)',
    min: 45,
    max: 55,
    hint: 'Größte Distanz, geschlossener Block, Torwart gut vorbereitet.',
  },
  {
    id: 'team',
    label: 'Mannschaft gesamt',
    min: 60,
    hint: 'Über 60 Prozent gilt im Amateurbereich als solider Wert.',
  },
];

export const DEFAULT_BENCHMARK_ID = 'rueckraum';

/** Snippet für Vereinsseiten – dieselbe Höhe wie das Embed-Layout. */
export const EMBED_SNIPPET = `<iframe
  src="https://www.statix-app.de/wurfquote-rechner/embed"
  title="Wurfquoten-Rechner von Statix"
  width="100%"
  height="760"
  loading="lazy"
  style="border:0;max-width:640px"
></iframe>`;

export const CALCULATOR_FAQS: BoardFaqItem[] = [
  {
    question: 'Wie berechnet man die Wurfquote im Handball?',
    answer:
      'Du teilst die Tore durch die Würfe und multiplizierst mit 100: Wurfquote (%) = Tore ÷ Würfe × 100. Beispiel: 7 Tore aus 12 Würfen ergeben 58,3 Prozent.',
  },
  {
    question: 'Was zählt als Wurf?',
    answer:
      'Jeder echte Torabschluss: Tor, gehaltener Ball, Pfosten- oder Lattentreffer und klarer Fehlwurf. Ein technischer Fehler ohne Abschluss – etwa ein Schrittfehler – ist kein Wurf und fließt nicht in die Quote ein.',
  },
  {
    question: 'Was ist eine gute Wurfquote?',
    answer:
      'Das hängt von der Position ab. Am Kreis gelten 65–75 Prozent als gut, aus dem Rückraum 45–55 Prozent, beim Siebenmeter 75–85 Prozent und beim Tempogegenstoß 85–95 Prozent. Eine Team-Wurfquote über 60 Prozent ist im Amateurbereich solide.',
  },
  {
    question: 'Wie berechne ich die Paradenquote des Torwarts?',
    answer:
      'Paradenquote = Paraden ÷ (Paraden + Gegentore) × 100. 14 Paraden bei 30 Würfen aufs Tor ergeben rund 47 Prozent. Im Amateurbereich gelten Werte über 33 Prozent als stark, über 40 Prozent als herausragend.',
  },
  {
    question: 'Ab wie vielen Würfen ist die Quote aussagekräftig?',
    answer:
      'Als Faustregel: unter zehn Würfen ist die Quote vor allem Zufall. 100 Prozent aus einem Wurf sagen weniger als 55 Prozent aus zwanzig. Schau deshalb immer auf die Anzahl der Abschlüsse daneben.',
  },
  {
    question: 'Darf ich den Rechner auf unserer Vereinsseite einbinden?',
    answer:
      'Ja, gerne. Kopier dir den iframe-Code von dieser Seite und setz ihn auf eure Homepage. Der Rechner läuft dann in eurem Layout, kostenlos und ohne Anmeldung.',
  },
];
