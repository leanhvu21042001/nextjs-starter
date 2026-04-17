import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LoginForm } from './components/login-form'
import { getLoginPageContent } from './page.content'
import { Box, Heading, Link, Main, Paragraph } from '@/components/ui'
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
    <Main className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <Box className="w-full max-w-md rounded-3xl border border-[var(--line-soft)] bg-[var(--surface-strong)] p-7 shadow-[0_16px_40px_rgba(15,29,50,0.12)] sm:p-8">
        <Box className="rounded-none border-0 bg-transparent p-0 shadow-none">
          <Heading level={2} className="text-center text-3xl font-extrabold text-slate-900">
            {content.title}
          </Heading>
          <Paragraph className="mt-2 text-center text-sm text-slate-600">
            {content.subtitle}{' '}
            <Link href="/" className="font-medium text-green-600 hover:text-green-500">
              {content.backHome}
            </Link>
          </Paragraph>
        </Box>

        <Box className="mt-8 rounded-none border-0 bg-transparent p-0 shadow-none">
          <LoginForm content={content} />
        </Box>

        <Box className="mt-6 rounded-xl border border-[var(--line-soft)] bg-white/70 p-4 shadow-none text-center">
          <Paragraph>
            {content.noAccount}{' '}
            <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
              {content.register}
            </Link>
          </Paragraph>
          <Paragraph className="mt-2 text-xs text-gray-400">{content.hint}</Paragraph>
        </Box>
      </Box>
    </Main>
  )
}
