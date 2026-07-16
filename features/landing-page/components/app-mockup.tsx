import AppScreenshot from './app-screenshot';

/**
 * In-app preview for the hero — the live match-recording screenshot shown the
 * way a coach would actually hold it on the sideline. Rendered through
 * `AppScreenshot`, which keeps the shot at its native aspect ratio so nothing
 * of the live view gets cropped away.
 */
export default function AppMockup() {
  return (
    <div className='relative mx-auto w-full'>
      {/* Glow */}
      <div className='absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.35),transparent_60%),radial-gradient(circle_at_80%_90%,rgba(37,99,235,0.3),transparent_55%)] blur-2xl' />

      <AppScreenshot
        src='/heroImage.png'
        alt='Handball-Statistiken live in der Statix App – Tore, Würfe und Paraden in Echtzeit erfassen'
        width={1916}
        height={879}
        label='Statix · Live-Erfassung'
        priority
        sizes='(max-width: 1024px) 100vw, 640px'
        className='relative'
      />
    </div>
  );
}
