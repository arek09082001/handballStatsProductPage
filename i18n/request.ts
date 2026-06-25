import { getRequestConfig } from 'next-intl/server';
import deMessages from '@/messages/de.json';
import { DEFAULT_LOCALE } from './config';

export default getRequestConfig(async () => ({
    locale: DEFAULT_LOCALE,
    messages: deMessages,
    timeZone: 'Europe/Berlin',
}));