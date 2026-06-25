import ServicesPage from '@/features/services/pages/services-page';
import PageSchema from '@/components/seo/page-schema';
import ServicesSchema from '@/components/seo/services-schema';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = createPageMetadata({
  title: 'Leistungen für Webdesign, Entwicklung und SEO',
  description:
    'Webdesign, Webentwicklung, lokale SEO und Wartung für Unternehmen, Handwerker und Dienstleister. Strategische Websites, die Sichtbarkeit, Vertrauen und Anfragen steigern.',
  path: '/leistungen',
  keywords: [
    'webdesign leistungen',
    'lokale seo agentur',
    'website wartung',
    'webentwicklung unternehmen',
  ],
  imagePath: '/leistungHero.png',
});

export default function Page() {
  return (
    <>
      <PageSchema
        id='services-page'
        name='Leistungen für Webdesign, Entwicklung und SEO'
        description='Leistungsseite für Webdesign, Webentwicklung, lokale SEO und Wartung mit Fokus auf Sichtbarkeit und Anfragen.'
        path='/leistungen'
        type='CollectionPage'
        imagePath='/leistungHero.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Leistungen', path: '/leistungen' },
        ]}
      />
      <ServicesSchema />
      <ServicesPage />
    </>
  );
}
