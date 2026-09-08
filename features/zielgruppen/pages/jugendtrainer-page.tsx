'use client';

import { useTranslations } from 'next-intl';
import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import { inlineLink } from '@/components/custom-ui/rich-text';
import SegmentHeader from '../components/segment-header';
import SegmentBenefits from '../components/segment-benefits';
import SegmentObjections from '../components/segment-objections';
import JugendtrainerDevelopment from '../components/jugendtrainer-development';
import type {
  YouthBenefit,
  YouthObjection,
} from '../data/jugendtrainer-content';

/**
 * Youth-coach page `/fuer-jugendtrainer`. Different buyer than the club page:
 * no budget question, but time on the bench, simplicity, and showing a
 * 14-year-old their own progress.
 * @returns A JSX element composing the ordered youth-coach sections.
 */
export default function JugendtrainerPage() {
  const t = useTranslations('youthCoachPage');

  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <SegmentHeader
        kicker={t('hero.kicker')}
        titleLead={t('hero.titleLead')}
        titleHighlight={t('hero.titleHighlight')}
        lede={t('hero.lede')}
        trust={t.raw('hero.trust') as string[]}
        screenshot={{
          src: '/recordStatsInGame.png',
          alt: t('hero.screenshotAlt'),
          label: t('hero.screenshotLabel'),
        }}
      />

      <SegmentBenefits
        kicker={t('benefits.kicker')}
        title={t('benefits.title')}
        description={t('benefits.description')}
        items={t.raw('benefits.items') as YouthBenefit[]}
      />

      <JugendtrainerDevelopment />

      <SegmentObjections
        kicker={t('objections.kicker')}
        title={t('objections.title')}
        description={t('objections.description')}
        items={t.raw('objections.items') as YouthObjection[]}
        ground='paper'>
        {t.rich('objections.links', {
          free: inlineLink('/handball-statistik-app-kostenlos'),
          clubs: inlineLink('/fuer-vereine'),
          template: inlineLink('/handball-statistik-excel-vorlage'),
        })}
      </SegmentObjections>

      <BoardFaq
        id='faq'
        kicker={t('faq.kicker')}
        title={t('faq.title')}
        description={t('faq.description')}
        items={t.raw('faq.items') as { question: string; answer: string }[]}
      />

      <BoardCta
        kicker={t('cta.kicker')}
        title={t('cta.title')}
        description={t('cta.description')}
        linkHref='/handball-statistik-app-kostenlos'
        linkLabel={t('cta.linkLabel')}
      />
    </div>
  );
}
