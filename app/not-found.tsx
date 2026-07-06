'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-[#0b1220] px-4 py-16 text-white'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.28),transparent_45%),radial-gradient(circle_at_80%_15%,rgba(37,99,235,0.22),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(249,115,22,0.18),transparent_40%)]' />
      <div className='relative mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-3xl items-center justify-center'>
        <motion.div
          className='w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_30px_90px_-35px_rgba(249,115,22,0.5)] backdrop-blur-xl md:p-12'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <div className='mb-8'>
            <motion.h1
              className='text-[120px] font-black leading-none tracking-[-0.06em] text-[#fdba74] sm:text-[180px]'
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}>
              404
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Diese Seite existiert nicht
            </h2>
            <p className='mx-auto mb-10 max-w-xl text-base leading-relaxed text-slate-200 md:text-lg'>
              Die angeforderte Seite konnten wir nicht finden. Spring zurück zur
              Startseite und entdecke, wie Statix dein Team besser macht.
            </p>
          </motion.div>

          <motion.div
            className='flex flex-col items-center justify-center gap-4 sm:flex-row'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}>
            <Button
              asChild
              size='lg'
              className='w-full bg-[#f97316] text-white hover:bg-[#ea580c] sm:w-auto'>
              <Link href='/' title='Zur Startseite' className='flex items-center gap-2'>
                <Home className='size-5' />
                Zur Startseite
              </Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='w-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto'>
              <Link href='/#newsletter' title='In den Newsletter eintragen' className='flex items-center gap-2'>
                <Rocket className='size-5' />
                Newsletter
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className='mt-12 border-t border-white/10 pt-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}>
            <p className='mb-4 text-sm text-slate-300'>Beliebte Ziele:</p>
            <div className='flex flex-wrap justify-center gap-3'>
              <Button asChild variant='ghost' size='sm' className='text-slate-100 hover:bg-white/10 hover:text-white'>
                <Link href='/#features' title='Funktionen ansehen'>Funktionen</Link>
              </Button>
              <Button asChild variant='ghost' size='sm' className='text-slate-100 hover:bg-white/10 hover:text-white'>
                <Link href='/#faq' title='Häufige Fragen'>FAQ</Link>
              </Button>
              <Button asChild variant='ghost' size='sm' className='text-slate-100 hover:bg-white/10 hover:text-white'>
                <Link href='/impressum' title='Zum Impressum'>Impressum</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className='mt-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => window.history.back()}
              className='text-slate-300 hover:bg-white/10 hover:text-white'>
              <ArrowLeft className='mr-2 size-4' />
              Zurück zur vorherigen Seite
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
