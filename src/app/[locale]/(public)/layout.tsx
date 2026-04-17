import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getMetadataContent } from './metadata.content'
import { getPublicLayoutContent } from './layout.content'
import { Link } from '@/components/ui/link'
import { hasLocale } from '@/lib/i18n/config'
import { createLocalizedMetadata } from '@/lib/seo'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> => {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const metadata = getMetadataContent(locale)

  return createLocalizedMetadata({
    locale,
    pathname: '/',
    title: metadata.title,
    description: metadata.description,
  })
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const content = getPublicLayoutContent(locale)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-green-700 tracking-tight">
              AppLogo
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                {content.nav.home}
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {content.nav.about}
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {content.nav.contact}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              {content.login}
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg shadow-sm transition"
            >
              {content.register}
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Next.js Setup. {content.footer}
        </div>
      </footer>
    </div>
  )
}
