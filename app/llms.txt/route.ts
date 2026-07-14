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

  const features = APP_FEATURES.map(
    (feature) => `- **${feature.name}**: ${feature.description}`,
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

${name} ist eine ${business.primaryService} für ${business.audience}. Trainer, Co-Trainer, Vereine und Mannschaften erfassen Handball-Spiele live per Tap – Tore, Würfe, Paraden, Strafen und Wechsel – und erhalten automatisch ausgewertete Spieler- und Mannschaftsstatistiken, Wurfbilder, KI-Analysen und Entwicklungsverläufe. ${name} läuft direkt im Browser auf Smartphone, Tablet (iPad und Android) und Laptop, funktioniert offline in der Halle und lässt sich in Sekunden mit dem Team teilen. Eine voll ausgestattete Live-Demo mit echten Spieldaten ist ohne Account unter ${CLUB_CONFIG.website.demoUrl} verfügbar. ${name} wird von Arkadiusz Weiss entwickelt – einem Handballer aus Deutschland (Made in Germany).

- Kategorie: Handball-Statistik-App / Handball Scouting & Spielanalyse
- Zielgruppe: ${business.audience}
- Plattform: Web-App (Browser), Smartphone, Tablet/iPad, Laptop
- Sprachen: Deutsch, Englisch
- Regionen: ${SERVICE_AREAS.join(', ')}
- Preis: Kostenlos starten, erstes Spiel ohne Verpflichtung und ohne Kreditkarte – faire Abos für Teams und Vereine
- Entwickler: Arkadiusz Weiss (Handballer, Deutschland)
- Website: ${SITE_URL}
- Live-Demo (ohne Account): ${CLUB_CONFIG.website.demoUrl}

## Funktionen
${features}

## Häufige Fragen
${faq}

## Ratgeber (Handball-Wissen für Trainer)
Praxisnahe Artikel für Trainer zu Statistik, Training, Taktik und Spielanalyse:
${ratgeber}

## Links
- Startseite: ${SITE_URL}
- Ratgeber: ${absoluteUrl(RATGEBER_BASE_PATH)}
- Live-Demo: ${CLUB_CONFIG.website.demoUrl}
- Impressum: ${absoluteUrl('/impressum')}
- Kontakt: ${CLUB_CONFIG.email.main}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
