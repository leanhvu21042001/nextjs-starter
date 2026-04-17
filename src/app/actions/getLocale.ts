'use server'

import { getRequestLocale } from '@/lib/i18n/get-locale'

export const myServerAction = async () => {
  const locale = await getRequestLocale()

  // Do something with the locale
  return locale
}
