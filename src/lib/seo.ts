import type { Metadata } from 'next'

import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config'
import { getLocalizedUrl } from '@/i18n/routing'

const FALLBACK_SITE_URL = 'http://localhost:3000'

const normalizeSiteUrl = (value: string): string => value.replace(/\/+$/, '')

export const getSiteUrl = (): string => {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL || process.env.SITE_URL
  return normalizeSiteUrl(fromEnv || FALLBACK_SITE_URL)
}

export const getAbsoluteUrl = (pathname: string): string => {
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${getSiteUrl()}${normalizedPathname}`
}

export const getLocalizedAbsoluteUrl = (pathname: string, locale: Locale): string =>
  getAbsoluteUrl(getLocalizedUrl(pathname, locale))

export const getLocaleAlternates = (pathname: string): Record<Locale, string> =>
  LOCALES.reduce(
    (acc, locale) => {
      acc[locale] = getLocalizedAbsoluteUrl(pathname, locale)
      return acc
    },
    {} as Record<Locale, string>,
  )

const OPEN_GRAPH_LOCALE_BY_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  vi: 'vi_VN',
}

type CreateLocalizedMetadataInput = {
  locale: Locale
  pathname: string
  title: string
  description: string
  noIndex?: boolean
}

export const createLocalizedMetadata = ({
  locale,
  pathname,
  title,
  description,
  noIndex = false,
}: CreateLocalizedMetadataInput): Metadata => {
  const canonical = getLocalizedAbsoluteUrl(pathname, locale)

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...getLocaleAlternates(pathname),
        'x-default': getLocalizedAbsoluteUrl(pathname, DEFAULT_LOCALE),
      },
    },
    openGraph: {
      type: 'website',
      locale: OPEN_GRAPH_LOCALE_BY_LOCALE[locale],
      url: canonical,
      title,
      description,
      siteName: 'Next.js Starter',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  }
}
