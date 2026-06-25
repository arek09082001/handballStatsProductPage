'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { BlogSection } from '../interfaces';
import ContactDialog from '@/components/custom-ui/contact-dialog';
import FinalCTASection from '@/features/landing-page/components/final-cta-section';
import HeroActionButton from '@/features/landing-page/components/hero-action-button';
import HeroEyebrowBadge from '@/features/landing-page/components/hero-eyebrow-badge';
import { heroFont } from '@/features/landing-page/components/hero-font';
import HeroTrustBadge from '@/features/landing-page/components/hero-trust-badge';
import SectionRenderer from './section-renderer';

interface BlogPageLayoutProps {
    title: string;
    description?: string;
    sections: BlogSection[];
}

export default function BlogPageLayout({
    title,
    description,
    sections,
}: BlogPageLayoutProps) {
    const t = useTranslations('heroSection');
    const trustItems = [t('trustItem1'), t('trustItem2'), t('trustItem3')];

    const handleAnalysisClick = () => {
        window.dispatchEvent(
            new CustomEvent('landing-page:request-type', {
                detail: { requestType: 'analysis' },
            }),
        );

        document.getElementById('final-cta-form')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });

        window.setTimeout(() => {
            document.getElementById('cta-name')?.focus();
        }, 450);
    };

    return (
        <article className="w-full">
            {/* Hero Section */}
            <section className="relative isolate w-full overflow-hidden bg-muted/40 pt-8 lg:pt-0">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_0%,hsl(var(--primary)/0.14),transparent),radial-gradient(ellipse_40%_40%_at_100%_100%,hsl(var(--success)/0.10),transparent)]" />

                <div className="relative mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col items-center gap-12 px-6 pb-16 pt-8 sm:px-10 lg:flex-row lg:items-center lg:gap-14 lg:py-20 xl:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                        className={`w-full shrink-0 text-center lg:w-[50%] lg:text-left xl:w-[48%] ${heroFont.className}`}>
                        <HeroEyebrowBadge label="Blogartikel" />

                        <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-foreground sm:text-[3.4rem] lg:text-[3.8rem] xl:text-[4.4rem]">
                            {title}
                        </h1>

                        {description && (
                            <p className="mx-auto mt-6 max-w-[560px] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 lg:mx-0">
                                {description}
                            </p>
                        )}

                        <div className="mt-8 flex min-h-[9.5rem] flex-col justify-start sm:min-h-[7rem]">
                            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
                                <ContactDialog
                                    defaultSubject={t('primarySubject')}
                                    title={t('primaryCta')}>
                                    <HeroActionButton variant="primary">
                                        {t('primaryCta')}
                                    </HeroActionButton>
                                </ContactDialog>

                                <HeroActionButton
                                    variant="secondary"
                                    onClick={handleAnalysisClick}>
                                    {t('secondaryCta')}
                                </HeroActionButton>
                            </div>

                            <div className="mt-6 flex min-h-10 flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
                                {trustItems.map((item) => (
                                    <HeroTrustBadge key={item} label={item} />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.75, ease: 'easeOut', delay: 0.1 }}
                        className="relative w-full lg:min-w-0 lg:flex-1">
                        <Image
                            src="/heroImage.png"
                            alt={title}
                            title={title}
                            width={780}
                            height={520}
                            className="h-auto w-full rounded-2xl object-contain drop-shadow-[0_24px_48px_hsl(var(--foreground)/0.16)]"
                            priority
                        />
                    </motion.div>
                </div>
            </section>

            {/* Dynamische Sections */}
            {sections.map((section, index) => (
                <SectionRenderer key={section.id || index} section={section} index={index} />
            ))}

            <FinalCTASection />
        </article>
    );
}

