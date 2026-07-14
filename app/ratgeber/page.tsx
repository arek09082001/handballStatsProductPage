import type { Metadata } from 'next';
import BlogIndexPage from '@/features/ratgeber/pages/blog-index-page';
import PageSchema from '@/components/seo/page-schema';
import { createPageMetadata } from '@/lib/seo';
import { RATGEBER_BASE_PATH } from '@/features/ratgeber/data/articles';

export const metadata: Metadata = createPageMetadata({
  title: 'Handball-Ratgeber für Trainer',
  description:
    'Praxisnahe Handball-Artikel für Trainer: Wurfquote berechnen, Training und Saison planen, Abwehrsysteme, Torwarttraining und Spielanalyse – verständlich erklärt.',
  path: RATGEBER_BASE_PATH,
  keywords: [
    'handball ratgeber',
    'handball trainer tipps',
    'handball training tipps',
    'handball taktik',
    'handball wissen für trainer',
  ],
  imagePath: '/heroImage.png',
});

export default function Page() {
  return (
    <>
      <PageSchema
        id='ratgeber-index'
        type='CollectionPage'
        name='Handball-Ratgeber für Trainer'
        description='Praxisnahe Handball-Artikel für Trainer zu Statistik, Training, Taktik und Spielanalyse.'
        path={RATGEBER_BASE_PATH}
        imagePath='/heroImage.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Ratgeber', path: RATGEBER_BASE_PATH },
        ]}
      />
      <BlogIndexPage />
    </>
  );
}
