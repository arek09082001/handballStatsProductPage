import type { Metadata } from 'next';
import WurfquoteRechnerEmbedPage from '@/features/wurfquote-rechner/pages/wurfquote-rechner-embed-page';
import {
  CALCULATOR_EMBED_PATH,
} from '@/features/wurfquote-rechner/data/calculator-content';
import { createPageMetadata } from '@/lib/seo';

/**
 * Embeddable calculator. `noIndex` keeps this route out of the index so it
 * never competes with the canonical `/wurfquote-rechner` page — the embed
 * exists to run inside other sites, not to rank.
 */
const embedMetadata = createPageMetadata({
  title: 'Wurfquoten-Rechner (Einbettung)',
  description:
    'Eingebettete Version des Wurfquoten-Rechners von Statix für Vereinsseiten.',
  path: CALCULATOR_EMBED_PATH,
  noIndex: true,
});

export const metadata: Metadata = {
  ...embedMetadata,
  // `noIndex` in createPageMetadata also sets nofollow. Here the attribution
  // link back to /wurfquote-rechner is the whole point of the embed, so the
  // page stays unindexed but its links stay followed.
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function Page() {
  return <WurfquoteRechnerEmbedPage />;
}
