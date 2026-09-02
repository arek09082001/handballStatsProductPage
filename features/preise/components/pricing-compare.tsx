import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import {
  COMPARE_GROUPS,
  LAUNCH_DATE_LABEL,
  type CompareValue,
} from '../data/pricing-content';

interface TierColumn {
  key: string;
  label: string;
  /** The season price, so the header still answers "was kostet das" mid-page. */
  price: string;
  featured?: boolean;
}

/**
 * The tick's disc and glyph.
 *
 * The `--success` token is a mid-tone green: as a glyph on its own 15 %-tinted
 * disc it measures 2.4:1 against warm paper and misses the 3:1 floor a
 * meaningful graphic has to clear. The disc keeps the token's hue and the glyph
 * is set in a deep shade of it (7:1) — the same reversal `PlayerMagnet` makes
 * for its jersey numbers, and for the same reason.
 */
const TICK_DISC = 'bg-success/20 text-[hsl(142_72%_20%)]';

/**
 * "Not included". At `ink/25` the dash measured 2.8:1 and was decoration rather
 * than a value; at 55 % it reads as an entry without competing with the ticks.
 */
const DASH = 'text-ink/55';

const TIER_COLUMNS: readonly TierColumn[] = [
  { key: 'basis', label: 'Basis', price: '0 €' },
  { key: 'trainer', label: 'Trainer', price: '79 €', featured: true },
  { key: 'pro', label: 'Pro', price: '159 €' },
];

/**
 * One cell. A tick and a dash are icons for sighted readers and words for
 * everybody else — a screen reader that meets a row of unlabelled `svg`s in a
 * comparison table learns nothing from it.
 */
function Cell({ value, featured }: { value: CompareValue; featured?: boolean }) {
  return (
    <td
      className={cn(
        'px-1 py-3 text-center align-middle sm:px-3',
        featured ? 'bg-primary/[0.07]' : undefined,
      )}>
      {value === true ? (
        <>
          <span
            className={cn(
              'mx-auto flex size-6 items-center justify-center rounded-full',
              TICK_DISC,
            )}>
            <Check className='size-3.5' strokeWidth={3} aria-hidden />
          </span>
          <span className='sr-only'>enthalten</span>
        </>
      ) : value === false ? (
        <>
          <Minus className={cn('mx-auto size-4', DASH)} aria-hidden />
          <span className='sr-only'>nicht enthalten</span>
        </>
      ) : (
        <span className='font-display text-[15px] font-bold tabular-nums text-ink'>
          {value}
        </span>
      )}
    </td>
  );
}

/**
 * The plan comparison — four scoresheets, one per feature group.
 *
 * Deliberately four tables rather than one long one with a sticky header: the
 * site's navigation is a floating bar pinned to the top of the viewport, so a
 * sticky `thead` would spend the whole scroll underneath it. Repeating a short
 * header per group keeps the column meaning within a screen of every row, and
 * a shared `colgroup` keeps all four tables in the same column grid so the eye
 * reads straight down.
 *
 * The columns never scroll sideways either. Every value is at most six
 * characters (the units live under the label), which is what lets three tier
 * columns and a wrapping label column fit a 360 px phone — the device this page
 * is actually read on.
 * @returns A JSX element rendering the full plan comparison on the paper panel ground.
 */
export default function PricingCompare() {
  return (
    <section
      id='vergleich'
      className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Alles im Vergleich'
          title='Was in welchem Plan drin ist'
          description='Vollständig, ohne Sternchen: jede Funktion und jede Grenze, wie die App sie ab Januar tatsächlich anwendet.'
        />

        <div className='mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink/70'>
          <span className='inline-flex items-center gap-2'>
            <span
              className={cn(
                'flex size-5 items-center justify-center rounded-full',
                TICK_DISC,
              )}>
              <Check className='size-3' strokeWidth={3} aria-hidden />
            </span>
            enthalten
          </span>
          <span className='inline-flex items-center gap-2'>
            <Minus className={cn('size-4', DASH)} aria-hidden />
            nicht enthalten
          </span>
          <span>Zahlen sind Obergrenzen, gültig ab dem {LAUNCH_DATE_LABEL}.</span>
        </div>

        <div className='mt-12 flex flex-col gap-14'>
          {COMPARE_GROUPS.map((group) => (
            <section key={group.id} aria-labelledby={`vergleich-${group.id}`}>
              <h3
                id={`vergleich-${group.id}`}
                className='font-display text-xl font-bold tracking-tight text-ink sm:text-2xl'>
                {group.title}
              </h3>
              <p className='mt-1.5 max-w-[62ch] text-[15px] leading-7 text-ink/70'>
                {group.note}
              </p>

              <table className='mt-6 w-full table-fixed border-collapse text-left'>
                <caption className='sr-only'>
                  {group.title}: Funktionen und Grenzen je Plan
                </caption>
                <colgroup>
                  <col />
                  <col className='w-16 sm:w-32 lg:w-40' />
                  <col className='w-16 sm:w-32 lg:w-40' />
                  <col className='w-16 sm:w-32 lg:w-40' />
                </colgroup>
                <thead>
                  <tr className='border-b-2 border-ink/25'>
                    <th scope='col' className='py-2.5 pr-3 text-left font-normal'>
                      <span className='sr-only'>Funktion oder Grenze</span>
                    </th>
                    {TIER_COLUMNS.map((tier) => (
                      <th
                        key={tier.key}
                        scope='col'
                        className={cn(
                          'px-1 py-2.5 text-center align-bottom sm:px-3',
                          tier.featured ? 'bg-primary/[0.07]' : undefined,
                        )}>
                        <span
                          className={cn(
                            'block font-display text-[15px] font-bold tracking-tight',
                            tier.featured ? 'text-primary' : 'text-ink',
                          )}>
                          {tier.label}
                        </span>
                        <span className='block font-medium tabular-nums text-[13px] text-ink/70'>
                          {tier.price}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row, index) => (
                    <tr
                      key={row.label}
                      className={cn(
                        'border-b border-ink/10',
                        index % 2 === 1 ? 'bg-paper/70' : undefined,
                      )}>
                      <th
                        scope='row'
                        className='py-3 pr-3 align-middle text-[15px] font-medium leading-6 text-ink'>
                        {row.label}
                        {row.hint ? (
                          <span className='mt-0.5 block text-[13px] font-normal leading-5 text-ink/70'>
                            {row.hint}
                          </span>
                        ) : null}
                      </th>
                      <Cell value={row.basis} />
                      <Cell value={row.trainer} featured />
                      <Cell value={row.pro} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>

        <p className='mt-12 max-w-[68ch] text-[15px] leading-7 text-ink/70'>
          Die Grenzen greifen nie mitten im Spiel: Ob noch ein Spiel ins
          Kontingent passt, wird beim Anlegen geprüft, nicht in der Halbzeitpause.
          Eine begonnene Erfassung läuft immer zu Ende und wird immer gespeichert.
        </p>
      </div>
    </section>
  );
}
