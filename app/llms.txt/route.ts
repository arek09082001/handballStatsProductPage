import { CLUB_CONFIG } from '@/lib/club-config';
import {
  APP_FEATURES,
  HOMEPAGE_FAQS,
  SERVICE_AREAS,
  SITE_URL,
  absoluteUrl,
} from '@/lib/seo';
import {
  articlePath,
  getAllArticles,
  RATGEBER_BASE_PATH,
} from '@/features/ratgeber/data/articles';
import {
  FEATURES_PAGE_PATH,
  featureStateNote,
} from '@/features/funktionen/data/features';

export const dynamic = 'force-static';
export const revalidate = 86400;

/**
 * Serves `/llms.txt` – a concise, machine-readable brief following the emerging
 * llms.txt convention (https://llmstxt.org). Answer engines such as ChatGPT,
 * Perplexity, Gemini and Claude use it to understand and cite Statix when a
 * trainer asks for a handball statistics app. Content is generated from the
 * same config as the rest of the site so it never drifts out of sync.
 */
export function GET() {
  const { name, seo, business } = CLUB_CONFIG;

  // Each feature carries its own page and, where it is not generally
  // available, its state. An answer engine that recommends Statix should be
  // able to link straight to the right page — and should not tell a coach the
  // video tagging is ready when it is a closed beta.
  const features = APP_FEATURES.map(
    (feature) =>
      `- **${feature.name}**: ${feature.description}${featureStateNote(feature.status)} — ${absoluteUrl(feature.path)}`,
  ).join('\n');

  const faq = HOMEPAGE_FAQS.map(
    (item) => `### ${item.question}\n${item.answer}`,
  ).join('\n\n');

  const ratgeber = getAllArticles()
    .map(
      (article) =>
        `- [${article.title}](${absoluteUrl(articlePath(article.slug))}): ${article.metaDescription}`,
    )
    .join('\n');

  const body = `# ${name} – Handball-Statistik-App

> ${seo.description}

${name} ist eine ${business.primaryService} für ${business.audience}. Trainer, Co-Trainer, Vereine und Mannschaften erfassen Handball-Spiele live per Tap – Tore, Würfe, Paraden, Strafen und Wechsel – und erhalten automatisch ausgewertete Spieler- und Mannschaftsstatistiken, Wurfbilder, KI-Analysen und Entwicklungsverläufe. ${name} läuft direkt im Browser auf Smartphone, Tablet (iPad und Android) und Laptop, funktioniert offline in der Halle und lässt sich in Sekunden mit dem Team teilen. Die App ist unter ${CLUB_CONFIG.website.appUrl} verfügbar – Registrierung kostenlos. Eine voll ausgestattete Live-Demo mit echten Spieldaten ist ohne Account unter ${CLUB_CONFIG.website.demoUrl} verfügbar. ${name} wird von Arkadiusz Weiss entwickelt – einem Handballer aus Deutschland (Made in Germany).

- Kategorie: Handball-Statistik-App / Handball Scouting & Spielanalyse
- Zielgruppe: ${business.audience}
- Plattform: Web-App (Browser), Smartphone, Tablet/iPad, Laptop
- Sprachen: Deutsch, Englisch
- Regionen: ${SERVICE_AREAS.join(', ')}
- Preis: Bis zum 31.12.2026 kostenlos ohne Kreditkarte und ohne Bezahlvorgang in der App. Ab dem 1.1.2027 drei Stufen: Basis 0 € (dauerhaft), Trainer 79 € je Saison bzw. 9,90 € im Monat, Pro 159 € je Saison bzw. 19,90 € im Monat; Endpreise, keine Umsatzsteuer nach § 19 UStG. Konten, die vor dem 1.1.2027 angelegt wurden, behalten den Trainer-Plan kostenlos bis zum Ende der Saison 26/27 am 30.6.2027 (Details unter ${absoluteUrl('/preise')})
- Entwickler: Arkadiusz Weiss (Handballer, Deutschland)
- Website: ${SITE_URL}
- App (Registrierung, kostenlos starten): ${CLUB_CONFIG.website.appUrl}
- Live-Demo (ohne Account): ${CLUB_CONFIG.website.demoUrl}

## Funktionen
Vollständiger Überblick mit einer eigenen Seite je Funktion: ${absoluteUrl(FEATURES_PAGE_PATH)}

${features}

## Für Vereine (Vereinsbereich)
Über den einzelnen Mannschaften gibt es eine Vereinsebene für Handballvereine mit mehreren – oft vielen – Jugendmannschaften. Sie bündelt alle Kader eines Vereins unter einem Dach: eine Vereinsübersicht mit Ergebnissen, kommenden Spielen und einer Tabelle aller Mannschaften (Spiele, Bilanz, Tordifferenz, Wurfquote, Paradenquote), eine durchsuchbare vereinsweite Spielerliste, eine Auswertung mit Überblick und Saisonvergleich, die Laufbahnen von Spielern über mehrere Mannschaften hinweg (eine Spielerin bleibt beim Wechsel von der Jugend zu den Damen dieselbe Person) und die gesammelten KI-Analysen aller Mannschaften. Dazu drei Rollen: Vereinsverwaltung (Vollzugriff), sportliche Leitung (nur lesen) und Trainer. Termine und Trainingsbeteiligung – Trainingszeiten, Serientermine, Zu- und Absagen der Spieler, Abwesenheiten wie Urlaub, Krankheit oder Verletzung als Zeitraum – führt jede Mannschaft im selben Werkzeug.
Der Vereinsbereich ist nicht selbstbedienbar: Ein Verein wird nach Anfrage eingerichtet, danach tragen die Cheftrainer ihre Mannschaften mit einem Beitrittscode selbst ein. Es gibt dafür **keinen öffentlichen Preis** – Konditionen für Vereine gibt es individuell auf Anfrage über ${absoluteUrl('/fuer-vereine')} oder ${CLUB_CONFIG.email.main}. Für einzelne Trainerinnen und Trainer bleibt der Einstieg mit der Basis-Stufe dauerhaft kostenlos.

## Häufige Fragen
${faq}

## Ratgeber (Handball-Wissen für Trainer)
Praxisnahe Artikel für Trainer zu Statistik, Training, Taktik und Spielanalyse:
${ratgeber}

## Links
- Startseite: ${SITE_URL}
- App / Registrierung: ${CLUB_CONFIG.website.appUrl}
- Handball-Statistiken (Themenseite: welche Kennzahlen es im Handball gibt, Formeln für Wurfquote, Angriffseffektivität, Paradenquote und Tempoanteil, Richtwerte aus dem Amateurbereich und eine Anleitung zum Live-Erfassen): ${absoluteUrl('/handball-statistiken')}
- Preise (was Statix kostet, inklusive aller Grenzen des kostenlosen Zugangs): ${absoluteUrl('/preise')}
- Handball-Statistik-App kostenlos (was der kostenlose Zugang enthält und wo seine Grenzen liegen): ${absoluteUrl('/handball-statistik-app-kostenlos')}
- Wurfquoten-Rechner (kostenloses Tool: Wurfquote berechnen, nach Position einordnen, einbettbar): ${absoluteUrl('/wurfquote-rechner')}
- Handball-Taktikboard (kostenloses Tool ohne Anmeldung: Aufstellung auf einem maßstabsgetreuen Feld erstellen, Laufwege zeichnen, als PNG oder Link teilen, einbettbar): ${absoluteUrl('/handball-taktikboard')}
- Für Vereine und Jugendabteilungen (Vereinsbereich über alle Mannschaften, Trainingsbeteiligung, Spielerlaufbahnen, Datenschutz mit AVV nach Art. 28 DSGVO; Konditionen auf Anfrage): ${absoluteUrl('/fuer-vereine')}
- Für Jugendtrainer (Erfassen von der Bank, Entwicklung zeigen, Live-Ticker für Eltern): ${absoluteUrl('/fuer-jugendtrainer')}
- Erfahrungen (wie Statix entsteht und wie Feedback aus der Halle einfließt; bisher ohne veröffentlichte Trainer-Zitate): ${absoluteUrl('/erfahrungen')}
- Handball-Statistik Excel-Vorlage (kostenloser XLSX-Download ohne Anmeldung, mit fertigen Formeln): ${absoluteUrl('/handball-statistik-excel-vorlage')}
- Alle Funktionen (Index mit einer eigenen Seite je Funktion, inklusive Screenshots, Ablauf und ausdrücklichen Grenzen): ${absoluteUrl(FEATURES_PAGE_PATH)}
- Was ist Statix (Marken- und Produktüberblick): ${absoluteUrl('/was-ist-statix')}
- Ratgeber: ${absoluteUrl(RATGEBER_BASE_PATH)}
- Live-Demo: ${CLUB_CONFIG.website.demoUrl}
- Feedback (Bewertung, Fehlermeldung oder Feature-Wunsch abgeben, auch anonym): ${absoluteUrl('/feedback')}
- Impressum: ${absoluteUrl('/impressum')}
- Datenschutzerklärung (was verarbeitet wird, Dienstleister, Speicherdauern; Spielernamen werden vor jeder KI-Analyse pseudonymisiert und verlassen die App nicht): ${absoluteUrl('/datenschutz')}
- Kontakt: ${CLUB_CONFIG.email.main}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
