'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className='min-h-screen bg-muted flex items-center justify-center px-4 py-16'>
      <div className='max-w-2xl w-full text-center'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          {/* Error Icon */}
          <div className='mb-8'>
            <motion.div
              className='inline-block text-red-500'
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}>
              <svg
                className='w-24 h-24 mx-auto'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </motion.div>
          </div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}>
            <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
              Etwas ist schiefgelaufen
            </h2>
            <p className='text-lg text-muted-foreground mb-8 max-w-md mx-auto'>
              Es tut uns leid, aber es ist ein Fehler aufgetreten. Bitte
              versuchen Sie es erneut.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}>
            <Button
              onClick={reset}
              size='lg'
              className='w-full sm:w-auto'>
              <RefreshCw className='size-5 mr-2' />
              Erneut versuchen
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='w-full sm:w-auto'>
              <Link href='/' title='Zur Startseite' className='flex items-center gap-2'>
                <Home className='size-5' />
                Zur Startseite
              </Link>
            </Button>
          </motion.div>

          {/* Additional Info */}
          {error.digest && (
            <motion.div
              className='mt-8 pt-8 border-t border-border'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}>
              <p className='text-xs text-muted-foreground'>
                Fehler-ID: {error.digest}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
