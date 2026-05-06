import { z } from 'zod'

import { categorySchemas } from './category.schema'

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & ENUMS TYPES
// ─────────────────────────────────────────────────────────────────────────────
export type TCategoryStatus = z.infer<typeof categorySchemas.CATEGORY_STATUS>

// ─────────────────────────────────────────────────────────────────────────────
// UI — shape của dữ liệu từ form (React Hook Form, etc.)
// ─────────────────────────────────────────────────────────────────────────────
export type TCategoryUi = z.infer<typeof categorySchemas.ui>

// ─────────────────────────────────────────────────────────────────────────────
// PAYLOAD DTOs — shape của dữ liệu gửi lên API
// ─────────────────────────────────────────────────────────────────────────────
export type TCategoryCreatePayload = z.infer<typeof categorySchemas.createPayload>
export type TCategoryUpdatePayload = z.infer<typeof categorySchemas.updatePayload>
export type TCategoryDeletePayload = z.infer<typeof categorySchemas.deletePayload>
