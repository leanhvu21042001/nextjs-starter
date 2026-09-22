import { z } from 'zod'

const nodeEnvSchema = z.enum(['development', 'production', 'test']).default('development')
const logLevelSchema = z.enum(['debug', 'info', 'warn', 'error'])
const publicApiUrlSchema = z
  .string()
  .trim()
  .default('')
  .refine((value) => {
    if (!value) return true

    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }, 'NEXT_PUBLIC_API_URL must be an absolute http(s) URL')

const publicEnvSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  NEXT_PUBLIC_API_URL: publicApiUrlSchema,
  NEXT_PUBLIC_API_TIMEOUT: z.coerce.number().int().positive().default(10_000),
  NEXT_PUBLIC_LOG_LEVEL: logLevelSchema.optional(),
  NEXT_PUBLIC_LOG_TO_FILE: z
    .string()
    .optional()
    .transform((value) => value !== 'false'),
})

const serverEnvSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  LOG_LEVEL: logLevelSchema.optional(),
})

export type RuntimeLogLevel = z.output<typeof logLevelSchema>
export type NodeEnv = z.output<typeof nodeEnvSchema>
export type PublicEnv = z.output<typeof publicEnvSchema>
export type ServerEnv = z.output<typeof serverEnvSchema>

type EnvSource = Record<string, string | undefined>

export function parsePublicEnv(source: EnvSource = process.env): PublicEnv {
  return publicEnvSchema.parse(source)
}

export function parseServerEnv(source: EnvSource = process.env): ServerEnv {
  return serverEnvSchema.parse(source)
}

const publicEnv = parsePublicEnv()

export function getNodeEnv(): NodeEnv {
  return publicEnv.NODE_ENV
}

export function getApiBaseUrl(): string {
  return publicEnv.NEXT_PUBLIC_API_URL
}

export function getApiTimeout(): number {
  return publicEnv.NEXT_PUBLIC_API_TIMEOUT
}

export function shouldPersistClientLogToFile(): boolean {
  return publicEnv.NEXT_PUBLIC_LOG_TO_FILE
}

export function getConfiguredLogLevel(runtime: 'server' | 'client'): RuntimeLogLevel | undefined {
  if (runtime === 'client') {
    return publicEnv.NEXT_PUBLIC_LOG_LEVEL
  }

  return parseServerEnv().LOG_LEVEL
}
