import type { BoardFaqItem } from '@/components/custom-ui/board-faq';
import { DE_MESSAGES } from '@/lib/messages';

export const JUGENDTRAINER_PAGE_PATH = '/fuer-jugendtrainer';

export interface YouthBenefit {
  number: number;
  title: string;
  text: string;
}

export interface YouthObjection {
  question: string;
  answer: string;
}

/** The visible FAQ in German, for the route's `FAQPage` node. */
export const JUGENDTRAINER_FAQS: BoardFaqItem[] =
  DE_MESSAGES.youthCoachPage.faq.items;
