'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { getHtmlLang, isAppLocale, DEFAULT_LOCALE } from '@/i18n/config';
import {
  DEFAULT_BENCHMARK_ID,
  type PositionBenchmark,
} from '../data/calculator-content';
import { useBenchmarks } from '../data/use-benchmarks';

/** Accepts both "58.3" and the "58,3" a coach types on a German keyboard. */
function parseNumber(value: string): number | null {
  const normalized = value.replace(',', '.').trim();
  if (normalized === '') return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

interface WurfquoteCalculatorProps {
  /** 'embed' drops the outer card chrome so the iframe fills its host. */
  variant?: 'page' | 'embed';
  className?: string;
}

/**
 * The Wurfquoten-Rechner. Plain React state, no animation and no chart library
 * — it has to work inside a foreign club page in an iframe as reliably as on
 * our own. The benchmark ranges come from `calculator-content.ts`, which mirrors
 * the Ratgeber article so both stay consistent; their labels and the reading
 * come from the bundle, so the tool speaks the reader's language.
 *
 * Decimals are formatted for the active language rather than always for German:
 * "58.3 %" for an English reader, "58,3 %" for the others.
 * @returns A JSX element rendering the shot-quota calculator.
 */
export default function WurfquoteCalculator({
  variant = 'page',
  className,
}: WurfquoteCalculatorProps) {
  const t = useTranslations('calculatorPage.calculator');
  const locale = useLocale();
  const benchmarks = useBenchmarks();

  const [tore, setTore] = useState('7');
  const [wuerfe, setWuerfe] = useState('12');
  const [benchmarkId, setBenchmarkId] = useState(DEFAULT_BENCHMARK_ID);
  const [zielquote, setZielquote] = useState('60');

  const decimalFormat = useMemo(
    () =>
      new Intl.NumberFormat(
        getHtmlLang(isAppLocale(locale) ? locale : DEFAULT_LOCALE),
        { minimumFractionDigits: 1, maximumFractionDigits: 1 },
      ),
    [locale],
  );

  const rangeLabel = useMemo(
    () => (benchmark: PositionBenchmark) =>
      benchmark.max === undefined
        ? t('rangeOver', { min: benchmark.min })
        : t('rangeBetween', { min: benchmark.min, max: benchmark.max }),
    [t],
  );

  const benchmark =
    benchmarks.find((entry) => entry.id === benchmarkId) ?? benchmarks[0];

  const result = useMemo(() => {
    const goals = parseNumber(tore);
    const shots = parseNumber(wuerfe);

    if (goals === null || shots === null) {
      return { status: 'empty' as const };
    }

    if (goals < 0 || shots < 0) {
      return { status: 'error' as const, message: t('errorNegative') };
    }

    if (shots === 0) {
      return { status: 'error' as const, message: t('errorNoShots') };
    }

    if (goals > shots) {
      return { status: 'error' as const, message: t('errorMoreGoals') };
    }

    const quota = (goals / shots) * 100;
    const range = rangeLabel(benchmark);

    // Plain-language reading of the quota against the position benchmark.
    const reading =
      quota < benchmark.min
        ? {
            tone: 'below' as const,
            headline: t('belowHeadline'),
            text: t('belowText', { label: benchmark.label, range }),
          }
        : benchmark.max !== undefined && quota > benchmark.max
          ? {
              tone: 'above' as const,
              headline: t('aboveHeadline'),
              text: t('aboveText', { label: benchmark.label, range }),
            }
          : {
              tone: 'inside' as const,
              headline: t('insideHeadline'),
              text: t('insideText', {
                label: benchmark.label,
                range,
                hint: benchmark.hint,
              }),
            };

    return {
      status: 'ok' as const,
      quota,
      goals,
      shots,
      reading,
      thin: shots < 10,
    };
  }, [tore, wuerfe, benchmark, rangeLabel, t]);

  const target = useMemo(() => {
    const goal = parseNumber(zielquote);
    const shots = parseNumber(wuerfe);
    const goals = parseNumber(tore);

    if (goal === null || shots === null || goals === null) return null;
    if (goal <= 0 || goal > 100 || shots <= 0 || goals < 0 || goals > shots)
      return null;

    const neededGoals = Math.ceil((goal / 100) * shots);
    const missing = Math.max(0, neededGoals - goals);

    // How many further shots would all have to go in to reach the target?
    const streak =
      goal >= 100
        ? null
        : Math.max(
            0,
            Math.ceil(((goal / 100) * shots - goals) / (1 - goal / 100)),
          );

    return { goal, neededGoals, missing, streak, shots };
  }, [zielquote, wuerfe, tore]);

  const onPaper = variant === 'page';

  const fieldClasses =
    'h-12 w-full rounded-xl border border-ink/15 bg-paper px-3.5 text-base font-semibold tabular-nums text-ink outline-none transition-colors placeholder:text-ink/40 hover:border-ink/25 focus:border-primary focus:ring-2 focus:ring-primary/25';
  const labelClasses =
    'block text-[13px] font-semibold uppercase tracking-wide text-ink/60';

  return (
    <div
      className={cn(
        'w-full rounded-2xl',
        onPaper
          ? 'board-shadow border border-ink/10 bg-paper p-5 sm:p-7'
          : 'bg-paper p-4 sm:p-6',
        className,
      )}>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <label className={labelClasses} htmlFor='rechner-tore'>
            {t('goalsLabel')}
          </label>
          <input
            id='rechner-tore'
            type='number'
            inputMode='numeric'
            min={0}
            step={1}
            value={tore}
            onChange={(event) => setTore(event.target.value)}
            className={cn(fieldClasses, 'mt-1.5')}
          />
        </div>
        <div>
          <label className={labelClasses} htmlFor='rechner-wuerfe'>
            {t('shotsLabel')}
          </label>
          <input
            id='rechner-wuerfe'
            type='number'
            inputMode='numeric'
            min={0}
            step={1}
            value={wuerfe}
            onChange={(event) => setWuerfe(event.target.value)}
            className={cn(fieldClasses, 'mt-1.5')}
          />
        </div>
      </div>

      <div className='mt-4'>
        <label className={labelClasses} htmlFor='rechner-position'>
          {t('positionLabel')}
        </label>
        <select
          id='rechner-position'
          value={benchmarkId}
          onChange={(event) => setBenchmarkId(event.target.value)}
          className={cn(fieldClasses, 'mt-1.5 cursor-pointer')}>
          {benchmarks.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.label} ({rangeLabel(entry)})
            </option>
          ))}
        </select>
      </div>

      <div
        aria-live='polite'
        className='mt-6 rounded-xl border border-ink/10 bg-paper-2 p-5 text-center'>
        {result.status === 'ok' ? (
          <>
            <p className='font-hand text-xl text-primary'>
              {t('resultKicker')}
            </p>
            <p className='mt-1 font-display text-[3.4rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-ink'>
              {`${decimalFormat.format(result.quota)} %`}
            </p>
            <p className='mt-2 text-sm text-ink/60'>
              {t('resultSummary', { goals: result.goals, shots: result.shots })}
            </p>
            <p
              className={cn(
                'mt-4 inline-block rounded-full px-3 py-1 text-[13px] font-semibold',
                result.reading.tone === 'below'
                  ? 'bg-secondary/12 text-secondary'
                  : result.reading.tone === 'above'
                    ? 'bg-success/15 text-success'
                    : 'bg-primary/12 text-primary',
              )}>
              {result.reading.headline}
            </p>
            <p className='mx-auto mt-3 max-w-[52ch] text-[15px] leading-7 text-ink/75'>
              {result.reading.text}
            </p>
            {result.thin ? (
              <p className='mx-auto mt-3 max-w-[52ch] text-[13px] leading-6 text-ink/55'>
                {t('thinWarning')}
              </p>
            ) : null}
          </>
        ) : result.status === 'error' ? (
          <p className='text-[15px] leading-7 text-ink/75'>{result.message}</p>
        ) : (
          <p className='text-[15px] leading-7 text-ink/75'>{t('empty')}</p>
        )}
      </div>

      <div className='mt-6 border-t border-ink/10 pt-5'>
        <p className='font-display text-base font-bold tracking-tight text-ink'>
          {t('reverseTitle')}
        </p>
        <div className='mt-3 flex flex-wrap items-end gap-4'>
          <div className='w-32'>
            <label className={labelClasses} htmlFor='rechner-ziel'>
              {t('targetLabel')}
            </label>
            <input
              id='rechner-ziel'
              type='number'
              inputMode='numeric'
              min={1}
              max={100}
              step={1}
              value={zielquote}
              onChange={(event) => setZielquote(event.target.value)}
              className={cn(fieldClasses, 'mt-1.5')}
            />
          </div>
          <p
            aria-live='polite'
            className='min-w-[16rem] flex-1 text-[15px] leading-7 text-ink/75'>
            {target ? (
              <>
                {t('targetLead', {
                  goal: decimalFormat.format(target.goal),
                  shots: target.shots,
                })}{' '}
                <strong className='font-semibold text-ink'>
                  {t('targetGoals', { needed: target.neededGoals })}
                </strong>
                .{' '}
                {target.missing > 0 ? (
                  <>
                    {t('targetMissing', { missing: target.missing })}
                    {target.streak !== null && target.streak > 0 ? (
                      <> {t('targetStreak', { streak: target.streak })}</>
                    ) : null}
                  </>
                ) : (
                  t('targetReached')
                )}
              </>
            ) : (
              t('targetInvalid')
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
