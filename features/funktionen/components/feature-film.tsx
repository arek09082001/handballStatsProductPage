'use client';

import { useTranslations } from 'next-intl';
import ChapterFilm from '@/features/landing-page/components/chapter-film';
import {
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { cn } from '@/lib/utils';
import { stepsFilmBounds } from '@/features/films/data/films';
import type { Feature } from '../data/features';

/**
 * „So läuft das“ als Film statt als Liste: ein Schritt-Film aus Remotion
 * (Repo remotion-statix, `StepsFilm`) zeigt jeden Schritt am echten Bild der
 * App — Magnet mit Nummer, eine Zeile, die Kamera fährt hin, ein Finger
 * tippt. Die Kapitelleiste trägt die Titel der Schritte, ein Tipp springt hin.
 *
 * Der Text verschwindet nicht: aufklappbar unter dem Film (und bei „Bewegung
 * reduzieren“ an seiner Stelle), damit Suchmaschinen und Bildschirmleser ihn
 * weiter haben — nur steht er nicht mehr als Wand im Weg.
 *
 * `tone` folgt dem Rhythmus der Seite: liegt danach ein dunkles Band, steht
 * der Film auf Papier, sonst auf dem Spielfeld.
 * @returns A JSX element rendering the feature's steps as a chaptered film.
 */
export default function FeatureFilm({
  feature,
  film,
  tone,
}: {
  feature: Feature;
  film: string;
  tone: 'paper' | 'court';
}) {
  const t = useTranslations('featuresPage.detail');
  const onPaper = tone === 'paper';
  const chapters = feature.steps.map((step) => ({ label: step.title, text: step.body }));
  const name = feature.short || feature.name;

  return (
    <section
      id='so-gehts'
      className={cn(
        'relative w-full scroll-mt-24 overflow-hidden py-16 md:py-20',
        onPaper ? 'bg-paper' : 'bg-court text-chalk',
      )}>
      {onPaper ? null : (
        <CourtDiagram
          variant='goal'
          aria-hidden
          className='pointer-events-none absolute -right-[18%] top-1/2 h-[118%] w-auto -translate-y-1/2 text-chalk/[0.07] sm:-right-[10%] lg:-right-[4%]'
        />
      )}
      <Grain tone={tone} />

      <div className='relative mx-auto w-full max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('filmKicker')}
          title={t('filmTitle', { feature: name })}
          tone={tone}
        />
        <div className='mt-10'>
          <ChapterFilm
            name={film}
            dir='films'
            bounds={stepsFilmBounds(chapters.length)}
            tone={tone}
            chapters={chapters}
            alt={t('filmAlt', { feature: name })}
            chaptersLabel={t('stepsTitle')}
            playLabel={t('filmPlay')}
            pauseLabel={t('filmPause')}
            transcriptLabel={t('filmTranscript')}
          />
        </div>
      </div>
    </section>
  );
}
