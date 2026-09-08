'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { COURT_VIEW_LIST, type CourtView } from './court-geometry';
import { FORMATION_PRESETS, type FormationPreset } from './formations';
import type {
  ArrowColorOption,
  ArrowKindOption,
  BoardModeOption,
  MagnetKindOption,
} from './taktikboard-content';

/** A court view with the label and helper text of the active language. */
export type LabelledCourtView = CourtView & { label: string; hint: string };

/** A formation preset with the name and helper line of the active language. */
export type LabelledFormation = FormationPreset & {
  label: string;
  hint: string;
};

/**
 * Joins a translated list onto a list of records by `id`.
 *
 * On `id` and not on position: the bundles are edited by hand, and a reordered
 * list would otherwise silently give the half court the full court's helper
 * text — a mislabel nothing would catch.
 */
function labelBy<TRecord, TCopy extends { id: string }>(
  records: readonly (TRecord & { id: string })[],
  copy: readonly TCopy[],
): (TRecord & TCopy)[] {
  const byId = new Map(copy.map((entry) => [entry.id, entry]));

  return records.map((record) => ({
    ...record,
    ...(byId.get(record.id) as TCopy),
  }));
}

/**
 * Every list the board's controls read, in the reader's language.
 *
 * One hook rather than five, because the rail, the settings card, the on-board
 * editor and the how-to band each need a different subset and would otherwise
 * each open the same namespace.
 */
export function useBoardOptions() {
  const t = useTranslations('boardPage.tool');

  return useMemo(
    () => ({
      magnetKinds: t.raw('magnetKinds') as MagnetKindOption[],
      modes: t.raw('modes') as BoardModeOption[],
      arrowKinds: t.raw('arrowKinds') as ArrowKindOption[],
      arrowColors: t.raw('arrowColors') as ArrowColorOption[],
      courtViews: labelBy(
        COURT_VIEW_LIST,
        t.raw('courtViews') as { id: string; label: string; hint: string }[],
      ) as LabelledCourtView[],
      formations: labelBy(
        FORMATION_PRESETS,
        t.raw('formations') as { id: string; label: string; hint: string }[],
      ) as LabelledFormation[],
    }),
    [t],
  );
}
