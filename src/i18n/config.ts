export const LOCALES = ['en', 'vi'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'vi'

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

export const hasLocale = (value: string): value is Locale => LOCALES.includes(value as Locale)

export const normalizeLocale = (value: string | null | undefined): Locale | null => {
  if (!value) return null

  const normalized = value.toLowerCase()

  if (hasLocale(normalized)) return normalized

  const languageCode = normalized.split('-')[0]
  return hasLocale(languageCode) ? languageCode : null
}

export const getLocaleDisplayName = (locale: Locale): string => {
  const localeLabelMap: Record<Locale, string> = {
    en: 'English',
    vi: 'Tiếng Việt',
  }

  return localeLabelMap[locale]
}

export const getTextDirection = (): 'ltr' | 'rtl' => 'ltr'
