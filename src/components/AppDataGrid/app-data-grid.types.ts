import { Key } from 'react'
import type { Column, Direction } from 'react-data-grid'

export type OptionsSelect = { label: string; value: unknown }

export type TKeyGrid = Key
export type TComparator<TRow> = (a: TRow, b: TRow) => number
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
}

export type TGenColumn<TRow, TSummaryRow> = (
  direction: Direction,
) => readonly TColumn<NoInfer<TRow>, NoInfer<TSummaryRow>>[]
