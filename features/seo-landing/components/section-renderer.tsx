import React from 'react';
import type { BlogSection } from '../interfaces';
import TextSectionComponent from './sections/text-section';
import TextWithImageSectionComponent from './sections/text-with-image-section';
import ListSectionComponent from './sections/list-section';
import CardsSectionComponent from './sections/cards-section';
import CTASectionComponent from './sections/cta-section';
import FAQSectionComponent from './sections/faq-section';
import StepsSectionComponent from './sections/steps-section';

interface SectionRendererProps {
    section: BlogSection;
    index: number;
}

function renderSectionContent(section: BlogSection) {
    switch (section.type) {
        case 'text':
            return <TextSectionComponent section={section} />;
        case 'textWithImage':
            return <TextWithImageSectionComponent section={section} />;
        case 'list':
            return <ListSectionComponent section={section} />;
        case 'cards':
            return <CardsSectionComponent section={section} />;
        case 'cta':
            return <CTASectionComponent section={section} />;
        case 'steps':
            return <StepsSectionComponent section={section} />;
        case 'faq':
            return <FAQSectionComponent section={section} />;
        default:
            return null;
    }
}

export default function SectionRenderer({ section, index }: SectionRendererProps) {
    const bgClass = {
        white: 'bg-white',
        light: 'bg-gradient-to-b from-slate-50 to-white',
        dark: 'bg-gradient-to-b from-slate-900 to-slate-950 text-white',
    }[section.backgroundColor || (index % 2 === 0 ? 'white' : 'light')];

    return (
        <section id={section.id} className={`${bgClass} py-16 md:py-24`}>
            <div className="mx-auto max-w-4xl px-6 sm:px-10">
                {/* CTA-Sections bringen ihr eigenes Layout mit */}
                {section.type !== 'cta' && (section.title || section.subtitle) && (
                    <div className="mb-12 text-center md:text-left">
                        {section.subtitle && (
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
                                {section.subtitle}
                            </p>
                        )}
                        {section.title && (
                            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-900 dark:text-white sm:text-4xl">
                                {section.title}
                            </h2>
                        )}
                    </div>
                )}
                {renderSectionContent(section)}
            </div>
        </section>
    );
}
