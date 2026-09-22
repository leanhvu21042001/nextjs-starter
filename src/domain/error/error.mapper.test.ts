import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { FetchError } from '@/lib/fetcher'

import { ERROR_CODES } from './error.codes'
import { toAppError } from './error.mapper'

describe('toAppError', () => {
  it('maps FetchError using error envelope code and params', () => {
    const error = new FetchError('Request failed', 400, {
      error: {
        code: ERROR_CODES.NET_CONFLICT,
        params: { resource: 'category' },
      },
    })

    const mapped = toAppError(error)

    expect(mapped.code).toBe(ERROR_CODES.NET_CONFLICT)
    expect(mapped.status).toBe(400)
    expect(mapped.params).toEqual({ resource: 'category' })
  })

  it('maps zod errors to validation code', () => {
    const schema = z.object({
      name: z.string().min(2),
    })
    const parsed = schema.safeParse({ name: '' })

    if (parsed.success) {
      throw new Error('Expected schema parsing to fail')
    }

    const mapped = toAppError(parsed.error)

    expect(mapped.code).toBe(ERROR_CODES.VALIDATION_INVALID_INPUT)
    expect(mapped.category).toBe('validation')
  })

  it('maps unknown errors to SYS_UNEXPECTED', () => {
    const mapped = toAppError(new Error('something else'))

    expect(mapped.code).toBe(ERROR_CODES.SYS_UNEXPECTED)
    expect(mapped.category).toBe('system')
  })
})
