'use client'

import React, { useState } from 'react'
import { SelectColumn, renderTextEditor as textEditor, type Column } from 'react-data-grid'
import { exportToExcel } from '@/lib/exportExcel'
import { AppDataGrid } from '@/components/data-grid'
import { Button } from '@/components/ui/button'

interface Row {
  id: number
  title: string
  client: string
  area: string
  country: string
  contact: string
  assignee: string
  progress: number
  startTimestamp: string
  endTimestamp: string
  budget: number
  transaction: string
  account: string
  version: string
  status: string
}

function createRows(): Row[] {
  const rows: Row[] = []
  for (let i = 1; i < 100; i++) {
    rows.push({
      id: i,
      title: `Task ${i}`,
      client: i % 2 === 0 ? 'MegaCorp' : 'StartupInc',
      area: 'IT',
      country: i % 3 === 0 ? 'USA' : 'Vietnam',
      contact: 'John Doe',
      assignee: 'Alice',
      progress: Math.floor(Math.random() * 100),
      startTimestamp: '2023-01-01',
      endTimestamp: '2023-12-31',
      budget: Math.floor(Math.random() * 10000),
      transaction: `TXN-${i}`,
      account: `ACC-${i}`,
      version: '1.0',
      status: i % 2 === 0 ? 'Pending' : 'Done',
    })
  }
  return rows
}

const columns: readonly Column<Row>[] = [
  SelectColumn,
  { key: 'id', name: 'ID', width: 80, resizable: true },
  { key: 'title', name: 'Title', renderEditCell: textEditor, resizable: true },
  { key: 'client', name: 'Client', renderEditCell: textEditor, resizable: true },
  { key: 'country', name: 'Country', renderEditCell: textEditor, resizable: true },
  {
    key: 'status',
    name: 'Status',
    renderCell: ({ row }) => (
      <span
        style={{
          padding: '2px 8px',
          borderRadius: '12px',
          backgroundColor: row.status === 'Done' ? '#e2fee2' : '#fee2e2',
          color: row.status === 'Done' ? '#0f766e' : '#991b1b',
          fontWeight: 500,
        }}
      >
        {row.status}
      </span>
    ),
    renderEditCell: textEditor,
  },
  { key: 'budget', name: 'Budget ($)', renderEditCell: textEditor },
]

function rowKeyGetter(row: Row) {
  return row.id
}

/**
 * Organism Component: `TasksGrid`
 * Đây là khối chứa business logic riêng biệt liên quan đến Grid Quản lý tasks
 */
export function TasksGrid() {
  const [rows, setRows] = useState(createRows)
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<React.Key>>(() => new Set())

  function handleExport() {
    exportToExcel(rows, columns, 'Tasks_Data')
  }

  return (
    <div className="flex flex-col gap-4 p-6 w-full mt-4 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-bold">Danh sách công việc</h2>
          <p className="text-sm text-gray-500">
            Atomic Design: Organism - Hỗ trợ Export và Copy/Paste DataGrid
          </p>
        </div>
        <Button onClick={handleExport}>Export to Excel</Button>
      </div>

      <AppDataGrid
        columns={columns}
        rows={rows}
        onRowsChange={setRows}
        rowKeyGetter={rowKeyGetter}
        selectedRows={selectedRows}
        onSelectedRowsChange={setSelectedRows}
      />
    </div>
  )
}
