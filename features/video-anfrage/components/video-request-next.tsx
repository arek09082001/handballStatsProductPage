'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { featurePath } from '@/features/funktionen/data/features';
import {
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';

const STEP_IDS = ['read', 'enable', 'feedback'] as const;

/**
 * What happens after the form — three steps, headed by magnets like a play on
 * the board, so a coach knows before sending that a person reads the request,
 * the account is enabled by hand and the beta expects feedback in return.
 * Below it, the two feature pages that say what the video can and cannot do
 * yet, because somebody who lands here from the pricing page may not have
 * read either.
 * @returns A JSX element rendering the steps and the links to the video pages.
 */
export default function VideoRequestNext() {
  const t = useTranslations('videoRequestPage.next');

  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-16 md:py-20'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-4xl px-6 sm:px-10'>
        <SectionHeading align='left' kicker={t('kicker')} title={t('title')} />

        <ol className='mt-8 grid gap-6 sm:grid-cols-3'>
          {STEP_IDS.map((step, index) => (
            <li key={step} className='flex gap-3.5'>
              <PlayerMagnet
                number={index + 1}
                size='sm'
                className='mt-0.5 shrink-0'
              />
              <div>
                <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                  {t(`steps.${step}.title`)}
                </h3>
                <p className='mt-1.5 text-[15px] leading-6 text-ink/70'>
                  {t(`steps.${step}.body`)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className='mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
          <Link
            href={featurePath('video-tagging')}
            className='inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline'>
            {t('taggingLink')}
            <ArrowRight className='size-4' aria-hidden />
          </Link>
          <Link
            href={featurePath('handball-livestream')}
            className='inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline sm:ml-6'>
            {t('livestreamLink')}
            <ArrowRight className='size-4' aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
