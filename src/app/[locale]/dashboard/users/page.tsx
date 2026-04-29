import { notFound } from 'next/navigation'

import { Box, Heading, Main, Paragraph } from '@/components/ui'
import { hasLocale } from '@/lib/i18n/config'

import { getUsersPageContent } from './page.content'

export default async function UsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const content = getUsersPageContent(locale)

  return (
    <Main className="p-8 text-slate-900">
      <Box className="max-w-7xl mx-auto">
        <Heading level={1} className="text-3xl font-bold mb-2">
          {content.heading}
        </Heading>
        <Paragraph className="text-slate-600 mb-8">{content.subheading}</Paragraph>

        <Box className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center text-slate-400">
          {content.placeholder}
        </Box>
      </Box>
    </Main>
  )
}
