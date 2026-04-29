import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Box, Heading, Link, Main, Paragraph, Section } from '@/components/ui'
import { hasLocale } from '@/lib/i18n/config'
import { createLocalizedMetadata } from '@/lib/seo'

import { getAboutPageContent } from './page.content'

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
    <Main className="py-24 sm:py-32">
      <Section className="mx-auto max-w-7xl px-6 lg:px-8">
        <Box className="mx-auto max-w-2xl lg:text-center">
          <Heading level={2} className="text-base font-semibold leading-7 text-green-600">
            {content.eyebrow}
          </Heading>
          <Paragraph className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {content.heading}
          </Paragraph>
          <Paragraph className="mt-6 text-lg leading-8 text-slate-600">{content.body}</Paragraph>

          <Box className="mt-10">
            <Link href="/" className="text-green-600 font-semibold hover:text-green-500">
              {content.backHome}
            </Link>
          </Box>
        </Box>
      </Section>
    </Main>
  )
}
