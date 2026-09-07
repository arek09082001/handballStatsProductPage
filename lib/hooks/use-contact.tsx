import { useMutation } from '@tanstack/react-query';
import { apiErrorFrom } from '@/lib/api-errors';

interface ContactData {
  name: string;
  email: string;
  topic: string;
  message: string;
  acceptPrivacy: boolean;
  website?: string; // Honeypot field
}

interface ContactResponse {
  success: boolean;
  message?: string;
  /** German sentence for the log; the browser renders `code` instead. */
  error?: string;
  code?: string;
}

const submitContact = async (data: ContactData): Promise<ContactResponse> => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw apiErrorFrom(result, 'Fehler beim Senden der Nachricht');
  }

  return result;
};

export function useContact() {
  return useMutation({
    mutationFn: submitContact,
  });
}
