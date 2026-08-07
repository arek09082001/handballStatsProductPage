import { Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
} from '@/features/landing-page/components/tactic';

/**
 * Court-ground header for `/kontakt` — the Trainertafel signature band, in the
 * same register as the other route headers. It carries the H1 and the direct
 * e-mail address, so a coach who would rather write from their own client never
 * has to fill the form at all. Static server component (no client JS).
 * @returns A JSX element rendering the contact page header on the court ground.
 */
export default async function ContactHeader() {
  const t = await getTranslations('contactPage');

  return (
    <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -right-[18%] top-1/2 h-[110%] w-auto -translate-y-1/2 text-chalk/[0.1] sm:-right-[10%] lg:-right-[4%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-3xl px-6 pb-16 pt-28 text-center sm:px-10 lg:pb-20 lg:pt-32'>
        <BoardKicker color='chalk' className='justify-center'>
          {t('kicker')}
        </BoardKicker>

        <h1 className='mt-5 text-balance font-display text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-chalk sm:text-[3rem]'>
          {t('title')}
        </h1>

        <p className='mx-auto mt-5 max-w-[58ch] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8'>
          {t('description')}
        </p>

        <a
          href={`mailto:${CLUB_CONFIG.email.main}`}
          className='mt-7 inline-flex items-center gap-2 rounded-xl border border-chalk/25 bg-chalk/5 px-5 py-3 text-sm font-semibold text-chalk transition-colors hover:border-chalk/45 hover:bg-chalk/10'>
          <Mail className='size-4 text-primary' />
          {CLUB_CONFIG.email.main}
        </a>
      </div>
    </header>
  );
}
