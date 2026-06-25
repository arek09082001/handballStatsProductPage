import React from 'react';
import Image from 'next/image';
import type { TextWithImageSection } from '../../interfaces';

export default function TextWithImageSectionComponent({ section }: { section: TextWithImageSection }) {
    const paragraphs = Array.isArray(section.content) ? section.content : [section.content];
    const isImageRight = section.imagePosition !== 'left';

    return (
        <div
            className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12 ${!isImageRight ? 'lg:flex-row-reverse' : ''}`}
        >
            <div className="flex-1 space-y-4">
                {paragraphs.map((text, i) => (
                    <p key={i} className="text-lg leading-8 text-slate-700 dark:text-slate-300">
                        {text}
                    </p>
                ))}
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl lg:w-[45%] lg:flex-shrink-0">
                <Image
                    src={section.image}
                    alt={section.imageAlt || section.title || 'Illustration zum Seitenabschnitt'}
                    title={section.imageAlt || section.title || 'Illustration zum Seitenabschnitt'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                />
            </div>
        </div>
    );
}
