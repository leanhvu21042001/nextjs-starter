import type { MetadataRoute } from 'next'

import { DEFAULT_LOCALE } from '@/lib/i18n/config'
import { getLocaleAlternates, getLocalizedAbsoluteUrl } from '@/lib/seo'

const INDEXABLE_ROUTES = [
  { pathname: '/', priority: 1, changeFrequency: 'weekly' as const },
  { pathname: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { pathname: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
]

const sitemap = (): MetadataRoute.Sitemap =>
  INDEXABLE_ROUTES.map((route) => ({
    url: getLocalizedAbsoluteUrl(route.pathname, DEFAULT_LOCALE),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    alternates: {
      languages: {
        ...getLocaleAlternates(route.pathname),
        'x-default': getLocalizedAbsoluteUrl(route.pathname, DEFAULT_LOCALE),
      },
    },
  }))

export default sitemap
