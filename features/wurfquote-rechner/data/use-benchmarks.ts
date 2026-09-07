'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  BENCHMARK_RANGES,
  type BenchmarkCopy,
  type PositionBenchmark,
} from './calculator-content';

/**
 * The position benchmarks in the reader's language.
 *
 * The percentages come from `BENCHMARK_RANGES` and the wording from the bundle,
 * joined on `id` rather than on list order: a bundle whose entries were
 * reordered would otherwise silently label the wing range as the pivot's.
 */
export function useBenchmarks(): PositionBenchmark[] {
  const t = useTranslations('calculatorPage');

  return useMemo(() => {
    const copyById = new Map(
      (t.raw('positions') as BenchmarkCopy[]).map((entry) => [entry.id, entry]),
    );

    return BENCHMARK_RANGES.map((range) => {
      const copy = copyById.get(range.id);

      return {
        ...range,
        label: copy?.label ?? range.id,
        hint: copy?.hint ?? '',
      };
    });
  }, [t]);
}
