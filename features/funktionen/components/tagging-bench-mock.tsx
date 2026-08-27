import {
  CourtDiagram,
  Grain,
  MarkerArrow,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { cn } from '@/lib/utils';

/**
 * A DRAWN tagging bench — not a screenshot, and it does not pretend to be one.
 *
 * The two real captures on `/funktionen/video-tagging` show the workbench: the
 * lanes and the catalogue, both photographed from a running instance. What they
 * cannot show is the picture behind them. Playback resolves to a signed URL
 * against object storage the screenshot machine has no access to, so a capture
 * of the stage is an empty rectangle — and painting a match into that rectangle
 * afterwards would be a fabricated product image, which is the one thing this
 * site does not do.
 *
 * So the moving half is drawn in the board's own language instead: a chalk
 * court where the video would be, a scrubber whose blocks are the filed scenes,
 * and the scene list a coach ends up with. Every label below comes from the
 * app's real vocabulary (`lib/video/tags.ts`) — the drawing is stylised, the
 * words are not invented.
 */

/** Scenes on the scrubber. `at` and `width` are percentages of the half. */
const SCENES = [
  { at: 4, width: 5, tone: 'good' },
  { at: 12, width: 4, tone: 'bad' },
  { at: 19, width: 6, tone: 'good' },
  { at: 28, width: 4, tone: 'good' },
  { at: 35, width: 5, tone: 'bad' },
  { at: 44, width: 4, tone: 'good' },
  { at: 51, width: 6, tone: 'good' },
  { at: 60, width: 4, tone: 'bad' },
  { at: 67, width: 5, tone: 'good' },
  { at: 76, width: 4, tone: 'good' },
  { at: 83, width: 6, tone: 'bad' },
  { at: 92, width: 4, tone: 'good' },
] as const;

/** The scene list, in the app's own words. */
const TAGGED = [
  {
    time: '12:04',
    number: 8,
    action: 'Tor',
    tone: 'good',
    qualifiers: ['2. Welle', 'Außen links', 'gegen 5:1'],
  },
  {
    time: '14:37',
    number: 9,
    action: 'Ballverlust',
    tone: 'bad',
    qualifiers: ['Positionsangriff', 'Kreisanspiel', 'Unterzahl'],
  },
  {
    time: '17:52',
    number: 4,
    action: 'Gehalten',
    tone: 'bad',
    qualifiers: ['Positionsangriff', 'Rückraum links', 'gegen 6:0'],
  },
  {
    time: '21:10',
    number: 1,
    action: 'Parade',
    tone: 'good',
    qualifiers: ['Gegner', 'Außen rechts'],
  },
  {
    time: '23:48',
    number: 8,
    action: 'Tor',
    tone: 'good',
    qualifiers: ['1. Welle', 'Durchbruch', 'Gleichzahl'],
  },
] as const;

/** The saved questions the filter turns into. */
const PLAYLISTS = [
  { name: 'Gegenstöße gegen 5:1', count: 18 },
  { name: 'Alle Ballverluste', count: 24 },
  { name: 'Kreisanspiele', count: 11 },
  { name: 'Paraden', count: 25 },
] as const;

const TONE = {
  good: 'bg-success/70 border-success',
  bad: 'bg-[hsl(0_65%_58%)]/70 border-[hsl(0_65%_58%)]',
} as const;

const CHIP_TONE = {
  good: 'border-success/40 bg-success/12 text-[hsl(142_45%_75%)]',
  bad: 'border-[hsl(0_65%_58%)]/45 bg-[hsl(0_65%_58%)]/12 text-[hsl(0_70%_82%)]',
} as const;

/**
 * @returns A JSX element rendering the drawn tagging bench on the court ground.
 */
export default function TaggingBenchMock() {
  return (
    <section className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-24'>
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Wie eine Szene entsteht'
          title='Eine Aufnahme, 281 Szenen, eine Frage'
          description='Diese Darstellung ist gezeichnet, kein Screenshot — die echten Aufnahmen der Werkbank stehen darunter. Die Bezeichnungen sind die aus der App.'
          tone='court'
        />

        <div className='mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-8'>
          {/* ── The stage: where the video is, drawn as the board ─────────── */}
          <div className='board-shadow-court rounded-2xl border border-chalk/12 bg-court-2 p-3 sm:p-4'>
            <div className='relative overflow-hidden rounded-xl bg-court ring-1 ring-chalk/12'>
              <div className='relative aspect-[16/9] w-full'>
                <CourtDiagram
                  variant='goal'
                  formation
                  formationOpacity={0.5}
                  aria-hidden
                  className='absolute left-1/2 top-1/2 h-[128%] w-auto -translate-x-1/2 -translate-y-1/2 text-chalk/25'
                />
                <MarkerArrow
                  variant='curve'
                  color='marker'
                  aria-hidden
                  className='absolute left-[26%] top-[30%] h-20 w-32 rotate-6'
                />
                <span className='absolute left-[24%] top-[22%] font-hand text-xl text-primary sm:text-2xl'>
                  Kreuzen, dann Kreis
                </span>

                <div className='absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-chalk/20 bg-court/85 px-3 py-1.5'>
                  <span className='size-1.5 rounded-full bg-primary' />
                  <span className='font-display text-[13px] font-bold tabular-nums tracking-tight text-chalk'>
                    23:48
                  </span>
                  <span className='text-[13px] text-chalk/50'>/ 62:00</span>
                </div>

                <div className='absolute bottom-4 right-4 rounded-full border border-primary/45 bg-primary/15 px-3 py-1.5 text-[13px] font-semibold text-primary'>
                  Szene läuft
                </div>
              </div>
            </div>

            {/* ── The scrubber: every filed scene as a block ──────────────── */}
            <div className='mt-4 px-1'>
              <div className='flex items-center justify-between text-[13px] text-chalk/50'>
                <span className='font-display font-bold tracking-tight text-chalk/75'>
                  2. Halbzeit
                </span>
                <span className='tabular-nums'>281 Szenen</span>
              </div>
              <div className='relative mt-2 h-9 rounded-lg border border-chalk/12 bg-court/70'>
                {SCENES.map((scene) => (
                  <span
                    key={scene.at}
                    aria-hidden='true'
                    className={cn(
                      'absolute top-1.5 h-6 rounded-[3px] border',
                      TONE[scene.tone],
                    )}
                    style={{ left: `${scene.at}%`, width: `${scene.width}%` }}
                  />
                ))}
                <span
                  aria-hidden='true'
                  className='absolute -top-1 bottom-[-0.25rem] w-0.5 bg-primary'
                  style={{ left: '38%' }}
                />
              </div>
              <div className='mt-2 flex justify-between text-[13px] tabular-nums text-chalk/40'>
                <span>0:00</span>
                <span>20:00</span>
                <span>40:00</span>
                <span>62:00</span>
              </div>
            </div>

            {/* ── The saved questions ─────────────────────────────────────── */}
            <div className='mt-5 flex flex-wrap gap-2 px-1'>
              {PLAYLISTS.map((playlist, index) => (
                <span
                  key={playlist.name}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[13px] font-medium',
                    index === 0
                      ? 'border-primary/50 bg-primary/15 text-primary'
                      : 'border-chalk/15 bg-chalk/[0.04] text-chalk/65',
                  )}>
                  {playlist.name}
                  <span className='tabular-nums opacity-70'>{playlist.count}</span>
                </span>
              ))}
            </div>
          </div>

          {/* ── The scene list a coach ends up with ───────────────────────── */}
          <div className='board-shadow-court rounded-2xl border border-chalk/12 bg-court-2 p-5 sm:p-6'>
            <p className='font-hand text-2xl text-primary'>Was dabei herauskommt</p>
            <p className='mt-1 text-[13px] leading-6 text-chalk/55'>
              Aktion, Spielerin und Kontext — jede Zeile ein Intervall im Video.
            </p>

            <ul className='mt-5 space-y-3'>
              {TAGGED.map((scene) => (
                <li
                  key={scene.time}
                  className='rounded-xl border border-chalk/10 bg-court/60 p-3.5'>
                  <div className='flex items-center gap-3'>
                    <PlayerMagnet
                      number={scene.number}
                      team={scene.action === 'Parade' ? 'chalk' : 'home'}
                      size='sm'
                      className='shrink-0'
                    />
                    <span
                      className={cn(
                        'rounded-md border px-2 py-0.5 text-[13px] font-semibold',
                        CHIP_TONE[scene.tone],
                      )}>
                      {scene.action}
                    </span>
                    <span className='ml-auto font-display text-[13px] font-bold tabular-nums text-chalk/55'>
                      {scene.time}
                    </span>
                  </div>
                  <div className='mt-2.5 flex flex-wrap gap-1.5'>
                    {scene.qualifiers.map((qualifier) => (
                      <span
                        key={qualifier}
                        className='rounded border border-chalk/12 bg-chalk/[0.04] px-2 py-0.5 text-[13px] text-chalk/60'>
                        {qualifier}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <p className='mt-5 border-t border-chalk/12 pt-4 text-[13px] leading-6 text-chalk/55'>
              Eine Playlist speichert diese Frage, nicht das Ergebnis. Wird eine
              vergessene Szene nachgetaggt, fällt sie von selbst hinein.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
