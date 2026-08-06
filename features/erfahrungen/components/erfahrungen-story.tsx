import Image from 'next/image';
import Link from 'next/link';
import { BoardCard, BoardKicker, Grain } from '@/features/landing-page/components/tactic';
import { ARTICLE_AUTHOR, authorInitials } from '@/features/ratgeber/data/author';

/**
 * The founder story — the honest substitute for reviews a young product does
 * not have yet. Name, role, photo and background come from `ARTICLE_AUTHOR`,
 * the same confirmed profile the Ratgeber byline uses, so the two can never
 * tell different stories about the same person.
 * @returns A JSX element rendering the founder story on the paper panel ground.
 */
export default function ErfahrungenStory() {
  const { name, role, bio, photoPath } = ARTICLE_AUTHOR;

  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <BoardCard pin='magnet' className='p-6 sm:p-9'>
          <div className='flex flex-col gap-6 sm:flex-row sm:gap-8'>
            {photoPath ? (
              <Image
                src={photoPath}
                alt={`${name}, ${role}`}
                width={128}
                height={128}
                className='size-24 shrink-0 rounded-2xl object-cover ring-1 ring-ink/10 sm:size-32'
              />
            ) : (
              <span
                aria-hidden='true'
                className='flex size-24 shrink-0 items-center justify-center rounded-2xl bg-court font-display text-3xl font-extrabold text-chalk ring-1 ring-ink/10 sm:size-32'>
                {authorInitials(name)}
              </span>
            )}

            <div className='min-w-0'>
              <BoardKicker>Von einem Handballer entwickelt</BoardKicker>
              <h2 className='mt-3 font-display text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.1rem]'>
                Wer hinter Statix steht
              </h2>
              <p className='mt-1 text-sm text-ink/60'>
                {name} · {role}
              </p>

              <div className='mt-5 space-y-4 text-base leading-8 text-ink/75'>
                <p>{bio}</p>
                <p>
                  Statix ist deshalb kein Tool aus einem Produktplan, sondern
                  aus einer Sporthalle. Feedback von Trainerinnen und Trainern
                  fließt direkt in die Entwicklung ein, und neue Funktionen
                  entstehen dort, wo sie gebraucht werden – auf der Bank, im
                  Training und in der Nachbereitung.
                </p>
                <p className='text-[15px]'>
                  Mehr über die App:{' '}
                  <Link
                    href='/was-ist-statix'
                    className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
                    Was ist Statix?
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </BoardCard>
      </div>
    </section>
  );
}
