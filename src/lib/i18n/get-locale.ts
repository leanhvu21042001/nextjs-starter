import { cookies, headers } from 'next/headers'

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, type Locale, normalizeLocale } from '@/lib/i18n/config'

export const getRequestLocale = async (): Promise<Locale> => {
  const requestHeaders = await headers()
  const fromHeader = normalizeLocale(requestHeaders.get('x-locale'))

  if (fromHeader) {
    return fromHeader
  }

  const cookieStore = await cookies()
  const fromCookie = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value)

  if (fromCookie) {
    return fromCookie
  }

  return DEFAULT_LOCALE
}
