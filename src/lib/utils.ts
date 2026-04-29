import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

/**
 * Thông minh merge className tailwind
 * Giải quyết các trường hợp conflict class (ví dụ: px-4 và px-6)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Trích xuất Error Object thành Human-readable String
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues.map((e) => e.message).join(', ')
  }

  if (error instanceof Error) {
    return error.message
  }

  // Fallback pattern cho các object có type giống Zod error issues trả về từ throw
  const err = error as { issues?: { message: string }[]; message?: string }
  if (err?.issues && err.issues.length > 0) {
    return err.issues[0].message
  }

  return err?.message || 'Có lỗi hệ thống xảy ra. Vui lòng thử lại.'
}

export function exportToCsv(gridEl: HTMLDivElement, fileName: string) {
  const { head, body, foot } = getGridContent(gridEl)
  const content = [...head, ...body, ...foot]
    .map((cells) => cells.map(serialiseCellValue).join(','))
    .join('\n')

  downloadFile(fileName, new Blob([content], { type: 'text/csv;charset=utf-8;' }))
}

function getGridContent(gridEl: HTMLDivElement) {
  return {
    head: getRows('.rdg-header-row'),
    body: getRows('.rdg-row:not(.rdg-summary-row)'),
    foot: getRows('.rdg-summary-row'),
  }

  function getRows(selector: string) {
    return Array.from(gridEl.querySelectorAll<HTMLDivElement>(selector)).map((gridRow) => {
      return Array.from(gridRow.querySelectorAll<HTMLDivElement>('.rdg-cell')).map(
        (gridCell) => gridCell.innerText,
      )
    })
  }
}

function serialiseCellValue(value: unknown) {
  if (typeof value === 'string') {
    const formattedValue = value.replace(/"/g, '""')
    return formattedValue.includes(',') ? `"${formattedValue}"` : formattedValue
  }
  return value
}

function downloadFile(fileName: string, data: Blob) {
  const downloadLink = document.createElement('a')
  downloadLink.download = fileName
  const url = URL.createObjectURL(data)
  downloadLink.href = url
  downloadLink.click()
  URL.revokeObjectURL(url)
}

type TDeepPickStringValue =
  | { props?: { children?: TDeepPickStringValue } }
  | string
  | number
  | undefined
export const deepPickStringValue = (param: TDeepPickStringValue): string | number | undefined => {
  if (typeof param === 'string' || typeof param === 'number') {
    return param
  }
  if (typeof param === 'object' && param !== null && Object.hasOwnProperty.call(param, 'props')) {
    return deepPickStringValue(param?.props?.children as TDeepPickStringValue)
  }
  return undefined
}
