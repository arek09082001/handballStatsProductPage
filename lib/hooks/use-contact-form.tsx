import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface ContactFormData {
  name: string;
  email?: string;
  phone?: string;
  topic: string;
  message: string;
  website?: string; // Honeypot field
  websiteUrl?: string;
  acceptPrivacy: boolean;
}

interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
  emailId?: string;
}

const submitContactForm = async (
  data: ContactFormData
): Promise<ContactResponse> => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Fehler beim Senden der Nachricht');
  }

  return result;
};

export function useContactForm() {
  return useMutation({
    mutationFn: submitContactForm,
    onSuccess: (data) => {
      toast.success(data.message || 'Nachricht erfolgreich gesendet!', {
        description: 'Wir werden uns so schnell wie möglich bei Ihnen melden.',
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      // Check if it's a rate limit error
      if (
        error.message.includes('viele Anfragen') ||
        error.message.includes('Limit')
      ) {
        toast.error('Zu viele Anfragen', {
          description: error.message,
          duration: 8000,
        });
      } else if (error.message.includes('Spam')) {
        toast.error('Spam erkannt', {
          description: 'Ihre Anfrage wurde als Spam erkannt.',
          duration: 5000,
        });
      } else {
        toast.error('Fehler beim Senden', {
          description: error.message || 'Bitte versuchen Sie es später erneut.',
          duration: 5000,
        });
      }
    },
  });
}
