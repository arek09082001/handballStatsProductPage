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
  FEATURES,
  FEATURES_PAGE_PATH,
  featurePath,
  featureStateNote,
  type Feature,
} from '@/features/funktionen/data/features';
import { VIDEO_REQUEST_PAGE_PATH } from '@/features/video-anfrage/data/video-request-content';

export const dynamic = 'force-static';

/**
 * The video area in full, for answer engines. The one-line feature list is
 * enough for the finished features, but "can Statix stream a handball game?"
 * or "does it do video analysis?" is a question about the details: one phone
 * or two, the delay, what the viewers need, what the analysis from the
 * picture actually does and that it is a closed beta. All of it comes from
 * the German feature catalogue — facts, capabilities, limits and FAQ — so this
 * section changes with the feature pages and cannot drift from them.
 */
function videoSection(feature: Feature): string {
  const lines: string[] = [
    `### ${feature.name}`,
    `Seite: ${absoluteUrl(featurePath(feature.slug))}`,
    `Stand:${featureStateNote(feature.status) || ' verfügbar'}`,
    '',
    feature.tagline,
    '',
    ...feature.intro,
    '',
    'Kurz gesagt:',
    ...feature.facts.map((fact) => `- ${fact.term}: ${fact.value}`),
  ];

  if (feature.capabilities) {
    lines.push('', `${feature.capabilities.title}:`);
    for (const group of feature.capabilities.groups) {
      lines.push(`- ${group.name}:`);
      lines.push(...group.items.map((item) => `  - ${item.name}: ${item.body}`));
    }
  }

  lines.push(
    '',
    'Was es (noch) nicht kann:',
    ...feature.limits.map((limit) => `- ${limit}`),
  );

  if (feature.faq.length > 0) {
    lines.push('', 'Fragen:');
    for (const item of feature.faq) {
      lines.push(`- ${item.question} ${item.answer}`);
    }
  }

  return lines.join('\n');
}

/** The video features; they print in catalogue order. */
const VIDEO_SLUGS = ['video-tagging', 'video-besprechung', 'handball-livestream'];
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

  const video = FEATURES.filter((feature) => VIDEO_SLUGS.includes(feature.slug))
    .map(videoSection)
    .join('\n\n');

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
- Sprachen: Deutsch, Englisch, Spanisch, Französisch, Polnisch
- Regionen: ${SERVICE_AREAS.join(', ')}
- Preis: Bis zum 31.12.2026 kostenlos ohne Kreditkarte und ohne Bezahlvorgang in der App. Ab dem 1.1.2027 ein Produkt mit zwei kombinierbaren Stufen. App-Stufe: Basis 0 € (dauerhaft), Trainer 79 € je Saison bzw. 9,90 € im Monat, Pro 149 € je Saison bzw. 14,90 € im Monat. Video-Stufe für alle Mannschaften, in denen das buchende Konto Cheftrainer ist – Speicher und Credits teilen sie sich (enthält App Basis): Video Basis 149 € (100 GB), Video Team 399 € (300 GB, 40 Rechen-Credits, Panorama, Schwenk-Fassung, Livestream), Video Analyse 849 € (500 GB, 180 Rechen-Credits, Laufwege, Ballerkennung) je Saison bzw. 14,90 €, 39,90 € und 84,90 € im Monat. Neben einer Video-Stufe kostet die App-Stufe je Saison nur den Paketpreis (Trainer 39 €, Pro 75 €). Eine Saison läuft vom 1.7. bis 30.6.; wer mitten in der Saison bucht, zahlt zuerst den Rest nach angefangenen Monaten, von April bis Juni gibt es nur das Monatsabo. Endpreise, keine Umsatzsteuer nach § 19 UStG. Gebucht wird auf ${absoluteUrl('/preise')} (Plan zusammenstellen, dann Anmeldung und Bezahlung in der App). Konten, die vor dem 1.1.2027 angelegt wurden, behalten den Trainer-Plan kostenlos bis zum Ende der Saison 26/27 am 30.6.2027 und danach dauerhaft einen Gründerpreis im Saisonabo ohne Video (Trainer 59 €, Pro 109 €, abschließbar bis 30.9.2027)
- Entwickler: Arkadiusz Weiss (Handballer, Deutschland)
- Website: ${SITE_URL}
- App (Registrierung, kostenlos starten): ${CLUB_CONFIG.website.appUrl}
- Live-Demo (ohne Account): ${CLUB_CONFIG.website.demoUrl}

## Funktionen
Vollständiger Überblick mit einer eigenen Seite je Funktion: ${absoluteUrl(FEATURES_PAGE_PATH)}

${features}

## Video, Livestream und Analyse aus dem Bild (Beta)
Statix hat einen Videobereich, der an der Live-Erfassung hängt: Weil jede Aktion schon mit Spielminute erfasst ist, liegt eine Aufnahme nach dem Abgleich mit der Spieluhr bereits in Szenen geschnitten vor. Der ganze Bereich – Video-Tagging, Video-Besprechung und Livestream – ist eine **geschlossene Beta**: gebaut und benutzt, aber nur für freigeschaltete Konten. Freischaltung je Konto auf Anfrage über ${absoluteUrl(VIDEO_REQUEST_PAGE_PATH)}. Ab dem 1.1.2027 ist Video eine eigene Stufe (Video Basis, Video Team, Video Analyse – Preise oben unter „Preis“); bis dahin ist nichts käuflich. Die Analyse aus dem Bild (Feldkalibrierung, Laufwege, Ballflug, Panorama, Schwenk-Fassung) rechnet auf gemieteten Grafikkarten in der EU und **schlägt nur vor**: Sie legt nie selbst eine Szene oder einen Statistik-Eintrag an. Wer nach einer Handball-Videoanalyse oder einem Handball-Livestream fragt, findet hier, was heute geht und was nicht.

${video}

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
- Handball-Statistik Excel-Vorlage (kostenloser XLSX-Download ohne Anmeldung, sechs Blätter mit fertigen Formeln für Wurfquote, Siebenmeter-Quote und Paradenquote und einem Wurfbild je Wurfzone; taugt als Vorlage für Statistik und Spielanalyse): ${absoluteUrl('/handball-statistik-excel-vorlage')}
- Alle Funktionen (Index mit einer eigenen Seite je Funktion, inklusive Screenshots, Ablauf und ausdrücklichen Grenzen): ${absoluteUrl(FEATURES_PAGE_PATH)}
- Was ist Statix (Marken- und Produktüberblick): ${absoluteUrl('/was-ist-statix')}
- Ratgeber: ${absoluteUrl(RATGEBER_BASE_PATH)}
- Live-Demo: ${CLUB_CONFIG.website.demoUrl}
- Feedback (Bewertung, Fehlermeldung oder Feature-Wunsch abgeben, auch anonym): ${absoluteUrl('/feedback')}
- Video-Freischaltung anfragen (Video-Tagging, Video-Besprechung, Livestream und Analyse aus dem Bild laufen als geschlossene Beta; Freischaltung je Konto auf Anfrage über dieses Formular): ${absoluteUrl(VIDEO_REQUEST_PAGE_PATH)}
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
