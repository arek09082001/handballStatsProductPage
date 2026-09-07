import type { BoardFaqItem } from '@/components/custom-ui/board-faq';
import { CLUB_CONFIG } from '@/lib/club-config';
import { DE_MESSAGES, fillPlaceholders } from '@/lib/messages';

export const ERFAHRUNGEN_PAGE_PATH = '/erfahrungen';

/** The contact address, as an ICU argument for the sentences that name it. */
export const ERFAHRUNGEN_MAIL_ARGS = { email: CLUB_CONFIG.email.main } as const;

export interface FeedbackStep {
  number: number;
  title: string;
  text: string;
}

/** The visible FAQ in German, for the route's `FAQPage` node. */
export const ERFAHRUNGEN_FAQS: BoardFaqItem[] =
  DE_MESSAGES.experiencesPage.faq.items.map((item) => ({
    question: item.question,
    answer: fillPlaceholders(item.answer, ERFAHRUNGEN_MAIL_ARGS),
  }));
