import { z } from 'zod'

import {
  authResponseSchema,
  loginPayloadSchema,
  loginUiSchema,
  registerPayloadSchema,
  registerUiSchema,
} from './auth.schema'

export type LoginUiDto = z.infer<typeof loginUiSchema>
export type LoginPayloadDto = z.infer<typeof loginPayloadSchema>
export type RegisterUiDto = z.infer<typeof registerUiSchema>
export type RegisterPayloadDto = z.infer<typeof registerPayloadSchema>
export type AuthResponseDto = z.infer<typeof authResponseSchema>

export type AuthModel = {
  accessToken: string
  user: {
    id: string
    email: string
    name: string
  }
}
