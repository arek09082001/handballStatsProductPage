'use client';

import { useTranslations } from 'next-intl';
import BoardFaq from '@/components/custom-ui/board-faq';
import { inlineLink } from '@/components/custom-ui/rich-text';
import SegmentHeader from '../components/segment-header';
import SegmentBenefits from '../components/segment-benefits';
import SegmentObjections from '../components/segment-objections';
import VereineClubLevel from '../components/vereine-club-level';
import VereineYouth from '../components/vereine-youth';
import VereineTraining from '../components/vereine-training';
import VereinePrivacy from '../components/vereine-privacy';
import VereineRollout from '../components/vereine-rollout';
import VereineContact from '../components/vereine-contact';
import {
  VEREINE_CONTACT_ANCHOR,
  type ClubBenefit,
  type ClubObjection,
} from '../data/vereine-content';

/**
 * Club page `/fuer-vereine`.
 *
 * Written for one reader: the club with many youth teams that wants the same
 * statistics kept in all of them, training attendance in the same place, and
 * one screen the Abteilungsleitung can open on a Monday. That club is the one
 * for which the club level exists, and it is the one that pays for it.
 *
 * The page carries **no price figure** and asks for an enquiry rather than a
 * registration — not as a sales tactic but because it is true: a club is set up
 * by hand (see the rollout band), and what a club with twelve squads needs is
 * not what a club with two needs. The coach-level pricing lives on `/preise`
 * and is linked from the objections band for whoever came here looking for it.
 *
 * Band order follows the questions a club asks in sequence: what changes for us
 * → what exactly is this club area → does it fit our youth department → what
 * about training and attendance → is the data protection sorted → how do we
 * start → what will get said in the Vorstand → the rest → and only then the ask.
 * @returns A JSX element composing the ordered club-page sections.
 */
export default function VereinePage() {
  const t = useTranslations('clubsPage');

  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <SegmentHeader
        kicker={t('hero.kicker')}
        titleLead={t('hero.titleLead')}
        titleHighlight={t('hero.titleHighlight')}
        lede={t('hero.lede')}
        trust={t.raw('hero.trust') as string[]}
        primaryAction={{
          href: `#${VEREINE_CONTACT_ANCHOR}`,
          label: t('hero.primaryAction'),
        }}
        screenshot={{
          src: '/verein-uebersicht.png',
          alt: t('hero.screenshotAlt'),
          label: t('hero.screenshotLabel'),
        }}
      />

      <SegmentBenefits
        kicker={t('benefits.kicker')}
        title={t('benefits.title')}
        description={t('benefits.description')}
        items={t.raw('benefits.items') as ClubBenefit[]}
      />

      <VereineClubLevel />

      <VereineYouth />

      <VereineTraining />

      <VereinePrivacy />

      <VereineRollout />

      <SegmentObjections
        kicker={t('objections.kicker')}
        title={t('objections.title')}
        description={t('objections.description')}
        items={t.raw('objections.items') as ClubObjection[]}>
        {t.rich('objections.links', {
          pricing: inlineLink('/preise'),
          free: inlineLink('/handball-statistik-app-kostenlos'),
          youth: inlineLink('/fuer-jugendtrainer'),
          guide: inlineLink('/ratgeber/handball-statistik-verein-einfuehren'),
        })}
      </SegmentObjections>

      <BoardFaq
        id='faq'
        kicker={t('faq.kicker')}
        title={t('faq.title')}
        description={t('faq.description')}
        items={t.raw('faq.items') as { question: string; answer: string }[]}
      />

      <VereineContact />
    </div>
  );
}
