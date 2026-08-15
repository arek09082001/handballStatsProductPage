import { useMutation } from '@tanstack/react-query';
import type { FeedbackCategoryId } from '@/features/feedback/data/feedback-content';

interface FeedbackData {
  rating: number;
  category: FeedbackCategoryId;
  message: string;
  /** Optional — feedback can be left anonymously. */
  name?: string;
  /** Optional — without it there is no confirmation mail and no reply. */
  email?: string;
  acceptPrivacy: boolean;
  website?: string; // Honeypot field
}

interface FeedbackResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const submitFeedback = async (
  data: FeedbackData
): Promise<FeedbackResponse> => {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Fehler beim Senden des Feedbacks');
  }

  return result;
};

export function useFeedback() {
  return useMutation({
    mutationFn: submitFeedback,
  });
}
