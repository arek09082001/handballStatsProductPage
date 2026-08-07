import { Play } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  BoardScreenshot,
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';

/**
 * The zero-friction entry point: the live demo needs no account at all. Court
 * signature band with a real in-app shot pinned beside the copy.
 * @returns A JSX element rendering the demo band on the court ground.
 */
export default function FreeDemo() {
  return (
    <section className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-28'>
      <CourtDiagram
        variant='full'
        aria-hidden
        className='pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-auto w-[94%] max-w-5xl text-chalk/[0.06]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto grid max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14'>
        <div>
          <SectionHeading
            tone='court'
            align='left'
            kicker='Null Aufwand'
            title='Live-Demo ohne Account'
            description='Kein Formular, keine E-Mail-Adresse, kein Passwort – ein Klick und du bist drin.'
          />

          <p className='mt-6 max-w-[60ch] text-base leading-7 text-chalk/75'>
            Die Demo ist keine Klickstrecke mit Platzhaltern, sondern eine voll
            gefüllte Statix-Version mit echten Spieldaten. Du siehst die
            Live-Erfassung, die Wurfbilder, die Spielerwerte und eine fertige
            KI-Analyse – genau so, wie es am Samstag in der Halle aussieht. Wenn
            dir das gefällt, legst du danach dein eigenes Team an. Wenn nicht,
            hast du nichts hinterlassen.
          </p>

          <a
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='mt-8 inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-display text-[15px] font-bold tracking-tight text-white shadow-[0_14px_26px_-14px_hsl(22_90%_45%/0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-court sm:h-14'>
            <Play className='size-4 fill-current' />
            Live-Demo starten
          </a>
        </div>

        <BoardScreenshot
          src='/recordStatsInGame.png'
          alt='Kostenlose Handball-Statistik-App: Spielaktionen live per Tap erfassen'
          width={2560}
          height={1600}
          label='Live-Erfassung in der Demo'
          tone='court'
          pin='tape'
          live
          sizes='(max-width: 1024px) 100vw, 48vw'
        />
      </div>
    </section>
  );
}
