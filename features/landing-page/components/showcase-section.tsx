'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { trackDemoClick, trackRegisterClick } from '@/lib/analytics';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from './hero-action-button';
import { BoardCard, Grain, MarkerUnderline, SectionHeading, TabletLoop } from './tactic';

interface ShowcaseItem {
  /** Spieluhr des Moments — dieselbe Zeit, die im Loop oben in der App steht. */
  clock: string;
  /** Was in diesem Moment auf dem Feld passiert, als Notiz des Trainers. */
  moment: string;
  title: string;
  description: string;
  facts: string[];
  /** Anchor text of the deeper page — the term that page ranks for. */
  linkLabel: string;
  alt: string;
}

/**
 * Eine Spielminute in drei Bildschirmen: 46:27 tippt der Trainer Eriks Tor
 * ein, eine Sekunde später steht es in der Tabelle, kurz darauf im Wurfbild.
 * Die Reihenfolge ist deshalb keine Aufzählung, sondern Zeit — die Uhr vor
 * jeder Zeile IST die Nummer, und sie ist dieselbe wie im Loop daneben.
 *
 * Each beat is a loop of the app on a tablet, rendered with Remotion from the
 * app's own components (repo remotion-statix, `src/compositions/showcase/`).
 * Am Ende steht das Paar aus Registrierung und Live-Demo: hier hat der
 * Besucher das Produkt gerade arbeiten sehen, früher ist er nicht überzeugter.
 */
const BEATS = [
  { video: 'live-erfassen', href: '/funktionen/live-erfassung' },
  { video: 'statistik', href: '/handball-statistiken' },
  { video: 'wurfbilder', href: '/funktionen/wurfbilder' },
] as const;

export default function ShowcaseSection() {
  const t = useTranslations('productPage.showcase');
  const items = t.raw('items') as ShowcaseItem[];

  return (
    <section
      id='features'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-14 md:py-24'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <SectionHeading
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

        <ol className='mt-10 flex flex-col gap-12 lg:mt-16 lg:gap-20'>
          {items.map((item, index) => {
            const beat = BEATS[index];
            if (!beat) return null;
            const reversed = index % 2 === 1;

            return (
              <li
                key={item.clock}
                className='grid items-center gap-8 lg:grid-cols-12 lg:gap-14'>
                <div data-beat-shot className={reversed ? 'lg:order-2 lg:col-span-7' : 'lg:col-span-7'}>
                  <TabletLoop
                    name={beat.video}
                    alt={item.alt}
                    pin={reversed ? 'magnet' : 'tape'}
                  />
                </div>

                <div data-beat-copy className={reversed ? 'lg:order-1 lg:col-span-5' : 'lg:col-span-5'}>
                  {/* Die Uhr wie in der App oben in der Mitte: dunkles Feld,
                      Archivo, Ziffern gleich breit. Der Punkt davor heisst
                      „läuft“ — es ist dieselbe Partie, nur Sekunden später. */}
                  <p className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                    <span className='inline-flex items-center gap-2 rounded-lg bg-court px-2.5 py-1 font-display text-lg font-extrabold leading-none tracking-[-0.02em] text-chalk tabular-nums shadow-[0_6px_14px_-8px_hsl(199_46%_12%/0.7)]'>
                      <span aria-hidden='true' className='size-1.5 rounded-full bg-primary' />
                      {item.clock}
                    </span>
                    <span className='font-hand text-2xl leading-none text-primary'>{item.moment}</span>
                  </p>

                  <h3 className='mt-5 text-balance font-display text-[1.75rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.125rem]'>
                    {item.title}
                  </h3>
                  <p className='mt-4 max-w-[48ch] text-base leading-7 text-ink/70 sm:text-[17px] sm:leading-8'>
                    {item.description}
                  </p>

                  <ul className='mt-5 flex flex-col gap-2'>
                    {item.facts.map((fact) => (
                      <li key={fact} className='flex items-start gap-2.5 text-[15px] leading-6 text-ink/80'>
                        <Check aria-hidden='true' className='mt-1 size-4 shrink-0 text-primary' strokeWidth={3} />
                        {fact}
                      </li>
                    ))}
                  </ul>

                  {/* Each beat links the page that ranks for it, with that
                      page's search term as the anchor — the home page has the
                      most clicks and passes them on. */}
                  <Link
                    href={beat.href}
                    className='board-detail-link group mt-4 inline-flex items-center gap-1.5 font-display text-[15px] font-bold tracking-tight text-primary transition-colors hover:text-[#ea580c]'>
                    {item.linkLabel}
                    <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Der Abschluss liegt auf dem Feld: eine Spielfeld-Karte mitten im
            Papier, angeheftet wie alles auf der Tafel. Registrierung und
            Live-Demo als Paar, wie überall auf der Seite. */}
        <BoardCard tone='court' pin='magnet' className='mx-auto mt-20 max-w-6xl px-6 py-9 sm:px-10 lg:mt-28'>
          <div className='flex flex-col items-center gap-7 text-center lg:flex-row lg:justify-between lg:gap-10 lg:text-left'>
            <div className='min-w-0'>
              <p className='text-balance font-display text-[1.75rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-chalk sm:text-[2rem]'>
                {t('closingTitle')}
              </p>
              <p className='mt-2 text-[15px] leading-6 text-chalk/70'>{t('trust')}</p>
            </div>
            <div className='flex w-full shrink-0 flex-col items-center gap-3 sm:w-auto sm:flex-row'>
              <HeroActionButton
                variant='primary'
                href={CLUB_CONFIG.website.appUrl}
                target='_blank'
                rel='noopener noreferrer'
                trailing={<ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />}
                onClick={() => trackRegisterClick('showcase')}
                className='focus-visible:ring-offset-court-2 lg:min-w-0'>
                {t('primaryCta')}
              </HeroActionButton>
              <HeroActionButton
                variant='secondary'
                href={CLUB_CONFIG.website.demoUrl}
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => trackDemoClick('showcase')}
                className='focus-visible:ring-offset-court-2 lg:min-w-0'>
                {t('secondaryCta')}
              </HeroActionButton>
            </div>
          </div>
        </BoardCard>
        <p className='mt-5 text-center text-[13px] leading-5 text-ink/75'>{t('note')}</p>
      </div>
    </section>
  );
}
