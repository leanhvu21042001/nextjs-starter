import type { Dispatch, SetStateAction } from 'react'

import type { GridToolbarConfig, MutationResultItem } from '@/components/AppDataGrid'
import type {
  useCreateCategoryUseCase,
  useDeleteCategoryUseCase,
  useUpdateCategoryUseCase,
} from '@/domain/category'

import type { CategoryRow, TasksGridContent } from './tasks-grid.types'

type CreateCategoryMutation = ReturnType<typeof useCreateCategoryUseCase>
type UpdateCategoryMutation = ReturnType<typeof useUpdateCategoryUseCase>
type DeleteCategoryMutation = ReturnType<typeof useDeleteCategoryUseCase>

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

type CreateToolbarConfigParams = {
  content: TasksGridContent
  setRows: Dispatch<SetStateAction<readonly CategoryRow[]>>
  createCategoryMutation: CreateCategoryMutation
  updateCategoryMutation: UpdateCategoryMutation
  deleteCategoryMutation: DeleteCategoryMutation
  refetchCategories: () => Promise<{ data?: readonly CategoryRow[] }>
}

export function createTasksGridToolbarConfig({
  content,
  setRows,
  createCategoryMutation,
  updateCategoryMutation,
  deleteCategoryMutation,
  refetchCategories,
}: CreateToolbarConfigParams): GridToolbarConfig<CategoryRow> {
  return {
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
  }
}
