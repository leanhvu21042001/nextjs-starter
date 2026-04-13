import { clsx, type ClassValue } from 'clsx'
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
