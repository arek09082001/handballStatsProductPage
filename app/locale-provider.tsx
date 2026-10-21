'use client';

import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import deMessages from '@/messages/de.json';
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
const loadMessages: Record<AppLocale, () => Promise<typeof deMessages>> = {
    de: async () => deMessages,
    en: async () => (await import('@/messages/en.json')).default,
    es: async () => (await import('@/messages/es.json')).default,
    fr: async () => (await import('@/messages/fr.json')).default,
    pl: async () => (await import('@/messages/pl.json')).default,
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
    const [messages, setMessages] = useState(deMessages);
    const requestId = useRef(0);

    const setLocale = useCallback(async (nextLocale: AppLocale) => {
        const request = ++requestId.current;
        if (nextLocale === locale) {
            return;
        }

        let nextMessages: typeof deMessages;
        try {
            nextMessages = await loadMessages[nextLocale]();
        } catch (error) {
            console.error('Unable to load the selected language', error);
            return;
        }
        if (request !== requestId.current) return;
        const currentScrollY = window.scrollY;

        startTransition(() => {
            setLocaleState(nextLocale);
            setMessages(nextMessages);
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
            <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Berlin">
                {children}
            </NextIntlClientProvider>
        </LocaleContext.Provider>
    );
}
