'use client'

import { AppDataGrid, type TComparator, type TGenColumn } from '@/components/AppDataGrid'
import { useState } from 'react'
import { Direction, renderTextEditor, SelectCellFormatter } from 'react-data-grid'
import { createPortal } from 'react-dom'

const dateFormatter = new Intl.DateTimeFormat(navigator.language)
const currencyFormatter = new Intl.NumberFormat(navigator.language, {
  style: 'currency',
  currency: 'eur',
})

interface Row {
  id: number
  title: string
  client: string
  area: string
  country: string
  contact: string
  assignee: string
  progress: number
  startTimestamp: number
  endTimestamp: number
  budget: number
  transaction: string
  account: string
  version: string
  available: boolean
}

interface SummaryRow {
  id: string
  totalCount: number
  yesCount: number
}

let countries: string[] = []

function createRows(): readonly Row[] {
  const now = Date.now()
  const rows: Row[] = []
  const countrySet = new Set<string>()

  for (let i = 0; i < 1000; i++) {
    const country = `Country #${Math.ceil(i / 50)}`
    countrySet.add(country)

    rows.push({
      id: i,
      title: `Task #${i + 1}`,
      client: `Client #${i + 1}`,
      area: `Area #${i + 1}`,
      country,
      contact: `contact${i + 1}@example.com`,
      assignee: `Assignee #${i + 1}`,
      progress: Math.random() * 100,
      startTimestamp: now - Math.round(Math.random() * 1e10),
      endTimestamp: now + Math.round(Math.random() * 1e10),
      budget: 500 + Math.random() * 10500,
      transaction: `Transaction #${i + 1}`,
      account: `Account #${i + 1}`,
      version: `Version #${i + 1}`,
      available: Math.random() > 0.5,
    })
  }

  countries = [...countrySet].sort(new Intl.Collator().compare)

  return rows
}

function getComparator(sortColumn: string): TComparator<Row> {
  switch (sortColumn) {
    case 'assignee':
    case 'title':
    case 'client':
    case 'area':
    case 'country':
    case 'contact':
    case 'transaction':
    case 'account':
    case 'version':
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn])
      }
    case 'available':
      return (a, b) => {
        return a[sortColumn] === b[sortColumn] ? 0 : a[sortColumn] ? 1 : -1
      }
    case 'id':
    case 'progress':
    case 'startTimestamp':
    case 'endTimestamp':
    case 'budget':
      return (a, b) => {
        return a[sortColumn] - b[sortColumn]
      }
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`)
  }
}

const genColumns: TGenColumn<Row, SummaryRow> = (direction: Direction) => {
  return [
    {
      key: 'id',
      name: 'ID',
      frozen: true,
      resizable: false,
      renderSummaryCell() {
        return <strong>Total</strong>
      },
    },
    {
      key: 'title',
      name: 'Task',
      frozen: true,
      renderEditCell: renderTextEditor,
      renderSummaryCell({ row }: { row: SummaryRow }) {
        return `${row.totalCount} records`
      },
    },
    {
      key: 'client',
      name: 'Client',
      width: 'max-content',
      draggable: true,
      renderEditCell: renderTextEditor,
    },
    {
      key: 'area',
      name: 'Area',
      renderEditCell: renderTextEditor,
    },
    {
      key: 'country',
      name: 'Country',
      renderEditCell: ({
        row,
        onRowChange,
      }: {
        row: Row
        onRowChange: (row: Row, commit?: boolean) => void
      }) => (
        <select
          autoFocus
          value={row.country}
          onChange={(e) => onRowChange({ ...row, country: e.target.value }, true)}
        >
          {countries.map((country) => (
            <option key={country}>{country}</option>
          ))}
        </select>
      ),
    },
    {
      key: 'contact',
      name: 'Contact',
      renderEditCell: renderTextEditor,
    },
    {
      key: 'assignee',
      name: 'Assignee',
      renderEditCell: renderTextEditor,
    },
    {
      key: 'progress',
      name: 'Completion',
      renderCell(props) {
        const value = props.row.progress
        return (
          <>
            <progress max={100} value={value} style={{ inlineSize: 50 }} /> {Math.round(value)}%
          </>
        )
      },
      renderEditCell({ row, onRowChange, onClose }) {
        return createPortal(
          <div
            dir={direction}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              placeItems: 'center',
              background: 'rgb(0 0 0 / 10%)',
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                onClose()
              }
            }}
          >
            <dialog
              open
              style={{
                width: 300,
              }}
            >
              <input
                style={{ width: '100%' }}
                autoFocus
                type="range"
                min="0"
                max="100"
                value={row.progress}
                onChange={(e) => onRowChange({ ...row, progress: e.target.valueAsNumber })}
              />
              <menu
                style={{
                  textAlign: 'end',
                }}
              >
                <button type="button" onClick={() => onClose()}>
                  Cancel
                </button>
                <button type="button" onClick={() => onClose(true)}>
                  Save
                </button>
              </menu>
            </dialog>
          </div>,
          document.body,
        )
      },
      editorOptions: {
        displayCellContent: true,
      },
    },
    {
      key: 'startTimestamp',
      name: 'Start date',
      renderCell(props: { row: Row }) {
        return dateFormatter.format(props.row.startTimestamp)
      },
    },
    {
      key: 'endTimestamp',
      name: 'Deadline',
      renderCell(props: { row: Row }) {
        return dateFormatter.format(props.row.endTimestamp)
      },
    },
    {
      key: 'budget',
      name: 'Budget',
      renderCell(props: { row: Row }) {
        return currencyFormatter.format(props.row.budget)
      },
    },
    {
      key: 'transaction',
      name: 'Transaction type',
    },
    {
      key: 'account',
      name: 'Account',
    },
    {
      key: 'version',
      name: 'Version',
      renderEditCell: renderTextEditor,
    },
    {
      key: 'available',
      name: 'Available',
      renderCell({
        row,
        onRowChange,
        tabIndex,
      }: {
        row: Row
        onRowChange: (row: Row, commit?: boolean) => void
        tabIndex: number
      }) {
        return (
          <SelectCellFormatter
            value={row.available}
            onChange={() => {
              onRowChange({ ...row, available: !row.available })
            }}
            tabIndex={tabIndex}
          />
        )
      },
      renderSummaryCell({
        row: { yesCount, totalCount },
      }: {
        row: { yesCount: number; totalCount: number }
      }) {
        return `${Math.floor((100 * yesCount) / totalCount)}% ✔️`
      },
    },
  ]
}

export function TasksGrid() {
  const [rows] = useState(createRows)

  return (
    <>
      <AppDataGrid<Row, SummaryRow>
        ariaLabel="Common Features Example"
        rowKeyGetterString="id"
        exportFileName="export grid"
        rows={rows}
        genColumns={genColumns}
        genComparator={getComparator}
        genSummaryRows={(rows) => {
          return [
            {
              id: 'total_0',
              totalCount: rows.length,
              yesCount: rows.filter((r) => r.available).length,
            },
          ]
        }}
      />
    </>
  )
}
