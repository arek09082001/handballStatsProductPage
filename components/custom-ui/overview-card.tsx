'use client';

import { Card } from '@/components/ui/card';
import { Slash } from 'lucide-react';
import { JSX } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OverviewCardProps {
  currentValue: string;
  target: string;
  loading?: boolean;
  label?: string;
  backgroundIcon?: JSX.Element;
}

export default function OverviewCard({
  currentValue,
  target,
  loading = true,
  label,
  backgroundIcon,
}: OverviewCardProps): JSX.Element {
  return (
    <Card className='relative flex flex-col items-center justify-center gap-2 bg-background p-5 h-full w-full overflow-hidden'>
      {backgroundIcon && (
        <div className='absolute top-0 bottom-0 left-0 opacity-5 pointer-events-none overflow-hidden'>
          {backgroundIcon}
        </div>
      )}
      <div>
        <div className='flex justify-start font-medium'>{label}</div>
        {loading ? (
          <Skeleton className='h-7 w-32' />
        ) : (
          <div className='flex flex-row items-center justify-center gap-2'>
            <div className='text-xl'>{currentValue}</div>
            <Slash size={12} />
            <div className='text-muted text-sm'>{target}</div>
          </div>
        )}
      </div>
    </Card>
  );
}
