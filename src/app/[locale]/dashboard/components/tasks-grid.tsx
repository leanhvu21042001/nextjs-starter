'use client'

import { useEffect, useMemo, useState } from 'react'
import { renderTextEditor } from 'react-data-grid'

import {
  AppDataGrid,
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
import type { ApiPaginatedResponse } from '@/lib/api-response'
import { formatters } from '@/lib/formatters'

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

const genColumns: TGenColumn<CategoryRow, CategorySummaryRow> = () => {
  return [
    {
      key: 'id',
      name: 'ID',
      frozen: true,
      resizable: false,
      renderSummaryCell() {
        return <strong>Total</strong>
      },
    },
    {
      key: 'name',
      name: 'Category',
      frozen: true,
      renderEditCell: renderTextEditor,
      renderSummaryCell({ row }: { row: CategorySummaryRow }) {
        return `${row.totalCount} records`
      },
    },
    {
      key: 'slug',
      name: 'Slug',
      width: 'max-content',
      draggable: true,
      renderEditCell: renderTextEditor,
    },
    {
      key: 'description',
      name: 'Description',
      renderEditCell: renderTextEditor,
    },
    {
      key: 'status',
      name: 'Status',
      renderCell(props) {
        return props.row.status
      },
      renderEditCell: ({ row, onRowChange }) => (
        <select
          autoFocus
          value={row.status}
          onChange={(e) =>
            onRowChange({ ...row, status: e.target.value as CategoryRow['status'] }, true)
          }
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      ),
    },
    {
      key: 'createdAt',
      name: 'Created at',
      renderCell(props: { row: CategoryRow }) {
        return formatters.date.toDateTimeString(
          formatters.date.toDate(props.row.createdAt) ?? new Date(),
          'date',
        )
      },
    },
    {
      key: 'updatedAt',
      name: 'Updated at',
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
          return '0% active'
        }

        return `${Math.floor((100 * activeCount) / totalCount)}% active`
      },
    },
  ]
}

export function TasksGrid() {
  const [rows, setRows] = useState<readonly CategoryRow[]>([])
  const { refetch: refetchCategories } = useGetCategoryUseCase({ enabled: false })
  const createCategoryMutation = useCreateCategoryUseCase()
  const updateCategoryMutation = useUpdateCategoryUseCase()
  const deleteCategoryMutation = useDeleteCategoryUseCase()

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

  useEffect(() => {
    let mounted = true

    const loadCategories = async () => {
      const result = await refetchCategories()
      const response = result.data as ApiPaginatedResponse<CategoryRow> | undefined

      if (!mounted) {
        return
      }

      setRows(response?.data.items ?? [])
    }

    loadCategories().catch(() => {
      if (mounted) {
        setRows([])
      }
    })

    return () => {
      mounted = false
    }
  }, [refetchCategories])

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
          label: 'ID',
          showInAdd: false,
          showInEdit: false,
        },
        name: {
          key: 'name',
          label: 'Category name',
          required: true,
          validate: (value) =>
            String(value ?? '').trim().length < 2 ? 'Name must have at least 2 chars' : null,
        },
        slug: {
          key: 'slug',
          label: 'Slug',
          required: true,
          validate: (value) =>
            /^[a-z0-9-]*$/.test(String(value ?? '')) ? null : 'Slug format is invalid',
        },
        description: {
          key: 'description',
          label: 'Description',
          defaultValue: '',
        },
        status: {
          key: 'status',
          label: 'Status',
          defaultValue: 'active',
          validate: (value) => {
            const status = String(value)
            return status === 'active' || status === 'inactive' ? null : 'Status is invalid'
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

        onRefresh: async () =>
          // params
          {
            // const status = params?.status
            // const search = String(params?.search ?? '').trim()

            const result = await refetchCategories()
            const response = result.data as ApiPaginatedResponse<CategoryRow> | undefined
            const items = response?.data.items ?? []
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
                  error instanceof Error ? error.message : 'Cannot add category',
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
                  error instanceof Error ? error.message : 'Cannot update category',
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
                  error instanceof Error ? error.message : 'Cannot delete category',
                )
              }
            }),
          )

          return results
        },
      },
    }),
    [createCategoryMutation, deleteCategoryMutation, refetchCategories, updateCategoryMutation],
  )

  return (
    <>
      <AppDataGrid<CategoryRow, CategorySummaryRow>
        ariaLabel="Dashboard Category Grid"
        rowKeyGetterString="id"
        exportFileName="dashboard-category-grid"
        rows={rows}
        genColumns={genColumns}
        genComparator={getComparator}
        toolbarConfig={toolbarConfig}
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
    </>
  )
}
