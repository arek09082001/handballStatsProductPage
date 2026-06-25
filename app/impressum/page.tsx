import ImpressumPage from '@/features/impressum/pages/impressum-page';
import PageSchema from '@/components/seo/page-schema';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = createPageMetadata({
  title: 'Impressum und rechtliche Angaben',
  description:
    'Impressum, Anbieterkennzeichnung und rechtliche Informationen von Arkadiusz Weiss Webentwicklung.',
  path: '/impressum',
  keywords: ['impressum webdesign weiss', 'anbieterkennzeichnung webdesign weiss'],
  imagePath: '/logo.png',
});

export default function Page() {
  return (
    <>
      <PageSchema
        id='impressum-page'
        name='Impressum und rechtliche Angaben'
        description='Rechtliche Informationen, Anbieterkennzeichnung und Verantwortlichkeiten von Arkadiusz Weiss Webentwicklung.'
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
