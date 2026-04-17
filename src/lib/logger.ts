type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogMeta = Record<string, unknown>

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
}

const isServer = typeof window === 'undefined'

const normalizeLevel = (value?: string | null): LogLevel => {
  if (!value) return process.env.NODE_ENV === 'production' ? 'info' : 'debug'

  const normalized = value.toLowerCase()

  if (
    normalized === 'debug' ||
    normalized === 'info' ||
    normalized === 'warn' ||
    normalized === 'error'
  ) {
    return normalized
  }

  return process.env.NODE_ENV === 'production' ? 'info' : 'debug'
}

const getConfiguredLevel = (): LogLevel => {
  if (isServer) {
    return normalizeLevel(process.env.LOG_LEVEL)
  }

  return normalizeLevel(process.env.NEXT_PUBLIC_LOG_LEVEL)
}

const shouldLog = (level: LogLevel): boolean => {
  const activeLevel = getConfiguredLevel()
  return LEVEL_ORDER[level] >= LEVEL_ORDER[activeLevel]
}

const normalizeMeta = (meta?: LogMeta | Error): LogMeta | undefined => {
  if (!meta) return undefined

  if (meta instanceof Error) {
    return {
      name: meta.name,
      message: meta.message,
      stack: meta.stack,
    }
  }

  return meta
}

const write = (level: LogLevel, message: string, meta?: LogMeta | Error) => {
  if (!shouldLog(level)) return

  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV ?? 'development',
    runtime: isServer ? 'server' : 'client',
    ...(normalizeMeta(meta) ? { meta: normalizeMeta(meta) } : {}),
  }

  switch (level) {
    case 'debug':
      console.debug(payload)
      return
    case 'info':
      console.info(payload)
      return
    case 'warn':
      console.warn(payload)
      return
    case 'error':
      console.error(payload)
      return
  }
}

export const logger = {
  debug: (message: string, meta?: LogMeta | Error) => write('debug', message, meta),
  info: (message: string, meta?: LogMeta | Error) => write('info', message, meta),
  warn: (message: string, meta?: LogMeta | Error) => write('warn', message, meta),
  error: (message: string, meta?: LogMeta | Error) => write('error', message, meta),
}

export type { LogLevel, LogMeta }
