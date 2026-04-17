'use client'
import { exportToCsv } from '@/lib/utils'
import { CSSProperties, Key, useMemo, useRef, useState } from 'react'
import {
  CalculatedColumn,
  CellCopyArgs,
  CellMouseArgs,
  CellMouseEvent,
  CellPasteArgs,
  Column,
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

enum EColumnType {
  DatePicker = 'DatePicker',
  TextEditor = 'TextEditor',
  Checkbox = 'Checkbox',
  Select = 'Select',
  MultipleSelect = 'MultipleSelect',
  Cascade = 'Cascade',
  ToolBar = 'ToolBar',
  Password = 'Password',
  TextInput = 'TextInput',
  NumberInput = 'NumberInput',
  Switch = 'Switch',
  Badge = 'Badge',
  Expanded = 'Expanded',
  Tooltip = 'Tooltip',
  ProgressBar = 'Progress',
  TreeView = 'TreeView',
}

type TKeyGrid = Key
type TComparator<TRow> = (a: TRow, b: TRow) => number
type TColumn<TRow, TSummaryRow> = Column<TRow, TSummaryRow> & {
  type?: EColumnType
  visible?: boolean
  options?: OptionsSelect[]
}
type TGenColumn<TRow, TSummaryRow> = (
  direction: Direction,
) => readonly TColumn<NoInfer<TRow>, NoInfer<TSummaryRow>>[]

type OptionsSelect = { label: string; value: unknown }

export enum EGridSelectionMode {
  multi = 'multi',
  single = 'single',
  none = 'none',
}
export const keyNoRow = 'STT' // number of row.

function isNoSearch<TRow, TSummaryRow>(column: TColumn<TRow, TSummaryRow>): boolean {
  // Không hiển thị giao diện không search.
  if (column.visible === false) return true // visible có thể null.
  // STT không search.
  if (column.key === keyNoRow) return true
  // Checkbox không search.
  if (column.type === 'Checkbox') return true

  return false
}

type TDeepPickStringValue =
  | { props?: { children?: TDeepPickStringValue } }
  | string
  | number
  | undefined
const deepPickStringValue = (param: TDeepPickStringValue) => {
  if (typeof param === 'string' || typeof param === 'number') {
    return param
  }
  if (typeof param === 'object' && param !== null && Object.hasOwnProperty.call(param, 'props')) {
    return deepPickStringValue(param?.props?.children as TDeepPickStringValue)
  }
  return undefined
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

  function rowClass(row: NoInfer<TRow>, rowIdx: number) {
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
        columns={columns}
        rows={rowsBySearchTerm}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        selectedRows={selectedRows}
        rowKeyGetter={(row: TRow) => row[rowKeyGetterString as keyof TRow] as unknown as TKeyGrid}
        onSelectedRowsChange={onSelectedRowsChange}
        onRowsChange={handleRowsChange}
        sortColumns={sortColumns}
        onSortColumnsChange={setSortColumns}
        topSummaryRows={summaryRows}
        bottomSummaryRows={summaryRows}
        className="fill-grid rdg-light rdg-custom"
        direction={direction}
        enableVirtualization={!isExporting}
        //
        onFill={handleFill}
        onCellCopy={handleCellCopy}
        onCellPaste={handleCellPaste}
        rowHeight={30}
        // isRowSelectionDisabled={(row) => row[rowKeyGetterString as keyof TRow] === 'id_2'}
        rowClass={rowClass}
        renderers={{
          noRowsFallback: <Empty content="No rows available" />,
        }}
        onCellClick={handleCellClick}
        onCellKeyDown={(_, event) => {
          if (event.key === 'Escape') {
            setCopiedCell(null)
          }
        }}
        // from eport
        // selectedRows={selectedRows}
        headerRowHeight={38}
        // onSelectedCellChange={typeof onFocus === 'function' ? onFocus : () => {}}
        onCellDoubleClick={handleDoubleClick}
        // handle TreeDataGrid
        onScroll={handleScroll}
      />
    </>
  )
}

export { AppDataGrid, type TComparator, type TGenColumn }
