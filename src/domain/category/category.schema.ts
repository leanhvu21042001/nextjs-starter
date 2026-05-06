import { z } from 'zod'

import { ERROR_CODES } from '@/domain/error'

enum ECategoryStatus {
  active = 'active',
  inactive = 'inactive',
}

const CATEGORY_STATUS = z.enum([ECategoryStatus.active, ECategoryStatus.inactive])

// * Đây là Raw model từ API (string dates) (Không sử dụng ra bên ngoài)
const categoryModelSchema = z.object({
  id: z.string().check(z.uuidv4()),
  name: z
    .string()
    .trim()
    .min(2, ERROR_CODES.VALIDATION_MIN_LENGTH)
    .max(100, ERROR_CODES.VALIDATION_MAX_LENGTH),
  slug: z
    .string()
    .max(120, ERROR_CODES.VALIDATION_MAX_LENGTH)
    .regex(/^[a-z0-9-]*$/, ERROR_CODES.VALIDATION_INVALID_FORMAT)
    .optional()
    .or(z.literal('')),
  description: z.string().nullable().optional().or(z.literal('')),
  status: CATEGORY_STATUS,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & ENUMS
// ─────────────────────────────────────────────────────────────────────────────

// const CATEGORY_STATUS = categoryModelSchema.shape.status.options

// ─────────────────────────────────────────────────────────────────────────────
// 1. UI SCHEMA — validate dữ liệu nhập từ form (phía client)
//    Dùng để validate trước khi gửi đi, field names match với form fields.
// ─────────────────────────────────────────────────────────────────────────────

const categoryUiSchema = z.object({
  id: categoryModelSchema.shape.id,
  name: categoryModelSchema.shape.name,
  slug: categoryModelSchema.shape.slug,
  description: categoryModelSchema.shape.description,
  status: z.enum(categoryModelSchema.shape.status.options, {
    error: ERROR_CODES.VALIDATION_INVALID_ENUM,
  }),

  // optional fields for UI state, not sent to API if undefined
  createdAt: categoryModelSchema.shape.createdAt.optional(),
  updatedAt: categoryModelSchema.shape.updatedAt.optional(),
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. PAYLOAD SCHEMAS — validate & shape dữ liệu gửi lên API
//    Field names phải khớp với API contract.
// ─────────────────────────────────────────────────────────────────────────────

const categoryCreatePayloadSchema = z.object({
  name: categoryModelSchema.shape.name,
  slug: categoryModelSchema.shape.slug,
  description: categoryModelSchema.shape.description,
  status: categoryModelSchema.shape.status,
})

const categoryUpdatePayloadSchema = categoryCreatePayloadSchema.extend({
  id: categoryModelSchema.shape.id,
  name: categoryModelSchema.shape.name,
  slug: categoryModelSchema.shape.slug,
  description: categoryModelSchema.shape.description,
  status: categoryModelSchema.shape.status,
})

const categoryDeletePayloadSchema = z.object({
  id: categoryModelSchema.shape.id,
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. RESPONSE SCHEMA — validate dữ liệu nhận từ API
//    Dùng để parse & type-check response trước khi đưa vào UI.
// ─────────────────────────────────────────────────────────────────────────────

export const categorySchemas = {
  CATEGORY_STATUS,
  ui: categoryUiSchema,
  createPayload: categoryCreatePayloadSchema,
  updatePayload: categoryUpdatePayloadSchema,
  deletePayload: categoryDeletePayloadSchema,
}
