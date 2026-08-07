import type { Metadata } from 'next';
import KontaktPage from '@/features/kontakt/pages/kontakt-page';
import PageSchema from '@/components/seo/page-schema';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Kontakt – Fragen zu Statix, Support & Feedback',
  description:
    'Fragen zur Handball-Statistik-App Statix, Unterstützung beim Start mit deinem Team oder Verein oder Feedback? Schreib uns über das Kontaktformular oder direkt per E-Mail – wir melden uns persönlich zurück.',
  path: '/kontakt',
  absoluteTitle: true,
  keywords: [
    'statix kontakt',
    'statix support',
    'handball statistik app kontakt',
    'statix feedback',
  ],
});

export default function Page() {
  return (
    <>
      <PageSchema
        id='kontakt'
        type='WebPage'
        name='Kontakt – Fragen zu Statix, Support & Feedback'
        description='Kontaktformular und direkte E-Mail-Adresse für Fragen, Support und Feedback zur Handball-Statistik-App Statix.'
        path='/kontakt'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Kontakt', path: '/kontakt' },
        ]}
      />
      <KontaktPage />
    </>
  );
}
