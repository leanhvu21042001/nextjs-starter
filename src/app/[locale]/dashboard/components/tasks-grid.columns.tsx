import { renderTextEditor } from 'react-data-grid'

import type { TComparator, TGenColumn } from '@/components/AppDataGrid'
import { formatters } from '@/lib/formatters'

import type { CategoryRow, CategorySummaryRow, TasksGridContent } from './tasks-grid.types'

export function getCategoryGridComparator(sortColumn: keyof CategoryRow): TComparator<CategoryRow> {
  switch (sortColumn) {
    case 'id':
    case 'name':
    case 'slug':
    case 'description':
    case 'status':
      return (a, b) => {
        const aValue = String(a[sortColumn]).trim() || ''
        const bValue = String(b[sortColumn]).trim() || ''
        return aValue.localeCompare(bValue)
      }
    case 'createdAt':
    case 'updatedAt':
      return (a, b) => {
        const aValue = formatters.date.toDate(a[sortColumn])
        const bValue = formatters.date.toDate(b[sortColumn])
        if (!aValue || !bValue) return 0

        return aValue.getTime() - bValue.getTime()
      }
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`)
  }
}

export const buildTasksGridColumns = (
  content: TasksGridContent,
): TGenColumn<CategoryRow, CategorySummaryRow> => {
  return () => [
    {
      key: 'id',
      name: content.columns.id,
      frozen: true,
      resizable: false,
      renderSummaryCell() {
        return <strong>{content.columns.total}</strong>
      },
    },
    {
      key: 'name',
      name: content.columns.category,
      frozen: true,
      renderEditCell: renderTextEditor,
      renderSummaryCell({ row }: { row: CategorySummaryRow }) {
        return content.columns.records(row.totalCount)
      },
    },
    {
      key: 'slug',
      name: content.columns.slug,
      width: 'max-content',
      draggable: true,
      renderEditCell: renderTextEditor,
    },
    {
      key: 'description',
      name: content.columns.description,
      renderEditCell: renderTextEditor,
    },
    {
      key: 'status',
      name: content.columns.status,
      renderCell(props) {
        return props.row.status === 'active'
          ? content.columns.statusActive
          : content.columns.statusInactive
      },
      renderEditCell: ({ row, onRowChange }) => (
        <select
          autoFocus
          value={row.status}
          onChange={(e) =>
            onRowChange({ ...row, status: e.target.value as CategoryRow['status'] }, true)
          }
        >
          <option value="active">{content.columns.statusActive}</option>
          <option value="inactive">{content.columns.statusInactive}</option>
        </select>
      ),
    },
    {
      key: 'createdAt',
      name: content.columns.createdAt,
      renderCell(props: { row: CategoryRow }) {
        return formatters.date.toDateTimeString(
          formatters.date.toDate(props.row.createdAt) ?? new Date(),
          'date',
        )
      },
    },
    {
      key: 'updatedAt',
      name: content.columns.updatedAt,
      renderCell(props: { row: CategoryRow }) {
        return formatters.date.toDateTimeString(
          formatters.date.toDate(props.row.updatedAt) ?? new Date(),
          'date',
        )
      },
      renderSummaryCell({
        row: { activeCount, totalCount },
      }: {
        row: { activeCount: number; totalCount: number }
      }) {
        if (totalCount === 0) {
          return content.columns.activePercent(0)
        }

        return content.columns.activePercent(Math.floor((100 * activeCount) / totalCount))
      },
    },
  ]
}
