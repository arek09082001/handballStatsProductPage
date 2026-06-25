import React from 'react';
import type { TextSection } from '../../interfaces';

export default function TextSectionComponent({ section }: { section: TextSection }) {
    const paragraphs = Array.isArray(section.content) ? section.content : [section.content];

    return (
        <div className="space-y-4">
            {paragraphs.map((text, i) => (
                <p
                    key={i}
                    className={`text-lg leading-8 ${i > 0 ? 'text-slate-600 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                    {text}
                </p>
            ))}
        </div>
    );
}
