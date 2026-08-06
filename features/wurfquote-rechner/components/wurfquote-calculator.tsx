'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DEFAULT_BENCHMARK_ID,
  POSITION_BENCHMARKS,
  type PositionBenchmark,
} from '../data/calculator-content';

const decimalFormat = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Accepts both "58.3" and the German "58,3" a coach actually types. */
function parseNumber(value: string): number | null {
  const normalized = value.replace(',', '.').trim();
  if (normalized === '') return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatPercent(value: number): string {
  return `${decimalFormat.format(value)} %`;
}

function rangeLabel(benchmark: PositionBenchmark): string {
  return benchmark.max === undefined
    ? `über ${benchmark.min} %`
    : `${benchmark.min}–${benchmark.max} %`;
}

/** Plain-language reading of the quota against the position benchmark. */
function readQuota(quota: number, benchmark: PositionBenchmark) {
  if (quota < benchmark.min) {
    return {
      tone: 'below' as const,
      headline: 'unter dem Richtwert',
      text: `Für ${benchmark.label} liegt der übliche Bereich bei ${rangeLabel(benchmark)}. Lohnt sich ein Blick aufs Wurfbild: Kommen die Fehlwürfe aus einer Zone oder aus einer Ecke?`,
    };
  }

  if (benchmark.max !== undefined && quota > benchmark.max) {
    return {
      tone: 'above' as const,
      headline: 'über dem Richtwert',
      text: `Stark: ${rangeLabel(benchmark)} gilt für ${benchmark.label} schon als gut. Prüf trotzdem die Wurfanzahl – wenige Abschlüsse heben die Quote schnell.`,
    };
  }

  return {
    tone: 'inside' as const,
    headline: 'im erwarteten Bereich',
    text: `${rangeLabel(benchmark)} ist für ${benchmark.label} der übliche Korridor. ${benchmark.hint}`,
  };
}

interface WurfquoteCalculatorProps {
  /** 'embed' drops the outer card chrome so the iframe fills its host. */
  variant?: 'page' | 'embed';
  className?: string;
}

/**
 * The Wurfquoten-Rechner. Plain React state, no animation and no chart library
 * — it has to work inside a foreign club page in an iframe as reliably as on
 * our own. Benchmarks come from `calculator-content.ts`, which mirrors the
 * Ratgeber article so both stay consistent.
 * @returns A JSX element rendering the shot-quota calculator.
 */
export default function WurfquoteCalculator({
  variant = 'page',
  className,
}: WurfquoteCalculatorProps) {
  const [tore, setTore] = useState('7');
  const [wuerfe, setWuerfe] = useState('12');
  const [benchmarkId, setBenchmarkId] = useState(DEFAULT_BENCHMARK_ID);
  const [zielquote, setZielquote] = useState('60');

  const benchmark =
    POSITION_BENCHMARKS.find((entry) => entry.id === benchmarkId) ?? POSITION_BENCHMARKS[0];

  const result = useMemo(() => {
    const goals = parseNumber(tore);
    const shots = parseNumber(wuerfe);

    if (goals === null || shots === null) {
      return { status: 'empty' as const };
    }

    if (goals < 0 || shots < 0) {
      return { status: 'error' as const, message: 'Negative Werte gibt es im Handball nicht.' };
    }

    if (shots === 0) {
      return { status: 'error' as const, message: 'Ohne Würfe gibt es keine Quote – trag erst die Torabschlüsse ein.' };
    }

    if (goals > shots) {
      return {
        status: 'error' as const,
        message: 'Mehr Tore als Würfe? Jedes Tor ist auch ein Wurf – prüf die beiden Zahlen.',
      };
    }

    const quota = (goals / shots) * 100;

    return {
      status: 'ok' as const,
      quota,
      goals,
      shots,
      reading: readQuota(quota, benchmark),
      thin: shots < 10,
    };
  }, [tore, wuerfe, benchmark]);

  const target = useMemo(() => {
    const goal = parseNumber(zielquote);
    const shots = parseNumber(wuerfe);
    const goals = parseNumber(tore);

    if (goal === null || shots === null || goals === null) return null;
    if (goal <= 0 || goal > 100 || shots <= 0 || goals < 0 || goals > shots) return null;

    const neededGoals = Math.ceil((goal / 100) * shots);
    const missing = Math.max(0, neededGoals - goals);

    // Wie viele weitere Würfe müssten alle sitzen, um die Zielquote zu erreichen?
    const streak =
      goal >= 100
        ? null
        : Math.max(0, Math.ceil(((goal / 100) * shots - goals) / (1 - goal / 100)));

    return { goal, neededGoals, missing, streak, shots };
  }, [zielquote, wuerfe, tore]);

  const onPaper = variant === 'page';

  const fieldClasses =
    'h-12 w-full rounded-xl border border-ink/15 bg-paper px-3.5 text-base font-semibold tabular-nums text-ink outline-none transition-colors placeholder:text-ink/40 hover:border-ink/25 focus:border-primary focus:ring-2 focus:ring-primary/25';
  const labelClasses = 'block text-[13px] font-semibold uppercase tracking-wide text-ink/60';

  return (
    <div
      className={cn(
        'w-full rounded-2xl',
        onPaper ? 'board-shadow border border-ink/10 bg-paper p-5 sm:p-7' : 'bg-paper p-4 sm:p-6',
        className,
      )}>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <label className={labelClasses} htmlFor='rechner-tore'>
            Tore
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
            Würfe (alle Torabschlüsse)
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
          Einordnen als
        </label>
        <select
          id='rechner-position'
          value={benchmarkId}
          onChange={(event) => setBenchmarkId(event.target.value)}
          className={cn(fieldClasses, 'mt-1.5 cursor-pointer')}>
          {POSITION_BENCHMARKS.map((entry) => (
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
            <p className='font-hand text-xl text-primary'>Wurfquote</p>
            <p className='mt-1 font-display text-[3.4rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-ink'>
              {formatPercent(result.quota)}
            </p>
            <p className='mt-2 text-sm text-ink/60'>
              {result.goals} von {result.shots} Würfen im Tor
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
                Achtung: Unter zehn Würfen ist die Quote vor allem Zufall. Nimm
                mehrere Spiele zusammen, bevor du daraus einen Trainingsauftrag
                machst.
              </p>
            ) : null}
          </>
        ) : result.status === 'error' ? (
          <p className='text-[15px] leading-7 text-ink/75'>{result.message}</p>
        ) : (
          <p className='text-[15px] leading-7 text-ink/75'>
            Trag Tore und Würfe ein – die Quote steht sofort da.
          </p>
        )}
      </div>

      <div className='mt-6 border-t border-ink/10 pt-5'>
        <p className='font-display text-base font-bold tracking-tight text-ink'>
          Umgekehrt gerechnet
        </p>
        <div className='mt-3 flex flex-wrap items-end gap-4'>
          <div className='w-32'>
            <label className={labelClasses} htmlFor='rechner-ziel'>
              Zielquote (%)
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
          <p aria-live='polite' className='min-w-[16rem] flex-1 text-[15px] leading-7 text-ink/75'>
            {target ? (
              <>
                Für {decimalFormat.format(target.goal)} % brauchst du bei{' '}
                {target.shots} Würfen{' '}
                <strong className='font-semibold text-ink'>
                  {target.neededGoals} Tore
                </strong>
                .{' '}
                {target.missing > 0 ? (
                  <>
                    Dir fehlen {target.missing}.
                    {target.streak !== null && target.streak > 0 ? (
                      <>
                        {' '}
                        Ohne die bisherigen Würfe zu ändern: die nächsten{' '}
                        {target.streak} Abschlüsse müssten alle sitzen.
                      </>
                    ) : null}
                  </>
                ) : (
                  'Das hast du schon erreicht.'
                )}
              </>
            ) : (
              'Trag oben gültige Werte ein, dann rechne ich dir die nötigen Tore aus.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
