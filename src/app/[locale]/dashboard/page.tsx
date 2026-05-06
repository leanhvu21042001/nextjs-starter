import { notFound } from 'next/navigation'

import { Heading, Main, Paragraph, Section } from '@/components/ui'
import { hasLocale } from '@/lib/i18n/config'

import { TasksGrid } from './components/tasks-grid'
import { getDashboardPageContent } from './page.content'

/**
 * Page Component: `/` (thuộc (dashboard) layout)
 */
export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()

  const content = getDashboardPageContent(locale)

  return (
    <Main className="space-y-6 p-6">
      <Section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Heading level={1} className="text-xl font-semibold text-slate-900">
          {content.heading}
        </Heading>
        <Paragraph className="mt-2 text-sm text-slate-600">{content.description}</Paragraph>
      </Section>

      <Section className="rounded-none border-0 bg-transparent p-0 shadow-none">
        <TasksGrid />
      </Section>
    </Main>
  )
}
