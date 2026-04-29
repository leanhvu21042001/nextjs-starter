import { z } from 'zod'

import {
  categoryCreatePayloadSchema,
  categoryDeletePayloadSchema,
  categoryResponseSchema,
  categoryUiSchema,
  categoryUpdatePayloadSchema,
} from './category.schema'

// ─────────────────────────────────────────────────────────────────────────────
// UI DTO — shape của dữ liệu từ form (React Hook Form, etc.)
// ─────────────────────────────────────────────────────────────────────────────
export type CategoryUiDto = z.infer<typeof categoryUiSchema>

// ─────────────────────────────────────────────────────────────────────────────
// PAYLOAD DTOs — shape của dữ liệu gửi lên API
// ─────────────────────────────────────────────────────────────────────────────
export type CategoryCreatePayloadDto = z.infer<typeof categoryCreatePayloadSchema>
export type CategoryUpdatePayloadDto = z.infer<typeof categoryUpdatePayloadSchema>
export type CategoryDeletePayloadDto = z.infer<typeof categoryDeletePayloadSchema>

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE DTO — shape raw của dữ liệu nhận từ API
// ─────────────────────────────────────────────────────────────────────────────
export type CategoryResponseDto = z.infer<typeof categoryResponseSchema>

// ─────────────────────────────────────────────────────────────────────────────
// UI MODEL — shape sau khi transform từ response, dùng trong component
//            (Date thay vì string, fields đã được normalize)
// ─────────────────────────────────────────────────────────────────────────────
export type CategoryModel = {
  id: string
  name: string
  slug: string
  description: string | null
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS LABEL MAP — helper cho UI display
// ─────────────────────────────────────────────────────────────────────────────
export const CATEGORY_STATUS_LABELS: Record<CategoryModel['status'], string> = {
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
}
