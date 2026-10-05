'use client';

import { useTranslations } from 'next-intl';
import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq, { type BoardFaqItem } from '@/components/custom-ui/board-faq';
import PricingHeader from '../components/pricing-header';
import PricingWhy from '../components/pricing-why';
import PricingConfigurator from '../components/pricing-configurator';
import PricingFounder from '../components/pricing-founder';
import PricingCompare from '../components/pricing-compare';
import PricingClub from '../components/pricing-club';
import PricingAlternative from '../components/pricing-alternative';
import type { PriceSheet } from '../data/price-sheet';
import { usePricingLabels } from '../data/use-pricing-labels';

/**
 * Pricing page `/preise` — since the new price list also the start of the
 * purchase: the visitor puts a plan together here and the buy button hands
 * over to the app (login or registration, then Stripe).
 *
 * The section order follows the questions a coach arrives with, in the order a
 * price announcement creates them: why is there a price at all, what does my
 * plan cost (the configurator), what happens to the account I already have,
 * what exactly is in each tier, what does a club pay — then the honest
 * comparison against the Zettel, the FAQ and the demo.
 *
 * Ground rhythm alternates court → paper throughout (see DESIGN.md), with the
 * configurator on the dark court as the page's scoreboard and the founder
 * guarantee on paper as the note pinned next to it.
 *
 * `sheet` is the app's price list, read on the server (or its static
 * fallback); every figure the page computes with comes from it.
 * @returns A JSX element composing the ordered pricing sections.
 */
export default function PreisePage({ sheet }: { sheet: PriceSheet }) {
  const t = useTranslations('pricingPage');
  const labels = usePricingLabels();

  // The dates are ICU arguments rather than baked-in text, so the accordion has
  // to resolve them itself; `t.raw` would hand the reader `{founderDeadline}`.
  const faqItems = (t.raw('faq.items') as BoardFaqItem[]).map((_, index) => ({
    question: t(`faq.items.${index}.question`, labels),
    answer: t(`faq.items.${index}.answer`, labels),
  }));

  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <PricingHeader />
      <PricingWhy />
      <PricingConfigurator sheet={sheet} />
      <PricingFounder sheet={sheet} />
      <PricingCompare sheet={sheet} />
      <PricingClub />
      <PricingAlternative />
      <BoardFaq
        id='faq'
        kicker={t('faq.kicker')}
        title={t('faq.title')}
        description={t('faq.description')}
        items={faqItems}
      />
      <BoardCta
        kicker={t('cta.kicker')}
        title={t('cta.title', labels)}
        description={t('cta.description', labels)}
        linkHref='/#newsletter'
        linkLabel={t('cta.linkLabel')}
      />
    </div>
  );
}
