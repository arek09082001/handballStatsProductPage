import DatenschutzPage from '@/features/datenschutz/pages/datenschutz-page';
import PageSchema from '@/components/seo/page-schema';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = createPageMetadata({
  title: 'Datenschutzerklärung',
  description:
    'Datenschutzerklärung der Statix App: welche Daten wir verarbeiten, wie Team-, Spieler- und Spieldaten geschützt sind, wie die KI-Analyse mit pseudonymisierten Spielernamen arbeitet und welche Rechte Sie haben.',
  path: '/datenschutz',
  keywords: [
    'datenschutz statix',
    'datenschutzerklärung statix',
    'statix dsgvo',
    'handball statistik app datenschutz',
  ],
  imagePath: '/logo.png',
});

export default function Page() {
  return (
    <>
      <PageSchema
        id='datenschutz-page'
        name='Datenschutzerklärung'
        description='Informationen zur Verarbeitung personenbezogener Daten in der Statix App und auf statix-app.de – inklusive der pseudonymisierten KI-Analyse, der Speicherdauern und der Betroffenenrechte.'
        path='/datenschutz'
        imagePath='/logo.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Datenschutzerklärung', path: '/datenschutz' },
        ]}
      />
      <DatenschutzPage />
    </>
  );
}
