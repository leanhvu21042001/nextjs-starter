import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LoginForm } from './components/login-form'
import { getLoginPageContent } from './page.content'
import { Link } from '@/components/ui/link'
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
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            {content.title}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {content.subtitle}{' '}
            <Link href="/" className="font-medium text-green-600 hover:text-green-500">
              {content.backHome}
            </Link>
          </p>
        </div>

        <LoginForm content={content} />

        <div className="mt-4 flex flex-col gap-2 text-center text-xs text-gray-500">
          <p>
            {content.noAccount}{' '}
            <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
              {content.register}
            </Link>
          </p>
          <p className="text-gray-400 mt-2">{content.hint}</p>
        </div>
      </div>
    </main>
  )
}
