import LandingPage from '@/features/landing-page/pages/landing-page';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'HandballStats – Die Statistik-App für dein Handball-Team',
  description:
    'Erfasse Spielzüge live, analysiere Spieler- und Mannschaftsleistung und gewinne mehr Spiele mit datenbasierten Entscheidungen. Kostenlos starten.',
  path: '/',
  keywords: [
    'handball statistik app',
    'handball stats',
    'handball scouting app',
    'handball trainer app',
    'spielerstatistik handball',
  ],
  imagePath: '/heroImage.png',
});

export default function Page() {
  return <LandingPage />;
}
