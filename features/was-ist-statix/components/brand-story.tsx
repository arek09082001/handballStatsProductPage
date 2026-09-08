'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { BrandAudience } from '../data/brand-content';
import {
  BoardKicker,
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import Reveal from './reveal';

/**
 * Who Statix is built for — read out as the coach's roster (numbered magnets,
 * no icon-square cards) — plus the person behind the app, pinned to the board
 * as a note with a real handball photo. The founder block reinforces the brand
 * entity (person + product + origin) for search engines.
 * @returns A JSX element rendering the audience roster and the founder story with a photo.
 */
export default function BrandStory() {
  const t = useTranslations('brandPage.story');
  const audiences = t.raw('audiences') as BrandAudience[];

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-6xl px-6 sm:px-8'>
        <Reveal>
          <SectionHeading
            kicker={t('kicker')}
            title={t('title')}
            description={t('description')}
            tone='paper'
          />
        </Reveal>

        <Reveal className='mt-14 grid gap-x-12 gap-y-2 border-t border-ink/12 sm:grid-cols-2'>
          {audiences.map((audience, index) => (
            <div
              key={audience.title}
              className='flex gap-4 border-b border-ink/12 py-6'>
              <PlayerMagnet number={index + 1} team='home' size='md' />
              <div>
                <h3 className='font-display text-lg font-bold tracking-[-0.01em] text-ink'>
                  {audience.title}
                </h3>
                <p className='mt-1.5 text-sm leading-6 text-ink/70'>
                  {audience.description}
                </p>
              </div>
            </div>
          ))}
        </Reveal>

        <Reveal className='relative mt-16'>
          <figure className='board-shadow relative overflow-hidden rounded-3xl border border-ink/10 bg-paper'>
            <span
              aria-hidden
              className='absolute -top-3 left-10 z-10 h-6 w-24 -rotate-6 rounded-[2px] bg-chalk/50 ring-1 ring-black/5 backdrop-blur-[1px]'
              style={{
                maskImage:
                  'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
              }}
            />
            <div className='grid items-stretch lg:grid-cols-2'>
              <div className='relative min-h-64 lg:min-h-full'>
                <Image
                  src='/saison-uebersicht-kennzahlen.jpg'
                  alt={t('photoAlt')}
                  fill
                  sizes='(max-width: 1024px) 100vw, 50vw'
                  className='object-cover'
                />
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-court/40 to-transparent lg:bg-gradient-to-r' />
              </div>

              <div className='p-8 sm:p-10'>
                <BoardKicker>{t('founderKicker')}</BoardKicker>
                <h2 className='mt-3 font-display text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.1rem]'>
                  {t('founderTitle')}
                </h2>
                <div className='mt-5 space-y-4 text-base leading-8 text-ink/75'>
                  <p>{t('founderParagraph1')}</p>
                  <p>{t('founderParagraph2')}</p>
                </div>
              </div>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
