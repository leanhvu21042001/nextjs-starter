import { z } from 'zod'

// ─────────────────────────────────────────────────────────────────────────────
// 1. UI SCHEMA — validate dữ liệu nhập từ form (phía client)
//    Dùng để validate trước khi gửi đi, field names match với form fields.
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_STATUS = ['active', 'inactive'] as const

export const categoryUiSchema = z.object({
  name: z
    .string({ error: 'Tên danh mục là bắt buộc' })
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự')
    .max(100, 'Tên danh mục không được vượt quá 100 ký tự')
    .trim(),

  slug: z
    .string()
    .max(120, 'Slug không được vượt quá 120 ký tự')
    .regex(/^[a-z0-9-]*$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang')
    .optional()
    .or(z.literal('')),

  description: z
    .string()
    .max(500, 'Mô tả không được vượt quá 500 ký tự')
    .optional()
    .or(z.literal('')),

  status: z.enum(CATEGORY_STATUS, { error: 'Trạng thái không hợp lệ' }),
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
