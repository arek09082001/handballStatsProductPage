// lib/utils/calcDynamicScore.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Rating {
  motivation?: number;
  focus?: number;
  performance?: number;
  discipline?: number;
  teamwork?: number;
  coachability?: number;
}

/**
 * Calculate a weighted performance score as a percentage (0–100%)
 * based on whichever ratings you have.
 */
export function calcDynamicScore(r: Rating): number {
  // Define ideal weights (sum to 1)
  const WEIGHTS: Record<keyof Rating, number> = {
    performance: 0.4,
    focus: 0.25,
    motivation: 0.2,
    discipline: 0.05,
    teamwork: 0.05,
    coachability: 0.05,
  };

  // Only include factors that actually have a numeric rating
  const present = (Object.keys(WEIGHTS) as (keyof Rating)[]).filter(
    (k) => typeof r[k] === 'number'
  );

  if (present.length === 0) return 0;

  // Sum the weights of present factors
  const totalWeight = present.reduce((sum, k) => sum + WEIGHTS[k], 0);

  // Compute weighted average (0–5 scale)
  const raw = present.reduce((sum, k) => {
    const value = (r[k] as number) || 0;
    const weight = WEIGHTS[k];
    return sum + (value * weight) / totalWeight;
  }, 0);

  // Convert 0–5 scale to percentage 0–100%
  const percent = Math.round((raw / 5) * 100);
  return percent;
}
