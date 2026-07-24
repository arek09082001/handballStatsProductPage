import BoardScreenshot from './tactic/board-screenshot';

/**
 * The hero's in‑app preview — the live match‑recording view, pinned to the
 * board the way a coach reviews it on the sideline. Kept at native aspect ratio.
 */
export default function AppMockup() {
  return (
    <BoardScreenshot
      src='/heroImage.png'
      alt='Handball-Statistiken live in der Statix App – Tore, Würfe und Paraden in Echtzeit erfassen'
      width={1916}
      height={879}
      label='Statix · Live-Erfassung'
      tone='court'
      pin='tape'
      live
      priority
      sizes='(max-width: 1024px) 100vw, 640px'
      className='mx-auto w-full'
    />
  );
}
