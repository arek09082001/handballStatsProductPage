'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertCircle, Check, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useNewsletter } from '@/lib/hooks/use-newsletter';
import { Button } from '@/components/ui/button';
import { BoardCard, CourtDiagram, Grain, SectionHeading } from './tactic';

export default function NewsletterSection() {
  const t = useTranslations('productPage.newsletter');
  const benefits = t.raw('benefits') as string[];
  const newsletterMutation = useNewsletter();

  const [email, setEmail] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  // Client-side validation error shown inline in the card.
  const [validationError, setValidationError] = useState<string | null>(null);
  // Honeypot
  const [website, setWebsite] = useState('');

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormValid = isValidEmail && acceptPrivacy;

  const errorMessage = validationError
    ? validationError
    : newsletterMutation.isError
      ? newsletterMutation.error?.message || t('errorDescription')
      : null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (!isValidEmail) {
      setValidationError(t('invalidEmail'));
      return;
    }

    if (!isFormValid) {
      return;
    }

    newsletterMutation.mutate(
      { email: email.trim(), acceptPrivacy, website },
      {
        onSuccess: () => {
          setEmail('');
          setAcceptPrivacy(false);
        },
      },
    );
  };

  return (
    <section
      id='newsletter'
      className='relative w-full scroll-mt-24 overflow-hidden bg-court py-24 text-chalk md:py-32'>
      <CourtDiagram
        variant='full'
        aria-hidden
        className='pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-auto w-[94%] max-w-5xl text-chalk/[0.06]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto grid w-full max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
        <div>
          <SectionHeading
            tone='court'
            align='left'
            kicker={t('kicker')}
            title={t('title')}
            description={t('description')}
          />
          <ul className='mt-8 flex flex-col gap-3'>
            {benefits.map((benefit) => (
              <li key={benefit} className='inline-flex items-center gap-2.5 text-sm text-chalk/85'>
                <span className='flex size-5 items-center justify-center rounded-full bg-success/20 text-success'>
                  <Check className='size-3' strokeWidth={3} />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {newsletterMutation.isSuccess ? (
          <BoardCard tone='court' pin='magnet' pinColor='success'>
            <div className='flex flex-col items-center justify-center p-8 text-center'>
              <span className='flex size-12 items-center justify-center rounded-full bg-success/20 text-success'>
                <Check className='size-6' />
              </span>
              <h3 className='mt-4 font-display text-lg font-bold text-chalk'>{t('successTitle')}</h3>
              <p className='mt-2 max-w-sm text-sm leading-6 text-chalk/75'>
                {t('successDescription')}
              </p>
            </div>
          </BoardCard>
        ) : (
          <form onSubmit={handleSubmit} className='w-full'>
            <BoardCard tone='court' pin='tape'>
              <div className='p-5 sm:p-6'>
                <label className='sr-only' htmlFor='newsletter-email'>
                  {t('placeholder')}
                </label>
                <div className='relative'>
                  <Mail className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-chalk/40' />
                  <input
                    id='newsletter-email'
                    name='email'
                    type='email'
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t('placeholder')}
                    className='h-12 w-full rounded-xl border border-chalk/15 bg-court pl-10 pr-3.5 text-sm text-chalk outline-none transition-all duration-200 placeholder:text-chalk/60 hover:border-chalk/25 focus:border-primary focus:ring-2 focus:ring-primary/30'
                  />
                </div>

                {/* Honeypot field — hidden from users */}
                <input
                  type='text'
                  name='website'
                  tabIndex={-1}
                  autoComplete='off'
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  className='hidden'
                  aria-hidden='true'
                />

                <label className='mt-3 flex items-start gap-3 text-left text-sm leading-6 text-chalk/80'>
                  <input
                    type='checkbox'
                    checked={acceptPrivacy}
                    onChange={(event) => setAcceptPrivacy(event.target.checked)}
                    className='mt-1 size-4 rounded border-chalk/25 bg-transparent text-primary focus:ring-primary'
                  />
                  <span>
                    {t('privacyPrefix')}{' '}
                    <Link
                      href='/impressum'
                      title='Zum Impressum und den Datenschutzbestimmungen'
                      className='font-semibold text-primary underline underline-offset-2'>
                      {t('privacyLink')}
                    </Link>{' '}
                    {t('privacySuffix')}
                  </span>
                </label>

                <Button
                  type='submit'
                  disabled={newsletterMutation.isPending || !isFormValid}
                  className='mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 font-display text-sm font-bold text-white shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-court active:scale-[0.98] disabled:pointer-events-none disabled:bg-chalk/15 disabled:text-chalk/45'>
                  {newsletterMutation.isPending ? t('pending') : t('button')}
                </Button>

                {errorMessage && (
                  <div
                    role='alert'
                    className='mt-3 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-left text-sm leading-5 text-red-200'>
                    <AlertCircle className='mt-0.5 size-4 shrink-0' />
                    <span>
                      <strong className='font-semibold'>{t('errorTitle')}:</strong>{' '}
                      {errorMessage}
                    </span>
                  </div>
                )}

                <p className='mt-3 text-center text-xs leading-5 text-chalk/50'>{t('note')}</p>
              </div>
            </BoardCard>
          </form>
        )}
      </div>
    </section>
  );
}
