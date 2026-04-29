import { z } from 'zod'

import { ERROR_CODES } from '@/domain/error'

export const loginUiSchema = z.object({
  email: z
    .string({ error: ERROR_CODES.VALIDATION_REQUIRED })
    .email(ERROR_CODES.VALIDATION_INVALID_EMAIL),
  password: z
    .string({ error: ERROR_CODES.VALIDATION_REQUIRED })
    .min(6, ERROR_CODES.VALIDATION_PASSWORD_MIN_LENGTH),
})

export const loginPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const authResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string().check(z.uuid()),
    email: z.string().email(),
    name: z.string(),
  }),
})

export const registerUiSchema = z
  .object({
    name: z
      .string({ error: ERROR_CODES.VALIDATION_REQUIRED })
      .min(2, ERROR_CODES.VALIDATION_INVALID_INPUT),
    email: z
      .string({ error: ERROR_CODES.VALIDATION_REQUIRED })
      .email(ERROR_CODES.VALIDATION_INVALID_EMAIL),
    password: z
      .string({ error: ERROR_CODES.VALIDATION_REQUIRED })
      .min(6, ERROR_CODES.VALIDATION_PASSWORD_MIN_LENGTH),
    confirmPassword: z.string({ error: ERROR_CODES.VALIDATION_REQUIRED }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_CODES.VALIDATION_PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  })

export const registerPayloadSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})
