import { createMapper } from '@/lib/create-mapper'

import { categorySchemas } from './category.schema'
import { TCategoryUi } from './category.types'

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — tự động tạo slug từ name nếu không được điền
// ─────────────────────────────────────────────────────────────────────────────

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu tiếng Việt
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// ─────────────────────────────────────────────────────────────────────────────
// Dùng createMapper factory để enforce pattern chuẩn
// ─────────────────────────────────────────────────────────────────────────────

export const categoryMapper = createMapper({
  // Schemas
  uiSchema: categorySchemas.ui,
  createPayloadSchema: categorySchemas.createPayload,
  updatePayloadSchema: categorySchemas.updatePayload,
  deletePayloadSchema: categorySchemas.deletePayload,
  responseSchema: categorySchemas.ui,

  // UI DTO → Create Payload
  toCreatePayload: (validated) => ({
    name: validated.name,
    slug: validated.slug?.trim() || generateSlug(validated.name),
    description: validated.description?.trim() || null,
    status: validated.status,
  }),

  // UI DTO + id → Update Payload
  toUpdatePayload: (validated, id) => ({
    id,
    name: validated.name,
    slug: validated.slug?.trim() || generateSlug(validated.name),
    description: validated.description?.trim() || null,
    status: validated.status,
  }),

  // Response DTO → UI Model
  fromResponse: (validated): TCategoryUi => {
    return {
      id: validated.id,
      name: validated.name,
      slug: validated.slug,
      description: validated.description,
      status: validated.status,
      createdAt: validated.createdAt,
      updatedAt: validated.updatedAt,
    }
  },
})
