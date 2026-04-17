import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import PageBody from './page.body'
import { getPublicPageContent } from './page.content'
import { hasLocale } from '@/i18n/config'
import { createLocalizedMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const content = getPublicPageContent(locale)

  return createLocalizedMetadata({
    locale,
    pathname: '/',
    title: content.meta.title,
    description: content.meta.description,
  })
}

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const content = getPublicPageContent(locale)

  return <PageBody content={content} />
}

export default Page
