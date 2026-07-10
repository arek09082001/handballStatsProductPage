import AgbPage from '@/features/agb/pages/agb-page';
import PageSchema from '@/components/seo/page-schema';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = createPageMetadata({
  title: 'Allgemeine Geschäftsbedingungen (AGB)',
  description:
    'Allgemeine Geschäftsbedingungen für die Nutzung der Statix Handball-Statistik-App und der zugehörigen Dienste.',
  path: '/agb',
  keywords: ['agb statix', 'nutzungsbedingungen statix'],
  imagePath: '/logo.png',
});

export default function Page() {
  return (
    <>
      <PageSchema
        id='agb-page'
        name='Allgemeine Geschäftsbedingungen (AGB)'
        description='Allgemeine Geschäftsbedingungen und Nutzungsbedingungen der Statix App.'
        path='/agb'
        imagePath='/logo.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'AGB', path: '/agb' },
        ]}
      />
      <AgbPage />
    </>
  );
}
