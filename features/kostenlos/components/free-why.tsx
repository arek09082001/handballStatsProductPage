'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { ARTICLE_AUTHOR, authorInitials } from '@/features/ratgeber/data/author';

/**
 * The founder's answer to "wo ist der Haken?" — one short paragraph in first
 * person, matching the story already told on the home page. No claims beyond
 * PRODUCT.md.
 * @returns A JSX element rendering the founder note on the paper panel ground.
 */
export default function FreeWhy() {
  const t = useTranslations('freePage.why');
  const role = useTranslations('author')('role');

  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
        />

        <BoardCard pin='magnet' className='mt-10 p-6 sm:p-8'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
            {ARTICLE_AUTHOR.photoPath ? (
              <Image
                src={ARTICLE_AUTHOR.photoPath}
                alt={`${ARTICLE_AUTHOR.name}, ${role}`}
                width={112}
                height={112}
                className='size-24 shrink-0 rounded-2xl object-cover ring-1 ring-ink/10 sm:size-28'
              />
            ) : (
              <span
                aria-hidden='true'
                className='flex size-24 shrink-0 items-center justify-center rounded-2xl bg-court font-display text-2xl font-extrabold text-chalk ring-1 ring-ink/10 sm:size-28'>
                {authorInitials(ARTICLE_AUTHOR.name)}
              </span>
            )}
            <div>
              <p className='max-w-[64ch] text-[15px] leading-7 text-ink/80'>
                {t('paragraph')}
              </p>
              <p className='mt-4 font-hand text-2xl text-primary'>{ARTICLE_AUTHOR.name}</p>
              <p className='text-sm text-ink/60'>{role}</p>
            </div>
          </div>
        </BoardCard>
      </div>
    </section>
  );
}
