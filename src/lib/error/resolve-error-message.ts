import { ERROR_CODES, isErrorCode, toAppError } from '@/domain/error'
import { DEFAULT_LOCALE, type Locale, normalizeLocale } from '@/lib/i18n/config'
import { getErrorMessageCatalog } from '@/lib/i18n/errors'
import { formatI18nMessage } from '@/lib/i18n/format-message'

function getClientLocale(): Locale {
  if (typeof document === 'undefined') {
    return DEFAULT_LOCALE
  }

  const normalized = normalizeLocale(document.documentElement.lang)
  return normalized ?? DEFAULT_LOCALE
}

export function resolveErrorMessage(error: unknown, locale?: Locale): string {
  if (typeof error === 'string' && !isErrorCode(error)) {
    return error
  }

  const appError = toAppError(error)
  const currentLocale = locale ?? getClientLocale()
  const catalog = getErrorMessageCatalog(currentLocale)
  const template =
    appError.customMessage ?? catalog[appError.code] ?? catalog[ERROR_CODES.SYS_UNEXPECTED]

  return formatI18nMessage(template, currentLocale, appError.params)
}
