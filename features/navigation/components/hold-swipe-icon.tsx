/**
 * The hold gesture as a glyph: the held player in the middle, one chevron per
 * direction — the app's own menu, drawn at icon size. Stroke and fill follow
 * `currentColor`, so it takes the colour of whatever it sits in.
 * @returns An inline SVG, hidden from assistive technology.
 */
export default function HoldSwipeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2.25}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      focusable='false'
      className={className}>
      <rect
        x='8.5'
        y='8.5'
        width='7'
        height='7'
        rx='2'
        fill='currentColor'
        stroke='none'
      />
      <path d='M9.5 5 12 2.5 14.5 5' />
      <path d='M9.5 19 12 21.5 14.5 19' />
      <path d='M5 9.5 2.5 12 5 14.5' />
      <path d='M19 9.5 21.5 12 19 14.5' />
    </svg>
  );
}
