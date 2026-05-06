import { Key } from 'react'
import type { Column, Direction } from 'react-data-grid'

export type OptionsSelect = { label: string; value: unknown }

export type TKeyGrid = Key
export type TComparator<TRow> = (a: TRow, b: TRow) => number
export type TRowKey<TRow> = keyof TRow & string
export type TAnyColumnKey<TRow, TSummaryRow> = TRowKey<TRow> | (keyof TSummaryRow & string) | string
export type TColumn<TRow, TSummaryRow> = Column<TRow, TSummaryRow> & {
  type?:
    | 'DatePicker'
    | 'TextEditor'
    | 'Checkbox'
    | 'Select'
    | 'MultipleSelect'
    | 'Cascade'
    | 'ToolBar'
    | 'Password'
    | 'TextInput'
    | 'NumberInput'
    | 'Switch'
    | 'Badge'
    | 'Expanded'
    | 'Tooltip'
    | 'Progress'
    | 'TreeView'
  visible?: boolean
  options?: OptionsSelect[]
  key: TAnyColumnKey<TRow, TSummaryRow>
}

export type TColumnWithRowKey<TRow, TSummaryRow, K extends TRowKey<TRow> = TRowKey<TRow>> = Omit<
  TColumn<TRow, TSummaryRow>,
  'key'
> & {
  key: K
}

export type TGenColumn<
  TRow,
  TSummaryRow,
  K extends TAnyColumnKey<TRow, TSummaryRow> = TRowKey<TRow>,
> = (
  direction: Direction,
) => readonly (Omit<TColumn<NoInfer<TRow>, NoInfer<TSummaryRow>>, 'key'> & { key: K })[]
