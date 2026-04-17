'use client'
import { deepPickStringValue, exportToCsv } from '@/lib/utils'
import { logger } from '@/lib/logger'
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import {
  CalculatedColumn,
  CellCopyArgs,
  CellKeyboardEvent,
  CellKeyDownArgs,
  CellMouseArgs,
  CellMouseEvent,
  CellPasteArgs,
  DataGrid,
  DataGridHandle,
  Direction,
  FillEvent,
  RowsChangeData,
  SelectColumn,
  SortColumn,
} from 'react-data-grid'
import { flushSync } from 'react-dom'

// required import to have styles
import 'react-data-grid/lib/styles.css'

import {
  Button,
  Box,
  Inline,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Empty,
  Input,
  Label,
  Select,
} from '../ui'
import useDebounce from '@/hooks/use-debounce'
import type {
  OptionsSelect,
  TColumn,
  TComparator,
  TGenColumn,
  TKeyGrid,
} from './app-data-grid.types'
import { isNoSearch } from './app-data-grid.utils'
import { GridToolbar } from './toolbar'
import { runWithConcurrency } from './concurrency'
import type {
  CrudAction,
  GridToolbarConfig,
  MutationResultItem,
  RowFieldConfig,
  RowMutationMap,
  RowMutationState,
} from './toolbar.types'

type RowFormMode = 'add' | 'edit'

type ToolbarField<TRow, TSummaryRow> = {
  key: keyof TRow & string
  label: string
  column: TColumn<TRow, TSummaryRow>
  config?: RowFieldConfig<TRow>
}

const normalizeErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Unknown error'
}

function AppDataGrid<TRow, TSummaryRow>({
  // simple config
  rowKeyGetterString,
  exportFileName,
  ariaLabel,
  direction = 'ltr',
  style = { maxHeight: 600 },
  isSearch = false,
  // data and state
  rows,
  // functions
  genColumns,
  genComparator,
  genSummaryRows,
  onRowChange,
  toolbarConfig,
}: {
  // simple config
  rowKeyGetterString: keyof TRow
  exportFileName: string
  ariaLabel: string
  direction?: Direction
  style?: CSSProperties
  isSearch?: boolean
  // data and state
  rows: readonly TRow[]
  // functions
  genColumns: TGenColumn<TRow, TSummaryRow> & { options?: OptionsSelect[] }
  genComparator: (sortColumn: string) => TComparator<TRow>
  genSummaryRows?: (rows: readonly TRow[]) => readonly TSummaryRow[]
  onRowChange?: (rows: readonly TRow[], data: RowsChangeData<TRow, TSummaryRow>) => void
  toolbarConfig?: GridToolbarConfig<TRow>
}) {
  // support states
  const gridRef = useRef<DataGridHandle>(null)
  const [isExporting, setIsExporting] = useState(false)
  const rowIdSeed = useRef(0)
  const refreshRequestId = useRef(0)

  const [tableSearchTerm, setTableSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce((tableSearchTerm || '').trim().toUpperCase())

  // data states
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<TKeyGrid>>(() => new Set<TKeyGrid>())
  const [gridRows, setGridRows] = useState<readonly TRow[]>(rows)
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  const [pendingRowKeys, setPendingRowKeys] = useState<Set<string>>(new Set())
  const [modifiedRowKeys, setModifiedRowKeys] = useState<Set<string>>(new Set())
  const [deletedRows, setDeletedRows] = useState<Map<string, TRow>>(new Map())
  const [rowMutations, setRowMutations] = useState<RowMutationMap>({})
  const [mutationResults, setMutationResults] = useState<MutationResultItem<TRow>[]>([])
  const [selectedFailedKeys, setSelectedFailedKeys] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [writeError, setWriteError] = useState<string | null>(null)
  const [readError, setReadError] = useState<string | null>(null)
  const [formMode, setFormMode] = useState<RowFormMode>('add')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRowKey, setEditingRowKey] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<Partial<TRow>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [copiedCell, setCopiedCell] = useState<{
    readonly row: TRow
    readonly column: CalculatedColumn<TRow, TSummaryRow>
  } | null>(null)

  const baseColumns = useMemo<ReturnType<typeof genColumns>>(
    () => genColumns(direction),
    [direction, genColumns],
  )

  const columns = useMemo<readonly TColumn<TRow, TSummaryRow>[]>(
    () => [SelectColumn as TColumn<TRow, TSummaryRow>, ...baseColumns],
    [baseColumns],
  )

  const getRowKeyValue = (row: TRow): TKeyGrid =>
    row[rowKeyGetterString as keyof TRow] as unknown as TKeyGrid

  const getRowKeyString = (row: TRow): string => String(getRowKeyValue(row))

  const setRowMutationState = (key: string, state: RowMutationState, error?: string) => {
    setRowMutations((prev) => ({ ...prev, [key]: { state, error } }))
  }

  const clearRowMutationState = (key: string) => {
    setRowMutations((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  useEffect(() => {
    setGridRows(rows)
    setPendingRowKeys(new Set())
    setModifiedRowKeys(new Set())
    setDeletedRows(new Map())
    setRowMutations({})
    setMutationResults([])
    setSelectedFailedKeys(new Set())
  }, [rows])

  const summaryRows = useMemo((): readonly TSummaryRow[] => {
    return genSummaryRows ? genSummaryRows(gridRows) : []
  }, [gridRows, genSummaryRows])

  const sortedRows = useMemo((): readonly TRow[] => {
    if (sortColumns.length === 0) return gridRows

    return gridRows.toSorted((a, b) => {
      for (const sort of sortColumns) {
        const compResult = genComparator(sort.columnKey)(a, b)
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult
        }
      }
      return 0
    })
  }, [gridRows, sortColumns, genComparator])

  const rowsBySearchTerm = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return sortedRows

    const filterColumnKeys = columns
      .map((column: TColumn<TRow, TSummaryRow>) => {
        if (isNoSearch(column)) return null

        return column.key
      })
      .filter(Boolean)

    const resSearch = sortedRows.filter((row: TRow) =>
      filterColumnKeys.some((key) => {
        const column = columns.find((col) => col.key === key)

        if (column?.type === 'Select') {
          const selectedOption = column.options?.find(
            (option: OptionsSelect) => option.value === row[key as keyof TRow],
          )
          return String(deepPickStringValue(selectedOption?.label || ''))
            ?.toUpperCase()
            .includes(debouncedSearchTerm)
        }

        return row[key as keyof TRow]?.toString().toUpperCase().includes(debouncedSearchTerm)
      }),
    )
    return resSearch
  }, [debouncedSearchTerm, columns, sortedRows])

  const fieldConfigMap: Partial<Record<keyof TRow & string, RowFieldConfig<TRow>>> =
    toolbarConfig?.fieldConfigs ??
    ({} as Partial<Record<keyof TRow & string, RowFieldConfig<TRow>>>)

  const getToolbarFields = (mode: RowFormMode): ToolbarField<TRow, TSummaryRow>[] => {
    return baseColumns
      .filter((column) => {
        const key = String(column.key) as keyof TRow & string
        const config = fieldConfigMap[key]
        const isKeyField = key === String(rowKeyGetterString)

        if (column.visible === false) return false
        if (isKeyField && !config) return false

        if (mode === 'add' && config?.showInAdd === false) return false
        if (mode === 'edit' && config?.showInEdit === false) return false

        if (column.type === 'ToolBar' || column.type === 'Expanded' || column.type === 'TreeView') {
          return false
        }

        return true
      })
      .map((column) => {
        const key = String(column.key) as keyof TRow & string
        const config = fieldConfigMap[key]

        return {
          key,
          label: config?.label ?? String(column.name ?? key),
          column,
          config,
        }
      })
  }

  const getDefaultFieldValue = (field: ToolbarField<TRow, TSummaryRow>): unknown => {
    const configured = field.config?.defaultValue
    if (typeof configured === 'function') {
      return (configured as () => unknown)()
    }

    if (configured !== undefined) return configured

    if (field.column.type === 'Checkbox' || field.column.type === 'Switch') return false
    if (field.column.type === 'NumberInput') return 0
    return ''
  }

  const openAddForm = () => {
    const fields = getToolbarFields('add')
    const initialValues = fields.reduce((acc, field) => {
      ;(acc as Record<string, unknown>)[field.key] = getDefaultFieldValue(field)
      return acc
    }, {} as Partial<TRow>)

    setFormMode('add')
    setEditingRowKey(null)
    setFormValues(initialValues)
    setFormErrors({})
    setIsFormOpen(true)
  }

  const openEditForm = () => {
    if (selectedRows.size !== 1) return

    const selectedKey = String(Array.from(selectedRows)[0])
    const target = gridRows.find((row) => getRowKeyString(row) === selectedKey)
    if (!target) return

    const fields = getToolbarFields('edit')
    const initialValues = fields.reduce((acc, field) => {
      const value = target[field.key as keyof TRow]
      ;(acc as Record<string, unknown>)[field.key] =
        value === undefined ? getDefaultFieldValue(field) : value
      return acc
    }, {} as Partial<TRow>)

    setFormMode('edit')
    setEditingRowKey(selectedKey)
    setFormValues(initialValues)
    setFormErrors({})
    setIsFormOpen(true)
  }

  const validateForm = (mode: RowFormMode, values: Partial<TRow>): Record<string, string> => {
    const fields = getToolbarFields(mode)
    const errors: Record<string, string> = {}

    fields.forEach((field) => {
      const value = values[field.key as keyof TRow]

      if (field.config?.required && (value === '' || value === undefined || value === null)) {
        errors[field.key] = `${field.label} is required`
        return
      }

      if (field.config?.validate) {
        const message = field.config.validate(value, values)
        if (message) {
          errors[field.key] = message
        }
      }
    })

    return errors
  }

  const markRowAsModified = (key: string) => {
    if (pendingRowKeys.has(key)) return

    setModifiedRowKeys((prev) => {
      const next = new Set(prev)
      next.add(key)
      return next
    })
    setRowMutationState(key, 'modified')
  }

  const handleAddInline = (partialValues?: Partial<TRow>) => {
    const fields = getToolbarFields('add')
    const draft = fields.reduce((acc, field) => {
      const incoming = partialValues?.[field.key as keyof TRow]
      ;(acc as Record<string, unknown>)[field.key] =
        incoming === undefined ? getDefaultFieldValue(field) : incoming
      return acc
    }, {} as Partial<TRow>)

    const generatedKey = `__new_${Date.now()}_${rowIdSeed.current++}`
    ;(draft as Record<string, unknown>)[String(rowKeyGetterString)] = generatedKey

    const row = draft as TRow
    const rowKey = getRowKeyString(row)

    setGridRows((prev) => [...prev, row])
    setPendingRowKeys((prev) => {
      const next = new Set(prev)
      next.add(rowKey)
      return next
    })
    setRowMutationState(rowKey, 'pending')
  }

  const handleFormSubmit = () => {
    const errors = validateForm(formMode, formValues)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) return

    if (formMode === 'add') {
      handleAddInline(formValues)
    } else if (editingRowKey) {
      setGridRows((prev) =>
        prev.map((row) => {
          if (getRowKeyString(row) !== editingRowKey) return row
          return { ...row, ...(formValues as Partial<TRow>) }
        }),
      )
      markRowAsModified(editingRowKey)
    }

    setIsFormOpen(false)
    setEditingRowKey(null)
    setFormValues({})
    setFormErrors({})
  }

  // event handlers functions
  function handleFill({ columnKey, sourceRow, targetRow }: FillEvent<TRow>): TRow {
    return { ...targetRow, [columnKey]: sourceRow[columnKey as keyof TRow] }
  }

  function handleCellCopy(
    { row, column }: CellCopyArgs<NoInfer<TRow>, NoInfer<TSummaryRow>>,
    event: React.ClipboardEvent<HTMLDivElement>,
  ): void {
    // copy highlighted text only
    if (window.getSelection()?.isCollapsed === false) {
      setCopiedCell(null)
      return
    }

    setCopiedCell({ row, column })
    event.clipboardData.setData('text/plain', row[column.key as keyof TRow] as unknown as string)
    event.preventDefault()
  }

  function handleCellPaste(
    { row, column }: CellPasteArgs<NoInfer<TRow>, NoInfer<TSummaryRow>>,
    event: React.ClipboardEvent<HTMLDivElement>,
  ): TRow {
    const targetColumnKey = column.key

    if (copiedCell !== null) {
      const sourceColumnKey = copiedCell.column.key
      const sourceRow = copiedCell.row

      const incompatibleColumns = ['email', 'zipCode', 'date']
      if (
        sourceColumnKey === 'avatar' ||
        ['id', 'avatar'].includes(targetColumnKey) ||
        ((incompatibleColumns.includes(targetColumnKey) ||
          incompatibleColumns.includes(sourceColumnKey)) &&
          sourceColumnKey !== targetColumnKey)
      ) {
        return row
      }

      return { ...row, [targetColumnKey]: sourceRow[sourceColumnKey as keyof TRow] }
    }

    const copiedText = event.clipboardData.getData('text/plain')
    if (copiedText !== '') {
      return { ...row, [targetColumnKey]: copiedText }
    }

    return row
  }

  function rowClass(row: NoInfer<TRow>) {
    const key = getRowKeyString(row)
    const state = rowMutations[key]?.state

    if (copiedCell?.row === row) {
      return 'copied-row-class'
    }

    if (state === 'error') return 'bg-red-50'
    if (state === 'success') return 'bg-green-50'
    if (state === 'modified') return 'bg-amber-50'
    if (state === 'pending') return 'bg-blue-50'

    return 'custom-row-class'
  }

  function handleDisabledRow(row: NoInfer<TRow>) {
    return row[rowKeyGetterString as keyof TRow] === 'id_2'
  }

  function handleRowKeyGetter(row: TRow) {
    return getRowKeyValue(row)
  }

  function handleExportToCsv() {
    flushSync(() => {
      setIsExporting(true)
    })

    exportToCsv(gridRef.current!.element!, `${exportFileName}.csv`)

    flushSync(() => {
      setIsExporting(false)
    })
  }

  function handleCellClick(
    args: CellMouseArgs<NoInfer<TRow>, NoInfer<TSummaryRow>>,
    event: CellMouseEvent,
  ) {
    if (args.column.key === 'title') {
      event.preventGridDefault()
      args.selectCell(true)
      // args.setActivePosition(true);
    }
  }

  function handleCellKeyDown(
    args: CellKeyDownArgs<NoInfer<TRow>, NoInfer<TSummaryRow>>,
    event: CellKeyboardEvent,
  ) {
    if (event.key === 'Escape') {
      setCopiedCell(null)
    }
  }
  const handleDoubleClick = (
    args: CellMouseArgs<NoInfer<TRow>, NoInfer<TSummaryRow>>,
    event: CellMouseEvent,
  ) => {
    logger.debug('DataGrid cell double-clicked', {
      column: args.column.key,
      rowIndex: args.rowIdx,
      eventType: event.type,
    })
  }

  const handleRowsChange = (
    newRows: NoInfer<TRow>[],
    data: RowsChangeData<NoInfer<TRow>, NoInfer<TSummaryRow>>,
  ) => {
    data.indexes.forEach((index) => {
      const nextRow = newRows[index]
      const prevRow = gridRows[index]

      if (!nextRow || !prevRow) return

      const key = getRowKeyString(nextRow)
      if (pendingRowKeys.has(key)) return

      if (JSON.stringify(nextRow) !== JSON.stringify(prevRow)) {
        markRowAsModified(key)
      }
    })

    setGridRows(newRows)

    onRowChange?.(newRows, {
      indexes: data.indexes,
      column: data.column,
    })
  }

  const onSelectedRowsChange = (nextSelectedRows: Set<TKeyGrid>) => {
    setSelectedRows(nextSelectedRows)
  }

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    logger.debug('DataGrid scrolled', {
      eventType: event.type,
    })
  }

  const executeActionSingle = async (
    action: CrudAction,
    rowsForAction: TRow[],
  ): Promise<MutationResultItem<TRow>[]> => {
    const handlers = toolbarConfig?.handlers
    const concurrencyLimit = toolbarConfig?.concurrency?.limit ?? 5
    const delayBetweenBatches = toolbarConfig?.concurrency?.delayBetweenBatches ?? 0

    const settled = await runWithConcurrency(
      rowsForAction,
      async (row) => {
        if (action === 'add') {
          if (!handlers?.onAdd) return row
          return handlers.onAdd(row)
        }

        if (action === 'update') {
          if (!handlers?.onUpdate) return row
          return handlers.onUpdate(row)
        }

        if (!handlers?.onDelete) return undefined
        await handlers.onDelete(row)
        return undefined
      },
      concurrencyLimit,
      delayBetweenBatches,
    )

    return settled.map((result, index) => {
      const sourceRow = rowsForAction[index]
      const key = getRowKeyString(sourceRow)

      if (result.status === 'fulfilled') {
        const resolvedRow =
          action === 'delete' ? sourceRow : ((result.value as TRow | undefined) ?? sourceRow)

        return {
          action,
          key,
          row: resolvedRow,
          status: 'success',
        } satisfies MutationResultItem<TRow>
      }

      return {
        action,
        key,
        row: sourceRow,
        status: 'error',
        error: normalizeErrorMessage(result.reason),
      } satisfies MutationResultItem<TRow>
    })
  }

  const executeActionBatch = async (
    action: CrudAction,
    rowsForAction: TRow[],
  ): Promise<MutationResultItem<TRow>[]> => {
    const handlers = toolbarConfig?.handlers

    if (action === 'add' && handlers?.onAddMany) {
      return handlers.onAddMany(rowsForAction)
    }

    if (action === 'update' && handlers?.onUpdateMany) {
      return handlers.onUpdateMany(rowsForAction)
    }

    if (action === 'delete' && handlers?.onDeleteMany) {
      return handlers.onDeleteMany(rowsForAction)
    }

    return executeActionSingle(action, rowsForAction)
  }

  const executeMutations = async (
    action: CrudAction,
    rowsForAction: TRow[],
  ): Promise<MutationResultItem<TRow>[]> => {
    const mutationMode = toolbarConfig?.mutationMode ?? 'single'

    if (rowsForAction.length === 0) return []

    try {
      if (mutationMode === 'batch') {
        return await executeActionBatch(action, rowsForAction)
      }

      return await executeActionSingle(action, rowsForAction)
    } catch (error) {
      const message = normalizeErrorMessage(error)

      return rowsForAction.map((row) => ({
        action,
        key: getRowKeyString(row),
        row,
        status: 'error',
        error: message,
      }))
    }
  }

  const applyMutationResults = (
    results: MutationResultItem<TRow>[],
    options?: { appendResults?: boolean },
  ) => {
    const appendResults = options?.appendResults ?? false
    const nextRows = [...gridRows]
    const nextPending = new Set(pendingRowKeys)
    const nextModified = new Set(modifiedRowKeys)
    const nextDeleted = new Map(deletedRows)
    const nextMutations = { ...rowMutations }

    const replaceRowByKey = (targetKey: string, row: TRow) => {
      const index = nextRows.findIndex((item) => getRowKeyString(item) === targetKey)
      if (index >= 0) {
        nextRows[index] = row
      }
    }

    results.forEach((result) => {
      const key = result.key

      if (result.status === 'success') {
        if (result.action === 'delete') {
          nextDeleted.delete(key)
          delete nextMutations[key]
        } else {
          const resolvedRow = result.row
          const resolvedKey = getRowKeyString(resolvedRow)

          replaceRowByKey(key, resolvedRow)

          nextPending.delete(key)
          nextModified.delete(key)

          delete nextMutations[key]
          nextMutations[resolvedKey] = { state: 'success' }
        }
      } else {
        const message = result.error ?? result.message ?? 'Unknown error'

        nextMutations[key] = { state: 'error', error: message }

        if (result.action === 'delete') {
          nextDeleted.delete(key)

          if (!nextRows.some((row) => getRowKeyString(row) === key)) {
            nextRows.push(result.row)
          }
        }
      }
    })

    setGridRows(nextRows)
    setPendingRowKeys(nextPending)
    setModifiedRowKeys(nextModified)
    setDeletedRows(nextDeleted)
    setRowMutations(nextMutations)

    setMutationResults((prev) => (appendResults ? [...prev, ...results] : results))
  }

  const handleSaveChanges = async () => {
    if (isSaving) return

    const pendingRows = gridRows.filter((row) => pendingRowKeys.has(getRowKeyString(row)))
    const modifiedRows = gridRows.filter((row) => modifiedRowKeys.has(getRowKeyString(row)))
    const deletedRowsList = Array.from(deletedRows.values())

    if (pendingRows.length === 0 && modifiedRows.length === 0 && deletedRowsList.length === 0) {
      return
    }

    setWriteError(null)
    setIsSaving(true)
    setSelectedFailedKeys(new Set())

    try {
      const addResults = await executeMutations('add', pendingRows)
      const updateResults = await executeMutations('update', modifiedRows)
      const deleteResults = await executeMutations('delete', deletedRowsList)

      const allResults = [...addResults, ...updateResults, ...deleteResults]
      applyMutationResults(allResults)

      const failedCount = allResults.filter((item) => item.status === 'error').length
      if (failedCount > 0) {
        setWriteError(`${failedCount} mutation(s) failed. Check details below and retry.`)
      }
    } catch (error) {
      setWriteError(normalizeErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const retryMutations = async (items: MutationResultItem<TRow>[]) => {
    if (items.length === 0 || isSaving) return

    setIsSaving(true)
    setWriteError(null)

    try {
      const addRows = items.filter((item) => item.action === 'add').map((item) => item.row)
      const updateRows = items.filter((item) => item.action === 'update').map((item) => item.row)
      const deleteRowsToRetry = items
        .filter((item) => item.action === 'delete')
        .map((item) => item.row)

      const addResults = await executeMutations('add', addRows)
      const updateResults = await executeMutations('update', updateRows)
      const deleteResults = await executeMutations('delete', deleteRowsToRetry)

      const merged = [...addResults, ...updateResults, ...deleteResults]
      applyMutationResults(merged, { appendResults: true })
    } catch (error) {
      setWriteError(normalizeErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleRetryOne = (item: MutationResultItem<TRow>) => {
    void retryMutations([item])
  }

  const handleRetryAll = () => {
    const failedItems = mutationResults.filter((item) => item.status === 'error')
    void retryMutations(failedItems)
  }

  const handleRetrySelected = () => {
    const failedItems = mutationResults.filter(
      (item) => item.status === 'error' && selectedFailedKeys.has(item.key),
    )
    void retryMutations(failedItems)
  }

  const handleDeleteRows = () => {
    if (selectedRows.size === 0) return

    if (toolbarConfig?.requireDeleteConfirm) {
      const confirmed = window.confirm(`Delete ${selectedRows.size} selected row(s)?`)
      if (!confirmed) return
    }

    const selectedKeySet = new Set(Array.from(selectedRows).map((key) => String(key)))
    const rowsToDelete = gridRows.filter((row) => selectedKeySet.has(getRowKeyString(row)))

    const nextDeleted = new Map(deletedRows)
    const nextPending = new Set(pendingRowKeys)
    const nextModified = new Set(modifiedRowKeys)

    rowsToDelete.forEach((row) => {
      const key = getRowKeyString(row)

      if (nextPending.has(key)) {
        nextPending.delete(key)
        nextModified.delete(key)
        clearRowMutationState(key)
        return
      }

      nextDeleted.set(key, row)
      setRowMutationState(key, 'deleted')
      nextModified.delete(key)
    })

    setDeletedRows(nextDeleted)
    setPendingRowKeys(nextPending)
    setModifiedRowKeys(nextModified)
    setGridRows((prev) => prev.filter((row) => !selectedKeySet.has(getRowKeyString(row))))
    setSelectedRows(new Set())
  }

  const handleUpdateAction = () => {
    const mode = toolbarConfig?.updateMode ?? 'inline'
    if (mode === 'modal') {
      openEditForm()
      return
    }

    if (selectedRows.size !== 1) return
    const selectedKey = String(Array.from(selectedRows)[0])
    markRowAsModified(selectedKey)
  }

  const handleAddAction = () => {
    const mode = toolbarConfig?.createMode ?? 'inline'
    if (mode === 'modal') {
      openAddForm()
      return
    }

    handleAddInline()
  }

  const handleRefresh = async () => {
    if (!toolbarConfig?.handlers?.onRefresh || isRefreshing) return

    setReadError(null)
    setIsRefreshing(true)
    const requestId = ++refreshRequestId.current

    try {
      const freshRows = await toolbarConfig.handlers.onRefresh(toolbarConfig?.refreshParams)

      if (requestId !== refreshRequestId.current) return

      setGridRows(freshRows)
      setPendingRowKeys(new Set())
      setModifiedRowKeys(new Set())
      setDeletedRows(new Map())
      setRowMutations({})
      setMutationResults([])
      setSelectedFailedKeys(new Set())
      setSelectedRows(new Set())
    } catch (error) {
      setReadError(normalizeErrorMessage(error))
    } finally {
      if (requestId === refreshRequestId.current) {
        setIsRefreshing(false)
      }
    }
  }

  const renderFormField = (field: ToolbarField<TRow, TSummaryRow>) => {
    const value = formValues[field.key as keyof TRow]
    const columnType = field.column.type

    if (columnType === 'Select') {
      return (
        <Select
          value={String(value ?? '')}
          onChange={(event) => {
            const nextValue = event.target.value
            setFormValues((prev) => ({
              ...prev,
              [field.key]: nextValue as TRow[keyof TRow],
            }))
          }}
          options={(field.column.options ?? []).map((option) => ({
            label: String(option.label),
            value: String(option.value),
          }))}
        />
      )
    }

    if (columnType === 'Checkbox' || columnType === 'Switch') {
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => {
            const nextValue = event.target.checked
            setFormValues((prev) => ({
              ...prev,
              [field.key]: nextValue as TRow[keyof TRow],
            }))
          }}
        />
      )
    }

    if (columnType === 'NumberInput') {
      return (
        <Input
          type="number"
          value={String(value ?? '')}
          onChange={(event) => {
            const nextValue = event.target.value === '' ? '' : Number(event.target.value)
            setFormValues((prev) => ({
              ...prev,
              [field.key]: nextValue as TRow[keyof TRow],
            }))
          }}
        />
      )
    }

    return (
      <Input
        value={String(value ?? '')}
        onChange={(event) => {
          const nextValue = event.target.value
          setFormValues((prev) => ({
            ...prev,
            [field.key]: nextValue as TRow[keyof TRow],
          }))
        }}
      />
    )
  }

  const formFields = getToolbarFields(formMode)

  return (
    <>
      <Box className="mb-2 flex flex-col gap-2 rounded-none border-0 bg-transparent p-0 shadow-none">
        <GridToolbar
          selectedCount={selectedRows.size}
          disabledActions={toolbarConfig?.disabledActions}
          isSaving={isSaving}
          isRefreshing={isRefreshing}
          mutationResults={mutationResults}
          selectedFailedKeys={selectedFailedKeys}
          onToggleFailed={(key) => {
            setSelectedFailedKeys((prev) => {
              const next = new Set(prev)
              if (next.has(key)) next.delete(key)
              else next.add(key)
              return next
            })
          }}
          onRetryOne={handleRetryOne}
          onRetryAll={handleRetryAll}
          onRetrySelected={handleRetrySelected}
          onAdd={handleAddAction}
          onUpdate={handleUpdateAction}
          onDelete={handleDeleteRows}
          onSave={handleSaveChanges}
          onRefresh={() => {
            void handleRefresh()
          }}
          readError={readError}
          writeError={writeError}
        />

        <Box className="flex flex-wrap items-center gap-2 rounded-none border-0 bg-transparent p-0 shadow-none">
          {isSearch ? (
            <Input
              onChange={(event) => {
                const value = event.target.value
                setTableSearchTerm(value)
              }}
              value={tableSearchTerm}
              placeholder="Search"
              className="w-[280px]"
            />
          ) : null}

          <Button type="button" size="sm" variant="outline" onClick={handleExportToCsv}>
            Export to CSV
          </Button>
        </Box>
      </Box>

      {copiedCell && (
        <style>
          {`
          .copied-row-class > [aria-colindex="${copiedCell.column.idx + 1}"] {
            background-color: #ccccff;
            &.rdg-cell-dragged-over {
              background-color: #9999ff;
            }
          }
       `}
        </style>
      )}

      <DataGrid<TRow, TSummaryRow, TKeyGrid>
        ref={gridRef}
        style={{
          height: 'calc(100% - 40px)',
          ...(style ?? {}),
        }}
        aria-label={ariaLabel}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        rowHeight={30}
        headerRowHeight={38}
        className="fill-grid rdg-light rdg-custom"
        columns={columns}
        rows={rowsBySearchTerm}
        selectedRows={selectedRows}
        sortColumns={sortColumns}
        topSummaryRows={summaryRows}
        bottomSummaryRows={summaryRows}
        direction={direction}
        enableVirtualization={!isExporting}
        renderers={{ noRowsFallback: <Empty title="No rows available" /> }}
        rowKeyGetter={handleRowKeyGetter}
        onSelectedRowsChange={onSelectedRowsChange}
        onRowsChange={handleRowsChange}
        onSortColumnsChange={setSortColumns}
        onFill={handleFill}
        onCellCopy={handleCellCopy}
        onCellPaste={handleCellPaste}
        isRowSelectionDisabled={handleDisabledRow}
        rowClass={rowClass}
        onCellClick={handleCellClick}
        onCellKeyDown={handleCellKeyDown}
        onCellDoubleClick={handleDoubleClick}
        onScroll={handleScroll}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formMode === 'add' ? 'Add new item' : 'Update item'}</DialogTitle>
            <DialogDescription>
              Form fields are generated from the grid columns and toolbar field configuration.
            </DialogDescription>
          </DialogHeader>

          <Box className="grid max-h-[60vh] grid-cols-1 gap-3 overflow-auto rounded-none border-0 bg-transparent p-0 shadow-none">
            {formFields.map((field) => (
              <Box
                key={field.key}
                className="flex flex-col gap-1 rounded-none border-0 bg-transparent p-0 shadow-none"
              >
                <Label>{field.label}</Label>
                {renderFormField(field)}
                {formErrors[field.key] && (
                  <Inline className="text-xs text-red-600">{formErrors[field.key]}</Inline>
                )}
              </Box>
            ))}
          </Box>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsFormOpen(false)
                setFormErrors({})
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleFormSubmit}>
              {formMode === 'add' ? 'Add to list' : 'Apply update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { AppDataGrid }
