import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'

import { DEFAULT_LOCALE, getTextDirection, normalizeLocale } from '@/i18n/config'
import { getSiteUrl } from '@/lib/seo'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Next.js Starter',
    template: '%s | Next.js Starter',
  },
  description:
    'Modern multilingual Next.js starter with clean architecture, form validation, and scalable UI components.',
  applicationName: 'Next.js Starter',
  openGraph: {
    type: 'website',
    siteName: 'Next.js Starter',
    title: 'Next.js Starter',
    description:
      'Modern multilingual Next.js starter with clean architecture, form validation, and scalable UI components.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Starter',
    description:
      'Modern multilingual Next.js starter with clean architecture, form validation, and scalable UI components.',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers()
  const locale = normalizeLocale(requestHeaders.get('x-locale')) ?? DEFAULT_LOCALE

  return (
    <html lang={locale} dir={getTextDirection()}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
