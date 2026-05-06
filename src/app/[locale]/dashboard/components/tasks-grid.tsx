'use client'

import { useEffect, useMemo, useState } from 'react'
import { renderTextEditor } from 'react-data-grid'

import { useParams } from 'next/navigation'

import {
  AppDataGrid,
  type AppDataGridText,
  type GridToolbarConfig,
  type MutationResultItem,
  type TComparator,
  type TGenColumn,
} from '@/components/AppDataGrid'
import {
  type TCategoryUi,
  useCreateCategoryUseCase,
  useDeleteCategoryUseCase,
  useGetCategoryUseCase,
  useUpdateCategoryUseCase,
} from '@/domain/category'
import { formatters } from '@/lib/formatters'
import { DEFAULT_LOCALE, hasLocale } from '@/lib/i18n/config'

import { getTasksGridContent } from './tasks-grid.content'

type CategoryRow = TCategoryUi

interface CategorySummaryRow {
  id: string
  totalCount: number
  activeCount: number
}

function getComparator(sortColumn: keyof CategoryRow): TComparator<CategoryRow> {
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

const buildColumns = (
  content: ReturnType<typeof getTasksGridContent>,
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

export function TasksGrid() {
  const params = useParams<{ locale?: string }>()
  const localeParam = params?.locale
  const locale = localeParam && hasLocale(localeParam) ? localeParam : DEFAULT_LOCALE
  const content = getTasksGridContent(locale)

  const [rows, setRows] = useState<readonly CategoryRow[]>([])
  const { data: categories, refetch: refetchCategories } = useGetCategoryUseCase({ enabled: false })
  const createCategoryMutation = useCreateCategoryUseCase()
  const updateCategoryMutation = useUpdateCategoryUseCase()
  const deleteCategoryMutation = useDeleteCategoryUseCase()

  const gridText = useMemo<AppDataGridText>(() => content.grid, [content.grid])
  const genColumns = useMemo(() => buildColumns(content), [content])

  const createMutationResult = (
    action: 'add' | 'update' | 'delete',
    row: CategoryRow,
    status: 'success' | 'error',
    error?: string,
  ): MutationResultItem<CategoryRow> => ({
    action,
    key: row.id,
    row,
    status,
    error,
  })

  const toolbarConfig = useMemo<GridToolbarConfig<CategoryRow>>(
    () => ({
      createMode: 'modal',
      updateMode: 'modal',
      requireDeleteConfirm: true,
      mutationMode: 'batch',
      concurrency: {
        limit: 4,
        delayBetweenBatches: 60,
      },
      refreshParams: {
        status: 'all',
        search: '',
      },
      fieldConfigs: {
        id: {
          key: 'id',
          label: content.columns.id,
          showInAdd: false,
          showInEdit: false,
        },
        name: {
          key: 'name',
          label: content.fields.categoryName,
          required: true,
          validate: (value) =>
            String(value ?? '').trim().length < 2 ? content.validation.nameMinLength : null,
        },
        slug: {
          key: 'slug',
          label: content.fields.slug,
          required: true,
          validate: (value) =>
            /^[a-z0-9-]*$/.test(String(value ?? '')) ? null : content.validation.invalidSlug,
        },
        description: {
          key: 'description',
          label: content.fields.description,
          defaultValue: '',
        },
        status: {
          key: 'status',
          label: content.fields.status,
          defaultValue: 'active',
          validate: (value) => {
            const status = String(value)
            return status === 'active' || status === 'inactive'
              ? null
              : content.validation.invalidStatus
          },
        },
        createdAt: {
          key: 'createdAt',
          showInAdd: false,
          showInEdit: false,
        },
        updatedAt: {
          key: 'updatedAt',
          showInAdd: false,
          showInEdit: false,
        },
      },
      handlers: {
        onAdd: async (row) => {
          const created = (await createCategoryMutation.mutateAsync(row)) as CategoryRow
          setRows((prevRows) => [...prevRows, created])
          return created
        },

        onUpdate: async (row) => {
          const updated = (await updateCategoryMutation.mutateAsync({
            id: row.id,
            data: row,
          })) as CategoryRow
          setRows((prevRows) => prevRows.map((item) => (item.id === updated.id ? updated : item)))
          return updated
        },

        onDelete: async (row) => {
          await deleteCategoryMutation.mutateAsync(row.id)
          setRows((prevRows) => prevRows.filter((item) => item.id !== row.id))
        },

        onRefresh: async () => {
          const result = await refetchCategories()
          const items = result.data ?? []
          setRows(items)
          return items
        },

        onAddMany: async (items) => {
          const results = await Promise.all(
            items.map(async (item) => {
              try {
                const created = (await createCategoryMutation.mutateAsync(item)) as CategoryRow
                setRows((prevRows) => [...prevRows, created])
                return createMutationResult('add', created, 'success')
              } catch (error) {
                return createMutationResult(
                  'add',
                  item,
                  'error',
                  error instanceof Error ? error.message : content.mutation.cannotAdd,
                )
              }
            }),
          )

          return results
        },

        onUpdateMany: async (items) => {
          const results = await Promise.all(
            items.map(async (item) => {
              try {
                const updated = (await updateCategoryMutation.mutateAsync({
                  id: item.id,
                  data: item,
                })) as CategoryRow
                setRows((prevRows) =>
                  prevRows.map((dbItem) => (dbItem.id === updated.id ? updated : dbItem)),
                )

                return createMutationResult('update', updated, 'success')
              } catch (error) {
                return createMutationResult(
                  'update',
                  item,
                  'error',
                  error instanceof Error ? error.message : content.mutation.cannotUpdate,
                )
              }
            }),
          )

          return results
        },

        onDeleteMany: async (items) => {
          const results = await Promise.all(
            items.map(async (item) => {
              try {
                await deleteCategoryMutation.mutateAsync(item.id)
                setRows((prevRows) => prevRows.filter((dbItem) => dbItem.id !== item.id))
                return createMutationResult('delete', item, 'success')
              } catch (error) {
                return createMutationResult(
                  'delete',
                  item,
                  'error',
                  error instanceof Error ? error.message : content.mutation.cannotDelete,
                )
              }
            }),
          )

          return results
        },
      },
    }),
    [
      content,
      createCategoryMutation,
      deleteCategoryMutation,
      refetchCategories,
      updateCategoryMutation,
    ],
  )

  useEffect(() => {
    refetchCategories().then((result) => {
      const items = result.data ?? []
      setRows(items)
    })
  }, [refetchCategories])

  return (
    <AppDataGrid<CategoryRow, CategorySummaryRow>
      ariaLabel={content.ariaLabel}
      rowKeyGetterString="id"
      exportFileName={content.exportFileName}
      rows={rows}
      genColumns={genColumns}
      genComparator={getComparator}
      toolbarConfig={toolbarConfig}
      localeText={gridText}
      isSearch
      genSummaryRows={(currentRows) => {
        return [
          {
            id: 'total_0',
            totalCount: currentRows.length,
            activeCount: currentRows.filter((row) => row.status === 'active').length,
          },
        ]
      }}
    />
  )
}
