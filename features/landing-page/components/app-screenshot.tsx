import Image from 'next/image';

interface AppScreenshotProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Optional caption shown in the faux browser address bar. */
  label?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Wraps a real in-app screenshot in a dark faux-browser frame so the product
 * shots sit consistently on the (light) marketing page. The screenshots are
 * already dark-themed, so the chrome stays dark to match.
 */
export default function AppScreenshot({
  src,
  alt,
  width,
  height,
  label,
  priority = false,
  sizes = '(max-width: 1024px) 100vw, 60vw',
  className,
}: AppScreenshotProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-[0_40px_90px_-45px_rgba(15,23,42,0.85)] ring-1 ring-black/5 ${
        className ?? ''
      }`}>
      {/* Browser chrome */}
      <div className='flex items-center gap-3 border-b border-white/10 bg-white/5 px-4 py-3'>
        <div className='flex items-center gap-1.5'>
          <span className='size-2.5 rounded-full bg-[#ff5f57]' />
          <span className='size-2.5 rounded-full bg-[#febc2e]' />
          <span className='size-2.5 rounded-full bg-[#28c840]' />
        </div>
        {label ? (
          <div className='flex min-w-0 flex-1 items-center rounded-lg bg-black/30 px-3 py-1.5'>
            <span className='truncate text-xs font-medium text-white/60'>{label}</span>
          </div>
        ) : null}
      </div>

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        className='h-auto w-full'
      />
    </div>
  );
}
