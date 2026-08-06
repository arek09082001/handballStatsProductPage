import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import ErfahrungenHeader from '../components/erfahrungen-header';
import TestimonialList from '../components/testimonial-list';
import ErfahrungenStory from '../components/erfahrungen-story';
import FeedbackLoop from '../components/feedback-loop';
import { ERFAHRUNGEN_FAQS } from '../data/erfahrungen-content';

/**
 * Experiences page `/erfahrungen`. While `TESTIMONIALS` is empty this is an
 * honest "so entsteht Statix" page: who builds it, how feedback from the hall
 * becomes features, and an invitation to contribute one. Real quotes appear
 * automatically once they exist in the data module.
 * @returns A JSX element composing the ordered experiences sections.
 */
export default function ErfahrungenPage() {
  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <ErfahrungenHeader />
      <TestimonialList />
      <ErfahrungenStory />
      <FeedbackLoop />
      <BoardFaq
        id='faq'
        kicker='Nachgefragt'
        title='Häufige Fragen zu Erfahrungen mit Statix'
        description='Warum hier keine Sternebewertungen stehen – und wie du dir trotzdem ein Urteil bildest.'
        items={ERFAHRUNGEN_FAQS}
      />
      <BoardCta
        kicker='Eigenes Urteil'
        title='Die ehrlichste Erfahrung ist deine eigene'
        description='Zwei Minuten mit echten Spieldaten sagen dir mehr als jede fremde Bewertung: kostenlos registrieren und selbst erfassen – oder erst in der Live-Demo ohne Account reinschauen.'
        linkHref='/was-ist-statix'
        linkLabel='Was ist Statix?'
      />
    </div>
  );
}
