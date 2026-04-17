import { notFound } from 'next/navigation'

import { LOCALES, hasLocale } from '@/i18n/config'

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

  return children
}

export default LocaleLayout
