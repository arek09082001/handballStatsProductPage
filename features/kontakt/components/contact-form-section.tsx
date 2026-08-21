'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Mail, MessageSquare, Send, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useContact } from '@/lib/hooks/use-contact';
import { Button } from '@/components/ui/button';
import { BoardCard, Grain } from '@/features/landing-page/components/tactic';

interface ContactFormSectionProps {
  /**
   * Anchor of the band. Defaults to `contact`, which is what the landing page
   * and `/kontakt` link to; a page embedding a second copy passes its own so
   * two forms never share one id.
   */
  anchorId?: string;
  /**
   * Subject line the form starts with. The club page passes one so an enquiry
   * arrives labelled as a club enquiry instead of an empty field. Without it,
   * a `?thema=` query parameter fills the field after mount — that is how the
   * club CTAs elsewhere on the site hand their subject over, and reading it
   * from `window` rather than `useSearchParams` keeps `/kontakt` statically
   * rendered.
   */
  defaultTopic?: string;
}

/**
 * The contact form, on its own route. It used to be the second-to-last band of
 * the landing page, where a four-field form competed with the registration CTA
 * for the visitor's last scroll. The page header above carries the heading and
 * the direct e-mail address, so this renders the form alone.
 */
export default function ContactFormSection({
  anchorId = 'contact',
  defaultTopic = '',
}: ContactFormSectionProps = {}) {
  const t = useTranslations('contactPage');
  const contactMutation = useContact();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(defaultTopic);
  const [message, setMessage] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  // Honeypot
  const [website, setWebsite] = useState('');

  // A `?thema=` parameter fills the subject once, and only while the field is
  // still untouched — a visitor arriving from the club page finds "Vereins-
  // anfrage" prepared, and anyone who has started typing keeps what they typed.
  useEffect(() => {
    if (defaultTopic) {
      return;
    }

    const fromQuery = new URLSearchParams(window.location.search).get('thema');

    if (fromQuery) {
      setTopic((current) => (current.trim() === '' ? fromQuery : current));
    }
  }, [defaultTopic]);

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
          setTopic(defaultTopic);
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

  // Field ids are derived from the band's anchor: the component is embeddable
  // now, and two copies on one page with the same `id` would point every label
  // at the first form's inputs.
  const fieldId = (field: string) => `${anchorId}-${field}`;

  const inputClassName =
    'h-12 w-full rounded-xl border border-ink/15 bg-white pl-10 pr-3.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink/60 hover:border-ink/25 focus:border-primary focus:ring-2 focus:ring-primary/25';

  return (
    <section
      id={anchorId}
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-16 md:py-24'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-2xl px-6 sm:px-10'>
        <form onSubmit={handleSubmit} className='w-full'>
          <BoardCard tone='paper' pin='tape'>
            <div className='space-y-4 p-5 sm:p-6'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='relative'>
                  <label className='sr-only' htmlFor={fieldId('name')}>
                    {t('namePlaceholder')}
                  </label>
                  <User className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40' />
                  <input
                    id={fieldId('name')}
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
                  <label className='sr-only' htmlFor={fieldId('email')}>
                    {t('emailPlaceholder')}
                  </label>
                  <Mail className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40' />
                  <input
                    id={fieldId('email')}
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
                <label className='sr-only' htmlFor={fieldId('topic')}>
                  {t('topicPlaceholder')}
                </label>
                <MessageSquare className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40' />
                <input
                  id={fieldId('topic')}
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
                <label className='sr-only' htmlFor={fieldId('message')}>
                  {t('messagePlaceholder')}
                </label>
                <textarea
                  id={fieldId('message')}
                  name='message'
                  required
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={t('messagePlaceholder')}
                  className='w-full resize-none rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink/60 hover:border-ink/25 focus:border-primary focus:ring-2 focus:ring-primary/25'
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
                    href='/datenschutz'
                    title='Zur Datenschutzerklärung'
                    className='font-semibold text-primary underline underline-offset-2'>
                    {t('privacyLink')}
                  </Link>{' '}
                  {t('privacySuffix')}
                </span>
              </label>

              <Button
                type='submit'
                disabled={contactMutation.isPending || !isFormValid}
                className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-display text-sm font-bold text-white shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.98] disabled:pointer-events-none disabled:bg-ink/10 disabled:text-ink/40'>
                <Send className='size-4' />
                {contactMutation.isPending ? t('pending') : t('button')}
              </Button>

              <p className='text-center text-[13px] leading-5 text-ink/50'>{t('note')}</p>
            </div>
          </BoardCard>
        </form>
      </div>
    </section>
  );
}
