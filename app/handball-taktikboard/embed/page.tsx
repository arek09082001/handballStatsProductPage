import type { Metadata } from 'next';
import HandballTaktikboardEmbedPage from '@/features/handball-taktikboard/pages/handball-taktikboard-embed-page';
import { TAKTIKBOARD_EMBED_PATH } from '@/features/handball-taktikboard/data/taktikboard-content';
import { createPageMetadata } from '@/lib/seo';

/**
 * Embeddable board. `noIndex` keeps this route out of the index so it never
 * competes with the canonical `/handball-taktikboard` page — the embed exists
 * to run inside other sites, not to rank.
 */
const embedMetadata = createPageMetadata({
  title: 'Handball-Taktikboard (Einbettung)',
  description:
    'Eingebettete Version des Handball-Taktikboards von Statix für Vereinsseiten.',
  path: TAKTIKBOARD_EMBED_PATH,
  noIndex: true,
});

export const metadata: Metadata = {
  ...embedMetadata,
  // `noIndex` in createPageMetadata also sets nofollow. Here the attribution
  // link back to /handball-taktikboard is the whole point of the embed, so the
  // page stays unindexed but its links stay followed.
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function Page() {
  return <HandballTaktikboardEmbedPage />;
}
