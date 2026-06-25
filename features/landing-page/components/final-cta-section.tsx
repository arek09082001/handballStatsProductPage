'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { useContactForm } from '@/lib/hooks/use-contact-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type RequestType = 'project' | 'analysis';
type RequestTypeEvent = CustomEvent<{ requestType: RequestType }>;
type SuggestionKey = 'benefit1' | 'benefit2' | 'benefit3';

export default function FinalCTASection() {
  const t = useTranslations('finalCtaSection');
  const searchParams = useSearchParams();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const websiteInputRef = useRef<HTMLInputElement>(null);
  const messageTextareaRef = useRef<HTMLTextAreaElement>(null);
  const contactMutation = useContactForm();
  const [requestType, setRequestType] = useState<RequestType>('analysis');
  const [activeSuggestion, setActiveSuggestion] = useState<SuggestionKey | null>(null);
  const [lastInsertedTemplate, setLastInsertedTemplate] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    websiteUrl: '',
    phone: '',
    message: '',
    acceptPrivacy: false,
  });

  const requestOptions: Array<{ key: RequestType; label: string }> = [
    { key: 'project', label: t('projectOption') },
    { key: 'analysis', label: t('analysisOption') },
  ];

  const suggestions: Array<{ key: SuggestionKey; label: string }> = [
    { key: 'benefit1', label: t('benefit1') },
    { key: 'benefit2', label: t('benefit2') },
    { key: 'benefit3', label: t('benefit3') },
  ];

  const isAnalysisRequest = requestType === 'analysis';
  const fieldClassName =
    'h-11 w-full rounded-lg border border-white/12 bg-white/8 px-3.5 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-white/20 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20';
  const textareaClassName =
    'min-h-[132px] w-full rounded-lg border border-white/12 bg-white/8 px-3.5 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-white/20 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20';

  const focusFirstInput = () => {
    window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 450);
  };

  const focusMessageTextarea = (delay = 50) => {
    window.setTimeout(() => {
      messageTextareaRef.current?.focus();
      messageTextareaRef.current?.setSelectionRange(
        messageTextareaRef.current.value.length,
        messageTextareaRef.current.value.length
      );
    }, delay);
  };

  const scrollToFormOnMobile = () => {
    if (!window.matchMedia('(max-width: 1023px)').matches) {
      return;
    }

    window.setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 80);
  };

  const getTemplateForSuggestion = (suggestionKey: SuggestionKey, type: RequestType) => {
    const templateKey = `${suggestionKey}Template${type === 'project' ? 'Project' : 'Analysis'}`;

    return t(templateKey as Parameters<typeof t>[0]);
  };

  const hasValidContactOption =
    formData.phone.trim().length > 0 ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());

  const isFormValid = Boolean(
    formData.name.trim().length >= 2 &&
    formData.message.trim().length >= 10 &&
    hasValidContactOption &&
    formData.acceptPrivacy &&
    (!isAnalysisRequest || formData.websiteUrl.trim())
  );

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((current) => ({
      ...current,
      acceptPrivacy: event.target.checked,
    }));
  };

  const handleSuggestionClick = (suggestionKey: SuggestionKey) => {
    const nextTemplate = getTemplateForSuggestion(suggestionKey, requestType);

    setActiveSuggestion(suggestionKey);
    setLastInsertedTemplate(nextTemplate);
    setFormData((current) => {
      const currentMessage = current.message.trim();
      const shouldReplaceMessage = !currentMessage || current.message === lastInsertedTemplate;

      return {
        ...current,
        message: shouldReplaceMessage
          ? nextTemplate
          : `${currentMessage}\n\n${nextTemplate}`,
      };
    });

    scrollToFormOnMobile();
    focusMessageTextarea(280);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    contactMutation.mutate(
      {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        topic:
          requestType === 'project'
            ? t('projectSubject')
            : t('analysisSubject'),
        message: formData.message.trim(),
        website: '',
        websiteUrl: formData.websiteUrl.trim() || undefined,
        acceptPrivacy: formData.acceptPrivacy,
      },
      {
        onSuccess: () => {
          setFormData({
            name: '',
            email: '',
            websiteUrl: '',
            phone: '',
            message: '',
            acceptPrivacy: false,
          });
          setRequestType('project');
        },
      }
    );
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const requestTypeParam = searchParams.get('requestType');

    if (requestTypeParam !== 'project' && requestTypeParam !== 'analysis') {
      return;
    }

    setRequestType(requestTypeParam);
    focusFirstInput();
  }, [searchParams]);

  useEffect(() => {
    const handleRequestTypeChange = (event: Event) => {
      const customEvent = event as RequestTypeEvent;
      const nextRequestType = customEvent.detail?.requestType;

      if (!nextRequestType) {
        return;
      }

      setRequestType(nextRequestType);
      focusFirstInput();
    };

    window.addEventListener(
      'landing-page:request-type',
      handleRequestTypeChange as EventListener
    );

    return () => {
      window.removeEventListener(
        'landing-page:request-type',
        handleRequestTypeChange as EventListener
      );
    };
  }, []);

  useEffect(() => {
    setActiveSuggestion(null);
    setLastInsertedTemplate('');
  }, [requestType]);

  return (
    <section id='final-cta' ref={sectionRef} className='w-full bg-background py-12 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div
          ref={cardRef}
          className='relative overflow-hidden rounded-[1.75rem] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-7 py-8 shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:px-9 md:px-11 md:py-10'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(52,104,245,0.22),transparent_45%)]' />

          <div className='relative grid gap-8 lg:grid-cols-[1.25fr_0.8fr] lg:items-start lg:gap-10'>
            <div className='text-center text-white lg:text-left'>
              <h2 className='mx-auto max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:mx-0'>
                {t('title')}
              </h2>
              <p className='mx-auto mt-4 max-w-lg text-base leading-7 text-slate-300 sm:text-lg lg:mx-0'>
                {t('description')}
              </p>

              <div className='mt-3 flex items-center justify-center gap-2 text-sm text-sky-200 lg:justify-start'>
                <Sparkles className='h-4 w-4' />
                <span>{t('suggestionHint')}</span>
              </div>

              <div className='mt-7 grid gap-3 sm:mx-auto sm:max-w-md lg:mx-0'>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.key}
                    type='button'
                    onClick={() => handleSuggestionClick(suggestion.key)}
                    className={cn(
                      'rounded-2xl border px-4 py-3 text-left text-sm backdrop-blur-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                      activeSuggestion === suggestion.key
                        ? 'border-sky-400/70 bg-sky-400/12 text-white shadow-[0_12px_32px_rgba(56,189,248,0.18)]'
                        : 'border-white/10 bg-white/5 text-background hover:border-white/20 hover:bg-white/8'
                    )}>
                    <span className='block'>{suggestion.label}</span>
                    <span className='mt-2 block text-xs text-slate-300'>
                      {requestType === 'project'
                        ? t('insertProjectTemplate')
                        : t('insertAnalysisTemplate')}
                    </span>
                  </button>
                ))}
              </div>

              <p className='mt-5 text-sm text-slate-300'>{t('socialProof')}</p>
            </div>

            <div
              id='final-cta-form'
              className='scroll-mt-28 lg:border-l lg:border-white/10 lg:pl-8 xl:pl-10'>
              <p className='text-2xl font-bold tracking-tight text-white'>
                {t('formTitle')}
              </p>

              <div className='mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2'>
                {requestOptions.map((option) => (
                  <Button
                    key={option.key}
                    type='button'
                    onClick={() => setRequestType(option.key)}
                    className={cn(
                      'inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/25 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
                      requestType === option.key
                        ? 'border-sky-400 bg-sky-400 text-background shadow-[0_10px_30px_rgba(56,189,248,0.2)]'
                        : 'border-white/12 bg-white/6 text-background hover:border-white/20 hover:bg-white/10'
                    )}>
                    {option.label}
                  </Button>
                ))}
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className='mt-5 space-y-3.5'>
                <label className='sr-only' htmlFor='cta-name'>
                  {t('nameLabel')}
                </label>
                <input
                  id='cta-name'
                  ref={nameInputRef}
                  name='name'
                  type='text'
                  required
                  minLength={2}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('namePlaceholder')}
                  className={fieldClassName}
                />

                <label className='sr-only' htmlFor='cta-email'>
                  {t('emailLabel')}
                </label>
                <input
                  id='cta-email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('emailPlaceholder')}
                  className={fieldClassName}
                />

                <label className='sr-only' htmlFor='cta-website'>
                  {t('websiteLabel')}
                </label>
                <input
                  id='cta-website'
                  ref={websiteInputRef}
                  name='websiteUrl'
                  type='text'
                  required={isAnalysisRequest}
                  aria-required={isAnalysisRequest}
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  placeholder={
                    isAnalysisRequest
                      ? t('analysisWebsitePlaceholder')
                      : t('websitePlaceholder')
                  }
                  className={fieldClassName}
                />
                <label className='sr-only' htmlFor='cta-phone'>
                  {t('phoneLabel')}
                </label>
                <input
                  id='cta-phone'
                  name='phone'
                  type='tel'
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('phonePlaceholder')}
                  className={fieldClassName}
                />

                <label className='sr-only' htmlFor='cta-message'>
                  {t('messageLabel')}
                </label>
                <textarea
                  id='cta-message'
                  ref={messageTextareaRef}
                  name='message'
                  required
                  minLength={10}
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={
                    requestType === 'project'
                      ? t('projectMessagePlaceholder')
                      : t('analysisMessagePlaceholder')
                  }
                  className={textareaClassName}
                />

                <label className='flex items-start gap-3 rounded-lg border border-white/12 bg-white/6 px-3.5 py-3 text-sm leading-6 text-slate-200'>
                  <input
                    name='acceptPrivacy'
                    type='checkbox'
                    checked={formData.acceptPrivacy}
                    onChange={handlePrivacyChange}
                    className='mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-sky-400 focus:ring-sky-400'
                  />
                  <span>
                    {t('privacyPrefix')}{' '}
                    <Link href='/impressum' title='Zum Impressum und den Datenschutzbestimmungen' className='font-semibold text-sky-300 underline underline-offset-2'>
                      {t('privacyLink')}
                    </Link>{' '}
                    {t('privacySuffix')}
                  </span>
                </label>

                <Button
                  type='submit'
                  disabled={contactMutation.isPending || !isFormValid}
                  className='mt-2 inline-flex h-12 w-full items-center justify-center rounded-lg bg-green-500 px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300/60 focus-visible:ring-offset-2 active:scale-[0.98]'>
                  {contactMutation.isPending
                    ? t('submitPending')
                    : requestType === 'project'
                      ? t('submitProject')
                      : t('submitAnalysis')}
                </Button>

                <p className='text-xs leading-5 text-slate-300'>
                  {t('responseNote')}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}