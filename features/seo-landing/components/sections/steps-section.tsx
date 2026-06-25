import React from 'react';
import type { StepsSection } from '../../interfaces';

export default function StepsSectionComponent({ section }: { section: StepsSection }) {
    return (
        <div className="space-y-6">
            {section.content && (
                <p className="mb-6 text-lg leading-8 text-slate-700 dark:text-slate-300">
                    {section.content}
                </p>
            )}
            {section.steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                        {i + 1}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                        <p className="mt-1 text-slate-600 dark:text-slate-400">{step.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
