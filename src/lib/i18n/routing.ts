import { DEFAULT_LOCALE, LOCALES, type Locale, hasLocale } from '@/lib/i18n/config'

const ensureLeadingSlash = (pathname: string): string =>
  pathname.startsWith('/') ? pathname : `/${pathname}`

const normalizePathname = (pathname: string): string => {
  const withLeadingSlash = ensureLeadingSlash(pathname)
  return withLeadingSlash === '/' ? withLeadingSlash : withLeadingSlash.replace(/\/$/, '')
}

export const isExternalHref = (href: string): boolean => /^https?:\/\//.test(href)

export const stripLocaleFromPathname = (pathname: string): string => {
  const normalizedPathname = normalizePathname(pathname)
  const segments = normalizedPathname.split('/').filter(Boolean)

  if (segments.length > 0 && hasLocale(segments[0])) {
    const remainingSegments = segments.slice(1)
    return remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '/'
  }

  return normalizedPathname
}

export const localizePathname = (pathname: string, locale: Locale): string => {
  const withoutLocale = stripLocaleFromPathname(pathname)

  if (locale === DEFAULT_LOCALE) {
    return withoutLocale
  }

  return withoutLocale === '/' ? `/${locale}` : `/${locale}${withoutLocale}`
}

export const getLocalizedUrl = (pathname: string, locale: Locale): string => {
  if (isExternalHref(pathname)) {
    return pathname
  }

  const [rawPathname, queryAndHash = ''] = pathname.split(/(?=[?#])/)
  return `${localizePathname(rawPathname || '/', locale)}${queryAndHash}`
}

export const getPathLocale = (pathname: string): Locale | null => {
  const normalizedPathname = normalizePathname(pathname)
  const firstSegment = normalizedPathname.split('/').filter(Boolean)[0]
  return firstSegment && hasLocale(firstSegment) ? firstSegment : null
}

export const getMultilingualUrls = (pathname: string): Record<Locale, string> =>
  LOCALES.reduce(
    (result, locale) => {
      result[locale] = getLocalizedUrl(pathname, locale)
      return result
    },
    {} as Record<Locale, string>,
  )
