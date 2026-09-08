'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorStateProps {
  /** Overrides the shared wording; both default to the reader's language. */
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

function ErrorState({
  title,
  message,
  onRetry,
  showRetry = true,
}: ErrorStateProps) {
  const t = useTranslations('statusPages.errorState');

  return (
    <Card className='w-full max-w-2xl mx-auto my-8 border-red-200 bg-red-50/50'>
      <CardContent className='p-8 sm:p-12'>
        <div className='flex flex-col items-center text-center space-y-4'>
          {/* Error Icon */}
          <div className='p-3 bg-red-100 rounded-full'>
            <AlertCircle className='h-8 w-8 text-red-600' />
          </div>

          {/* Error Title */}
          <h3 className='text-xl sm:text-2xl font-bold text-slate-800'>
            {title ?? t('title')}
          </h3>

          {/* Error Message */}
          <p className='text-slate-600 text-sm sm:text-base max-w-md'>
            {message ?? t('message')}
          </p>

          {/* Retry Button */}
          {showRetry && onRetry && (
            <Button
              onClick={onRetry}
              variant='outline'
              className='mt-4 gap-2 border-red-300 hover:bg-red-50 hover:border-red-400 transition-all'>
              <RefreshCw className='h-4 w-4' />
              {t('retryCta')}
            </Button>
          )}

          {/* Help Text */}
          <p className='text-[13px] text-slate-500 mt-4'>{t('help')}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Memoize since this is a pure presentational component
export default React.memo(ErrorState);
