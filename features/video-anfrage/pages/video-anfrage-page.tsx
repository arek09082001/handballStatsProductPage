import VideoRequestHeader from '../components/video-request-header';
import VideoRequestFormSection from '../components/video-request-form-section';
import VideoRequestNext from '../components/video-request-next';

/**
 * Video access request `/video-anfrage`. The video area runs as a closed beta
 * and is enabled per account; this route is the one button for getting in,
 * where the site used to say "schreib uns" and leave the visitor to find the
 * contact form. Court header with the honest state of the video, paper band
 * with the form, then what happens after sending.
 * @returns A JSX element composing the request header, the form and the steps.
 */
export default function VideoAnfragePage() {
  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <VideoRequestHeader />
      <VideoRequestFormSection />
      <VideoRequestNext />
    </div>
  );
}
