import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getAboutPageContent } from './page.content'
import { Link } from '@/components/ui/link'
import { hasLocale } from '@/i18n/config'
import { createLocalizedMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const { meta } = getAboutPageContent(locale)

  return createLocalizedMetadata({
    locale,
    pathname: '/about',
    title: meta.title,
    description: meta.description,
  })
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const content = getAboutPageContent(locale)

  return (
    <main className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">{content.eyebrow}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {content.heading}
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">{content.body}</p>

          <div className="mt-10">
            <Link href="/" className="text-green-600 font-semibold hover:text-green-500">
              {content.backHome}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
