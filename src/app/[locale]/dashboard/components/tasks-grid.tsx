'use client'

import { useEffect, useMemo, useState } from 'react'

import { useParams } from 'next/navigation'

import { AppDataGrid, type AppDataGridText } from '@/components/AppDataGrid'
import {
  useCreateCategoryUseCase,
  useDeleteCategoryUseCase,
  useGetCategoryUseCase,
  useUpdateCategoryUseCase,
} from '@/domain/category'
import { DEFAULT_LOCALE, hasLocale } from '@/lib/i18n/config'

import { buildTasksGridColumns, getCategoryGridComparator } from './tasks-grid.columns'
import { getTasksGridContent } from './tasks-grid.content'
import { createTasksGridToolbarConfig } from './tasks-grid.toolbar'
import type { CategoryRow, CategorySummaryRow } from './tasks-grid.types'

export function TasksGrid() {
  const params = useParams<{ locale?: string }>()
  const localeParam = params?.locale
  const locale = localeParam && hasLocale(localeParam) ? localeParam : DEFAULT_LOCALE
  const content = getTasksGridContent(locale)

  const [rows, setRows] = useState<readonly CategoryRow[]>([])
  const { refetch: refetchCategories } = useGetCategoryUseCase({ enabled: false })
  const createCategoryMutation = useCreateCategoryUseCase()
  const updateCategoryMutation = useUpdateCategoryUseCase()
  const deleteCategoryMutation = useDeleteCategoryUseCase()

  const gridText = useMemo<AppDataGridText>(() => content.grid, [content.grid])
  const genColumns = useMemo(() => buildTasksGridColumns(content), [content])

  const toolbarConfig = useMemo(
    () => ({
      ...createTasksGridToolbarConfig({
        content,
        setRows,
        createCategoryMutation,
        updateCategoryMutation,
        deleteCategoryMutation,
        refetchCategories,
      }),
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
      genComparator={getCategoryGridComparator}
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
