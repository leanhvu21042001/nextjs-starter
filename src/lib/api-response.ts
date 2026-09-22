import { z } from 'zod'

const errorParamsSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
const errorDetailSchema = z.object({
  code: z.string().optional(),
  message: z.string().optional(),
  params: errorParamsSchema.optional(),
})

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

export const apiErrorResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  code: z.string().optional(),
  params: errorParamsSchema.optional(),
  error: errorDetailSchema.optional(),
})

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

export type ApiErrorParams = z.infer<typeof errorParamsSchema>
export type ApiErrorDetail = z.infer<typeof errorDetailSchema>
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>
