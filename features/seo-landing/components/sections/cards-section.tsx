import React from 'react';
import {
    Code, Target, LineChart, Users, Zap, Shield,
    Globe, Search, Rocket, Star, Phone, CheckCircle2,
} from 'lucide-react';
import type { CardsSection, IconName } from '../../interfaces';

const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
    code: Code,
    target: Target,
    chart: LineChart,
    users: Users,
    zap: Zap,
    shield: Shield,
    globe: Globe,
    search: Search,
    rocket: Rocket,
    star: Star,
    phone: Phone,
    check: CheckCircle2,
};

export default function CardsSectionComponent({ section }: { section: CardsSection }) {
    const cols = section.columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2';

    return (
        <div className="space-y-6">
            {section.content && (
                <p className="mb-6 text-lg leading-8 text-slate-700 dark:text-slate-300">
                    {section.content}
                </p>
            )}
            <div className={`grid gap-6 ${cols}`}>
                {section.cards.map((card, i) => {
                    const Icon = card.icon ? iconMap[card.icon] : null;
                    return (
                        <div
                            key={i}
                            className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/30"
                        >
                            {Icon && <Icon className="mb-3 h-8 w-8 text-blue-600 dark:text-blue-400" />}
                            <h3 className="font-semibold text-slate-900 dark:text-white">{card.title}</h3>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{card.description}</p>
                            {card.items && card.items.length > 0 && (
                                <ul className="mt-3 space-y-1">
                                    {card.items.map((line, j) => (
                                        <li
                                            key={j}
                                            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                                        >
                                            <span className="font-bold text-blue-600 dark:text-blue-400">•</span>
                                            {line}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
