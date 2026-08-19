'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Send, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useFeedback } from '@/lib/hooks/use-feedback';
import { Button } from '@/components/ui/button';
import { BoardCard, Grain } from '@/features/landing-page/components/tactic';
import {
  FEEDBACK_CATEGORY_IDS,
  FEEDBACK_MAX_MESSAGE_LENGTH,
  FEEDBACK_MIN_MESSAGE_LENGTH,
  type FeedbackCategoryId,
} from '../data/feedback-content';
import FeedbackRating from './feedback-rating';

/**
 * The feedback form. Three required answers — a rating, the area it is about
 * and the message itself — and two optional ones, because a coach who wants to
 * report a broken half-time view at 22:40 should not have to type their name
 * first. Everything is posted to `/api/feedback`, which mails the summary to
 * the team address.
 */
export default function FeedbackFormSection() {
  const t = useTranslations('feedbackPage');
  const feedbackMutation = useFeedback();

  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState<FeedbackCategoryId | ''>('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  // Honeypot
  const [website, setWebsite] = useState('');

  const trimmedEmail = email.trim();
  // An empty address is valid here — it only has to parse when it is filled in.
  const isValidEmail =
    trimmedEmail === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const isFormValid =
    rating > 0 &&
    category !== '' &&
    message.trim().length >= FEEDBACK_MIN_MESSAGE_LENGTH &&
    isValidEmail &&
    acceptPrivacy;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail) {
      toast.error(t('invalidEmail'));
      return;
    }

    if (rating === 0) {
      toast.error(t('missingRating'));
      return;
    }

    if (category === '') {
      toast.error(t('missingCategory'));
      return;
    }

    if (!isFormValid) {
      return;
    }

    feedbackMutation.mutate(
      {
        rating,
        category,
        message: message.trim(),
        name: name.trim(),
        email: trimmedEmail,
        acceptPrivacy,
        website,
      },
      {
        onSuccess: () => {
          toast.success(t('successTitle'), {
            description: t('successDescription'),
            duration: 6000,
          });
          setRating(0);
          setCategory('');
          setMessage('');
          setName('');
          setEmail('');
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
    'h-12 w-full rounded-xl border border-ink/15 bg-white pl-10 pr-3.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink/60 hover:border-ink/25 focus:border-primary focus:ring-2 focus:ring-primary/25';

  return (
    <section
      id='feedback'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-16 md:py-24'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-2xl px-6 sm:px-10'>
        <form onSubmit={handleSubmit} className='w-full'>
          <BoardCard tone='paper' pin='tape'>
            <div className='space-y-6 p-5 sm:p-6'>
              <FeedbackRating value={rating} onChange={setRating} />

              <fieldset className='space-y-2'>
                <legend className='text-sm font-semibold text-ink'>
                  {t('categoryLabel')}
                </legend>
                <div className='flex flex-wrap gap-2'>
                  {FEEDBACK_CATEGORY_IDS.map((categoryId) => {
                    const isSelected = category === categoryId;

                    return (
                      <label
                        key={categoryId}
                        className={`cursor-pointer rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors duration-200 focus-within:ring-2 focus-within:ring-primary/50 ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-ink/15 bg-white text-ink/70 hover:border-ink/30 hover:text-ink'
                        }`}>
                        <input
                          type='radio'
                          name='feedback-category'
                          value={categoryId}
                          checked={isSelected}
                          onChange={() => setCategory(categoryId)}
                          className='sr-only'
                        />
                        {t(`categories.${categoryId}`)}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className='space-y-2'>
                <label
                  className='block text-sm font-semibold text-ink'
                  htmlFor='feedback-message'>
                  {t('messageLabel')}
                </label>
                <textarea
                  id='feedback-message'
                  name='message'
                  required
                  rows={6}
                  maxLength={FEEDBACK_MAX_MESSAGE_LENGTH}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={t('messagePlaceholder')}
                  className='w-full resize-none rounded-xl border border-ink/15 bg-white px-3.5 py-3 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink/60 hover:border-ink/25 focus:border-primary focus:ring-2 focus:ring-primary/25'
                />
                <p className='text-[13px] leading-5 text-ink/50'>
                  {t('messageHint', { min: FEEDBACK_MIN_MESSAGE_LENGTH })}
                </p>
              </div>

              <div className='space-y-2'>
                <p className='text-sm font-semibold text-ink'>
                  {t('contactLabel')}{' '}
                  <span className='font-normal text-ink/50'>
                    {t('optional')}
                  </span>
                </p>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='relative'>
                    <label className='sr-only' htmlFor='feedback-name'>
                      {t('namePlaceholder')}
                    </label>
                    <User className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40' />
                    <input
                      id='feedback-name'
                      name='name'
                      type='text'
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={t('namePlaceholder')}
                      className={inputClassName}
                    />
                  </div>

                  <div className='relative'>
                    <label className='sr-only' htmlFor='feedback-email'>
                      {t('emailPlaceholder')}
                    </label>
                    <Mail className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40' />
                    <input
                      id='feedback-email'
                      name='email'
                      type='email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={t('emailPlaceholder')}
                      className={inputClassName}
                    />
                  </div>
                </div>
                <p className='text-[13px] leading-5 text-ink/50'>
                  {t('contactHint')}
                </p>
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
                disabled={feedbackMutation.isPending || !isFormValid}
                className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-display text-sm font-bold text-white shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.98] disabled:pointer-events-none disabled:bg-ink/10 disabled:text-ink/40'>
                <Send className='size-4' />
                {feedbackMutation.isPending ? t('pending') : t('button')}
              </Button>

              <p className='text-center text-[13px] leading-5 text-ink/50'>
                {t('note')}
              </p>
            </div>
          </BoardCard>
        </form>
      </div>
    </section>
  );
}
