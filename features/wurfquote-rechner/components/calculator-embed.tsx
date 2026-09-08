'use client';

import { useTranslations } from 'next-intl';
import {
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import EmbedSnippet from './embed-snippet';

/**
 * "Rechner einbinden" — the calculator is free to reuse on club sites. Keeps
 * the exchange plain: their page gets a working tool, ours gets a link back.
 * @returns A JSX element rendering the embed instructions on the paper ground.
 */
export default function CalculatorEmbed() {
  const t = useTranslations('calculatorPage.embed');

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-10'>
          <EmbedSnippet />
        </div>

        <p className='mt-6 max-w-[68ch] text-base leading-7 text-ink/70'>
          {t('closing')}
        </p>
      </div>
    </section>
  );
}
