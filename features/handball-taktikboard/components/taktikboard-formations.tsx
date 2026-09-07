'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  BoardCard,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { inlineLink } from '@/components/custom-ui/rich-text';
import {
  FORMATION_ARTICLE_HREFS,
  type FormationNote,
} from '../data/taktikboard-content';

/**
 * "Die fertigen Aufstellungen" — one paragraph per preset, each pointing at the
 * Ratgeber article that explains the system properly. A board shows an
 * arrangement; it does not explain when to use it.
 * @returns A JSX element rendering the formation notes on the paper ground.
 */
export default function TaktikboardFormations() {
  const t = useTranslations('boardPage.formations');
  const notes = t.raw('notes') as FormationNote[];

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-10 grid gap-5 md:grid-cols-2'>
          {notes.map((note, index) => (
            <BoardCard
              key={note.id}
              pin='none'
              className={
                // An odd count leaves the last note alone in a two-column row;
                // let it run the full width instead of hanging half-empty.
                index === notes.length - 1 && notes.length % 2 === 1
                  ? 'p-6 md:col-span-2'
                  : 'p-6'
              }>
              <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                {note.title}
              </h3>
              <p className='mt-2 text-[15px] leading-7 text-ink/75'>
                {note.text}
              </p>
              <Link
                href={FORMATION_ARTICLE_HREFS[note.id]}
                className='mt-2 inline-flex min-h-11 items-center text-[15px] font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
                {note.articleLabel}
              </Link>
            </BoardCard>
          ))}
        </div>

        <p className='mt-10 max-w-[70ch] text-base leading-7 text-ink/70'>
          {t.rich('closing', {
            systems: inlineLink('/ratgeber/handball-abwehrsysteme'),
          })}
        </p>
      </div>
    </section>
  );
}
