'use client';

import Link from 'next/link';
import { ArrowRight, Flag, Hand, Megaphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { trackDemoClick, trackRegisterClick } from '@/lib/analytics';
import { CLUB_CONFIG } from '@/lib/club-config';
import ChapterFilm from './chapter-film';
import HeroActionButton from './hero-action-button';
import { BoardCard, CourtDiagram, Grain, MarkerUnderline, SectionHeading } from './tactic';

interface Chapter {
  label: string;
  text: string;
}

interface Point {
  title: string;
  description: string;
}

/** Banner, Tor, Auszeit — dieselbe Reihenfolge wie im Film und in der App (`settings.sponsors.slots`) */
const SLOT_ICONS = [Megaphone, Flag, Hand];

/**
 * Die Section „Live-Ticker“ erzählt, was der Ticker für die Menschen tut, die
 * NICHT in der Halle sind: freigeben, ein Tor erfassen, und Sekunden später
 * feiert Oma auf dem Sofa mit. Der Film trägt die Geschichte (gerendert in
 * Remotion aus der echten Ticker-Seite und dem LIVE-Panel der App), darunter
 * stehen die vier Vorteile als Zeile eines Spielberichtsbogens.
 *
 * Die Sponsoren bekommen einen eigenen Zettel: Für den Trainer ist der Ticker
 * Service an den Eltern, für den Verein ist er eine Werbefläche, die jede
 * Familie sieht — und das ist der Satz, mit dem eine Trainerin die
 * Trainer-Stufe beim Vorstand durchbekommt. Die Fakten (drei Stellen,
 * Kennzeichnung, 100 % beim Verein, ab der Trainer-Stufe) stammen aus der
 * App (`settings.sponsors`) und der Preisseite.
 *
 * `#liveticker` war bisher ein leerer Anker in „Und dann noch“; jetzt ist es
 * wieder eine eigene Section.
 */
export default function LiveTickerSection() {
  const t = useTranslations('productPage.liveTicker');
  const chapters = t.raw('chapters') as Chapter[];
  const benefits = t.raw('benefits') as Point[];
  const slots = t.raw('sponsor.slots') as Point[];

  return (
    <section id='liveticker' className='relative w-full scroll-mt-24 overflow-hidden bg-court py-20 text-chalk md:py-28'>
      <CourtDiagram
        variant='full'
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-8 mx-auto h-auto w-[92%] max-w-5xl text-chalk/[0.06]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          tone='court'
          kicker={t('kicker')}
          title={
            <>
              {t('titleLead')}{' '}
              <span className='relative inline-block'>
                {t('titleHighlight')}
                <MarkerUnderline color='marker' />
              </span>
            </>
          }
          description={t('description')}
          className='max-w-3xl'
        />

        <div className='mt-12 lg:mt-16'>
          <ChapterFilm
            name='live-ticker'
            chapters={chapters}
            alt={t('filmAlt')}
            chaptersLabel={t('chaptersLabel')}
            playLabel={t('play')}
            pauseLabel={t('pause')}
          />
        </div>

        <div className='mt-16 border-t border-chalk/15 pt-8 lg:mt-20'>
          <p className='font-hand text-2xl text-primary'>{t('benefitsTitle')}</p>
          <dl className='mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4'>
            {benefits.map((benefit) => (
              <div key={benefit.title}>
                <dt className='font-display text-lg font-bold tracking-tight text-chalk'>{benefit.title}</dt>
                <dd className='mt-1 text-[15px] leading-6 text-chalk/65'>{benefit.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Der Zettel für den Vorstand: was der Ticker dem Verein bringt */}
        <BoardCard tone='paper' pin='magnet' pinColor='marker' className='mt-14 text-ink lg:mt-16'>
          <div className='grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14'>
            <div>
              <p className='font-hand text-2xl text-primary'>{t('sponsor.kicker')}</p>
              <h3 className='mt-2 font-display text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.1rem]'>
                {t('sponsor.title')}
              </h3>
              <p className='mt-4 max-w-[52ch] text-[15px] leading-7 text-ink/75'>{t('sponsor.description')}</p>
              <div className='mt-6 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3'>
                <span className='font-display text-5xl font-extrabold tracking-[-0.04em] text-primary sm:text-6xl'>100&nbsp;%</span>
                <span className='text-[15px] font-semibold leading-6 text-ink sm:max-w-[22ch]'>{t('sponsor.keep')}</span>
              </div>
            </div>

            <div className='flex flex-col'>
              <p className='text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/55'>{t('sponsor.slotsTitle')}</p>
              <ul className='mt-3'>
                {slots.map((slot, index) => {
                  const Icon = SLOT_ICONS[index] ?? Megaphone;
                  return (
                    <li key={slot.title} className='flex items-start gap-4 border-t border-ink/10 py-4'>
                      <span className='flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary'>
                        <Icon className='size-5' aria-hidden='true' />
                      </span>
                      <span>
                        <span className='block font-display text-lg font-bold tracking-tight text-ink'>{slot.title}</span>
                        <span className='mt-0.5 block text-[15px] leading-6 text-ink/70'>{slot.description}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className='mt-auto border-t border-ink/10 pt-4 text-[13px] leading-5 text-ink/60'>
                {t('sponsor.note')}{' '}
                <Link href='/preise' className='font-semibold text-primary underline-offset-4 hover:underline'>
                  {t('sponsor.pricingLink')}
                </Link>
              </p>
            </div>
          </div>
        </BoardCard>

        <div className='mt-12 flex flex-col items-center gap-6 text-center lg:mt-14'>
          <div className='flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row'>
            <HeroActionButton
              variant='primary'
              href={CLUB_CONFIG.website.appUrl}
              target='_blank'
              rel='noopener noreferrer'
              trailing={<ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />}
              onClick={() => trackRegisterClick('ticker')}>
              {t('primaryCta')}
            </HeroActionButton>
            <HeroActionButton
              variant='secondary'
              href={CLUB_CONFIG.website.demoUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => trackDemoClick('ticker')}>
              {t('secondaryCta')}
            </HeroActionButton>
          </div>
          <p className='text-[13px] leading-5 text-chalk/50'>{t('note')}</p>
        </div>
      </div>
    </section>
  );
}
