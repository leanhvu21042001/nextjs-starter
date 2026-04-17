'use client'

import NextLink from 'next/link'
import { useParams } from 'next/navigation'
import type { FC, PropsWithChildren } from 'react'

import { DEFAULT_LOCALE, hasLocale } from '@/lib/i18n/config'
import { getLocalizedUrl } from '@/lib/i18n/routing'

export const checkIsExternalLink = (href?: string): boolean => /^https?:\/\//.test(href ?? '')

type AppLinkProps = Omit<React.ComponentPropsWithoutRef<typeof NextLink>, 'href'> & {
  href: string
}

export const Link: FC<AppLinkProps> = ({ href, ...props }) => {
  const { children, ...rest } = props as PropsWithChildren<AppLinkProps>
  const params = useParams<{ locale?: string | string[] }>()

  const localeParam = Array.isArray(params.locale) ? params.locale[0] : params.locale
  const locale = localeParam && hasLocale(localeParam) ? localeParam : DEFAULT_LOCALE

  const isStringHref = typeof href === 'string'
  const isExternalLink = isStringHref && checkIsExternalLink(href)

  const hrefI18n = isStringHref && !isExternalLink ? getLocalizedUrl(href, locale) : href

  return (
    <NextLink {...rest} href={hrefI18n as never}>
      {children}
    </NextLink>
  )
}

Link.displayName = 'Link'
