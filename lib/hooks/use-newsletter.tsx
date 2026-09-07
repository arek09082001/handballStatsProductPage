import { useMutation } from '@tanstack/react-query';
import { apiErrorFrom } from '@/lib/api-errors';

interface NewsletterData {
  email: string;
  acceptPrivacy: boolean;
  website?: string; // Honeypot field
}

interface NewsletterResponse {
  success: boolean;
  message?: string;
  /** German sentence for the log; the browser renders `code` instead. */
  error?: string;
  code?: string;
}

const submitNewsletter = async (
  data: NewsletterData,
): Promise<NewsletterResponse> => {
  const response = await fetch('/api/newsletter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw apiErrorFrom(result, 'Fehler bei der Anmeldung');
  }

  return result;
};

export function useNewsletter() {
  return useMutation({
    mutationFn: submitNewsletter,
  });
}
