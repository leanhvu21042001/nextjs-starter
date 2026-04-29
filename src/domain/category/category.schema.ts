import { z } from 'zod'

import { ERROR_CODES } from '@/domain/error'

// ─────────────────────────────────────────────────────────────────────────────
// 1. UI SCHEMA — validate dữ liệu nhập từ form (phía client)
//    Dùng để validate trước khi gửi đi, field names match với form fields.
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_STATUS = ['active', 'inactive'] as const

export const categoryUiSchema = z.object({
  name: z
    .string({ error: ERROR_CODES.VALIDATION_REQUIRED })
    .min(2, ERROR_CODES.VALIDATION_MIN_LENGTH)
    .max(100, ERROR_CODES.VALIDATION_MAX_LENGTH)
    .trim(),

  slug: z
    .string()
    .max(120, ERROR_CODES.VALIDATION_MAX_LENGTH)
    .regex(/^[a-z0-9-]*$/, ERROR_CODES.VALIDATION_INVALID_FORMAT)
    .optional()
    .or(z.literal('')),

  description: z.string().max(500, ERROR_CODES.VALIDATION_MAX_LENGTH).optional().or(z.literal('')),

  status: z.enum(CATEGORY_STATUS, { error: ERROR_CODES.VALIDATION_INVALID_ENUM }),
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. PAYLOAD SCHEMAS — validate & shape dữ liệu gửi lên API
//    Field names phải khớp với API contract.
// ─────────────────────────────────────────────────────────────────────────────

export const categoryCreatePayloadSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  status: z.enum(CATEGORY_STATUS),
})

export const categoryUpdatePayloadSchema = categoryCreatePayloadSchema.extend({
  id: z.string().check(z.uuid()),
})

export const categoryDeletePayloadSchema = z.object({
  id: z.string().check(z.uuid()),
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. RESPONSE SCHEMA — validate dữ liệu nhận từ API
//    Dùng để parse & type-check response trước khi đưa vào UI.
// ─────────────────────────────────────────────────────────────────────────────

export const categoryResponseSchema = z.object({
  id: z.string().check(z.uuid()),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  status: z.enum(CATEGORY_STATUS),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})
