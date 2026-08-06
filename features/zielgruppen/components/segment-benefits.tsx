import { Grain, PlayerMagnet, SectionHeading } from '@/features/landing-page/components/tactic';

interface SegmentBenefitsProps {
  kicker: string;
  title: string;
  description: string;
  items: { number: number; title: string; text: string }[];
  ground?: 'paper' | 'paper-2';
}

/**
 * Shared benefit list for the audience pages — numbered magnets as the board's
 * point-list bullet (see DESIGN.md), two columns on wide screens.
 * @returns A JSX element rendering the audience benefits on a paper ground.
 */
export default function SegmentBenefits({
  kicker,
  title,
  description,
  items,
  ground = 'paper',
}: SegmentBenefitsProps) {
  return (
    <section
      className={`relative w-full overflow-hidden py-20 md:py-28 ${
        ground === 'paper' ? 'bg-paper' : 'bg-paper-2'
      }`}>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading align='left' kicker={kicker} title={title} description={description} />

        <ul className='mt-12 grid gap-8 md:grid-cols-2 md:gap-x-10'>
          {items.map((item) => (
            <li key={item.number} className='flex items-start gap-4'>
              <PlayerMagnet number={item.number} size='md' className='mt-0.5 shrink-0' />
              <div>
                <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                  {item.title}
                </h3>
                <p className='mt-1.5 max-w-[56ch] text-[15px] leading-7 text-ink/75'>{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
