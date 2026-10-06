/**
 * The livestream as a glyph: a filled dot sending two arcs to either side —
 * the broadcast mark, drawn at icon size. Stroke and fill follow
 * `currentColor`, so it takes the colour of whatever it sits in.
 * @returns An inline SVG, hidden from assistive technology.
 */
export default function LiveStreamIcon({ className }: { className?: string }) {
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
      <circle cx='12' cy='12' r='2.6' fill='currentColor' stroke='none' />
      <path d='M8.2 8.2a5.4 5.4 0 0 0 0 7.6' />
      <path d='M15.8 8.2a5.4 5.4 0 0 1 0 7.6' />
      <path d='M5.2 5.2a9.6 9.6 0 0 0 0 13.6' />
      <path d='M18.8 5.2a9.6 9.6 0 0 1 0 13.6' />
    </svg>
  );
}
