import type { Metadata } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import { headers } from 'next/headers'

import { DEFAULT_LOCALE, getTextDirection, normalizeLocale } from '@/lib/i18n/config'
import { getSiteUrl } from '@/lib/seo'

import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['400', '500', '600', '700', '800'],
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['600', '700'],
})

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
      <body className={`${manrope.variable} ${fraunces.variable} font-sans`}>{children}</body>
    </html>
  )
}
