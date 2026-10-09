import { useMutation } from '@tanstack/react-query';
import { apiErrorFrom } from '@/lib/api-errors';
import type {
  VideoRequestSourceId,
  VideoRequestTierId,
} from '@/features/video-anfrage/data/video-request-content';

interface VideoRequestData {
  name: string;
  /** The address the Statix account runs on — the allowlist is keyed by it. */
  email: string;
  /** Optional — squad and club, so the team knows who is asking. */
  team?: string;
  tier: VideoRequestTierId;
  /** Optional — how they film, what they want from the video. */
  message?: string;
  /** The page the request button sat on, if known. */
  source?: VideoRequestSourceId | '';
  acceptPrivacy: boolean;
  website?: string; // Honeypot field
}

interface VideoRequestResponse {
  success: boolean;
  message?: string;
  /** German sentence for the log; the browser renders `code` instead. */
  error?: string;
  code?: string;
}

const submitVideoRequest = async (
  data: VideoRequestData,
): Promise<VideoRequestResponse> => {
  const response = await fetch('/api/video-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw apiErrorFrom(result, 'Fehler beim Senden der Anfrage');
  }

  return result;
};

export function useVideoRequest() {
  return useMutation({
    mutationFn: submitVideoRequest,
  });
}
