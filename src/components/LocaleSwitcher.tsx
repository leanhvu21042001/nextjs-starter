'use client'

import type { FC } from 'react'
import Cookies from 'js-cookie'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Select } from '@/components/ui'
import { Box } from '@/components/ui/box'
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE_NAME,
  getLocaleDisplayName,
  hasLocale,
} from '@/lib/i18n/config'
import { getLocalizedUrl, getPathLocale, stripLocaleFromPathname } from '@/lib/i18n/routing'

export const LocaleSwitcher: FC = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const pathLocale = getPathLocale(pathname)
  const locale = pathLocale ?? DEFAULT_LOCALE

  const handleLocaleChange = (nextLocale: string) => {
    if (!hasLocale(nextLocale)) return

    Cookies.set(LOCALE_COOKIE_NAME, nextLocale, { expires: 365 })

    const pathWithoutLocale = stripLocaleFromPathname(pathname)
    const query = searchParams.toString()
    const nextPath = getLocalizedUrl(pathWithoutLocale, nextLocale)
    router.replace((query ? `${nextPath}?${query}` : nextPath) as never)
  }

  return (
    <Box className="w-44 border-0 bg-transparent p-0 shadow-none">
      <Select
        aria-label="Select language"
        value={locale}
        onChange={(event) => handleLocaleChange(event.target.value)}
        options={LOCALES.map((localeItem) => ({
          value: localeItem,
          label: getLocaleDisplayName(localeItem),
        }))}
        className="h-9 rounded-md border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm"
      />
    </Box>
  )
}
