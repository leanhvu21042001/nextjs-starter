import { Box, Heading, Paragraph, Section } from '@/components/ui'
import { TasksGrid } from './components/tasks-grid'

/**
 * Page Component: `/` (thuộc (dashboard) layout)
 */
export default function DashboardPage() {
  return (
    <main className="space-y-6 p-6">
      <Section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Heading level={1} className="text-xl font-semibold text-slate-900">
          Data Grid CRUD Full Example
        </Heading>
        <Paragraph className="mt-2 text-sm text-slate-600">
          This dashboard demonstrates the complete toolbar workflow: add/update (modal),
          multi-select delete, save mutations, refresh with params, per-item success/error mapping,
          retry one/selected/all failed items, and batch mutation handling with concurrency
          controls.
        </Paragraph>
      </Section>

      <Section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <TasksGrid />
      </Section>
    </main>
  )
}
