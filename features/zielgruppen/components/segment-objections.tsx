import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';

interface SegmentObjectionsProps {
  kicker: string;
  title: string;
  description: string;
  items: { question: string; answer: string }[];
  ground?: 'paper' | 'paper-2';
  /** Optional closing paragraph, used for the internal links. */
  children?: React.ReactNode;
}

/**
 * The objections band: the sentences that actually get said in a committee
 * meeting or a training break, answered in the open rather than hidden in an
 * FAQ. The same items are emitted as FAQPage entries by the route.
 * @returns A JSX element rendering the objections on a paper ground.
 */
export default function SegmentObjections({
  kicker,
  title,
  description,
  items,
  ground = 'paper-2',
  children,
}: SegmentObjectionsProps) {
  return (
    <section
      className={`relative w-full overflow-hidden py-20 md:py-28 ${
        ground === 'paper' ? 'bg-paper' : 'bg-paper-2'
      }`}>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading align='left' kicker={kicker} title={title} description={description} />

        <div className='mt-10 flex flex-col gap-5'>
          {items.map((item) => (
            <BoardCard key={item.question} pin='none' className='p-6 sm:p-7'>
              <h3 className='font-hand text-2xl text-ink'>{item.question}</h3>
              <p className='mt-3 max-w-[56ch] text-[15px] leading-7 text-ink/75'>{item.answer}</p>
            </BoardCard>
          ))}
        </div>

        {children ? (
          <div className='mt-10 max-w-[58ch] text-base leading-7 text-ink/70'>{children}</div>
        ) : null}
      </div>
    </section>
  );
}
