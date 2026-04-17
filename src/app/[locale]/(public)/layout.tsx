import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getMetadataContent } from './metadata.content'
import { getPublicLayoutContent } from './layout.content'
import { Box, Footer, Header, Link, Main, Nav } from '@/components/ui'
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
    <Box className="min-h-screen rounded-none border-0 bg-transparent p-0 shadow-none flex flex-col">
      <Header className="w-full border-b border-[var(--line-soft)] bg-[var(--surface-strong)] px-4 py-3 sm:px-6 lg:px-8">
        <Box className="mx-auto w-full max-w-6xl rounded-none border-0 bg-transparent p-0 shadow-none">
          <Box className="rounded-none border-0 bg-transparent p-0 shadow-none flex items-center justify-between gap-3">
            <Box className="rounded-none border-0 bg-transparent p-0 shadow-none flex items-center gap-3 sm:gap-8">
              <Link
                href="/"
                className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)]"
              >
                AppLogo
              </Link>
              <Nav className="hidden items-center rounded-full border border-[var(--line-soft)] bg-white/80 px-2 py-1 md:flex">
                <Link
                  href="/"
                  className="rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]"
                >
                  {content.nav.home}
                </Link>
                <Link
                  href="/about"
                  className="rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]"
                >
                  {content.nav.about}
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]"
                >
                  {content.nav.contact}
                </Link>
              </Nav>
            </Box>

            <Box className="rounded-none border-0 bg-transparent p-0 shadow-none flex items-center gap-2 sm:gap-3">
              <LocaleSwitcher />
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-white sm:inline-flex"
              >
                {content.login}
              </Link>
              <Link
                href="/register"
                className="inline-flex rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-bold text-white shadow-[0_8px_22px_rgba(15,159,76,0.35)] transition hover:-translate-y-0.5 hover:bg-[var(--brand-deep)]"
              >
                {content.register}
              </Link>
            </Box>
          </Box>

          <Nav className="mt-3 flex items-center justify-center rounded-full border border-[var(--line-soft)] bg-white/80 px-2 py-1 md:hidden">
            <Link
              href="/"
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]"
            >
              {content.nav.home}
            </Link>
            <Link
              href="/about"
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]"
            >
              {content.nav.about}
            </Link>
            <Link
              href="/contact"
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]"
            >
              {content.nav.contact}
            </Link>
          </Nav>
        </Box>
      </Header>

      <Main className="flex-1">{children}</Main>

      <Footer className="mt-auto px-4 pb-6 pt-8 sm:px-6 lg:px-8">
        <Box className="mx-auto max-w-6xl rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] px-6 py-5 text-center text-sm font-medium text-[var(--text-secondary)] shadow-[0_8px_24px_rgba(15,29,50,0.08)]">
          © {new Date().getFullYear()} Next.js Setup. {content.footer}
        </Box>
      </Footer>
    </Box>
  )
}
