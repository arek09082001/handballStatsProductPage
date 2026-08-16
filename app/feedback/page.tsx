import type { Metadata } from 'next';
import FeedbackPage from '@/features/feedback/pages/feedback-page';
import PageSchema from '@/components/seo/page-schema';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Feedback – Deine Meinung zur Handball-Statistik-App Statix',
  description:
    'Wie gut funktioniert Statix für dein Team? Bewerte die Handball-Statistik-App, melde Fehler oder wünsch dir Funktionen – dein Feedback geht direkt an das Statix-Team und fließt in die Weiterentwicklung ein.',
  path: '/feedback',
  absoluteTitle: true,
  keywords: [
    'statix feedback',
    'statix bewertung',
    'handball statistik app feedback',
    'handball statistik app bewerten',
    'statix fehler melden',
    'statix feature wunsch',
  ],
});

export default function Page() {
  return (
    <>
      <PageSchema
        id='feedback'
        type='WebPage'
        name='Feedback – Deine Meinung zur Handball-Statistik-App Statix'
        description='Feedback-Formular für die Handball-Statistik-App Statix: Bewertung abgeben, Fehler melden oder Funktionen wünschen.'
        path='/feedback'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Feedback', path: '/feedback' },
        ]}
      />
      <FeedbackPage />
    </>
  );
}
