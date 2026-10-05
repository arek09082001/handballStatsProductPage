'use client';

import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  BoardCard,
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import type { FounderStep } from '../data/pricing-content';
import type { PriceSheet } from '../data/price-sheet';
import { usePriceFormat } from '../data/use-price-format';
import { usePricingLabels } from '../data/use-pricing-labels';

/**
 * The founder guarantee — the only thing on this page with an expiry date, and
 * therefore the only band that argues for acting today rather than in January.
 *
 * It sits directly under the price board on purpose: "Trainer, 79 €" has to
 * carry a figure before "für dich 0 €" means anything. The note is pinned with
 * tape and tilted a degree, because a guarantee handed over on the board is a
 * note, not a banner — and the date is circled in marker the way a coach circles
 * a date on the season plan.
 *
 * Since the new price list the promise has a second half: after the free
 * season, founders keep a permanent founder price on a season subscription
 * without video. Its figures come from the same price list as the
 * configurator; the card names both tiers because the founder decides later
 * which one he wants.
 * @returns A JSX element rendering the grandfathering promise on the paper ground.
 */
export default function PricingFounder({ sheet }: { sheet: PriceSheet }) {
  const t = useTranslations('pricingPage.founder');
  const labels = usePricingLabels();
  const format = usePriceFormat();
  const steps = t.raw('steps') as FounderStep[];

  return (
    <section
      id='bestandsschutz'
      className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-4 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title', labels)}
          description={t('description', labels)}
        />

        <div className='mt-10 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12'>
          <BoardCard pin='tape' className='rotate-[-0.7deg] p-7 sm:p-8'>
            <p className='font-hand text-2xl text-primary'>{t('cardTitle')}</p>

            <p className='mt-4 text-[15px] leading-7 text-ink/75'>
              {t('cardDeadlineLabel')}
            </p>
            <p className='relative mt-1 inline-block whitespace-nowrap font-display text-[clamp(1.5rem,6.5vw,2.3rem)] font-extrabold leading-tight tracking-[-0.03em] tabular-nums text-ink'>
              {labels.founderDeadline}
              <svg
                viewBox='0 0 240 60'
                fill='none'
                aria-hidden='true'
                preserveAspectRatio='none'
                className='pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)] text-primary'>
                <path
                  d='M60 6 C 24 6, 5 18, 6 31 C 7 46, 44 55, 118 55 C 196 55, 234 45, 233 30 C 232 16, 200 6, 128 5 C 96 4.6, 68 7, 48 12'
                  stroke='currentColor'
                  strokeWidth='2.2'
                  strokeLinecap='round'
                  opacity='0.85'
                />
              </svg>
            </p>

            <dl className='mt-8 divide-y divide-ink/10 border-y border-ink/10'>
              <div className='flex items-baseline justify-between gap-6 py-2.5 text-[15px]'>
                <dt className='text-ink/70'>{t('cardPlanLabel')}</dt>
                <dd className='font-display font-bold text-ink'>
                  {t('cardPlanValue')}
                </dd>
              </div>
              <div className='flex items-baseline justify-between gap-6 py-2.5 text-[15px]'>
                <dt className='text-ink/70'>{t('cardFreeUntilLabel')}</dt>
                <dd className='font-display font-bold tabular-nums text-ink'>
                  {labels.founderFreeUntil}
                </dd>
              </div>
              <div className='flex items-baseline justify-between gap-6 py-2.5 text-[15px]'>
                <dt className='text-ink/70'>{t('cardDueLabel')}</dt>
                <dd className='font-display font-bold tabular-nums text-primary'>
                  {format.euro(0)}
                </dd>
              </div>
              <div className='flex items-baseline justify-between gap-6 py-2.5 text-[15px]'>
                <dt className='text-ink/70'>{t('cardFounderLabel')}</dt>
                <dd className='flex flex-col items-end text-right font-display font-bold tabular-nums text-ink'>
                  {(['trainer', 'pro'] as const).map((tier) => (
                    <span key={tier}>
                      {t.rich(`cardFounder.${tier}`, {
                        founder: format.euro(sheet.app[tier].founder.season),
                        standard: format.euro(sheet.app[tier].standard.season),
                        strike: (chunks) => (
                          <s className='font-sans text-[13px] font-medium text-ink/55'>
                            {chunks}
                          </s>
                        ),
                      })}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <p className='mt-5 text-[13px] leading-6 text-ink/70'>
              {t('cardNote', labels)}
            </p>

            <a
              href={CLUB_CONFIG.website.appUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-5 font-display text-[15px] font-bold tracking-tight text-white shadow-[0_14px_26px_-14px_hsl(22_90%_45%/0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.99]'>
              {t('cardCta')}
            </a>
          </BoardCard>

          <ol className='flex flex-col gap-7'>
            {steps.map((step, index) => (
              <li key={step.number} className='flex items-start gap-4 sm:gap-5'>
                <PlayerMagnet
                  number={step.number}
                  size='lg'
                  className='shrink-0'
                />
                <div>
                  <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                    {t(`steps.${index}.title`, labels)}
                  </h3>
                  <p className='mt-1.5 max-w-[58ch] text-[15px] leading-7 text-ink/75'>
                    {t(`steps.${index}.text`, labels)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className='mt-10 max-w-[68ch] text-base leading-7 text-ink/70'>
          {t('closing')}
        </p>
      </div>
    </section>
  );
}
