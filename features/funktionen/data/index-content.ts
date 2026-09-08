import { DE_MESSAGES } from '@/lib/messages';
import type { FeatureFaqItem } from './features';

/**
 * The German index FAQ, for the route's `FAQPage` node.
 *
 * The questions themselves live in the `featuresPage` namespace of the bundles
 * and are read from there rather than kept as a second German original: Google
 * requires the markup and the visible text to match word for word, and the
 * visible text is whatever the reader's language says.
 */
export const FEATURES_INDEX_FAQS: FeatureFaqItem[] =
  DE_MESSAGES.featuresPage.index.faq;
