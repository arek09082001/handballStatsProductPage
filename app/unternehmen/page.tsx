import CompanyPage from '@/features/company/pages/company-page';
import PageSchema from '@/components/seo/page-schema';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = createPageMetadata({
  title: 'Über Arkadiusz Weiss Webentwicklung',
  description:
    'Erfahre mehr über Arbeitsweise, Positionierung und den strategischen Ansatz hinter Webdesign, Entwicklung und SEO für Unternehmen und Dienstleister.',
  path: '/unternehmen',
  keywords: [
    'webdesigner über mich',
    'webagentur unternehmen',
    'arkadiusz weiss webentwicklung',
  ],
  imagePath: '/arkadiusz_weiss.jpg',
});

export default function Page() {
  return (
    <>
      <PageSchema
        id='company-page'
        name='Über Arkadiusz Weiss Webentwicklung'
        description='Unternehmensseite mit Profil, Arbeitsweise und strategischer Ausrichtung für moderne Unternehmenswebsites.'
        path='/unternehmen'
        type='AboutPage'
        imagePath='/arkadiusz_weiss.jpg'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Unternehmen', path: '/unternehmen' },
        ]}
      />
      <CompanyPage />
    </>
  );
}
