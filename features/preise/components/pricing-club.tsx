'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { inlineLink } from '@/components/custom-ui/rich-text';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';

/**
 * Answers the club-budget query head-on ("Was kostet Statix für einen
 * Verein?"). The H2 is the exact question a treasurer types into Google.
 *
 * The answer stays split even now that the coach tiers carry figures: a coach
 * pays a listed price, a club is quoted one. Naming a single number for a club
 * with two squads and a club with twelve would be wrong for at least one of
 * them, so this band gives an order of magnitude to budget against and hands
 * over to an enquiry. Everything else commercial about clubs lives on
 * `/fuer-vereine`.
 * @returns A JSX element rendering the club-cost band on the paper ground.
 */
export default function PricingClub() {
  const t = useTranslations('pricingPage.club');

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-10 grid gap-6 md:grid-cols-2'>
          <BoardCard pin='magnet' className='p-6 sm:p-7'>
            <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
              {t('coachTitle')}
            </h3>
            <p className='mt-3 text-[15px] leading-7 text-ink/75'>
              {t('coachParagraph1')}
            </p>
            <p className='mt-3 text-[15px] leading-7 text-ink/75'>
              {t('coachParagraph2')}
            </p>
          </BoardCard>

          <BoardCard pin='magnet' pinColor='opponent' className='p-6 sm:p-7'>
            <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
              {t('clubTitle')}
            </h3>
            <p className='mt-3 text-[15px] leading-7 text-ink/75'>
              {t('clubParagraph1')}
            </p>
            <p className='mt-3 text-[15px] leading-7 text-ink/75'>
              {t('clubParagraph2')}
            </p>
            <Link
              href='/fuer-vereine#vereinsanfrage'
              className='mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
              {t('clubLink')}
            </Link>
          </BoardCard>
        </div>

        <p className='mt-8 max-w-[68ch] text-base leading-7 text-ink/70'>
          {t.rich('closing', {
            club: inlineLink('/fuer-vereine'),
            youth: inlineLink('/fuer-jugendtrainer'),
          })}
        </p>
      </div>
    </section>
  );
}
