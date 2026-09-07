'use client';

import { useTranslations } from 'next-intl';
import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import ErfahrungenHeader from '../components/erfahrungen-header';
import TestimonialList from '../components/testimonial-list';
import ErfahrungenStory from '../components/erfahrungen-story';
import FeedbackLoop from '../components/feedback-loop';
import { ERFAHRUNGEN_MAIL_ARGS } from '../data/erfahrungen-content';

/**
 * Experiences page `/erfahrungen`. While `TESTIMONIALS` is empty this is an
 * honest "so entsteht Statix" page: who builds it, how feedback from the hall
 * becomes features, and an invitation to contribute one. Real quotes appear
 * automatically once they exist in the data module.
 * @returns A JSX element composing the ordered experiences sections.
 */
export default function ErfahrungenPage() {
  const t = useTranslations('experiencesPage');

  // One answer names the contact address, so the accordion resolves the
  // argument itself rather than showing the reader a literal `{email}`.
  const faqItems = (t.raw('faq.items') as { question: string }[]).map(
    (_, index) => ({
      question: t(`faq.items.${index}.question`),
      answer: t(`faq.items.${index}.answer`, ERFAHRUNGEN_MAIL_ARGS),
    }),
  );

  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <ErfahrungenHeader />
      <TestimonialList />
      <ErfahrungenStory />
      <FeedbackLoop />
      <BoardFaq
        id='faq'
        kicker={t('faq.kicker')}
        title={t('faq.title')}
        description={t('faq.description')}
        items={faqItems}
      />
      <BoardCta
        kicker={t('cta.kicker')}
        title={t('cta.title')}
        description={t('cta.description')}
        linkHref='/was-ist-statix'
        linkLabel={t('cta.linkLabel')}
      />
    </div>
  );
}
