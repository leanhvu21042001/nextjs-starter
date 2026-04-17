import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LoginForm } from './components/login-form'
import { getLoginPageContent } from './page.content'
import { Box, Heading, Link, Paragraph } from '@/components/ui'
import { hasLocale } from '@/lib/i18n/config'
import { createLocalizedMetadata } from '@/lib/seo'

/**
 * Route: /login
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const content = getLoginPageContent(locale)

  return createLocalizedMetadata({
    locale,
    pathname: '/login',
    title: content.meta.title,
    description: content.meta.description,
    noIndex: true,
  })
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const content = getLoginPageContent(locale)

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Box className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <Box>
          <Heading level={2} className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            {content.title}
          </Heading>
          <Paragraph className="mt-2 text-center text-sm text-slate-600">
            {content.subtitle}{' '}
            <Link href="/" className="font-medium text-green-600 hover:text-green-500">
              {content.backHome}
            </Link>
          </Paragraph>
        </Box>

        <LoginForm content={content} />

        <Box className="mt-4 flex flex-col gap-2 text-center text-xs text-gray-500">
          <Paragraph>
            {content.noAccount}{' '}
            <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
              {content.register}
            </Link>
          </Paragraph>
          <Paragraph className="text-gray-400 mt-2">{content.hint}</Paragraph>
        </Box>
      </Box>
    </main>
  )
}
