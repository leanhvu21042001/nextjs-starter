import { TColumn } from './app-data-grid.types'

const keyNoRow = 'STT' // number of row.

export function isNoSearch<TRow, TSummaryRow>(column: TColumn<TRow, TSummaryRow>): boolean {
  // Không hiển thị giao diện không search.
  if (column.visible === false) return true // visible có thể null.
  // STT không search.
  if (column.key === keyNoRow) return true
  // Checkbox không search.
  if (column.type === 'Checkbox') return true

  return false
}

export function isAtBottom({ currentTarget }: React.UIEvent<HTMLDivElement>): boolean {
  return currentTarget.scrollTop + 10 >= currentTarget.scrollHeight - currentTarget.clientHeight;
}