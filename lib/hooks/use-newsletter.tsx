import { useMutation } from '@tanstack/react-query';

interface NewsletterData {
  email: string;
  acceptPrivacy: boolean;
  website?: string; // Honeypot field
}

interface NewsletterResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const submitNewsletter = async (
  data: NewsletterData
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
    throw new Error(result.error || 'Fehler bei der Anmeldung');
  }

  return result;
};

export function useNewsletter() {
  return useMutation({
    mutationFn: submitNewsletter,
  });
}
