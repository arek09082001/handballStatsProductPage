import ImpressumPage from '@/features/impressum/pages/impressum-page';
import PageSchema from '@/components/seo/page-schema';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = createPageMetadata({
  title: 'Impressum',
  description:
    'Impressum und Anbieterkennzeichnung der Statix App nach § 5 DDG. Die Datenschutzerklärung finden Sie unter /datenschutz.',
  path: '/impressum',
  keywords: ['impressum statix', 'anbieterkennzeichnung statix'],
  imagePath: '/logo.png',
});

export default function Page() {
  return (
    <>
      <PageSchema
        id='impressum-page'
        name='Impressum'
        description='Anbieterkennzeichnung nach § 5 DDG und Verantwortlichkeiten zur Statix App.'
        path='/impressum'
        imagePath='/logo.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Impressum', path: '/impressum' },
        ]}
      />
      <ImpressumPage />
    </>
  );
}
