'use client';

import { useTranslations } from 'next-intl';
import { BoardScreenshot, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { inlineLink } from '@/components/custom-ui/rich-text';

/**
 * The youth-specific argument: development you can show a 14-year-old, backed
 * by the player cards that already exist in the app. Also the hand-off into the
 * Ratgeber articles a youth coach is most likely to want next.
 * @returns A JSX element rendering the development band on the paper panel ground.
 */
export default function JugendtrainerDevelopment() {
  const t = useTranslations('youthCoachPage.development');

  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto grid max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14'>
        <div>
          <SectionHeading
            align='left'
            kicker={t('kicker')}
            title={t('title')}
            description={t('description')}
          />

          <p className='mt-6 max-w-[62ch] text-base leading-7 text-ink/75'>
            {t('paragraph')}
          </p>

          <p className='mt-4 max-w-[62ch] text-base leading-7 text-ink/75'>
            {t.rich('readMore', {
              development: inlineLink('/ratgeber/handball-spielerentwicklung-messen'),
              youth: inlineLink('/ratgeber/jugendhandball-trainieren'),
              mini: inlineLink('/ratgeber/handball-minihandball-kinder'),
            })}
          </p>
        </div>

        <BoardScreenshot
          src='/teamManagement.png'
          alt={t('screenshotAlt')}
          width={2560}
          height={2000}
          label={t('screenshotLabel')}
          tone='paper'
          pin='magnet'
          sizes='(max-width: 1024px) 100vw, 48vw'
        />
      </div>
    </section>
  );
}
