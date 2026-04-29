import { createMapper } from '@/lib/create-mapper'

import {
  categoryCreatePayloadSchema,
  categoryDeletePayloadSchema,
  categoryResponseSchema,
  categoryUiSchema,
  categoryUpdatePayloadSchema,
} from './category.schema'
import type { CategoryModel } from './category.types'

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
// categoryMapper — dùng createMapper factory để enforce pattern chuẩn
// ─────────────────────────────────────────────────────────────────────────────

export const categoryMapper = createMapper({
  // Schemas
  uiSchema: categoryUiSchema,
  createPayloadSchema: categoryCreatePayloadSchema,
  updatePayloadSchema: categoryUpdatePayloadSchema,
  deletePayloadSchema: categoryDeletePayloadSchema,
  responseSchema: categoryResponseSchema,

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

  // Response DTO → UI Model (Date thay string, rename nếu cần)
  fromResponse: (validated): CategoryModel => ({
    id: validated.id,
    name: validated.name,
    slug: validated.slug,
    description: validated.description,
    status: validated.status,
    createdAt: new Date(validated.createdAt),
    updatedAt: new Date(validated.updatedAt),
  }),
})
