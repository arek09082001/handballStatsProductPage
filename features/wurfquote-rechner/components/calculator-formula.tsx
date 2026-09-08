'use client';

import { useTranslations } from 'next-intl';
import {
  BoardCard,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';

/**
 * "Die Formel" — stated as plain text (not an image, not a canvas) so search
 * engines can lift it as a featured snippet, plus the two follow-up formulas a
 * coach asks for right after.
 * @returns A JSX element rendering the formula band on the paper ground.
 */
export default function CalculatorFormula() {
  const t = useTranslations('calculatorPage.formula');

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

        <BoardCard pin='magnet' className='mt-10 p-6 text-center sm:p-8'>
          <p className='font-display text-[1.5rem] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[2rem]'>
            {t('expression')}
          </p>
        </BoardCard>

        <div className='mt-8 grid gap-4 sm:grid-cols-2'>
          <BoardCard pin='none' className='p-5'>
            <h3 className='font-display text-base font-bold tracking-tight text-ink'>
              {t('shotTitle')}
            </h3>
            <p className='mt-2 text-[15px] leading-7 text-ink/75'>
              {t('shotText')}
            </p>
          </BoardCard>
          <BoardCard pin='none' className='p-5'>
            <h3 className='font-display text-base font-bold tracking-tight text-ink'>
              {t('saveTitle')}
            </h3>
            <p className='mt-2 text-[15px] leading-7 text-ink/75'>
              {t('saveText')}
            </p>
          </BoardCard>
        </div>
      </div>
    </section>
  );
}
