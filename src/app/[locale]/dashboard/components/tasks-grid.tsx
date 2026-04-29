'use client'

import { useMemo, useRef, useState } from 'react'
import { Direction, SelectCellFormatter, renderTextEditor } from 'react-data-grid'
import { createPortal } from 'react-dom'

import {
  AppDataGrid,
  type GridToolbarConfig,
  type MutationResultItem,
  type TComparator,
  type TGenColumn,
} from '@/components/AppDataGrid'
import { Box } from '@/components/ui'

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

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const withRandomFailure = async <T,>(task: () => T | Promise<T>, failRate = 0.25): Promise<T> => {
  await delay(120 + Math.floor(Math.random() * 240))

  if (Math.random() < failRate) {
    throw new Error('Simulated network/server failure for demo purposes')
  }

  return task()
}

function createRows(): readonly Row[] {
  const now = Date.now()
  const rows: Row[] = []
  const countrySet = new Set<string>()

  for (let i = 0; i < 80; i++) {
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
          <Box
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
          </Box>,
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
  const [rows, setRows] = useState<readonly Row[]>(createRows)
  const dbRef = useRef<Row[]>(createRows() as Row[])

  const nextNumericId = () =>
    dbRef.current.reduce((max, row) => (row.id > max ? row.id : max), 0) + 1

  const createMutationResult = (
    action: 'add' | 'update' | 'delete',
    row: Row,
    status: 'success' | 'error',
    error?: string,
  ): MutationResultItem<Row> => ({
    action,
    key: String(row.id),
    row,
    status,
    error,
  })

  const toolbarConfig = useMemo<GridToolbarConfig<Row>>(
    () => ({
      createMode: 'modal',
      updateMode: 'modal',
      requireDeleteConfirm: true,
      mutationMode: 'batch',
      concurrency: {
        limit: 4,
        delayBetweenBatches: 60,
      },
      refreshParams: {
        country: 'all',
        minBudget: '0',
      },
      fieldConfigs: {
        id: {
          key: 'id',
          label: 'ID',
          showInAdd: false,
          showInEdit: false,
        },
        title: {
          key: 'title',
          label: 'Task title',
          required: true,
          validate: (value) =>
            String(value ?? '').trim().length < 3 ? 'Title must have at least 3 chars' : null,
        },
        contact: {
          key: 'contact',
          label: 'Contact email',
          required: true,
          validate: (value) =>
            /.+@.+\..+/.test(String(value ?? '')) ? null : 'Contact must be a valid email',
        },
        budget: {
          key: 'budget',
          label: 'Budget',
          required: true,
          defaultValue: 1000,
          validate: (value) => (Number(value) > 0 ? null : 'Budget must be greater than 0'),
        },
        progress: {
          key: 'progress',
          label: 'Progress',
          defaultValue: 0,
          validate: (value) => {
            const n = Number(value)
            return n >= 0 && n <= 100 ? null : 'Progress must be between 0 and 100'
          },
        },
        startTimestamp: {
          key: 'startTimestamp',
          showInAdd: false,
          showInEdit: false,
        },
        endTimestamp: {
          key: 'endTimestamp',
          showInAdd: false,
          showInEdit: false,
        },
      },
      handlers: {
        onAdd: async (row) =>
          withRandomFailure(() => {
            const now = Date.now()
            const persisted: Row = {
              ...row,
              id: nextNumericId(),
              startTimestamp: row.startTimestamp ?? now,
              endTimestamp: row.endTimestamp ?? now + 7 * 24 * 60 * 60 * 1000,
            }
            dbRef.current = [...dbRef.current, persisted]
            setRows([...dbRef.current])
            return persisted
          }, 0.18),

        onUpdate: async (row) =>
          withRandomFailure(() => {
            dbRef.current = dbRef.current.map((item) =>
              item.id === row.id ? { ...item, ...row } : item,
            )
            setRows([...dbRef.current])
            return row
          }, 0.22),

        onDelete: async (row) =>
          withRandomFailure(() => {
            dbRef.current = dbRef.current.filter((item) => item.id !== row.id)
            setRows([...dbRef.current])
          }, 0.14),

        onRefresh: async (params) =>
          withRandomFailure(() => {
            const country = params?.country ?? 'all'
            const minBudget = Number(params?.minBudget ?? 0)
            const filtered = dbRef.current.filter((item) => {
              const byCountry = country === 'all' ? true : item.country === country
              const byBudget = item.budget >= minBudget
              return byCountry && byBudget
            })

            setRows([...filtered])
            return filtered
          }, 0.1),

        onAddMany: async (items) => {
          await delay(250)

          const results = items.map((item) => {
            if (String(item.title).toLowerCase().includes('fail')) {
              return createMutationResult(
                'add',
                item,
                'error',
                'Title contains blocked keyword: fail',
              )
            }

            const now = Date.now()
            const persisted: Row = {
              ...item,
              id: nextNumericId(),
              startTimestamp: item.startTimestamp ?? now,
              endTimestamp: item.endTimestamp ?? now + 7 * 24 * 60 * 60 * 1000,
            }
            dbRef.current = [...dbRef.current, persisted]

            return createMutationResult('add', persisted, 'success')
          })

          setRows([...dbRef.current])
          return results
        },

        onUpdateMany: async (items) => {
          await delay(260)

          const results = items.map((item) => {
            if (item.progress < 0 || item.progress > 100) {
              return createMutationResult(
                'update',
                item,
                'error',
                'Progress out of range (must be 0..100)',
              )
            }

            dbRef.current = dbRef.current.map((dbItem) =>
              dbItem.id === item.id ? { ...dbItem, ...item } : dbItem,
            )

            return createMutationResult('update', item, 'success')
          })

          setRows([...dbRef.current])
          return results
        },

        onDeleteMany: async (items) => {
          await delay(180)

          const results = items.map((item) => {
            if (item.id % 11 === 0) {
              return createMutationResult(
                'delete',
                item,
                'error',
                'Protected row cannot be deleted',
              )
            }

            dbRef.current = dbRef.current.filter((dbItem) => dbItem.id !== item.id)
            return createMutationResult('delete', item, 'success')
          })

          setRows([...dbRef.current])
          return results
        },
      },
    }),
    [],
  )

  return (
    <>
      <AppDataGrid<Row, SummaryRow>
        ariaLabel="Dashboard CRUD Grid Example"
        rowKeyGetterString="id"
        exportFileName="dashboard-crud-grid"
        rows={rows}
        genColumns={genColumns}
        genComparator={getComparator}
        toolbarConfig={toolbarConfig}
        isSearch
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
