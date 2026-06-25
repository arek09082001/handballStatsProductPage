import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { ListSection } from '../../interfaces';

export default function ListSectionComponent({ section }: { section: ListSection }) {
    return (
        <div className="space-y-4">
            {section.content && (
                <p className="mb-6 text-lg leading-8 text-slate-700 dark:text-slate-300">
                    {section.content}
                </p>
            )}
            <ul className="space-y-4 pl-0">
                {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
