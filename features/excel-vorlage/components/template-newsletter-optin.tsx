'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AlertCircle, Check, Mail } from 'lucide-react';
import { useNewsletter } from '@/lib/hooks/use-newsletter';

/**
 * Optional newsletter sign-up beside the template download.
 *
 * Legal note (Kopplungsverbot, § 7 UWG): the download must never depend on
 * this form. It sits next to the download button, both checkboxes start
 * unchecked, and nothing here gates the file — the download link works with
 * this form untouched. Sign-up itself stays double opt-in via
 * `app/api/newsletter/route.ts`.
 * @returns A JSX element rendering the optional newsletter form.
 */
export default function TemplateNewsletterOptin() {
  const newsletterMutation = useNewsletter();

  const [email, setEmail] = useState('');
  const [wantsNewsletter, setWantsNewsletter] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  // Honeypot
  const [website, setWebsite] = useState('');

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormValid = isValidEmail && wantsNewsletter && acceptPrivacy;

  const errorMessage = validationError
    ? validationError
    : newsletterMutation.isError
      ? newsletterMutation.error?.message || 'Das hat leider nicht geklappt.'
      : null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);

    if (!isValidEmail) {
      setValidationError('Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }

    if (!wantsNewsletter || !acceptPrivacy) {
      setValidationError(
        'Für den Newsletter brauche ich beide Häkchen. Die Vorlage bekommst du auch ohne.',
      );
      return;
    }

    newsletterMutation.mutate(
      { email: email.trim(), acceptPrivacy, website },
      {
        onSuccess: () => {
          setEmail('');
          setWantsNewsletter(false);
          setAcceptPrivacy(false);
        },
      },
    );
  };

  if (newsletterMutation.isSuccess) {
    return (
      <div className='flex items-start gap-3 rounded-xl border border-success/40 bg-success/10 p-4 text-left'>
        <span className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-success'>
          <Check className='size-3' strokeWidth={3} />
        </span>
        <p className='text-sm leading-6 text-chalk/85'>
          Fast geschafft: Ich habe dir eine Bestätigungs-E-Mail geschickt. Erst
          mit dem Klick darin bist du eingetragen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='text-left'>
      <p className='text-sm font-semibold text-chalk'>Optional: Updates per Mail</p>
      <p className='mt-1 text-[13px] leading-6 text-chalk/65'>
        Kein Pflichtfeld für den Download – die Vorlage bekommst du ohne alles.
      </p>

      <label className='sr-only' htmlFor='template-newsletter-email'>
        E-Mail-Adresse
      </label>
      <div className='relative mt-3'>
        <Mail className='pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-chalk/40' />
        <input
          id='template-newsletter-email'
          name='email'
          type='email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder='deine@mail.de'
          className='h-11 w-full rounded-xl border border-chalk/15 bg-court pl-10 pr-3.5 text-sm text-chalk outline-none transition-all duration-200 placeholder:text-chalk/50 hover:border-chalk/25 focus:border-primary focus:ring-2 focus:ring-primary/30'
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

      <label className='mt-3 flex items-start gap-3 text-[13px] leading-6 text-chalk/75'>
        <input
          type='checkbox'
          checked={wantsNewsletter}
          onChange={(event) => setWantsNewsletter(event.target.checked)}
          className='mt-1 size-4 rounded border-chalk/25 bg-transparent text-primary focus:ring-primary'
        />
        <span>Ja, schick mir den Statix-Newsletter mit Neuigkeiten zur App.</span>
      </label>

      <label className='mt-2 flex items-start gap-3 text-[13px] leading-6 text-chalk/75'>
        <input
          type='checkbox'
          checked={acceptPrivacy}
          onChange={(event) => setAcceptPrivacy(event.target.checked)}
          className='mt-1 size-4 rounded border-chalk/25 bg-transparent text-primary focus:ring-primary'
        />
        <span>
          Ich habe die{' '}
          <Link
            href='/impressum'
            title='Zum Impressum und den Datenschutzbestimmungen'
            className='font-semibold text-primary underline underline-offset-2'>
            Datenschutzhinweise
          </Link>{' '}
          gelesen. Abmeldung jederzeit möglich.
        </span>
      </label>

      <button
        type='submit'
        disabled={newsletterMutation.isPending || !isFormValid}
        className='mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl border border-chalk/30 bg-chalk/5 px-4 font-display text-sm font-bold text-chalk transition-all duration-200 hover:border-chalk/50 hover:bg-chalk/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-court disabled:pointer-events-none disabled:border-chalk/10 disabled:text-chalk/40'>
        {newsletterMutation.isPending ? 'Wird gesendet …' : 'Eintragen'}
      </button>

      {errorMessage && (
        <div
          role='alert'
          className='mt-3 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm leading-5 text-red-200'>
          <AlertCircle className='mt-0.5 size-4 shrink-0' />
          <span>{errorMessage}</span>
        </div>
      )}
    </form>
  );
}
