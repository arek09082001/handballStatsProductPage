import ContactHeader from '../components/contact-header';
import ContactFormSection from '../components/contact-form-section';

/**
 * Contact page `/kontakt`. The form used to live as the second-to-last band of
 * the landing page, directly ahead of the closing registration CTA — a
 * four-field form standing between a convinced visitor and the button. It has
 * its own route now: court header with the direct e-mail, paper band with the
 * form.
 * @returns A JSX element composing the contact header and the form band.
 */
export default function KontaktPage() {
  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <ContactHeader />
      <ContactFormSection />
    </div>
  );
}
