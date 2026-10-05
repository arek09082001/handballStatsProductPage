'use client';

import { Check, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import type {
  AppCompareRow,
  CompareGroup,
  CompareRowBase,
  CompareValue,
  VideoCompareRow,
} from '../data/pricing-content';
import type { PriceSheet } from '../data/price-sheet';
import { usePriceFormat } from '../data/use-price-format';
import { usePricingLabels } from '../data/use-pricing-labels';

interface TierColumn<Row> {
  key: keyof Row & string;
  label: string;
  /** The season price, so the header still answers "was kostet das" mid-page. */
  price: string;
  featured?: boolean;
}

interface TierCopy {
  id: string;
  name: string;
}

/**
 * The tick's disc and glyph.
 *
 * The `--success` token is a mid-tone green: as a glyph on its own 15 %-tinted
 * disc it measures 2.4:1 against warm paper and misses the 3:1 floor a
 * meaningful graphic has to clear. The disc keeps the token's hue and the glyph
 * is set in a deep shade of it (7:1) — the same reversal `PlayerMagnet` makes
 * for its jersey numbers, and for the same reason.
 */
const TICK_DISC = 'bg-success/20 text-[hsl(142_72%_20%)]';

/**
 * "Not included". At `ink/25` the dash measured 2.8:1 and was decoration rather
 * than a value; at 55 % it reads as an entry without competing with the ticks.
 */
const DASH = 'text-ink/55';

/**
 * One cell. A tick and a dash are icons for sighted readers and words for
 * everybody else — a screen reader that meets a row of unlabelled `svg`s in a
 * comparison table learns nothing from it.
 */
function Cell({
  value,
  featured,
  includedLabel,
  notIncludedLabel,
}: {
  value: CompareValue;
  featured?: boolean;
  includedLabel: string;
  notIncludedLabel: string;
}) {
  return (
    <td
      className={cn(
        'px-1 py-3 text-center align-middle sm:px-3',
        featured ? 'bg-primary/[0.07]' : undefined,
      )}>
      {value === true ? (
        <>
          <span
            className={cn(
              'mx-auto flex size-6 items-center justify-center rounded-full',
              TICK_DISC,
            )}>
            <Check className='size-3.5' strokeWidth={3} aria-hidden />
          </span>
          <span className='sr-only'>{includedLabel}</span>
        </>
      ) : value === false ? (
        <>
          <Minus className={cn('mx-auto size-4', DASH)} aria-hidden />
          <span className='sr-only'>{notIncludedLabel}</span>
        </>
      ) : (
        <span className='font-display text-[15px] font-bold tabular-nums text-ink'>
          {value}
        </span>
      )}
    </td>
  );
}

/** One scoresheet: a group heading, its note, and a fixed-grid table. */
function CompareTable<Row extends CompareRowBase>({
  group,
  columns,
  captionSuffix,
  rowHeaderSr,
  includedLabel,
  notIncludedLabel,
}: {
  group: CompareGroup<Row>;
  columns: readonly TierColumn<Row>[];
  captionSuffix: string;
  rowHeaderSr: string;
  includedLabel: string;
  notIncludedLabel: string;
}) {
  return (
    <section aria-labelledby={`vergleich-${group.id}`}>
      <h4
        id={`vergleich-${group.id}`}
        className='font-display text-xl font-bold tracking-tight text-ink sm:text-2xl'>
        {group.title}
      </h4>
      <p className='mt-1.5 max-w-[62ch] text-[15px] leading-7 text-ink/70'>
        {group.note}
      </p>

      <table className='mt-6 w-full table-fixed border-collapse text-left'>
        <caption className='sr-only'>
          {group.title}: {captionSuffix}
        </caption>
        <colgroup>
          <col />
          {columns.map((column) => (
            <col key={column.key} className='w-[4.25rem] sm:w-32 lg:w-40' />
          ))}
        </colgroup>
        <thead>
          <tr className='border-b-2 border-ink/25'>
            <th scope='col' className='py-2.5 pr-3 text-left font-normal'>
              <span className='sr-only'>{rowHeaderSr}</span>
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                scope='col'
                className={cn(
                  'px-1 py-2.5 text-center align-bottom sm:px-3',
                  column.featured ? 'bg-primary/[0.07]' : undefined,
                )}>
                <span
                  className={cn(
                    'block font-display text-[14px] font-bold leading-tight tracking-tight sm:text-[15px]',
                    column.featured ? 'text-primary' : 'text-ink',
                  )}>
                  {column.label}
                </span>
                <span className='block font-medium tabular-nums text-[13px] text-ink/70'>
                  {column.price}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {group.rows.map((row, index) => (
            <tr
              key={row.label}
              className={cn(
                'border-b border-ink/10',
                index % 2 === 1 ? 'bg-paper/70' : undefined,
              )}>
              <th
                scope='row'
                className='py-3 pr-3 align-middle text-[15px] font-medium leading-6 text-ink'>
                {row.label}
                {row.hint ? (
                  <span className='mt-0.5 block text-[13px] font-normal leading-5 text-ink/70'>
                    {row.hint}
                  </span>
                ) : null}
              </th>
              {columns.map((column) => (
                <Cell
                  key={column.key}
                  value={row[column.key] as CompareValue}
                  featured={column.featured}
                  includedLabel={includedLabel}
                  notIncludedLabel={notIncludedLabel}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/**
 * The plan comparison — scoresheets for both dials of the product: first the
 * app tiers (four groups, one per kind of work), then the video tiers.
 *
 * Deliberately several tables rather than one long one with a sticky header:
 * the site's navigation is a floating bar pinned to the top of the viewport,
 * so a sticky `thead` would spend the whole scroll underneath it. Repeating a
 * short header per group keeps the column meaning within a screen of every
 * row, and a shared column grid keeps the tables aligned so the eye reads
 * straight down.
 *
 * The columns never scroll sideways either. Every value is at most six
 * characters (the units live under the label), which is what lets three tier
 * columns and a wrapping label column fit a 360 px phone — the device this page
 * is actually read on. The prices in the headers come from the same price list
 * as the configurator.
 * @returns A JSX element rendering the full plan comparison on the paper panel ground.
 */
export default function PricingCompare({ sheet }: { sheet: PriceSheet }) {
  const t = useTranslations('pricingPage.compare');
  const tConfig = useTranslations('pricingPage.configurator');
  const labels = usePricingLabels();
  const format = usePriceFormat();

  const groups = t.raw('groups') as CompareGroup<AppCompareRow>[];
  const videoGroup = t.raw('video') as CompareGroup<VideoCompareRow>;
  const includedLabel = t('included');
  const notIncludedLabel = t('notIncluded');
  const appCopy = tConfig.raw('app.items') as TierCopy[];
  const videoCopy = tConfig.raw('video.items') as TierCopy[];
  const nameOf = (copy: TierCopy[], id: string) =>
    copy.find((item) => item.id === id)?.name ?? id;

  const appColumns: readonly TierColumn<AppCompareRow>[] = [
    { key: 'basis', label: nameOf(appCopy, 'basis'), price: format.euro(0) },
    {
      key: 'trainer',
      label: nameOf(appCopy, 'trainer'),
      price: format.euro(sheet.app.trainer.standard.season),
      featured: true,
    },
    {
      key: 'pro',
      label: nameOf(appCopy, 'pro'),
      price: format.euro(sheet.app.pro.standard.season),
    },
  ];
  const videoColumns: readonly TierColumn<VideoCompareRow>[] = (
    ['basis', 'team', 'analyse'] as const
  ).map((id) => ({
    key: id,
    label: nameOf(videoCopy, id),
    price: format.euro(sheet.video[id].season),
  }));

  const tableProps = {
    captionSuffix: t('captionSuffix'),
    rowHeaderSr: t('rowHeaderSr'),
    includedLabel,
    notIncludedLabel,
  };

  return (
    <section
      id='vergleich'
      className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-4 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink/70'>
          <span className='inline-flex items-center gap-2'>
            <span
              className={cn(
                'flex size-5 items-center justify-center rounded-full',
                TICK_DISC,
              )}>
              <Check className='size-3' strokeWidth={3} aria-hidden />
            </span>
            {includedLabel}
          </span>
          <span className='inline-flex items-center gap-2'>
            <Minus className={cn('size-4', DASH)} aria-hidden />
            {notIncludedLabel}
          </span>
          <span>{t('limitsNote', labels)}</span>
        </div>

        <h3 className='mt-14 border-b-2 border-ink pb-2 font-display text-[1.6rem] font-extrabold tracking-[-0.02em] text-ink'>
          {t('appHeading')}
        </h3>
        <div className='mt-8 flex flex-col gap-14'>
          {groups.map((group) => (
            <CompareTable
              key={group.id}
              group={group}
              columns={appColumns}
              {...tableProps}
            />
          ))}
        </div>

        <p className='mt-10 max-w-[68ch] text-[15px] leading-7 text-ink/70'>
          {t('closing')}
        </p>

        <h3 className='mt-16 border-b-2 border-ink pb-2 font-display text-[1.6rem] font-extrabold tracking-[-0.02em] text-ink'>
          {t('videoHeading')}
        </h3>
        <div className='mt-8'>
          <CompareTable group={videoGroup} columns={videoColumns} {...tableProps} />
        </div>
        <p className='mt-8 max-w-[68ch] text-[15px] leading-7 text-ink/70'>
          {t('videoClosing')}
        </p>
      </div>
    </section>
  );
}
