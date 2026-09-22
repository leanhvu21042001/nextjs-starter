import { describe, expect, it } from 'vitest'

import { parsePublicEnv, parseServerEnv } from './env'

describe('env parsing', () => {
  it('applies compatible defaults for public env', () => {
    const env = parsePublicEnv({})

    expect(env.NODE_ENV).toBe('development')
    expect(env.NEXT_PUBLIC_API_URL).toBe('')
    expect(env.NEXT_PUBLIC_API_TIMEOUT).toBe(10000)
    expect(env.NEXT_PUBLIC_LOG_TO_FILE).toBe(true)
  })

  it('rejects invalid NEXT_PUBLIC_API_URL', () => {
    expect(() =>
      parsePublicEnv({
        NEXT_PUBLIC_API_URL: 'ftp://api.example.com',
      }),
    ).toThrow('NEXT_PUBLIC_API_URL must be an absolute http(s) URL')
  })

  it('parses server log level when configured', () => {
    const env = parseServerEnv({
      LOG_LEVEL: 'warn',
      NODE_ENV: 'production',
    })

    expect(env.LOG_LEVEL).toBe('warn')
    expect(env.NODE_ENV).toBe('production')
  })
})
