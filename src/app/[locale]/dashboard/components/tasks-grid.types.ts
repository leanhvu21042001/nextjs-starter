import type { TCategoryUi } from '@/domain/category'

import type { getTasksGridContent } from './tasks-grid.content'

export type CategoryRow = TCategoryUi

export interface CategorySummaryRow {
  id: string
  totalCount: number
  activeCount: number
}

export type TasksGridContent = ReturnType<typeof getTasksGridContent>
