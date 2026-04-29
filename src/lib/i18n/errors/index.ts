import type { ErrorCode } from '@/domain/error'
import type { Locale } from '@/lib/i18n/config'

import { enErrorMessages } from './en'
import { viErrorMessages } from './vi'

const errorMessagesByLocale: Record<Locale, Record<ErrorCode, string>> = {
  en: enErrorMessages as Record<ErrorCode, string>,
  vi: viErrorMessages as Record<ErrorCode, string>,
}

export function getErrorMessageCatalog(locale: Locale) {
  return errorMessagesByLocale[locale]
}
