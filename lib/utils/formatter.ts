import {
  format,
  formatDistanceToNow,
  formatDuration,
  type Locale,
} from 'date-fns';
import { enUS, de } from 'date-fns/locale';

export default class Formatter {
  private static getLocale(locale: string): Locale {
    const locales: Record<string, Locale> = {
      en: enUS,
      de,
    };

    return locales?.[locale] ?? de;
  }

  public static formatTime(
    pTime: Date,
    pFormatType?: 'long' | 'short'
  ): string {
    const userLocale = 'de';
    const locale = Formatter.getLocale(userLocale);
    const formatString = pFormatType === 'long' ? 'pp' : 'p';
    return format(pTime, formatString, { locale });
  }

  public static formatDate(date: Date, formatType?: 'long' | 'short'): string {
    const userLocale = 'de';
    const locale = Formatter.getLocale(userLocale);
    const formatString = formatType === 'long' ? 'PPPP' : 'P';
    return format(date, formatString, { locale });
  }

  public static formatDateTime(
    pDate: Date,
    formatType?: 'long' | 'short'
  ): string {
    const userLocale = 'de';
    const locale = Formatter.getLocale(userLocale);
    const formatString = formatType === 'long' ? 'P pp' : 'P p';
    return format(pDate, formatString, { locale });
  }

  public static formatRelativeTime = (date: Date): string => {
    const userLocale = 'de';
    const locale = Formatter.getLocale(userLocale);
    return formatDistanceToNow(date, { addSuffix: true, locale });
  };

  public static formatHourDuration(pDuration: number): string {
    const userLocale = 'de';
    const locale = Formatter.getLocale(userLocale);
    const minutes = Math.round(60 * (pDuration % 1));
    const hours = Math.trunc(pDuration);
    return formatDuration(
      { hours, minutes },
      { locale, format: ['hours', 'minutes'] }
    );
  }

  public static formatNumber(value: number, decimals: number = 2): string {
    const userLocale = 'de';
    return new Intl.NumberFormat(userLocale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }
}
