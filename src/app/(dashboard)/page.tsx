import { TasksGrid } from './components/tasks-grid'

/**
 * Page Component: `/` (thuộc (dashboard) layout)
 */
export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8 bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-600 mb-6">Trang ví dụ mô hình cấu trúc Atomic Design.</p>

        <TasksGrid />
      </div>
    </main>
  )
}
