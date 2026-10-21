'use client';

import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { trackDemoClick, trackRegisterClick } from '@/lib/analytics';
import { CLUB_CONFIG } from '@/lib/club-config';
import ChapterFilm from './chapter-film';
import HeroActionButton from './hero-action-button';
import { CourtDiagram, Grain, MarkerUnderline, SectionHeading } from './tactic';

interface Chapter {
  label: string;
  text: string;
}

interface Scope {
  title: string;
  description: string;
}

/**
 * Die KI-Section erzählt EINE Geschichte statt einer Funktionsliste: ein knapp
 * verlorenes Spiel, ein Tipp, die Antwort mit Minute und Zahlen, ein Plan fürs
 * Training. Der Film trägt sie (gerendert in Remotion aus den
 * Bericht-Komponenten der App), die Kapitelleiste darunter erzählt sie in
 * Worten mit. Erst danach die vier Analyse-Arten — wer bis hier gelesen hat,
 * weiss, wozu sie gut sind — und das Paar aus Registrierung und Demo.
 */
export default function AiAnalyticsSection() {
  const t = useTranslations('productPage.ai');
  const chapters = t.raw('chapters') as Chapter[];
  const scopes = t.raw('scopes') as Scope[];

  return (
    <section
      id='ai'
      className='relative w-full scroll-mt-24 overflow-hidden bg-court py-20 text-chalk md:py-28'>
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
            name='ki-analyse'
            chapters={chapters}
            alt={t('filmAlt')}
            chaptersLabel={t('chaptersLabel')}
            playLabel={t('play')}
            pauseLabel={t('pause')}
          />
        </div>

        {/* Die vier Arten als Zeile eines Spielberichtsbogens: Haarlinie,
            Titel, ein Satz — kein Kartenraster, die Geschichte oben ist das Bild. */}
        <div className='mt-16 border-t border-chalk/15 pt-8 lg:mt-20'>
          <p className='font-hand text-2xl text-primary'>{t('scopesTitle')}</p>
          <dl className='mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4'>
            {scopes.map((scope) => (
              <div key={scope.title}>
                <dt className='font-display text-lg font-bold tracking-tight text-chalk'>{scope.title}</dt>
                <dd className='mt-1 text-[15px] leading-6 text-chalk/65'>{scope.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className='mt-12 flex flex-col items-center gap-6 text-center lg:mt-14'>
          <p className='flex max-w-2xl items-start gap-2.5 text-left text-[15px] leading-6 text-chalk/70'>
            <ShieldCheck className='mt-0.5 size-5 shrink-0 text-success' aria-hidden='true' />
            <span>{t('privacyNote')}</span>
          </p>
          <div className='flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row'>
            <HeroActionButton
              variant='primary'
              href={CLUB_CONFIG.website.appUrl}
              target='_blank'
              rel='noopener noreferrer'
              trailing={<ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />}
              onClick={() => trackRegisterClick('ai')}>
              {t('primaryCta')}
            </HeroActionButton>
            <HeroActionButton
              variant='secondary'
              href={CLUB_CONFIG.website.demoUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => trackDemoClick('ai')}>
              {t('secondaryCta')}
            </HeroActionButton>
          </div>
          <p className='text-[13px] leading-5 text-chalk/50'>{t('note')}</p>
        </div>
      </div>
    </section>
  );
}
