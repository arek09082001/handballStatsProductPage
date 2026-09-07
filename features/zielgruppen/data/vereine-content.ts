import type { BoardFaqItem } from '@/components/custom-ui/board-faq';
import { CLUB_CONFIG } from '@/lib/club-config';
import { DE_MESSAGES } from '@/lib/messages';

export const VEREINE_PAGE_PATH = '/fuer-vereine';

/**
 * Where every club CTA on this page goes.
 *
 * Deliberately the contact route and not the app registration: the club level
 * is not self-service. A club is set up by hand, its administrators are
 * appointed by hand, and the join code is handed over personally — so the next
 * step for a club is a conversation, not a sign-up form. The `thema` parameter
 * pre-fills the subject line of the contact form (see the contact form
 * section), so a club enquiry arrives labelled as one.
 *
 * The subject stays German in every language: it is a label on an email in an
 * inbox that is read in German, not copy the visitor is being sold on.
 */
export const VEREINE_CONTACT_TOPIC = 'Vereinsanfrage';
export const VEREINE_CONTACT_HREF = `/kontakt?thema=${encodeURIComponent(
  VEREINE_CONTACT_TOPIC,
)}`;

/** Anchor of the enquiry band at the foot of the page. */
export const VEREINE_CONTACT_ANCHOR = 'vereinsanfrage';

/** Argument for the sentence that hands over the address for a DPA request. */
export const VEREINE_MAIL_ARGS = { email: CLUB_CONFIG.email.main } as const;

export interface ClubBenefit {
  number: number;
  title: string;
  text: string;
}

export interface ClubCapability {
  /** The screen it is, named the way the club's own navigation names it. */
  term: string;
  text: string;
}

export interface RolloutStep {
  number: number;
  title: string;
  text: string;
}

export interface ClubObjection {
  question: string;
  answer: string;
}

export interface ClubYouthPoint {
  number: number;
  title: string;
  text: string;
}

export interface ClubPrivacyPoint {
  title: string;
  text: string;
}

/**
 * The club area, screen by screen, in German — the route emits it as an
 * `ItemList` so an engine can answer "was kann der Vereinsbereich" without
 * parsing the band. The visible band reads the same list out of the reader's
 * own bundle.
 */
export const CLUB_CAPABILITIES: ClubCapability[] =
  DE_MESSAGES.clubsPage.clubLevel.capabilities;

/**
 * The four rollout steps in German, for the route's `HowTo` node — word for
 * word what the visible band shows a German reader.
 */
export const ROLLOUT_STEPS: RolloutStep[] = DE_MESSAGES.clubsPage.rollout.steps;

/** The visible FAQ in German, for the route's `FAQPage` node. */
export const VEREINE_FAQS: BoardFaqItem[] = DE_MESSAGES.clubsPage.faq.items;
