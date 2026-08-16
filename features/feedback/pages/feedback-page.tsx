import FeedbackHeader from '../components/feedback-header';
import FeedbackFormSection from '../components/feedback-form-section';

/**
 * Feedback page `/feedback`. The contact route answers questions; this one
 * collects opinions — a rating, the area it belongs to and the message — and
 * mails the summary to the team address, so product feedback no longer arrives
 * disguised as a support request.
 * @returns A JSX element composing the feedback header and the form band.
 */
export default function FeedbackPage() {
  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <FeedbackHeader />
      <FeedbackFormSection />
    </div>
  );
}
