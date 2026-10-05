'use client';

import { Lock, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';
import { cn } from '@/lib/utils';
import { trackCheckoutClick, trackRegisterClick } from '@/lib/analytics';
import { BoardCard } from '@/features/landing-page/components/tactic';
import type { PriceSheet } from '../data/price-sheet';
import {
  checkoutHref,
  type PlanQuote,
  type PlanSelection,
} from '../data/plan-selection';
import type { CheckoutGate } from '../data/use-checkout-gate';
import type { PriceFormat } from '../data/use-price-format';
import { usePricingLabels } from '../data/use-pricing-labels';

export const SUMMARY_ID = 'deine-auswahl';

const PRIMARY_ACTION =
  'inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-center font-display text-[15px] font-bold leading-5 tracking-tight text-white shadow-[0_14px_26px_-14px_hsl(22_90%_45%/0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.99]';

interface PricingSummaryProps {
  selection: PlanSelection;
  quote: PlanQuote;
  sheet: PriceSheet;
  gate: CheckoutGate;
  format: PriceFormat;
  appName: (id: PlanSelection['app']) => string;
  videoName: (id: PlanSelection['video']) => string;
}

/**
 * The receipt pinned next to the configurator: what is selected, what it costs
 * today, what it costs from then on, and the one button that leaves this site.
 *
 * On paper rather than court, because it is the thing a coach would tear off
 * and hand to the treasurer — and because a paper note on the dark board is
 * where the eye lands after every click.
 *
 * Three states for the action, in this order of precedence:
 *  - **nothing paid** (App Basis, no video): registration, which is free;
 *  - **checkout open** (launched, or `?kasse=vorschau`): a plain link to the
 *    app's intent route, which handles login, registration and Stripe;
 *  - **before the launch**: a disabled button that names the date, and next
 *    to it the registration that secures the founder terms.
 * @returns A JSX element rendering the selection summary and its action.
 */
export default function PricingSummary({
  selection,
  quote,
  sheet,
  gate,
  format,
  appName,
  videoName,
}: PricingSummaryProps) {
  const t = useTranslations('pricingPage.configurator');
  const labels = usePricingLabels();
  const season = selection.cadence === 'season';
  const unit = season ? t('price.perSeason') : t('price.perMonth');
  const showToday = gate.open && season && quote.today !== null && !quote.free;
  const nextSeasonStart = sheet.season.nextSeasonStart;

  const creditsLabel = (tier: keyof PriceSheet['video']) => {
    const credits = sheet.video[tier].credits[selection.cadence];
    if (credits === 0) return t('video.noCredits');
    return season
      ? t('video.creditsSeason', { credits })
      : t('video.creditsMonth', { credits });
  };

  return (
    <BoardCard
      pin='tape'
      className='p-6 sm:p-7'>
      <div id={SUMMARY_ID} className='scroll-mt-28'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <h3 className='font-hand text-[1.7rem] leading-none text-primary'>
            {t('summary.title')}
          </h3>
          {gate.preview ? (
            <span className='rounded-full border border-secondary/40 bg-secondary/10 px-2.5 py-0.5 text-[13px] font-semibold text-[hsl(221_70%_38%)]'>
              {t('summary.previewBadge')}
            </span>
          ) : null}
        </div>

        <dl className='mt-5 divide-y divide-ink/10 border-y border-ink/15'>
          {selection.app === 'basis' ? (
            <div className='flex items-baseline justify-between gap-4 py-3'>
              <dt className='text-[15px] font-semibold text-ink'>
                {t('summary.appLine', { name: appName('basis') })}
              </dt>
              <dd className='text-[15px] font-medium text-ink/70'>
                {selection.video === 'none'
                  ? t('price.forever')
                  : t('summary.included')}
              </dd>
            </div>
          ) : null}

          {quote.lines.map((line) => (
            <div key={line.kind} className='py-3'>
              <div className='flex items-baseline justify-between gap-4'>
                <dt className='text-[15px] font-semibold text-ink'>
                  {line.kind === 'app'
                    ? t('summary.appLine', { name: appName(line.tier) })
                    : videoName(line.tier)}
                </dt>
                <dd className='whitespace-nowrap font-display text-[17px] font-bold tabular-nums text-ink'>
                  {format.euro(line.amount)}
                  <span className='ml-1 font-sans text-[13px] font-medium text-ink/65'>
                    {unit}
                  </span>
                </dd>
              </div>
              {line.kind === 'app' && line.instead !== null ? (
                <p className='mt-1 text-[13px] leading-5 text-[hsl(142_72%_24%)]'>
                  {t.rich('summary.packNote', {
                    instead: format.euro(line.instead),
                    strike: (chunks) => (
                      <s className='text-ink/60'>{chunks}</s>
                    ),
                  })}
                </p>
              ) : null}
              {line.kind === 'video' ? (
                <p className='mt-1 text-[13px] leading-5 text-ink/65'>
                  {t('summary.videoNote', {
                    gb: sheet.video[line.tier].storageGb,
                    credits: creditsLabel(line.tier),
                  })}
                </p>
              ) : null}
            </div>
          ))}
        </dl>

        <div aria-live='polite' className='mt-5'>
          {quote.free ? (
            <>
              <p className='font-display text-[2.4rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-ink'>
                {format.euro(0)}
              </p>
              <p className='mt-2 text-[15px] leading-6 text-ink/75'>
                {t('summary.freeText')}
              </p>
            </>
          ) : showToday ? (
            <>
              <div className='flex items-baseline justify-between gap-4'>
                <p className='text-[15px] font-semibold text-ink'>
                  {t('summary.todayLabel')}
                </p>
                <p
                  key={quote.today}
                  className='price-swap font-display text-[2.4rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-ink'>
                  {format.euro(quote.today ?? 0)}
                </p>
              </div>
              <p className='mt-1 text-[13px] leading-5 text-ink/70'>
                {t('summary.todayNote', {
                  seasonEnd: nextSeasonStart
                    ? format.dayBefore(nextSeasonStart)
                    : '',
                })}
              </p>
              <div className='mt-4 flex items-baseline justify-between gap-4 border-t border-dashed border-ink/20 pt-3'>
                <p className='text-[15px] text-ink/80'>
                  {nextSeasonStart
                    ? t('summary.renewLabel', {
                        date: format.date(nextSeasonStart),
                      })
                    : t('summary.recurringSeasonLabel')}
                </p>
                <p className='whitespace-nowrap font-display text-xl font-bold tabular-nums text-ink'>
                  {format.euro(quote.recurring)}
                  <span className='ml-1 font-sans text-[13px] font-medium text-ink/65'>
                    {unit}
                  </span>
                </p>
              </div>
            </>
          ) : (
            <div className='flex items-baseline justify-between gap-4'>
              <p className='text-[15px] font-semibold text-ink'>
                {season
                  ? t('summary.recurringSeasonLabel')
                  : t('summary.recurringMonthLabel')}
              </p>
              <p
                key={`${quote.recurring}-${selection.cadence}`}
                className='price-swap whitespace-nowrap font-display text-[2.4rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-ink'>
                {format.euro(quote.recurring)}
              </p>
            </div>
          )}

          {!quote.free ? (
            <p className='mt-3 text-[13px] leading-5 text-ink/70'>
              {!gate.open
                ? season
                  ? t('summary.launchNoteSeason', labels)
                  : t('summary.launchNoteMonth', labels)
                : season
                  ? quote.today === null
                    ? `${t('summary.seasonTerms')} ${t('summary.fallbackNote')}`
                    : t('summary.seasonTerms')
                  : t('summary.monthTerms')}
            </p>
          ) : null}

          {quote.founder ? (
            <p className='mt-3 rounded-lg bg-primary/10 px-3 py-2 text-[13px] leading-5 text-ink/80'>
              {t('summary.founderNote', {
                ...labels,
                founder: format.euro(quote.founder.amount),
                standard: format.euro(quote.founder.instead),
              })}
            </p>
          ) : null}
        </div>

        <div className='mt-6 flex flex-col gap-3'>
          {quote.free ? (
            <a
              href={CLUB_CONFIG.website.appUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => trackRegisterClick('pricing')}
              className={PRIMARY_ACTION}>
              <UserPlus className='size-4 shrink-0' aria-hidden />
              {t('summary.register')}
            </a>
          ) : gate.open ? (
            <>
              <a
                href={checkoutHref(selection, sheet)}
                onClick={() => trackCheckoutClick(selection)}
                className={PRIMARY_ACTION}>
                {t('summary.buy')}
              </a>
              <p className='text-[13px] leading-5 text-ink/70'>
                {t('summary.buyHint')}
              </p>
            </>
          ) : (
            <>
              <button
                type='button'
                disabled
                className={cn(
                  'inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-dashed border-ink/30 bg-paper-2 px-5 py-3 font-display text-[15px] font-bold tracking-tight text-ink/70',
                )}>
                <Lock className='size-4 shrink-0' aria-hidden />
                {t('summary.buyLocked', labels)}
              </button>
              <a
                href={CLUB_CONFIG.website.appUrl}
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => trackRegisterClick('pricing')}
                className={PRIMARY_ACTION}>
                <UserPlus className='size-4 shrink-0' aria-hidden />
                {t('summary.registerFounder')}
              </a>
            </>
          )}
        </div>

        <p className='mt-5 text-[13px] leading-5 text-ink/65'>
          {t('summary.vatNote')}
        </p>
      </div>
    </BoardCard>
  );
}
