'use client'
import { deepPickStringValue, exportToCsv } from '@/lib/utils'
import { CSSProperties, useMemo, useRef, useState } from 'react'
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

import { Input, Empty } from '../ui'
import useDebounce from '@/hooks/use-debounce'
import type {
  OptionsSelect,
  TColumn,
  TComparator,
  TGenColumn,
  TKeyGrid,
} from './app-data-grid.types'
import { isNoSearch } from './app-data-grid.utils'

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
}) {
  // support states
  const gridRef = useRef<DataGridHandle>(null)
  const [isExporting, setIsExporting] = useState(false)

  const [tableSearchTerm, setTableSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce((tableSearchTerm || '').trim().toUpperCase())

  // data states
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<TKeyGrid>>(() => new Set<TKeyGrid>())
  const [gridRows, setGridRows] = useState<readonly TRow[]>(rows)
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  const [copiedCell, setCopiedCell] = useState<{
    readonly row: TRow
    readonly column: CalculatedColumn<TRow, TSummaryRow>
  } | null>(null)

  const columns = useMemo<ReturnType<typeof genColumns>>(
    () => [SelectColumn, ...genColumns(direction)],
    [direction, genColumns],
  )

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
    // console.log({
    //   row,
    //   rowIdx,
    // })

    if (copiedCell?.row === row) {
      return 'copied-row-class'
    }

    // const isRowDisabled = row.isRowDisabled ?? false
    // return isRowDisabled ? 'rdg-row-disabled' : undefined
    return 'custom-row-class'
  }

  function handleDisabledRow(row: NoInfer<TRow>) {
    return row[rowKeyGetterString as keyof TRow] === 'id_2'
  }

  function handleRowKeyGetter(row: TRow) {
    return row[rowKeyGetterString as keyof TRow] as unknown as TKeyGrid
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
    console.log({
      args,
      event,
    })
  }

  const handleRowsChange = (
    newRows: NoInfer<TRow>[],
    data: RowsChangeData<NoInfer<TRow>, NoInfer<TSummaryRow>>,
  ) => {
    // Update state with filtered changes
    setGridRows(newRows)

    // Call external handler with filtered changes
    onRowChange?.(newRows, {
      indexes: data.indexes,
      column: data.column,
    })
  }

  const onSelectedRowsChange = (nextSelectedRows: Set<TKeyGrid>) => {
    setSelectedRows(nextSelectedRows)
  }

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    console.log({
      event,
    })
  }

  // logic and render functions

  // async functions

  // effect functions

  // condition render or logs

  return (
    <>
      <div>
        {isSearch ? (
          <Input
            onChange={(event) => {
              const value = event.target.value
              setTableSearchTerm(value)
            }}
            value={tableSearchTerm}
            placeholder="Tìm kiếm"
            style={{
              width: '280px',
              margin: '12px 0',
              height: 'fit-content',
            }}
          />
        ) : null}
        <button type="button" onClick={handleExportToCsv}>
          Export to CSV
        </button>
      </div>

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
        renderers={{ noRowsFallback: <Empty content="No rows available" /> }}
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
    </>
  )
}

export { AppDataGrid }
