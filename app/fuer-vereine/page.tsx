import type { Metadata } from 'next';
import VereinePage from '@/features/zielgruppen/pages/vereine-page';
import PageSchema from '@/components/seo/page-schema';
import JsonLdScript from '@/components/seo/json-ld-script';
import { CLUB_CONFIG } from '@/lib/club-config';
import { absoluteUrl, createPageMetadata, SERVICE_AREAS, SITE_URL } from '@/lib/seo';
import {
  CLUB_CAPABILITIES,
  ROLLOUT_STEPS,
  VEREINE_CONTACT_ANCHOR,
  VEREINE_FAQS,
  VEREINE_PAGE_PATH,
} from '@/features/zielgruppen/data/vereine-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Handball-Statistik-App für Vereine & Jugendabteilungen',
  description:
    'Alle Mannschaften eines Vereins nach einem Schema: Spiele live erfassen, Kader und Trainingsbeteiligung an einem Ort, Spielerlaufbahnen über alle Jugenden, Auswertung für die Abteilungsleitung. AVV nach Art. 28 DSGVO — Konditionen auf Anfrage.',
  path: VEREINE_PAGE_PATH,
  keywords: [
    'handball statistik app für vereine',
    'handball statistik verein',
    'handball verein statistik software',
    'handball vereinssoftware statistik',
    'handball statistik mehrere mannschaften',
    'handball jugendabteilung statistik',
    'handball statistik jugendmannschaften einheitlich',
    'handball trainingsbeteiligung erfassen',
    'handball kader verwalten app verein',
    'handball spielerentwicklung verein dokumentieren',
    'statistik software handball jugendabteilung',
    'handball nachwuchs statistik verein',
    'handball trainerteam software',
  ],
  imagePath: '/gameListOverview.png',
});

/**
 * Route shell for `/fuer-vereine`.
 *
 * Five schema nodes, each answering a different question an engine asks about
 * this page:
 *
 * - `WebPage` + BreadcrumbList (via `PageSchema`) — where the page sits.
 * - A second `WebPage` typed with an `Audience`, so "für Vereine" and
 *   "Jugendabteilung" queries match the audience and not just the words.
 * - `Service`, because the club level genuinely is one: it is set up by hand
 *   for a club, not bought in a checkout. It carries **no `offers`** — there is
 *   no price to state, and inventing one is both a legal and a structured-data
 *   problem (see the Ratgeber rules). What it carries instead is the way in: a
 *   `ContactPoint` and a `ContactAction` on the enquiry band.
 * - `ItemList` of what the club area contains, so an engine can answer "was
 *   kann der Vereinsbereich" without parsing the band.
 * - `HowTo` for the four rollout steps, word for word from the visible band.
 *
 * The FAQ nodes come from the visible accordion only. The objections band
 * states its items as quoted sentences ("Was kostet das denn?") in a coach's
 * voice rather than as neutral questions, so it is not marked up as `Question`;
 * the same objections are covered in question form in the FAQ itself.
 */
export default function Page() {
  const pageUrl = absoluteUrl(VEREINE_PAGE_PATH);

  const faqEntities = VEREINE_FAQS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  }));

  return (
    <>
      <PageSchema
        id='fuer-vereine'
        name='Handball-Statistik-App für Vereine & Jugendabteilungen'
        description='Wie ein Handballverein mit Statix alle Mannschaften auf einen Standard bringt: gemeinsame Erfassung, Kader und Trainingsbeteiligung an einem Ort, Spielerlaufbahnen über alle Jugendmannschaften, eine Auswertung für die Abteilungsleitung und geregelter Datenschutz.'
        path={VEREINE_PAGE_PATH}
        imagePath='/gameListOverview.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Für Vereine', path: VEREINE_PAGE_PATH },
        ]}
      />
      <JsonLdScript
        id='fuer-vereine-audience-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${pageUrl}#audience-page`,
          url: pageUrl,
          name: 'Handball-Statistik-App für Vereine & Jugendabteilungen',
          inLanguage: 'de-DE',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          audience: {
            '@type': 'Audience',
            audienceType:
              'Handballvereine, Jugendabteilungen, Abteilungsleitungen und Trainerteams',
            name: 'Handballvereine mit mehreren Mannschaften',
            geographicArea: {
              '@type': 'Country',
              name: 'Deutschland',
            },
          },
          mainEntity: {
            '@id': `${SITE_URL}#app`,
          },
        }}
      />
      <JsonLdScript
        id='fuer-vereine-service-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${pageUrl}#service`,
          name: 'Statix Vereinsbereich für Handballvereine',
          serviceType: 'Handball-Statistik-Software für Vereine',
          description:
            'Eine gemeinsame Statistik-Ebene über allen Mannschaften eines Handballvereins: einheitliche Live-Erfassung, Kader und Terminplanung je Mannschaft, Spielerlaufbahnen über mehrere Jugendmannschaften hinweg, vereinsweite Auswertung mit Saisonvergleich und Rollen für Vereinsverwaltung und sportliche Leitung. Einrichtung nach Anfrage, Konditionen individuell.',
          url: pageUrl,
          inLanguage: 'de-DE',
          isRelatedTo: { '@id': `${SITE_URL}#app` },
          provider: {
            '@id': `${SITE_URL}/#organization`,
          },
          areaServed: SERVICE_AREAS.map((area) => ({
            '@type': 'AdministrativeArea',
            name: area,
          })),
          audience: {
            '@type': 'Audience',
            audienceType: 'Handballvereine mit mehreren Jugendmannschaften',
          },
          potentialAction: {
            '@type': 'ContactAction',
            name: 'Verein anfragen',
            target: `${pageUrl}#${VEREINE_CONTACT_ANCHOR}`,
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Vereinsanfragen',
            email: CLUB_CONFIG.email.main,
            availableLanguage: ['de', 'en'],
            areaServed: 'DE',
          },
        }}
      />
      <JsonLdScript
        id='fuer-vereine-features-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          '@id': `${pageUrl}#vereinsbereich`,
          name: 'Funktionen des Statix Vereinsbereichs',
          description:
            'Was ein Handballverein im Vereinsbereich von Statix über allen Mannschaften sieht.',
          itemListOrder: 'https://schema.org/ItemListUnordered',
          numberOfItems: CLUB_CAPABILITIES.length,
          itemListElement: CLUB_CAPABILITIES.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.title,
            description: item.text,
          })),
        }}
      />
      <JsonLdScript
        id='fuer-vereine-howto-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          '@id': `${pageUrl}#einfuehrung`,
          name: 'Statix im Handballverein einführen',
          description:
            'In vier Schritten von der Anfrage bis zur ersten Vereinsübersicht — ohne Datenimport und ohne Stichtag.',
          inLanguage: 'de-DE',
          step: ROLLOUT_STEPS.map((step) => ({
            '@type': 'HowToStep',
            position: step.number,
            name: step.title,
            text: step.text,
            url: `${pageUrl}#einfuehrung`,
          })),
        }}
      />
      <JsonLdScript
        id='fuer-vereine-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: faqEntities,
        }}
      />
      <VereinePage />
    </>
  );
}
