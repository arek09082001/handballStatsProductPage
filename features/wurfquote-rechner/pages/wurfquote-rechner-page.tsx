'use client';

import { useTranslations } from 'next-intl';
import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import CalculatorHeader from '../components/calculator-header';
import CalculatorFormula from '../components/calculator-formula';
import CalculatorExample from '../components/calculator-example';
import CalculatorBenchmarks from '../components/calculator-benchmarks';
import CalculatorLimits from '../components/calculator-limits';
import CalculatorEmbed from '../components/calculator-embed';

/**
 * Calculator page `/wurfquote-rechner`. The tool sits above the fold; the
 * formula, the worked example and the position benchmarks below it answer the
 * same query for readers who never touch an input field.
 * @returns A JSX element composing the ordered calculator-page sections.
 */
export default function WurfquoteRechnerPage() {
  const t = useTranslations('calculatorPage');

  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <CalculatorHeader />
      <CalculatorFormula />
      <CalculatorExample />
      <CalculatorBenchmarks />
      <CalculatorLimits />
      <CalculatorEmbed />
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
