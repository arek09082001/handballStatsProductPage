import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Website für Startups in Recklinghausen | Professionelle Webentwicklung",
    description: "Starte durch mit einer modernen Website für dein Startup in Recklinghausen. Wir bieten individuelle Webdesign-Lösungen für Gründer und junge Unternehmen.",
    keywords: [
        "Website Recklinghausen",
        "Startup Webdesign",
        "Webentwicklung Recklinghausen",
        "Gründer Website",
        "Startup Homepage Recklinghausen"
    ]
};

export default function WebsiteFuerStartupPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="mb-4 text-center text-3xl font-bold md:text-left">Website für dein Startup in Recklinghausen</h1>
            <p className="mb-6">
                Du hast ein Startup in Recklinghausen und möchtest mit einer professionellen Website durchstarten? Wir unterstützen Gründer und junge Unternehmen mit modernen, performanten und suchmaschinenoptimierten Webseiten.
            </p>
            <h2 className="mb-2 text-center text-2xl font-semibold md:text-left">Warum eine eigene Website für dein Startup?</h2>
            <ul className="list-disc ml-6 mb-6">
                <li>Erreiche mehr Kunden in Recklinghausen und Umgebung</li>
                <li>Präsentiere deine Geschäftsidee professionell</li>
                <li>Wachse digital und gewinne Investoren</li>
                <li>Individuelles Design, das zu deinem Startup passt</li>
            </ul>
            <h2 className="mb-2 text-center text-2xl font-semibold md:text-left">Unsere Leistungen</h2>
            <ul className="list-disc ml-6 mb-6">
                <li>Modernes Webdesign & Entwicklung</li>
                <li>SEO-Optimierung für Recklinghausen</li>
                <li>Responsive Design für alle Geräte</li>
                <li>Beratung & Support für Startups</li>
            </ul>
            <p>Starte jetzt durch und sichere dir ein unverbindliches Beratungsgespräch!</p>
        </main>
    );
}
