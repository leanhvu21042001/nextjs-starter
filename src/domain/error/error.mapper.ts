import { z } from 'zod'

import { FetchError } from '@/lib/fetcher'

import { ERROR_CODES, isErrorCode } from './error.codes'
import { AppError } from './error.types'

type ErrorBody = {
  code?: string
  message?: string
  params?: Record<string, string | number | boolean>
  error?: {
    code?: string
    message?: string
    params?: Record<string, string | number | boolean>
  }
}

function getCodeFromErrorBody(data: unknown) {
  const body = data as ErrorBody | undefined

  if (isErrorCode(body?.code)) {
    return body.code
  }

  if (isErrorCode(body?.error?.code)) {
    return body.error.code
  }

  return null
}

function getParamsFromErrorBody(data: unknown) {
  const body = data as ErrorBody | undefined

  if (body?.params && typeof body.params === 'object') {
    return body.params
  }

  if (body?.error?.params && typeof body.error.params === 'object') {
    return body.error.params
  }

  return undefined
}

function getCustomMessageFromErrorBody(data: unknown) {
  const body = data as ErrorBody | undefined

  if (typeof body?.message === 'string' && body.message.trim().length > 0) {
    return body.message
  }

  if (typeof body?.error?.message === 'string' && body.error.message.trim().length > 0) {
    return body.error.message
  }

  return undefined
}

function mapStatusToCode(status: number) {
  if (status === 400) return ERROR_CODES.NET_BAD_REQUEST
  if (status === 401) return ERROR_CODES.NET_UNAUTHORIZED
  if (status === 403) return ERROR_CODES.NET_FORBIDDEN
  if (status === 404) return ERROR_CODES.NET_NOT_FOUND
  if (status === 409) return ERROR_CODES.NET_CONFLICT
  if (status === 413) return ERROR_CODES.NET_PAYLOAD_TOO_LARGE
  if (status === 408) return ERROR_CODES.NET_TIMEOUT
  if (status >= 500) return ERROR_CODES.NET_SERVER_ERROR
  return ERROR_CODES.SYS_UNEXPECTED
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof FetchError) {
    const code = getCodeFromErrorBody(error.data) ?? mapStatusToCode(error.status)

    return new AppError(code, {
      category: 'network',
      status: error.status,
      params: getParamsFromErrorBody(error.data),
      customMessage: getCustomMessageFromErrorBody(error.data),
      cause: error,
    })
  }

  if (error instanceof z.ZodError) {
    const firstMessage = error.issues[0]?.message
    const code = isErrorCode(firstMessage) ? firstMessage : ERROR_CODES.VALIDATION_INVALID_INPUT

    return new AppError(code, {
      category: 'validation',
      cause: error,
    })
  }

  if (error instanceof Error && isErrorCode(error.message)) {
    return new AppError(error.message, {
      category: 'system',
      cause: error,
    })
  }

  return new AppError(ERROR_CODES.SYS_UNEXPECTED, {
    category: 'system',
    cause: error,
  })
}
