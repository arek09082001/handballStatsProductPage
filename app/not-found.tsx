'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, BriefcaseBusiness, ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import ContactDialog from '@/components/custom-ui/contact-dialog';

export default function NotFound() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-slate-950 px-4 py-16 text-white'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.25),transparent_45%),radial-gradient(circle_at_80%_15%,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.2),transparent_40%)]' />
      <div className='relative mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-3xl items-center justify-center'>
        <motion.div
          className='w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_30px_90px_-35px_rgba(56,189,248,0.5)] backdrop-blur-xl md:p-12'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <div className='mb-8'>
            <motion.h1
              className='text-[120px] font-black leading-none tracking-[-0.06em] text-cyan-300 sm:text-[180px]'
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
              Die angeforderte URL passt nicht zur aktuellen Website-Struktur von Arkadiusz Weiss Webdesign.
              Nutzen Sie die Schnellzugriffe, um direkt zu den wichtigsten Bereichen zu gelangen.
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
              className='w-full bg-cyan-400 text-slate-950 hover:bg-cyan-300 sm:w-auto'>
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
              <Link href='/leistungen' title='Leistungen ansehen' className='flex items-center gap-2'>
                <BriefcaseBusiness className='size-5' />
                Leistungen ansehen
              </Link>
            </Button>
          </motion.div>

          <motion.div
            className='mt-12 border-t border-white/10 pt-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}>
            <p className='mb-4 text-sm text-slate-300'>
              Beliebte Ziele:
            </p>
            <div className='flex flex-wrap gap-3 justify-center'>
              <Button asChild variant='ghost' size='sm' className='text-slate-100 hover:bg-white/10 hover:text-white'>
                <Link href='/unternehmen' title='Zur Unternehmensseite'>Unternehmen</Link>
              </Button>
              <Button asChild variant='ghost' size='sm' className='text-slate-100 hover:bg-white/10 hover:text-white'>
                <Link href='/kontakt' title='Zur Kontaktseite'>Kontakt</Link>
              </Button>
              <Button asChild variant='ghost' size='sm' className='text-slate-100 hover:bg-white/10 hover:text-white'>
                <Link href='/leistungen' title='Zur Leistungsseite'>Leistungen</Link>
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
              <ArrowLeft className='size-4 mr-2' />
              Zurück zur vorherigen Seite
            </Button>
            <ContactDialog defaultSubject='Projektanfrage' title='Projekt anfragen'>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='ml-2 text-slate-300 hover:bg-white/10 hover:text-white'>
                <Mail className='size-4' />
                Projekt anfragen
              </Button>
            </ContactDialog>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
