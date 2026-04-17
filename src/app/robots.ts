import type { MetadataRoute } from 'next'

import { LOCALES } from '@/lib/i18n/config'
import { getLocalizedUrl } from '@/lib/i18n/routing'
import { getAbsoluteUrl, getSiteUrl } from '@/lib/seo'

const getAllMultilingualUrls = (urls: string[]) =>
  urls.flatMap((url) => LOCALES.map((locale) => getLocalizedUrl(url, locale)))

const DISALLOWED_ROUTES = ['/login', '/register', '/dashboard']

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: ['/'],
    disallow: getAllMultilingualUrls(DISALLOWED_ROUTES),
  },
  host: getSiteUrl(),
  sitemap: getAbsoluteUrl('/sitemap.xml'),
})

export default robots
