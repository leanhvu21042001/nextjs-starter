import type { ErrorCode } from './error.codes'

export type ErrorCategory = 'validation' | 'auth' | 'network' | 'permission' | 'business' | 'system'

export type ErrorParams = Record<string, string | number | boolean>

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly options?: {
      category?: ErrorCategory
      status?: number
      params?: ErrorParams
      customMessage?: string
      cause?: unknown
    },
  ) {
    super(code)
    this.name = 'AppError'
  }

  get category(): ErrorCategory {
    return this.options?.category ?? 'system'
  }

  get status(): number | undefined {
    return this.options?.status
  }

  get params(): ErrorParams | undefined {
    return this.options?.params
  }

  get customMessage(): string | undefined {
    return this.options?.customMessage
  }
}
