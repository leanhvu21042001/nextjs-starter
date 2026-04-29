import { notFound } from 'next/navigation'

import { Providers } from '@/components/providers'
import { LOCALES, hasLocale } from '@/lib/i18n/config'

export const generateStaticParams = async () => LOCALES.map((locale) => ({ locale }))

const LocaleLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params

  if (!hasLocale(locale)) {
    notFound()
  }

  return <Providers>{children}</Providers>
}

export default LocaleLayout
