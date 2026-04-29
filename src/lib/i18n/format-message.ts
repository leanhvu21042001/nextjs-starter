import { IntlMessageFormat } from 'intl-messageformat'

import type { Locale } from '@/lib/i18n/config'

type MessageValues = Record<string, string | number | boolean>

export function formatI18nMessage(
  template: string,
  locale: Locale,
  values?: MessageValues,
): string {
  if (!values) {
    return template
  }

  try {
    const formatter = new IntlMessageFormat(template, locale)
    return String(formatter.format(values))
  } catch {
    return template
  }
}
