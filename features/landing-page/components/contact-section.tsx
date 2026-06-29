'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, MessageSquare, Send, Sparkles, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useContact } from '@/lib/hooks/use-contact';
import { Button } from '@/components/ui/button';
import { CLUB_CONFIG } from '@/lib/club-config';

export default function ContactSection() {
  const t = useTranslations('productPage.contact');
  const contactMutation = useContact();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  // Honeypot
  const [website, setWebsite] = useState('');

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormValid =
    name.trim().length >= 2 &&
    isValidEmail &&
    topic.trim().length >= 2 &&
    message.trim().length >= 10 &&
    acceptPrivacy;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail) {
      toast.error(t('invalidEmail'));
      return;
    }

    if (!isFormValid) {
      return;
    }

    contactMutation.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        topic: topic.trim(),
        message: message.trim(),
        acceptPrivacy,
        website,
      },
      {
        onSuccess: () => {
          toast.success(t('successTitle'), {
            description: t('successDescription'),
            duration: 6000,
          });
          setName('');
          setEmail('');
          setTopic('');
          setMessage('');
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

  const inputClassName =
    'h-12 w-full rounded-xl border border-white/12 bg-white/8 pl-10 pr-3.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-white/20 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/25';

  return (
    <section
      id='contact'
      className='w-full scroll-mt-24 bg-background py-20 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#0b1220] via-[#101a36] to-[#0b1220] px-7 py-10 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.7)] sm:px-10 md:px-14 md:py-12'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(249,115,22,0.22),transparent_45%),radial-gradient(circle_at_85%_90%,rgba(37,99,235,0.22),transparent_45%)]' />

          <div className='relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
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

              <Link
                href={`mailto:${CLUB_CONFIG.email.main}`}
                className='mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#fdba74] transition-colors hover:text-[#fed7aa]'>
                <Mail className='size-4' />
                {CLUB_CONFIG.email.main}
              </Link>
            </div>

            <form onSubmit={handleSubmit} className='w-full'>
              <div className='space-y-4 rounded-2xl border border-white/12 bg-white/5 p-5 backdrop-blur-sm sm:p-6'>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='relative'>
                    <label className='sr-only' htmlFor='contact-name'>
                      {t('namePlaceholder')}
                    </label>
                    <User className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400' />
                    <input
                      id='contact-name'
                      name='name'
                      type='text'
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={t('namePlaceholder')}
                      className={inputClassName}
                    />
                  </div>

                  <div className='relative'>
                    <label className='sr-only' htmlFor='contact-email'>
                      {t('emailPlaceholder')}
                    </label>
                    <Mail className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400' />
                    <input
                      id='contact-email'
                      name='email'
                      type='email'
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={t('emailPlaceholder')}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className='relative'>
                  <label className='sr-only' htmlFor='contact-topic'>
                    {t('topicPlaceholder')}
                  </label>
                  <MessageSquare className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400' />
                  <input
                    id='contact-topic'
                    name='topic'
                    type='text'
                    required
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    placeholder={t('topicPlaceholder')}
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className='sr-only' htmlFor='contact-message'>
                    {t('messagePlaceholder')}
                  </label>
                  <textarea
                    id='contact-message'
                    name='message'
                    required
                    rows={5}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={t('messagePlaceholder')}
                    className='w-full resize-none rounded-xl border border-white/12 bg-white/8 px-3.5 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-white/20 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/25'
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

                <label className='flex items-start gap-3 text-left text-sm leading-6 text-slate-200'>
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
                  disabled={contactMutation.isPending || !isFormValid}
                  className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] px-4 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-18px_rgba(249,115,22,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'>
                  <Send className='size-4' />
                  {contactMutation.isPending ? t('pending') : t('button')}
                </Button>

                <p className='text-center text-xs leading-5 text-slate-400'>
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
