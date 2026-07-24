'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, MessageSquare, Send, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useContact } from '@/lib/hooks/use-contact';
import { Button } from '@/components/ui/button';
import { CLUB_CONFIG } from '@/lib/club-config';
import { BoardCard, Grain, SectionHeading } from './tactic';

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
      },
    );
  };

  const inputClassName =
    'h-12 w-full rounded-xl border border-ink/15 bg-white pl-10 pr-3.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink/40 hover:border-ink/25 focus:border-primary focus:ring-2 focus:ring-primary/25';

  return (
    <section
      id='contact'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-24 md:py-32'>
      <Grain tone='paper' />
      <div className='relative mx-auto grid w-full max-w-6xl gap-12 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
        <div>
          <SectionHeading
            align='left'
            kicker={t('kicker')}
            title={t('title')}
            description={t('description')}
          />
          <Link
            href={`mailto:${CLUB_CONFIG.email.main}`}
            className='mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-[#ea580c]'>
            <Mail className='size-4' />
            {CLUB_CONFIG.email.main}
          </Link>
        </div>

        <form onSubmit={handleSubmit} className='w-full'>
          <BoardCard tone='paper' pin='tape'>
            <div className='space-y-4 p-5 sm:p-6'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='relative'>
                  <label className='sr-only' htmlFor='contact-name'>
                    {t('namePlaceholder')}
                  </label>
                  <User className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40' />
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
                  <Mail className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40' />
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
                <MessageSquare className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40' />
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
                  className='w-full resize-none rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink/40 hover:border-ink/25 focus:border-primary focus:ring-2 focus:ring-primary/25'
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

              <label className='flex items-start gap-3 text-left text-sm leading-6 text-ink/75'>
                <input
                  type='checkbox'
                  checked={acceptPrivacy}
                  onChange={(event) => setAcceptPrivacy(event.target.checked)}
                  className='mt-1 size-4 rounded border-ink/25 bg-transparent text-primary focus:ring-primary'
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
                disabled={contactMutation.isPending || !isFormValid}
                className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-display text-sm font-bold text-white shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'>
                <Send className='size-4' />
                {contactMutation.isPending ? t('pending') : t('button')}
              </Button>

              <p className='text-center text-xs leading-5 text-ink/50'>{t('note')}</p>
            </div>
          </BoardCard>
        </form>
      </div>
    </section>
  );
}
