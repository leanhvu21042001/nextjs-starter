import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

import type { Column } from 'react-data-grid'

type HorizontalAlign = 'left' | 'center' | 'right'
type ExcelValue = string | number | boolean | Date | null | undefined

export interface ExcelSelectOption {
  value: string
  label?: string
}

export interface ExcelExportColumnConfig<R> {
  key: string
  type?: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox'
  align?: HorizontalAlign
  dateFormat?: string
  numberFormat?: string
  delimiter?: string
  options?: ExcelSelectOption[]
  width?: number
  header?: string
  mapValue?: (row: R) => ExcelValue
}

export interface ExcelExportOptions<R> {
  sheetName: string
  title?: string
  description?: string
  fileNamePrefix?: string
  excludeKeys?: string[]
  withBorder: boolean
  autoFitColumns: boolean
  addDataValidation: boolean
  headerFillColor: string
  dangerousTextPrefixes: string[]
  defaultDateFormat: string
  defaultColumnWidth: number
  maxValidationRows: number
  columnsConfig: Record<string, ExcelExportColumnConfig<R>>
  mapRow?: (row: R, rowIndex: number) => Partial<Record<string, ExcelValue>>
  afterBuild?: (
    workbook: ExcelJS.Workbook,
    sheet: ExcelJS.Worksheet,
    headerRowIndex: number,
    dataStartRow: number,
  ) => void | Promise<void>
}

export interface ExcelImportOptions {
  headerRowIndex?: number
  mapHeader?: (header: string, index: number) => string
}

const DEFAULT_EXPORT_OPTIONS: Omit<ExcelExportOptions<Record<string, unknown>>, 'columnsConfig'> = {
  sheetName: 'Sheet1',
  withBorder: true,
  autoFitColumns: true,
  addDataValidation: true,
  headerFillColor: 'FF4F81BD',
  dangerousTextPrefixes: ['=', '+', '-', '@'],
  defaultDateFormat: 'dd/mm/yyyy hh:mm',
  defaultColumnWidth: 18,
  maxValidationRows: 1000,
}

const EXCLUDED_COLUMN_KEYS = new Set(['select-row'])

export async function exportToExcel<R extends Record<string, unknown>>(
  rows: R[],
  columns: readonly Column<R, unknown>[],
  fileName = 'export',
  options?: Partial<ExcelExportOptions<R>>,
) {
  const config = mergeExportOptions(options)
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sanitizeWorksheetName(config.sheetName))

  const effectiveColumns = columns.filter((column) => {
    const key = String(column.key)
    if (EXCLUDED_COLUMN_KEYS.has(key)) return false
    if (config.excludeKeys?.includes(key)) return false
    if ('visible' in column && (column as { visible?: boolean }).visible === false) {
      return false
    }
    return true
  })

  const columnDefs = effectiveColumns.map((column) => {
    const key = String(column.key)
    const columnConfig = config.columnsConfig[key]
    return {
      key,
      header: columnConfig?.header ?? getColumnHeader(column),
      width: resolveColumnWidth(column, columnConfig?.width, config.defaultColumnWidth),
      sourceColumn: column,
      config: columnConfig,
    }
  })

  worksheet.columns = columnDefs.map((columnDef) => ({
    key: columnDef.key,
    header: columnDef.header,
    width: columnDef.width,
  }))

  const tempHeaderRows = addTitleRows(
    worksheet,
    config.title,
    config.description,
    columnDefs.length,
  )
  const headerRowIndex = 1 + tempHeaderRows

  styleHeaderRow(worksheet.getRow(headerRowIndex), config.headerFillColor)

  rows.forEach((row, index) => {
    const mappedData = config.mapRow?.(row, index) ?? {}
    const rowData = columnDefs.reduce<Record<string, ExcelValue>>((acc, columnDef) => {
      const configuredValue = columnDef.config?.mapValue?.(row)
      const mappedValue = mappedData[columnDef.key]
      const baseValue = configuredValue ?? mappedValue ?? row[columnDef.key]
      acc[columnDef.key] = normalizeCellValue(
        baseValue,
        columnDef.config,
        config.dangerousTextPrefixes,
      )
      return acc
    }, {})

    const excelRow = worksheet.addRow(rowData)
    styleDataRow(excelRow, columnDefs, headerRowIndex, config.withBorder, config.defaultDateFormat)
  })

  if (config.addDataValidation) {
    applyDataValidation(
      workbook,
      worksheet,
      columnDefs,
      headerRowIndex + 1,
      rows.length,
      config.maxValidationRows,
    )
  }

  if (config.autoFitColumns) {
    autoFitColumns(worksheet, headerRowIndex)
  }

  await config.afterBuild?.(workbook, worksheet, headerRowIndex, headerRowIndex + 1)

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })

  const fileNameWithPrefix = config.fileNamePrefix
    ? `${config.fileNamePrefix}_${fileName}`
    : fileName

  saveAs(blob, `${fileNameWithPrefix}.xlsx`)
}

export async function importFromExcel(
  file: File,
  options?: ExcelImportOptions,
): Promise<Record<string, unknown>[]> {
  if (!file) {
    throw new Error('Please provide a file to import.')
  }

  const data = await file.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(data)

  const worksheet = workbook.worksheets[0]
  if (!worksheet) {
    return []
  }

  const headerRowIndex = options?.headerRowIndex ?? 1
  const headerRow = worksheet.getRow(headerRowIndex)
  const headers: string[] = []

  headerRow.eachCell((cell, colNumber) => {
    const rawHeader = String(cell.text ?? `column${colNumber}`).trim() || `column${colNumber}`
    headers[colNumber - 1] = options?.mapHeader?.(rawHeader, colNumber - 1) ?? rawHeader
  })

  const result: Record<string, unknown>[] = []

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRowIndex) {
      return
    }

    const rowData: Record<string, unknown> = {}
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const key = headers[colNumber - 1] ?? `column${colNumber}`
      rowData[key] = getRawCellValue(cell.value)
    })
    result.push(rowData)
  })

  return result
}

function mergeExportOptions<R extends Record<string, unknown>>(
  options?: Partial<ExcelExportOptions<R>>,
): ExcelExportOptions<R> {
  const defaults = DEFAULT_EXPORT_OPTIONS as Omit<ExcelExportOptions<R>, 'columnsConfig'>

  return {
    ...defaults,
    ...options,
    columnsConfig: options?.columnsConfig ?? {},
  }
}

function getColumnHeader<R extends Record<string, unknown>>(column: Column<R, unknown>): string {
  if (typeof column.name === 'string' && column.name.trim()) {
    return column.name
  }
  return String(column.key)
}

function resolveColumnWidth<R extends Record<string, unknown>>(
  column: Column<R, unknown>,
  widthOverride: number | undefined,
  defaultWidth: number,
): number {
  if (widthOverride && widthOverride > 0) {
    return widthOverride
  }

  if (typeof column.width === 'number') {
    return Math.max(10, Math.round(column.width / 8))
  }

  return defaultWidth
}

function addTitleRows(
  worksheet: ExcelJS.Worksheet,
  title: string | undefined,
  description: string | undefined,
  columnCount: number,
): number {
  let insertedRows = 0

  if (!title && !description) {
    return insertedRows
  }

  if (description) {
    worksheet.spliceRows(1, 0, [description])
    insertedRows += 1
  }

  if (title) {
    worksheet.spliceRows(1, 0, [title])
    insertedRows += 1
  }

  const lastCol = excelColumnName(columnCount)

  if (title) {
    const range = `A1:${lastCol}1`
    worksheet.mergeCells(range)
    const cell = worksheet.getCell('A1')
    cell.font = { size: 16, bold: true, color: { argb: 'FF1F2937' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
  }

  if (description) {
    const rowIndex = title ? 2 : 1
    const range = `A${rowIndex}:${lastCol}${rowIndex}`
    worksheet.mergeCells(range)
    const cell = worksheet.getCell(`A${rowIndex}`)
    cell.font = { size: 12, color: { argb: 'FF4B5563' } }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
  }

  return insertedRows
}

function styleHeaderRow(row: ExcelJS.Row, headerFillColor: string) {
  row.height = 22
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: headerFillColor },
    }
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      bottom: { style: 'thin' },
    }
  })
}

function normalizeCellValue<R extends Record<string, unknown>>(
  value: unknown,
  columnConfig: ExcelExportColumnConfig<R> | undefined,
  dangerousTextPrefixes: string[],
): ExcelValue {
  const cellType = columnConfig?.type

  if (cellType === 'checkbox') {
    return value === true || value === 'true' ? 'true' : 'false'
  }

  if (cellType === 'multiselect') {
    const delimiter = columnConfig?.delimiter ?? ','
    if (Array.isArray(value)) {
      return value.map((item) => String(item)).join(`${delimiter} `)
    }
    return value == null ? '' : String(value)
  }

  if (cellType === 'select' && columnConfig?.options?.length) {
    const raw = value == null ? '' : String(value)
    const selected = columnConfig.options.find((option) => option.value === raw)
    return selected?.label ?? selected?.value ?? raw
  }

  if (cellType === 'date') {
    if (value instanceof Date) {
      return value
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value)
      if (!Number.isNaN(date.getTime())) {
        return date
      }
    }
    return ''
  }

  if (cellType === 'number') {
    if (value === '' || value == null) {
      return 0
    }
    const numeric = Number(value)
    return Number.isFinite(numeric) ? numeric : 0
  }

  if (value == null) {
    return ''
  }

  if (typeof value === 'string') {
    if (dangerousTextPrefixes.some((char) => value.startsWith(char))) {
      return `'${value}`
    }
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean' || value instanceof Date) {
    return value
  }

  return String(value)
}

function styleDataRow<R extends Record<string, unknown>>(
  row: ExcelJS.Row,
  columns: Array<{
    key: string
    config?: ExcelExportColumnConfig<R>
  }>,
  headerRowIndex: number,
  withBorder: boolean,
  defaultDateFormat: string,
) {
  if (row.number <= headerRowIndex) {
    return
  }

  row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    const column = columns[colNumber - 1]
    const type = column?.config?.type
    const explicitAlign = column?.config?.align

    if (withBorder) {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' },
      }
    }

    const horizontal = explicitAlign ?? resolveAlignment(type, cell.value)
    cell.alignment = {
      horizontal,
      vertical: 'middle',
      wrapText: true,
    }

    if (type === 'date') {
      cell.numFmt = column?.config?.dateFormat ?? defaultDateFormat
    }

    if (type === 'number' && column?.config?.numberFormat) {
      cell.numFmt = column.config.numberFormat
    }

    if (type === 'text') {
      cell.numFmt = '@'
    }
  })
}

function resolveAlignment(
  type: ExcelExportColumnConfig<Record<string, unknown>>['type'] | undefined,
  value: ExcelJS.CellValue,
): HorizontalAlign {
  if (type === 'number') {
    return 'right'
  }

  if (type === 'checkbox') {
    return 'center'
  }

  if (typeof value === 'number') {
    return 'right'
  }

  return 'left'
}

function applyDataValidation<R extends Record<string, unknown>>(
  workbook: ExcelJS.Workbook,
  worksheet: ExcelJS.Worksheet,
  columns: Array<{
    key: string
    config?: ExcelExportColumnConfig<R>
  }>,
  dataStartRow: number,
  dataLength: number,
  maxValidationRows: number,
) {
  const validationColumns = columns.filter(
    (column) => (column.config?.options?.length ?? 0) > 0 || column.config?.type === 'checkbox',
  )

  if (validationColumns.length === 0) {
    return
  }

  const helperSheet = workbook.addWorksheet('__validations')
  helperSheet.state = 'veryHidden'

  validationColumns.forEach((column, index) => {
    const options = getValidationOptions(column.config)
    const helperColumn = index + 1
    const helperColumnName = excelColumnName(helperColumn)

    options.forEach((option, optionIndex) => {
      helperSheet.getCell(`${helperColumnName}${optionIndex + 1}`).value = option
    })

    const targetColumnIndex = columns.findIndex((item) => item.key === column.key) + 1
    const targetColumnName = excelColumnName(targetColumnIndex)
    const endRow = Math.max(dataStartRow + dataLength - 1, dataStartRow + maxValidationRows)
    const formula = `'__validations'!$${helperColumnName}$1:$${helperColumnName}$${options.length}`

    for (let row = dataStartRow; row <= endRow; row++) {
      worksheet.getCell(`${targetColumnName}${row}`).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [formula],
        showErrorMessage: true,
      }
    }
  })
}

function getValidationOptions<R extends Record<string, unknown>>(
  config: ExcelExportColumnConfig<R> | undefined,
): string[] {
  if (!config) {
    return []
  }

  if (config.type === 'checkbox') {
    return ['true', 'false']
  }

  return config.options?.map((option) => option.label ?? option.value).filter(Boolean) ?? []
}

function autoFitColumns(worksheet: ExcelJS.Worksheet, minRow = 1) {
  worksheet.columns.forEach((column) => {
    let maxLength = 10

    if (!column.eachCell) {
      return
    }

    column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber < minRow) {
        return
      }

      const value = cell.value
      const valueLength = value == null ? 0 : String(value).length
      if (valueLength > maxLength) {
        maxLength = valueLength
      }
    })

    column.width = Math.min(maxLength + 2, 80)
  })
}

function sanitizeWorksheetName(name: string): string {
  const normalized = (name || 'Sheet1').replace(/[\\/?*\[\]:]/g, '').trim()
  return normalized.substring(0, 31) || 'Sheet1'
}

function excelColumnName(index: number): string {
  let result = ''
  let current = index

  while (current > 0) {
    const remainder = (current - 1) % 26
    result = String.fromCharCode(65 + remainder) + result
    current = Math.floor((current - 1) / 26)
  }

  return result
}

function getRawCellValue(value: ExcelJS.CellValue): unknown {
  if (value == null) {
    return ''
  }

  if (typeof value === 'object' && 'text' in value) {
    return String(value.text)
  }

  if (typeof value === 'object' && 'result' in value) {
    return value.result ?? ''
  }

  return value
}
