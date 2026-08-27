import { Minus } from 'lucide-react';
import { Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { FEATURE_STATUS_HINT, type Feature } from '../data/features';

/**
 * "Was Statix hier nicht macht".
 *
 * Every feature page carries one, and it is not a disclaimer band. A coach
 * decides against a tool once, on matchday, when it turns out not to do the
 * thing they assumed — and then they tell four other coaches. Naming the
 * boundary on the marketing page costs a paragraph and saves that.
 *
 * For anything not generally available the band opens with the status line, so
 * the limitation a reader most needs ("I cannot have this yet") is the first
 * one they read rather than the last.
 * @returns A JSX element rendering the feature's boundaries on the paper panel ground.
 */
export default function FeatureLimits({ feature }: { feature: Feature }) {
  const statusFirst = feature.status !== 'live';
  const entries = statusFirst
    ? [FEATURE_STATUS_HINT[feature.status], ...feature.limits]
    : feature.limits;

  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-24'>
      <Grain tone='paper' />

      <div className='relative mx-auto w-full max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Ehrlich gesagt'
          title='Was Statix hier nicht macht'
          description='Damit du es vorher weißt und nicht am Spieltag.'
        />

        <ul className='mt-9 space-y-4'>
          {entries.map((limit) => (
            <li key={limit.slice(0, 40)} className='flex items-start gap-3.5'>
              <span
                aria-hidden='true'
                className='mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink/50'>
                <Minus className='size-3' />
              </span>
              <span className='max-w-[68ch] text-[15px] leading-7 text-ink/75'>
                {limit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
