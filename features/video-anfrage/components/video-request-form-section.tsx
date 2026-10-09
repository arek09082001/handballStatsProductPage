'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Mail, Send, User, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useApiErrorMessage } from '@/lib/hooks/use-api-error-message';
import { useVideoRequest } from '@/lib/hooks/use-video-request';
import { CLUB_CONFIG } from '@/lib/club-config';
import { Button } from '@/components/ui/button';
import { BoardCard, Grain } from '@/features/landing-page/components/tactic';
import {
  DEFAULT_VIDEO_REQUEST_TIER,
  VIDEO_REQUEST_MAX_MESSAGE_LENGTH,
  VIDEO_REQUEST_MAX_NAME_LENGTH,
  VIDEO_REQUEST_MAX_TEAM_LENGTH,
  VIDEO_REQUEST_MIN_NAME_LENGTH,
  VIDEO_REQUEST_SOURCE_PARAM,
  VIDEO_REQUEST_TIER_IDS,
  VIDEO_REQUEST_TIER_PARAM,
  isVideoRequestSourceId,
  isVideoRequestTierId,
  type VideoRequestSourceId,
  type VideoRequestTierId,
} from '../data/video-request-content';

const INPUT_CLASS =
  'h-12 w-full rounded-xl border border-ink/15 bg-white pl-10 pr-3.5 text-sm text-ink outline-none transition-all duration-200 placeholder:text-ink/60 hover:border-ink/25 focus:border-primary focus:ring-2 focus:ring-primary/25';

/**
 * The request form. Two required answers — who, and the address the Statix
 * account runs on, because that is what the app's allowlist is keyed by — and
 * three the visitor may skip: the squad, the tier they have in mind (defaults
 * to "noch unklar") and a free line about how they film. Posted to
 * `/api/video-request`, which mails the team and sends the visitor a receipt.
 *
 * The tier and the origin arrive as `?stufe=` and `?von=` from the buttons on
 * the pricing page and the feature pages, read from `window` after mount so
 * the route stays statically rendered — the same way `/kontakt` takes its
 * subject.
 */
export default function VideoRequestFormSection() {
  const t = useTranslations('videoRequestPage');
  const tCommon = useTranslations('common');
  const apiErrorMessage = useApiErrorMessage();
  const requestMutation = useVideoRequest();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');
  const [tier, setTier] = useState<VideoRequestTierId>(
    DEFAULT_VIDEO_REQUEST_TIER,
  );
  const [message, setMessage] = useState('');
  const [source, setSource] = useState<VideoRequestSourceId | ''>('');
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  // Honeypot
  const [website, setWebsite] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromTier = params.get(VIDEO_REQUEST_TIER_PARAM);
    const fromSource = params.get(VIDEO_REQUEST_SOURCE_PARAM);

    if (isVideoRequestTierId(fromTier)) {
      setTier(fromTier);
    }
    if (isVideoRequestSourceId(fromSource)) {
      setSource(fromSource);
    }
  }, []);

  const trimmedEmail = email.trim();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const isFormValid =
    name.trim().length >= VIDEO_REQUEST_MIN_NAME_LENGTH &&
    isValidEmail &&
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

    requestMutation.mutate(
      {
        name: name.trim(),
        email: trimmedEmail,
        team: team.trim(),
        tier,
        message: message.trim(),
        source,
        acceptPrivacy,
        website,
      },
      {
        onSuccess: () => {
          toast.success(t('successTitle'), {
            description: t('successDescription'),
            duration: 8000,
          });
          setName('');
          setEmail('');
          setTeam('');
          setTier(DEFAULT_VIDEO_REQUEST_TIER);
          setMessage('');
          setAcceptPrivacy(false);
        },
        onError: (error: Error) => {
          toast.error(t('errorTitle'), {
            description: apiErrorMessage(error),
            duration: 6000,
          });
        },
      },
    );
  };

  return (
    <section
      id='anfrage'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-16 md:py-24'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-2xl px-6 sm:px-10'>
        <form onSubmit={handleSubmit} className='w-full'>
          <BoardCard tone='paper' pin='tape'>
            <div className='space-y-6 p-5 sm:p-6'>
              <div className='space-y-2'>
                <p className='text-sm font-semibold text-ink'>
                  {t('contactLabel')}
                </p>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='relative'>
                    <label className='sr-only' htmlFor='video-request-name'>
                      {t('namePlaceholder')}
                    </label>
                    <User className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40' />
                    <input
                      id='video-request-name'
                      name='name'
                      type='text'
                      required
                      maxLength={VIDEO_REQUEST_MAX_NAME_LENGTH}
                      autoComplete='name'
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={t('namePlaceholder')}
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className='relative'>
                    <label className='sr-only' htmlFor='video-request-email'>
                      {t('emailPlaceholder')}
                    </label>
                    <Mail className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40' />
                    <input
                      id='video-request-email'
                      name='email'
                      type='email'
                      required
                      autoComplete='email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={t('emailPlaceholder')}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
                <p className='text-[13px] leading-5 text-ink/50'>
                  {t('emailHint', {
                    app: CLUB_CONFIG.website.appUrlWithoutProtocol,
                  })}
                </p>
              </div>

              <div className='space-y-2'>
                <label
                  className='block text-sm font-semibold text-ink'
                  htmlFor='video-request-team'>
                  {t('teamLabel')}{' '}
                  <span className='font-normal text-ink/50'>
                    {t('optional')}
                  </span>
                </label>
                <div className='relative'>
                  <Users className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40' />
                  <input
                    id='video-request-team'
                    name='team'
                    type='text'
                    maxLength={VIDEO_REQUEST_MAX_TEAM_LENGTH}
                    autoComplete='organization'
                    value={team}
                    onChange={(event) => setTeam(event.target.value)}
                    placeholder={t('teamPlaceholder')}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <fieldset className='space-y-2'>
                <legend className='text-sm font-semibold text-ink'>
                  {t('tierLabel')}
                </legend>
                <div className='flex flex-wrap gap-2'>
                  {VIDEO_REQUEST_TIER_IDS.map((tierId) => {
                    const isSelected = tier === tierId;

                    return (
                      <label
                        key={tierId}
                        className={`cursor-pointer rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors duration-200 focus-within:ring-2 focus-within:ring-primary/50 ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-ink/15 bg-white text-ink/70 hover:border-ink/30 hover:text-ink'
                        }`}>
                        <input
                          type='radio'
                          name='video-request-tier'
                          value={tierId}
                          checked={isSelected}
                          onChange={() => setTier(tierId)}
                          className='sr-only'
                        />
                        {t(`tiers.${tierId}`)}
                      </label>
                    );
                  })}
                </div>
                <p className='text-[13px] leading-5 text-ink/50'>
                  {t.rich('tierHint', {
                    pricing: (chunks) => (
                      <Link
                        href='/preise#plaene'
                        className='font-semibold text-primary underline underline-offset-2'>
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              </fieldset>

              <div className='space-y-2'>
                <label
                  className='block text-sm font-semibold text-ink'
                  htmlFor='video-request-message'>
                  {t('messageLabel')}{' '}
                  <span className='font-normal text-ink/50'>
                    {t('optional')}
                  </span>
                </label>
                <textarea
                  id='video-request-message'
                  name='message'
                  rows={4}
                  maxLength={VIDEO_REQUEST_MAX_MESSAGE_LENGTH}
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
                    title={tCommon('privacyLinkTitle')}
                    className='font-semibold text-primary underline underline-offset-2'>
                    {t('privacyLink')}
                  </Link>{' '}
                  {t('privacySuffix')}
                </span>
              </label>

              <Button
                type='submit'
                disabled={requestMutation.isPending || !isFormValid}
                className='inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-display text-sm font-bold text-white shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.98] disabled:pointer-events-none disabled:bg-ink/10 disabled:text-ink/40'>
                <Send className='size-4' />
                {requestMutation.isPending ? t('pending') : t('button')}
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
