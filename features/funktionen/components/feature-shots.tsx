import {
  BoardScreenshot,
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import type { Feature, FeatureShot } from '../data/features';

/**
 * The screenshot band — the signature court ground of a feature page.
 *
 * Every image here is a real capture from `scripts/screenshots/capture.mjs`
 * against a running instance, never a mockup of a screen: the app UI is dark,
 * so shots pinned to the dark court read as prints on the board rather than as
 * cut-outs floating on paper.
 *
 * Layout is decided by the shapes, not by a grid. Landscape captures are
 * app screens full of six-point labels and table rows — halved into two columns
 * they become texture, so they get the full board width, one under the other.
 * Phone captures are grouped into their own row at the end at a phone's width,
 * which is the only size at which a 780×1688 shot means anything.
 *
 * The first shot is skipped when the hero already pinned it.
 * @returns A JSX element rendering the feature's screenshots on the court ground.
 */
export default function FeatureShots({ feature }: { feature: Feature }) {
  // The hero pins shot 0 unless the feature carries a drawn mock instead.
  const shots = feature.mock ? feature.shots : feature.shots.slice(1);
  if (shots.length === 0) return null;

  const isPortrait = (shot: FeatureShot) => shot.height > shot.width;
  const wide = shots.filter((shot) => !isPortrait(shot));
  const phones = shots.filter(isPortrait);

  return (
    <section className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-24'>
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -right-[18%] top-1/2 h-[118%] w-auto -translate-y-1/2 text-chalk/[0.07] sm:-right-[10%] lg:-right-[4%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Aus der App'
          title='So sieht das aus'
          description='Echte Aufnahmen aus Statix — keine Montage. Wenn sich die App ändert, werden sie neu aufgenommen.'
          tone='court'
        />

        <div className='mt-12 space-y-10'>
          {wide.map((shot, index) => (
            <BoardScreenshot
              key={shot.src + shot.label}
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              label={shot.label}
              tone='court'
              pin={index % 2 === 0 ? 'tape' : 'magnet'}
              sizes='(max-width: 1280px) 100vw, 1216px'
            />
          ))}
        </div>

        {phones.length > 0 ? (
          <div className='mt-10 flex flex-wrap justify-center gap-8'>
            {phones.map((shot) => (
              <BoardScreenshot
                key={shot.src + shot.label}
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                label={shot.label}
                tone='court'
                pin='magnet'
                sizes='(max-width: 640px) 70vw, 20rem'
                className='w-full max-w-[19rem]'
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
