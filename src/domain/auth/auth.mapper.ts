import { z } from 'zod'

import { createMapper } from '@/lib/create-mapper'

import {
  authResponseSchema,
  loginPayloadSchema,
  loginUiSchema,
  registerPayloadSchema,
  registerUiSchema,
} from './auth.schema'
import type { AuthModel } from './auth.types'

// Fallback schemas for updates/deletes that don't apply to login
const emptySchema = z.object({})

export const authMapper = createMapper({
  uiSchema: loginUiSchema,
  createPayloadSchema: loginPayloadSchema,
  updatePayloadSchema: emptySchema,
  deletePayloadSchema: emptySchema,
  responseSchema: authResponseSchema,

  // UI DTO -> Payload
  toCreatePayload: (validated) => ({
    email: validated.email,
    password: validated.password,
  }),

  toUpdatePayload: () => ({}),

  // Response -> UI Model
  fromResponse: (validated): AuthModel => ({
    accessToken: validated.accessToken,
    user: {
      id: validated.user.id,
      email: validated.user.email,
      name: validated.user.name,
    },
  }),
})

export const registerMapper = createMapper({
  uiSchema: registerUiSchema,
  createPayloadSchema: registerPayloadSchema,
  updatePayloadSchema: emptySchema,
  deletePayloadSchema: emptySchema,
  responseSchema: authResponseSchema,

  // UI DTO -> Payload
  toCreatePayload: (validated) => ({
    name: validated.name,
    email: validated.email,
    password: validated.password,
  }),

  toUpdatePayload: () => ({}),

  // Response -> UI Model (Sử dụng lại logic của auth)
  fromResponse: (validated): AuthModel => ({
    accessToken: validated.accessToken,
    user: {
      id: validated.user.id,
      email: validated.user.email,
      name: validated.user.name,
    },
  }),
})
