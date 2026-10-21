'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

/** Real app captures, visible in the server frame. Only the marker draws in;
 * the quiet rest pose is identical on the server and under reduced motion. */
export default function HeroDevices() {
  const t = useTranslations('productPage.hero');
  return (
    <div className='hero-devices relative mx-auto w-full max-w-[760px] [perspective:2200px]'>
      <div className='relative aspect-[16/10.5] w-full'>
        <div className='absolute right-0 top-[2%] w-[94%] [transform:rotateY(-8deg)_rotateX(3deg)_rotateZ(-1.5deg)]'>
          <DeviceFrame kind='tablet'>
            <Image
              src='/hero-tablet-verlauf.png'
              alt={t('tabletAlt')}
              width={2560}
              height={1600}
              priority
              fetchPriority='high'
              sizes='(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 620px'
              className='block h-auto w-full'
            />
            <svg aria-hidden='true' viewBox='0 0 120 60' fill='none'
              className='pointer-events-none absolute left-[58.5%] top-[23.5%] h-[16%] w-[13%] overflow-visible'>
              <path className='hero-turn-mark'
                d='M14 34 C 10 14, 52 4, 86 8 C 116 12, 118 44, 88 52 C 60 58, 20 56, 12 38 C 9 30, 18 22, 30 18'
                pathLength='1' stroke='hsl(22 92% 52%)' strokeWidth={4}
                strokeLinecap='round' vectorEffect='non-scaling-stroke' />
            </svg>
          </DeviceFrame>
        </div>
        <div className='absolute bottom-0 left-0 w-[25%] [transform:rotateZ(3deg)]'>
          <DeviceFrame kind='phone'>
            <Image src='/hero-mobil-statistik.png' alt={t('phoneAlt')}
              width={780} height={1688}
              sizes='(max-width: 640px) 100px, 160px' className='block h-auto w-full' />
          </DeviceFrame>
        </div>
      </div>
      <p className='mt-3 text-center font-hand text-xl font-semibold text-primary sm:text-2xl'>
        {t('noteTablet')}
      </p>
    </div>
  );
}

function DeviceFrame({
  kind,
  children,
}: {
  kind: 'tablet' | 'phone';
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative bg-[#0a0d12] ring-1 ring-chalk/15',
        'shadow-[0_40px_60px_-30px_rgba(0,0,0,0.75),0_18px_28px_-18px_rgba(0,0,0,0.6)]',
        kind === 'tablet'
          ? 'rounded-[22px] p-[1.6%] sm:rounded-[28px]'
          : 'rounded-[26px] p-[4.5%] sm:rounded-[32px]',
      )}>
      <div
        className={cn(
          'relative overflow-hidden bg-court',
          kind === 'tablet' ? 'rounded-[12px] sm:rounded-[16px]' : 'rounded-[18px] sm:rounded-[24px]',
        )}>
        {children}
        {/* A faint sheen across the glass, so the screen reads as a device. */}
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_38%)]'
        />
      </div>
    </div>
  );
}
