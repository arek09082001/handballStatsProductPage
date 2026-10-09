import type { Metadata } from 'next';
import VideoAnfragePage from '@/features/video-anfrage/pages/video-anfrage-page';
import { VIDEO_REQUEST_PAGE_PATH } from '@/features/video-anfrage/data/video-request-content';
import PageSchema from '@/components/seo/page-schema';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'Video-Freischaltung anfragen – Video-Tagging & Livestream in Statix',
  description:
    'Die Video-Funktionen von Statix – Video-Tagging, Livestream und Analyse aus dem Bild – laufen als geschlossene Beta. Frag hier die Freischaltung für dein Konto an; wir melden uns persönlich.',
  path: VIDEO_REQUEST_PAGE_PATH,
  absoluteTitle: true,
  imagePath: '/video-tagging-spuren.png',
  keywords: [
    'statix video freischaltung',
    'statix video beta',
    'handball video tagging anfrage',
    'handball livestream app beta',
    'statix video anfrage',
  ],
});

export default function Page() {
  return (
    <>
      <PageSchema
        id='video-anfrage'
        type='WebPage'
        name='Video-Freischaltung anfragen – Video-Tagging & Livestream in Statix'
        description='Anfrageformular für die Video-Beta der Handball-Statistik-App Statix: Video-Tagging, Livestream und Analyse aus dem Bild für das eigene Konto freischalten lassen.'
        path={VIDEO_REQUEST_PAGE_PATH}
        imagePath='/video-tagging-spuren.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          {
            name: 'Video-Freischaltung anfragen',
            path: VIDEO_REQUEST_PAGE_PATH,
          },
        ]}
      />
      <VideoAnfragePage />
    </>
  );
}
