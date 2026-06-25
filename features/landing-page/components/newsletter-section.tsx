'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, Mail, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useNewsletter } from '@/lib/hooks/use-newsletter';
import { Button } from '@/components/ui/button';

export default function NewsletterSection() {
  const t = useTranslations('productPage.newsletter');
  const benefits = t.raw('benefits') as string[];
  const newsletterMutation = useNewsletter();

  const [email, setEmail] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  // Honeypot
  const [website, setWebsite] = useState('');

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormValid = isValidEmail && acceptPrivacy;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail) {
      toast.error(t('invalidEmail'));
      return;
    }

    if (!isFormValid) {
      return;
    }

    newsletterMutation.mutate(
      {
        email: email.trim(),
        acceptPrivacy,
        website,
      },
      {
        onSuccess: () => {
          toast.success(t('successTitle'), {
            description: t('successDescription'),
            duration: 6000,
          });
          setEmail('');
          setAcceptPrivacy(false);
        },
        onError: (error: Error) => {
          toast.error(t('errorTitle'), {
            description: error.message || t('errorDescription'),
            duration: 6000,
          });
        },
      }
    );
  };

  return (
    <section id='newsletter' className='w-full scroll-mt-24 bg-background py-12 md:py-20'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0b1220] via-[#101a36] to-[#0b1220] px-7 py-10 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.7)] sm:px-10 md:px-14 md:py-12'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(249,115,22,0.22),transparent_45%),radial-gradient(circle_at_85%_90%,rgba(37,99,235,0.22),transparent_45%)]' />

          <div className='relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
            <div className='text-center text-white lg:text-left'>
              <span className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#fdba74]'>
                <Sparkles className='size-3.5' />
                {t('eyebrow')}
              </span>
              <h2 className='mt-4 text-3xl font-bold tracking-tight sm:text-4xl'>
                {t('title')}
              </h2>
              <p className='mx-auto mt-4 max-w-lg text-base leading-7 text-slate-300 lg:mx-0'>
                {t('description')}
              </p>

              <ul className='mt-6 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start'>
                {benefits.map((benefit) => (
                  <li key={benefit} className='inline-flex items-center gap-2 text-sm text-slate-200'>
                    <span className='flex size-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300'>
                      <Check className='size-3' />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleSubmit} className='w-full'>
              <div className='rounded-2xl border border-white/12 bg-white/5 p-5 backdrop-blur-sm sm:p-6'>
                <label className='sr-only' htmlFor='newsletter-email'>
                  {t('placeholder')}
                </label>
                <div className='relative'>
                  <Mail className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400' />
                  <input
                    id='newsletter-email'
                    name='email'
                    type='email'
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t('placeholder')}
                    className='h-12 w-full rounded-xl border border-white/12 bg-white/8 pl-10 pr-3.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-white/20 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/25'
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

                <label className='mt-3 flex items-start gap-3 text-left text-sm leading-6 text-slate-200'>
                  <input
                    type='checkbox'
                    checked={acceptPrivacy}
                    onChange={(event) => setAcceptPrivacy(event.target.checked)}
                    className='mt-1 size-4 rounded border-white/20 bg-transparent text-[#f97316] focus:ring-[#f97316]'
                  />
                  <span>
                    {t('privacyPrefix')}{' '}
                    <Link
                      href='/impressum'
                      title='Zum Impressum und den Datenschutzbestimmungen'
                      className='font-semibold text-[#fdba74] underline underline-offset-2'>
                      {t('privacyLink')}
                    </Link>{' '}
                    {t('privacySuffix')}
                  </span>
                </label>

                <Button
                  type='submit'
                  disabled={newsletterMutation.isPending || !isFormValid}
                  className='mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] px-4 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-18px_rgba(249,115,22,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'>
                  {newsletterMutation.isPending ? t('pending') : t('button')}
                </Button>

                <p className='mt-3 text-center text-xs leading-5 text-slate-400'>
                  {t('note')}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
