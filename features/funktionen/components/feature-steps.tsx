import {
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import type { Feature } from '../data/features';

/**
 * "So läuft das" — the feature's steps as the coach's roster: a numbered magnet
 * per row, hairline rules between them. Same point-list grammar as the landing
 * page's operate bands (see DESIGN.md), so a feature page reads as part of the
 * board rather than as a generic icon grid.
 * @returns A JSX element rendering the numbered steps on the paper ground.
 */
export default function FeatureSteps({ feature }: { feature: Feature }) {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-24'>
      <Grain tone='paper' />

      <div className='relative mx-auto w-full max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Der Ablauf'
          title='So läuft das in der Praxis'
        />

        <div className='mt-10 border-t border-ink/10'>
          {feature.steps.map((step, index) => (
            <div
              key={step.title}
              className='flex items-start gap-5 border-b border-ink/10 py-6'>
              <PlayerMagnet
                number={index + 1}
                team='home'
                size='md'
                className='shrink-0'
              />
              <div>
                <h3 className='font-display text-lg font-bold tracking-[-0.01em] text-ink'>
                  {step.title}
                </h3>
                <p className='mt-1.5 max-w-[64ch] text-[15px] leading-7 text-ink/70'>
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
