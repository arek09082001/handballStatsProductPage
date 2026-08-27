import type { FeatureFaqItem } from './features';

/**
 * Copy that belongs to the feature index itself rather than to any one feature.
 * Kept beside the catalogue so the route file stays a route file, and so the
 * FAQ answers below can be lifted verbatim into the page's `FAQPage` JSON-LD —
 * Google requires the markup and the visible text to match.
 */
export const FEATURES_INDEX_FAQS: FeatureFaqItem[] = [
  {
    question: 'Sind alle Funktionen im kostenlosen Zugang enthalten?',
    answer:
      'Ja. Statix ist noch nicht auf ein Abo umgestellt, also steht im Moment jede fertige Funktion jedem Konto offen — es gibt heute nichts hinter einer Bezahlschranke. Später wird es ein Abo geben; wie es zugeschnitten ist, steht noch nicht fest.',
  },
  {
    question: 'Was heißt „In Arbeit“ bei einer Funktion?',
    answer:
      'Dass sie gebaut wird und mit wenigen Teams läuft, die Rückmeldung geben. Ein neues Konto sieht sie nicht. Wir listen sie trotzdem, weil sie in der App sichtbar ist und weil eine Funktionsliste, die den Stand verschweigt, beim ersten Klick auffliegt.',
  },
  {
    question: 'Was heißt „Auf Anfrage“?',
    answer:
      'Die Funktion ist fertig, wird aber für euch eingerichtet statt selbst angelegt. Das betrifft den Vereinsbereich: was ein Verein mit zwei Mannschaften braucht, ist nicht das, was ein Verein mit zwölf braucht.',
  },
  {
    question: 'Muss ich alles benutzen?',
    answer:
      'Nein. Die meisten Trainer fangen mit der Live-Erfassung an und nehmen sich den Rest, wenn die Frage aufkommt. Termine, Turniere, Video und der Vereinsbereich stehen bereit, ohne dass jemand sie einschalten muss.',
  },
  {
    question: 'Sind die Screenshots echt?',
    answer:
      'Ja. Jede Aufnahme auf diesen Seiten kommt aus einer laufenden Statix-Instanz und wird neu aufgenommen, wenn sich die App ändert. Wo eine Darstellung gezeichnet ist statt fotografiert, steht das ausdrücklich daneben — beim Video-Tagging zum Beispiel, dessen Aufnahmen im Videospeicher liegen und nicht auf der Screenshot-Maschine.',
  },
  {
    question: 'Kann ich Statix ausprobieren, ohne ein Konto anzulegen?',
    answer:
      'Ja. Die Live-Demo ist ein vollständig gefülltes Statix mit echten Spieldaten: Live-Statistiken, Wurfbilder und KI-Analyse direkt im Browser, ohne Anmeldung.',
  },
];
