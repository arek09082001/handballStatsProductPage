import Link from 'next/link';
import { Instagram, Mail } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  CourtDiagram,
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { FEEDBACK_LOOP } from '../data/erfahrungen-content';

/**
 * How a remark from the bench becomes a feature. This is the page's actual
 * substance while there are no testimonials: not "was Trainer sagen", but what
 * happens when they say it.
 * @returns A JSX element rendering the feedback loop on the court ground.
 */
export default function FeedbackLoop() {
  return (
    <section className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-28'>
      <CourtDiagram
        variant='full'
        aria-hidden
        className='pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-auto w-[94%] max-w-5xl text-chalk/[0.06]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          tone='court'
          align='left'
          kicker='Der kurze Weg'
          title='Wie Feedback aus der Halle in die App kommt'
          description='Zwischen deiner Nachricht und der Person, die den Code schreibt, steht niemand.'
        />

        <ol className='mt-12 grid gap-8 md:grid-cols-2 md:gap-x-10'>
          {FEEDBACK_LOOP.map((step) => (
            <li key={step.number} className='flex items-start gap-4'>
              <PlayerMagnet number={step.number} size='md' className='mt-0.5 shrink-0' />
              <div>
                <h3 className='font-display text-lg font-bold tracking-tight text-chalk'>
                  {step.title}
                </h3>
                <p className='mt-1.5 max-w-[56ch] text-[15px] leading-7 text-chalk/75'>
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className='mt-12 flex flex-col gap-3 sm:flex-row sm:items-center'>
          <a
            href={`mailto:${CLUB_CONFIG.email.main}`}
            className='inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-display text-[15px] font-bold tracking-tight text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-court'>
            <Mail className='size-4' />
            Feedback per Mail
          </a>
          <a
            href={CLUB_CONFIG.social.instagram.url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-chalk/30 bg-chalk/5 px-6 font-display text-[15px] font-bold tracking-tight text-chalk transition-colors duration-200 hover:border-chalk/50 hover:bg-chalk/10'>
            <Instagram className='size-4' />
            {CLUB_CONFIG.social.instagram.handle}
          </a>
        </div>

        <p className='mt-8 max-w-[70ch] text-base leading-7 text-chalk/75'>
          Wenn du wissen willst, wie Trainer im Verein oder im Nachwuchs mit
          Statix arbeiten, findest du das auf den Seiten{' '}
          <Link
            href='/fuer-vereine'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Statix für Vereine
          </Link>{' '}
          und{' '}
          <Link
            href='/fuer-jugendtrainer'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Statix für Jugendtrainer
          </Link>
          . Praxiswissen ohne App gibt es im{' '}
          <Link
            href='/ratgeber'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Handball-Ratgeber
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
