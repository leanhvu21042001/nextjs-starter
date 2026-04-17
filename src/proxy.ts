import { NextRequest, NextResponse } from 'next/server'

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale } from '@/lib/i18n/config'
import { getPathLocale } from '@/lib/i18n/routing'

const getLocaleFromQuery = (request: NextRequest) =>
  normalizeLocale(request.nextUrl.searchParams.get('lang'))

const getLocaleFromCookie = (request: NextRequest) =>
  normalizeLocale(request.cookies.get(LOCALE_COOKIE_NAME)?.value)

const getLocaleFromAcceptLanguage = (request: NextRequest) => {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return null

  const candidates = acceptLanguage
    .split(',')
    .map((value) => value.split(';')[0]?.trim())
    .filter(Boolean)

  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate)
    if (locale) return locale
  }

  return null
}

const resolvePreferredLocale = (request: NextRequest) =>
  getLocaleFromQuery(request) ??
  getLocaleFromCookie(request) ??
  getLocaleFromAcceptLanguage(request) ??
  DEFAULT_LOCALE

const withLocaleHeader = (request: NextRequest, locale: string) => {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)
  return requestHeaders
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const localeInPath = getPathLocale(pathname)

  if (localeInPath) {
    const response = NextResponse.next({
      request: {
        headers: withLocaleHeader(request, localeInPath),
      },
    })

    response.cookies.set(LOCALE_COOKIE_NAME, localeInPath, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
    return response
  }

  const locale = resolvePreferredLocale(request)
  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname =
    locale === DEFAULT_LOCALE ? `/${DEFAULT_LOCALE}${pathname}` : `/${locale}${pathname}`

  const response = NextResponse.rewrite(rewriteUrl, {
    request: {
      headers: withLocaleHeader(request, locale),
    },
  })

  response.cookies.set(LOCALE_COOKIE_NAME, locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })

  return response
}

export const config = {
  matcher: '/((?!api|static|assets|robots|sitemap|sw|service-worker|manifest|.*\\..*|_next).*)',
}
