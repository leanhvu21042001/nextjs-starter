import { notFound } from 'next/navigation'

import { Box, Heading, Paragraph } from '@/components/ui'
import { getSettingsPageContent } from './page.content'
import { hasLocale } from '@/lib/i18n/config'

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const content = getSettingsPageContent(locale)

  return (
    <main className="p-8 text-slate-900">
      <Box className="max-w-7xl mx-auto">
        <Heading level={1} className="text-3xl font-bold mb-2">
          {content.heading}
        </Heading>
        <Paragraph className="text-slate-600 mb-8">{content.subheading}</Paragraph>

        <Box className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <Box className="border border-slate-100 p-4 rounded-lg">
            <Heading level={3} className="font-semibold text-lg mb-2">
              {content.accountInfo.title}
            </Heading>
            <Paragraph className="text-sm text-slate-500">
              {content.accountInfo.description}
            </Paragraph>
          </Box>
          <Box className="border border-slate-100 p-4 rounded-lg">
            <Heading level={3} className="font-semibold text-lg mb-2">
              {content.security.title}
            </Heading>
            <Paragraph className="text-sm text-slate-500">{content.security.description}</Paragraph>
          </Box>
        </Box>
      </Box>
    </main>
  )
}
