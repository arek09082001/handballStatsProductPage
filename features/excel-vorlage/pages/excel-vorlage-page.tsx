'use client';

import { useTranslations } from 'next-intl';
import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import TemplateHeader from '../components/template-header';
import TemplateMetrics from '../components/template-metrics';
import TemplateHowTo from '../components/template-howto';
import TemplateLimits from '../components/template-limits';
import TemplateUpgrade from '../components/template-upgrade';

/**
 * Excel template page `/handball-statistik-excel-vorlage`. Download first (no
 * form in front of it), then what the file tracks, how to fill it during a
 * game, where a spreadsheet stops being enough, and only then the app.
 * @returns A JSX element composing the ordered template-page sections.
 */
export default function ExcelVorlagePage() {
  const t = useTranslations('templatePage');

  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <TemplateHeader />
      <TemplateMetrics />
      <TemplateHowTo />
      <TemplateLimits />
      <TemplateUpgrade />
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
        linkHref='/preise'
        linkLabel={t('cta.linkLabel')}
      />
    </div>
  );
}
