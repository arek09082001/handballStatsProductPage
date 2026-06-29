'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AlertCircle, Check, Loader2, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterConfirm() {
  const t = useTranslations('newsletterConfirm');
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    setStatus('loading');
    setErrorMessage(null);

    try {
      const response = await fetch('/api/newsletter/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrorMessage(result.error || t('errorDescription'));
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMessage(t('errorDescription'));
      setStatus('error');
    }
  };

  return (
    <section className='flex min-h-[calc(100vh-88px)] w-full items-center justify-center bg-muted/40 px-6 py-20'>
      <div className='w-full max-w-md rounded-3xl border border-border bg-background p-8 text-center shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)] sm:p-10'>
        {status === 'success' ? (
          <>
            <span className='mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500'>
              <Check className='size-7' />
            </span>
            <h1 className='mt-6 text-2xl font-bold tracking-tight text-foreground'>
              {t('successTitle')}
            </h1>
            <p className='mt-3 text-sm leading-6 text-muted-foreground'>
              {t('successDescription')}
            </p>
            <Button
              asChild
              className='mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] px-4 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5'>
              <Link href='/'>{t('backHome')}</Link>
            </Button>
          </>
        ) : !token ? (
          <>
            <span className='mx-auto flex size-14 items-center justify-center rounded-full bg-red-500/15 text-red-500'>
              <AlertCircle className='size-7' />
            </span>
            <h1 className='mt-6 text-2xl font-bold tracking-tight text-foreground'>
              {t('invalidTitle')}
            </h1>
            <p className='mt-3 text-sm leading-6 text-muted-foreground'>
              {t('invalidDescription')}
            </p>
            <Button
              asChild
              variant='outline'
              className='mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold'>
              <Link href='/#newsletter'>{t('backToForm')}</Link>
            </Button>
          </>
        ) : (
          <>
            <span className='mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <Mail className='size-7' />
            </span>
            <h1 className='mt-6 text-2xl font-bold tracking-tight text-foreground'>
              {t('title')}
            </h1>
            <p className='mt-3 text-sm leading-6 text-muted-foreground'>
              {t('description')}
            </p>

            <Button
              onClick={handleConfirm}
              disabled={status === 'loading'}
              className='mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] px-4 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60'>
              {status === 'loading' && <Loader2 className='size-4 animate-spin' />}
              {status === 'loading' ? t('pending') : t('confirmButton')}
            </Button>

            {status === 'error' && errorMessage && (
              <div
                role='alert'
                className='mt-4 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-3.5 py-2.5 text-left text-sm leading-5 text-red-600 dark:text-red-300'>
                <AlertCircle className='mt-0.5 size-4 shrink-0' />
                <span>{errorMessage}</span>
              </div>
            )}

            <p className='mt-4 text-xs leading-5 text-muted-foreground'>
              {t('ignoreHint')}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
