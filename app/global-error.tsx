'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang='de'>
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backgroundColor: '#f9fafb',
          }}>
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              textAlign: 'center',
            }}>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#111827',
              }}>
              Ein kritischer Fehler ist aufgetreten
            </h2>
            <p
              style={{
                fontSize: '1rem',
                marginBottom: '2rem',
                color: '#6b7280',
              }}>
              Bitte laden Sie die Seite neu oder kehren Sie zur Startseite zurück.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}>
                Erneut versuchen
              </button>
              <a
                href='/'
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'white',
                  color: '#111827',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '1rem',
                }}>
                Zur Startseite
              </a>
            </div>
            {error.digest && (
              <p
                style={{
                  marginTop: '2rem',
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                }}>
                Fehler-ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
