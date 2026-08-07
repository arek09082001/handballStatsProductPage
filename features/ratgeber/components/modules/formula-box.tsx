/**
 * A metric written on the board: the formula in Archivo at poster size with the
 * worked example underneath in the coach's hand. Replaces the blockquote that
 * every kennzahl article used to reach for.
 */
export default function FormulaBox({
  label,
  formula,
  example,
}: {
  label: string;
  formula: string;
  example?: string;
}) {
  return (
    <figure className='my-9 overflow-hidden rounded-2xl border border-ink/10 bg-court text-chalk board-shadow-court'>
      <div className='px-6 py-6 sm:px-8 sm:py-7'>
        <p className='font-hand text-xl leading-none text-primary'>{label}</p>
        <p className='mt-3 font-display text-[1.35rem] font-extrabold leading-snug tracking-[-0.02em] tabular-nums text-chalk sm:text-[1.6rem]'>
          {formula}
        </p>
      </div>
      {example ? (
        <figcaption className='border-t border-chalk/15 bg-chalk/[0.04] px-6 py-4 text-[15px] leading-7 tabular-nums text-chalk/75 sm:px-8'>
          <span className='font-semibold text-chalk/90'>Beispiel: </span>
          {example}
        </figcaption>
      ) : null}
    </figure>
  );
}
