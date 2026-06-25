import React from 'react';
import type { FAQSection } from '../../interfaces';

export default function FAQSectionComponent({ section }: { section: FAQSection }) {
    return (
        <div className="space-y-4">
            {section.content && (
                <p className="mb-6 text-lg leading-8 text-slate-700 dark:text-slate-300">
                    {section.content}
                </p>
            )}
            <div className="grid gap-4">
                {section.items.map((item, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60"
                    >
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {item.question}
                        </h3>
                        <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
                            {item.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}