type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogMeta = Record<string, unknown>
type LogPayload = {
  level: LogLevel
  message: string
  timestamp: string
  env: string
  runtime: 'server' | 'client'
  meta?: LogMeta
}

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

  const runtime: 'server' | 'client' = isServer ? 'server' : 'client'

  const payload: LogPayload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV ?? 'development',
    runtime,
    ...(normalizeMeta(meta) ? { meta: normalizeMeta(meta) } : {}),
  }

  void persistLogToFile(payload)

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

const shouldPersistLogToFile = () => {
  if (isServer) return false
  if (process.env.NEXT_PUBLIC_LOG_TO_FILE === 'false') return false
  return true
}

const safeStringify = (value: unknown) => {
  const seen = new WeakSet<object>()

  return JSON.stringify(value, (_key, val: unknown) => {
    if (typeof val === 'bigint') {
      return val.toString()
    }

    if (typeof val === 'object' && val !== null) {
      if (seen.has(val as object)) {
        return '[Circular]'
      }
      seen.add(val as object)
    }

    return val
  })
}

const persistLogToFile = async (payload: LogPayload) => {
  if (!shouldPersistLogToFile()) return

  try {
    const body = safeStringify(payload)

    if (
      !isServer &&
      typeof navigator !== 'undefined' &&
      typeof navigator.sendBeacon === 'function'
    ) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon('/api/log', blob)
      return
    }

    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
      cache: 'no-store',
    })
  } catch (error) {
    // Never let logging failures break application flow.
    console.error({
      level: 'error',
      message: 'Failed to persist log file',
      timestamp: new Date().toISOString(),
      runtime: isServer ? 'server' : 'client',
      meta: normalizeMeta(error as Error),
    })
  }
}

export const logger = {
  debug: (message: string, meta?: LogMeta | Error) => write('debug', message, meta),
  info: (message: string, meta?: LogMeta | Error) => write('info', message, meta),
  warn: (message: string, meta?: LogMeta | Error) => write('warn', message, meta),
  error: (message: string, meta?: LogMeta | Error) => write('error', message, meta),
}

export type { LogLevel, LogMeta }
