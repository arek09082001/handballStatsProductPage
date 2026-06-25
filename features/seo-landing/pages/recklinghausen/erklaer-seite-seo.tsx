import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "SEO Erklärung für Recklinghausen | Was ist Suchmaschinenoptimierung?",
    description: "Erfahre, wie SEO Unternehmen in Recklinghausen hilft, online besser gefunden zu werden. Tipps und Infos zur Suchmaschinenoptimierung für lokale Firmen.",
    keywords: [
        "SEO Recklinghausen",
        "Suchmaschinenoptimierung Recklinghausen",
        "SEO Erklärung",
        "SEO Tipps Recklinghausen",
        "Lokale SEO Recklinghausen"
    ]
};

export default function SeoErklaerSeitePage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="mb-4 text-center text-3xl font-bold md:text-left">Was ist SEO? Suchmaschinenoptimierung für Recklinghausen erklärt</h1>
            <p className="mb-6">
                SEO steht für Suchmaschinenoptimierung und hilft Unternehmen in Recklinghausen, bei Google & Co. besser gefunden zu werden. Mit gezielten Maßnahmen kannst du mehr Kunden aus deiner Region erreichen.
            </p>
            <h2 className="mb-2 text-center text-2xl font-semibold md:text-left">Warum ist SEO wichtig?</h2>
            <ul className="list-disc ml-6 mb-6">
                <li>Mehr Sichtbarkeit in Suchmaschinen</li>
                <li>Gezielte Ansprache lokaler Kunden</li>
                <li>Wettbewerbsvorteil gegenüber anderen Firmen</li>
                <li>Langfristig mehr Anfragen und Umsatz</li>
            </ul>
            <h2 className="mb-2 text-center text-2xl font-semibold md:text-left">SEO-Tipps für Recklinghausen</h2>
            <ul className="list-disc ml-6 mb-6">
                <li>Optimiere deine Website für lokale Suchbegriffe</li>
                <li>Pflege einen Google My Business Eintrag</li>
                <li>Erstelle hochwertige Inhalte für deine Zielgruppe</li>
                <li>Sammle positive Bewertungen von Kunden</li>
            </ul>
            <p>Du möchtest mehr über SEO erfahren? Kontaktiere uns für eine individuelle Beratung!</p>
        </main>
    );
}
