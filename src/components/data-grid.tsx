'use client'

import { DataGrid, type DataGridProps } from 'react-data-grid'
import 'react-data-grid/lib/styles.css'

export interface AppDataGridProps<R, SR = unknown> extends DataGridProps<R, SR> {
  height?: number | string
}

/**
 * Molecule component: `AppDataGrid`
 * Bọc lại DataGrid của thư viện, setup styles viền và chiều cao mặc định
 */
export function AppDataGrid<R, SR = unknown>({
  height = 600,
  className,
  ...props
}: AppDataGridProps<R, SR>) {
  return (
    <div
      style={{ height, border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}
      className="w-full"
    >
      <DataGrid className={`rdg-light ${className || ''}`} style={{ height: '100%' }} {...props} />
    </div>
  )
}
