'use client';

import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import deMessages from '@/messages/de.json';
import enMessages from '@/messages/en.json';
import esMessages from '@/messages/es.json';
import frMessages from '@/messages/fr.json';
import plMessages from '@/messages/pl.json';
import { DEFAULT_LOCALE, getHtmlLang, type AppLocale } from '@/i18n/config';

type LocaleContextValue = {
    locale: AppLocale;
    setLocale: (locale: AppLocale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Typed as a total map over `AppLocale`: a language added to the list without
 * a bundle here would otherwise be offered by the switcher and then render
 * nothing.
 */
const messagesByLocale: Record<AppLocale, typeof deMessages> = {
    de: deMessages,
    en: enMessages,
    es: esMessages,
    fr: frMessages,
    pl: plMessages,
};

export function useAppLocale() {
    const context = useContext(LocaleContext);

    if (!context) {
        throw new Error('useAppLocale must be used within LocaleProvider');
    }

    return context;
}

export default function LocaleProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [locale, setLocaleState] = useState<AppLocale>(DEFAULT_LOCALE);

    const setLocale = useCallback((nextLocale: AppLocale) => {
        if (nextLocale === locale) {
            return;
        }

        const currentScrollY = window.scrollY;

        startTransition(() => {
            setLocaleState(nextLocale);
        });

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                window.scrollTo({
                    top: currentScrollY,
                    left: 0,
                    behavior: 'instant',
                });
            });
        });
    }, [locale]);

    useEffect(() => {
        document.documentElement.lang = getHtmlLang(locale);
    }, [locale]);

    const contextValue = useMemo(
        () => ({
            locale,
            setLocale,
        }),
        [locale, setLocale],
    );

    return (
        <LocaleContext.Provider value={contextValue}>
            <NextIntlClientProvider locale={locale} messages={messagesByLocale[locale]} timeZone="Europe/Berlin">
                {children}
            </NextIntlClientProvider>
        </LocaleContext.Provider>
    );
}