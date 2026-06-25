import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ContactDialog from '@/components/custom-ui/contact-dialog';
import type { CTASection } from '../../interfaces';

export default function CTASectionComponent({ section }: { section: CTASection }) {
    const primaryHref = section.primaryButton?.href || '#final-cta';
    const primaryLabel = section.primaryButton?.label || 'Jetzt Kontakt aufnehmen';
    const isPrimaryFinalCta = primaryHref.startsWith('#final-cta');
    const isSecondaryFinalCta = section.secondaryButton?.href.startsWith('#final-cta');

    return (
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-center text-white sm:p-12">
            {section.title && (
                <h2 className="text-2xl font-bold sm:text-3xl">{section.title}</h2>
            )}
            {section.content && (
                <p className="mt-4 text-lg text-blue-100">{section.content}</p>
            )}
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                {isPrimaryFinalCta ? (
                    <ContactDialog defaultSubject={primaryLabel} title={primaryLabel}>
                        <button
                            type="button"
                            className="inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 font-semibold text-blue-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            {primaryLabel}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </ContactDialog>
                ) : (
                    <Link
                        href={primaryHref}
                        title={primaryLabel}
                        className="inline-flex h-12 items-center gap-2 rounded-lg bg-white px-6 font-semibold text-blue-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        {primaryLabel}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                )}
                {section.secondaryButton && (
                    isSecondaryFinalCta ? (
                        <ContactDialog
                            defaultSubject={section.secondaryButton.label}
                            title={section.secondaryButton.label}
                        >
                            <button
                                type="button"
                                className="inline-flex h-12 items-center gap-2 rounded-lg border-2 border-white/30 px-6 font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white/10"
                            >
                                {section.secondaryButton.label}
                            </button>
                        </ContactDialog>
                    ) : (
                        <Link
                            href={section.secondaryButton.href}
                            title={section.secondaryButton.label}
                            className="inline-flex h-12 items-center gap-2 rounded-lg border-2 border-white/30 px-6 font-semibold text-white transition-all duration-200 hover:border-white hover:bg-white/10"
                        >
                            {section.secondaryButton.label}
                        </Link>
                    )
                )}
            </div>
        </div>
    );
}
