'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ArrowDown, Cpu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  CourtDiagram,
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import {
  APP_TIER_IDS,
  VIDEO_TIER_IDS,
  type AppTierId,
  type Cadence,
  type PriceSheet,
  type VideoTierId,
} from '../data/price-sheet';
import {
  DEFAULT_SELECTION,
  quotePlan,
  type PlanSelection,
} from '../data/plan-selection';
import { useCheckoutGate } from '../data/use-checkout-gate';
import { usePriceFormat } from '../data/use-price-format';
import { usePricingLabels } from '../data/use-pricing-labels';
import { useRadioGroup } from '../data/use-radio-group';
import PricingPlanOption from './pricing-plan-option';
import PricingSummary, { SUMMARY_ID } from './pricing-summary';

interface TierCopy {
  id: string;
  name: string;
  audience: string;
  highlights: string[];
  recommended?: boolean;
}

const CADENCES: readonly Cadence[] = ['season', 'month'];

/** One numbered step of the configurator, headed by a magnet like a play on the board. */
function ConfiguratorStep({
  number,
  id,
  title,
  note,
  children,
}: {
  number: number;
  id: string;
  title: string;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className='flex items-start gap-3.5'>
        <PlayerMagnet number={number} size='sm' className='mt-0.5 shrink-0' />
        <div>
          <h3
            id={id}
            className='font-display text-xl font-bold tracking-tight text-chalk sm:text-2xl'>
            {title}
          </h3>
          {note ? (
            <p className='mt-1 max-w-[60ch] text-[15px] leading-6 text-chalk/70'>
              {note}
            </p>
          ) : null}
        </div>
      </div>
      <div className='mt-5'>{children}</div>
    </div>
  );
}

/**
 * The configurator — the heart of `/preise` and the scoreboard band of the page.
 *
 * Statix is one product with two dials: the APP tier (for the account and every
 * squad in it) and, for a squad that films, a VIDEO tier. Both run on the same
 * cadence. The band asks in that order — cadence, app, video — because the
 * cadence changes every figure below it and the video choice changes the app's
 * figure (the package price), never the other way round.
 *
 * Every figure comes from the app's price list (`sheet`); nothing here knows a
 * price. The summary beside it is sticky from `lg`, and on a phone a slim bar
 * pinned to the bottom of the viewport carries the running total down to it,
 * so the effect of a tap is never a scroll away.
 * @returns A JSX element rendering the plan configurator on the court ground.
 */
export default function PricingConfigurator({ sheet }: { sheet: PriceSheet }) {
  const t = useTranslations('pricingPage.configurator');
  const labels = usePricingLabels();
  const format = usePriceFormat();
  const gate = useCheckoutGate(sheet);

  const seasonOpen = sheet.season.purchaseOpen;
  const [selection, setSelection] = useState<PlanSelection>(() => ({
    ...DEFAULT_SELECTION,
    cadence: seasonOpen ? 'season' : 'month',
  }));
  const quote = useMemo(() => quotePlan(selection, sheet), [selection, sheet]);
  const season = selection.cadence === 'season';

  const appCopy = t.raw('app.items') as TierCopy[];
  const videoCopy = [
    t.raw('video.none') as TierCopy,
    ...(t.raw('video.items') as TierCopy[]),
  ];
  const appName = useCallback(
    (id: AppTierId) => appCopy.find((item) => item.id === id)?.name ?? id,
    [appCopy],
  );
  const videoName = useCallback(
    (id: VideoTierId) => videoCopy.find((item) => item.id === id)?.name ?? id,
    [videoCopy],
  );

  const setCadence = useCallback(
    (cadence: Cadence) => setSelection((current) => ({ ...current, cadence })),
    [],
  );
  const setApp = useCallback(
    (app: AppTierId) => setSelection((current) => ({ ...current, app })),
    [],
  );
  const setVideo = useCallback(
    (video: VideoTierId) => setSelection((current) => ({ ...current, video })),
    [],
  );

  const cadenceRadio = useRadioGroup(
    CADENCES,
    selection.cadence,
    setCadence,
    (cadence) => cadence === 'season' && !seasonOpen,
  );
  const appRadio = useRadioGroup(APP_TIER_IDS, selection.app, setApp);
  const videoRadio = useRadioGroup(VIDEO_TIER_IDS, selection.video, setVideo);

  const unit = season ? t('price.perSeason') : t('price.perMonth');
  const withVideo = selection.video !== 'none';

  const appFigure = (id: AppTierId) => {
    if (id === 'basis') {
      return { amount: format.euro(0), unit: t('price.forever'), note: null };
    }
    const prices = sheet.app[id];
    if (!season) {
      return { amount: format.euro(prices.month), unit, note: null };
    }
    if (withVideo) {
      return {
        amount: format.euro(prices.pack.season),
        unit,
        note: t.rich('price.packNote', {
          instead: format.euro(prices.standard.season),
          strike: (chunks) => <s className='text-chalk/55'>{chunks}</s>,
        }),
      };
    }
    return { amount: format.euro(prices.standard.season), unit, note: null };
  };

  const videoFigure = (id: VideoTierId) => {
    if (id === 'none') {
      return { amount: format.euro(0), unit: '', note: t('video.noneNote') };
    }
    const prices = sheet.video[id];
    const credits = prices.credits[selection.cadence];
    const creditsText =
      credits === 0
        ? t('video.noCredits')
        : season
          ? t('video.creditsSeason', { credits })
          : t('video.creditsMonth', { credits });
    return {
      amount: format.euro(season ? prices.season : prices.month),
      unit,
      note: `${t('video.storage', { gb: prices.storageGb })} · ${creditsText}`,
    };
  };

  const mobileFigure = quote.free
    ? format.euro(0)
    : gate.open && season && quote.today !== null
      ? format.euro(quote.today)
      : format.euro(quote.recurring);
  const mobileUnit = quote.free
    ? t('price.forever')
    : gate.open && season && quote.today !== null
      ? t('summary.mobileToday')
      : unit;

  return (
    <section
      id='plaene'
      aria-labelledby='plaene-titel'
      className='relative w-full scroll-mt-20 bg-court py-20 text-chalk md:py-28'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <CourtDiagram
          variant='full'
          aria-hidden
          className='absolute inset-x-0 bottom-0 mx-auto h-auto w-[94%] max-w-5xl text-chalk/[0.05]'
        />
        <Grain tone='court' />
      </div>

      <div className='relative mx-auto max-w-6xl px-4 sm:px-10'>
        <SectionHeading
          tone='court'
          kicker={t('kicker')}
          title={<span id='plaene-titel'>{t('title')}</span>}
          description={t('description')}
        />

        <div className='mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_23rem]'>
          <div className='flex min-w-0 flex-col gap-14'>
            <ConfiguratorStep
              number={1}
              id='plan-schritt-abrechnung'
              title={t('cadence.title')}
              note={t('cadence.note')}>
              <div
                role='radiogroup'
                aria-labelledby='plan-schritt-abrechnung'
                className='grid w-full max-w-md grid-cols-2 gap-1 rounded-2xl border border-chalk/15 bg-chalk/[0.05] p-1'>
                {CADENCES.map((cadence, index) => {
                  const radio = cadenceRadio(cadence, index);
                  const active = radio['aria-checked'];
                  const disabled = radio['aria-disabled'] === true;
                  return (
                    <button
                      key={cadence}
                      type='button'
                      {...radio}
                      className={cn(
                        'flex flex-col items-center rounded-xl px-3 py-2.5 text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-court',
                        active
                          ? 'bg-primary text-white shadow-[0_8px_18px_-10px_hsl(22_90%_45%/0.9)]'
                          : 'text-chalk/75 hover:bg-chalk/[0.06] hover:text-chalk',
                        disabled && 'cursor-not-allowed opacity-45 hover:bg-transparent',
                      )}>
                      <span className='font-display text-base font-bold tracking-tight'>
                        {t(`cadence.${cadence}`)}
                      </span>
                      <span
                        className={cn(
                          'text-[13px] leading-5',
                          active ? 'text-white/85' : 'text-chalk/60',
                        )}>
                        {t(`cadence.${cadence}Hint`)}
                      </span>
                    </button>
                  );
                })}
              </div>
              {!seasonOpen ? (
                <p className='mt-3 max-w-md text-[13px] leading-5 text-chalk/75'>
                  {t('cadence.seasonClosed')}
                </p>
              ) : null}
            </ConfiguratorStep>

            <ConfiguratorStep
              number={2}
              id='plan-schritt-app'
              title={t('app.title')}
              note={t('app.note')}>
              <div
                role='radiogroup'
                aria-labelledby='plan-schritt-app'
                className='grid gap-4 pt-3 sm:grid-cols-3'>
                {appCopy.map((tier, index) => {
                  const id = tier.id as AppTierId;
                  const figure = appFigure(id);
                  return (
                    <PricingPlanOption
                      key={id}
                      radio={appRadio(id, index)}
                      name={tier.name}
                      audience={tier.audience}
                      amount={figure.amount}
                      unit={figure.unit}
                      note={figure.note}
                      highlights={tier.highlights}
                      recommendedLabel={
                        tier.recommended ? t('recommended') : undefined
                      }
                    />
                  );
                })}
              </div>
            </ConfiguratorStep>

            <ConfiguratorStep
              number={3}
              id='plan-schritt-video'
              title={t('video.title')}
              note={t('video.note')}>
              <div
                role='radiogroup'
                aria-labelledby='plan-schritt-video'
                className='grid gap-4 sm:grid-cols-2'>
                {videoCopy.map((tier, index) => {
                  const id = tier.id as VideoTierId;
                  const figure = videoFigure(id);
                  return (
                    <PricingPlanOption
                      key={id}
                      radio={videoRadio(id, index)}
                      name={tier.name}
                      audience={tier.audience}
                      amount={figure.amount}
                      unit={figure.unit}
                      note={figure.note}
                      highlights={tier.highlights}
                    />
                  );
                })}
              </div>

              <div className='mt-6 flex gap-3.5 rounded-2xl border border-chalk/12 bg-chalk/[0.04] p-5'>
                <Cpu
                  className='mt-0.5 size-5 shrink-0 text-primary'
                  aria-hidden
                />
                <div className='text-[14px] leading-6 text-chalk/75'>
                  <p className='font-display text-base font-bold tracking-tight text-chalk'>
                    {t('video.creditsTitle')}
                  </p>
                  <p className='mt-1'>{t('video.creditsText')}</p>
                  <p className='mt-1'>
                    {t('video.creditPacks', {
                      smallCredits: sheet.creditPacks.small.credits,
                      smallPrice: format.euro(sheet.creditPacks.small.price),
                      largeCredits: sheet.creditPacks.large.credits,
                      largePrice: format.euro(sheet.creditPacks.large.price),
                    })}
                  </p>
                  <p className='mt-3 text-[13px] leading-5 text-chalk/65'>
                    {t('video.betaNote', labels)}
                  </p>
                </div>
              </div>
            </ConfiguratorStep>

            {/* Phone only: the running total, pinned to the bottom of the
                viewport while the steps scroll past, and a jump to the receipt. */}
            <div className='sticky bottom-3 z-20 -mt-6 lg:hidden'>
              <div className='flex items-center justify-between gap-3 rounded-2xl border border-chalk/15 bg-court-2/95 px-4 py-3 shadow-[0_18px_40px_-16px_hsl(200_60%_4%/0.9)] backdrop-blur-sm'>
                <p className='min-w-0'>
                  <span className='block truncate text-[13px] leading-5 text-chalk/70'>
                    {quote.free
                      ? t('summary.appLine', { name: appName('basis') })
                      : [
                          selection.app !== 'basis'
                            ? appName(selection.app)
                            : null,
                          selection.video !== 'none'
                            ? videoName(selection.video)
                            : null,
                        ]
                          .filter(Boolean)
                          .join(' + ')}
                  </span>
                  <span
                    aria-live='polite'
                    className='font-display text-xl font-extrabold tabular-nums text-chalk'>
                    {mobileFigure}
                    <span className='ml-1 font-sans text-[13px] font-medium text-chalk/65'>
                      {mobileUnit}
                    </span>
                  </span>
                </p>
                <a
                  href={`#${SUMMARY_ID}`}
                  className='inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 font-display text-[15px] font-bold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chalk/70'>
                  {t('summary.jump')}
                  <ArrowDown className='size-4' aria-hidden />
                </a>
              </div>
            </div>
          </div>

          <aside
            aria-label={t('summary.title')}
            className='lg:sticky lg:top-28'>
            <PricingSummary
              selection={selection}
              quote={quote}
              sheet={sheet}
              gate={gate}
              format={format}
              appName={appName}
              videoName={videoName}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}
