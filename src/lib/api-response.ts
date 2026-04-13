import { z } from 'zod'

// ─── Generic API Response Wrapper ─────────────────────────────────────────────
// Chuẩn response trả về từ API: { success, message, data }

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
  })

export const apiPaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
      items: z.array(itemSchema),
      total: z.number(),
      page: z.number(),
      pageSize: z.number(),
    }),
  })

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type ApiPaginatedResponse<T> = {
  success: boolean
  message: string
  data: {
    items: T[]
    total: number
    page: number
    pageSize: number
  }
}
