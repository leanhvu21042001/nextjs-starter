import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

import { NextRequest, NextResponse } from 'next/server'

import { ERROR_CODES } from '@/domain/error'

export const runtime = 'nodejs'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type IncomingLogPayload = {
  level?: LogLevel
  message?: string
  timestamp?: string
  env?: string
  runtime?: 'server' | 'client'
  meta?: unknown
}

const MAX_BODY_BYTES = 32 * 1024

const isAllowedOrigin = (request: NextRequest) => {
  const origin = request.headers.get('origin')
  if (!origin) return true

  const host = request.headers.get('host')
  if (!host) return false

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

const safeStringify = (value: unknown) => {
  const seen = new WeakSet<object>()

  return JSON.stringify(value, (_key, val: unknown) => {
    if (typeof val === 'bigint') return val.toString()

    if (typeof val === 'object' && val !== null) {
      if (seen.has(val as object)) return '[Circular]'
      seen.add(val as object)
    }

    return val
  })
}

const getLogFileName = (level: LogLevel, timestamp: string) => {
  const datePart = timestamp.slice(0, 10)
  return level === 'error' ? `error-${datePart}.log` : `app-${datePart}.log`
}

const sanitizePayload = (payload: IncomingLogPayload) => {
  const level: LogLevel =
    payload.level === 'debug' ||
    payload.level === 'info' ||
    payload.level === 'warn' ||
    payload.level === 'error'
      ? payload.level
      : 'info'

  const timestamp =
    typeof payload.timestamp === 'string' && payload.timestamp.length > 0
      ? payload.timestamp
      : new Date().toISOString()

  return {
    level,
    message:
      typeof payload.message === 'string' && payload.message.length > 0
        ? payload.message.slice(0, 2000)
        : 'Unknown message',
    timestamp,
    env: typeof payload.env === 'string' ? payload.env.slice(0, 50) : 'unknown',
    runtime: payload.runtime === 'client' ? 'client' : 'server',
    meta: payload.meta,
  }
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      {
        code: ERROR_CODES.NET_FORBIDDEN,
        message: 'Forbidden origin',
        params: { resource: 'log' },
      },
      { status: 403 },
    )
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      {
        code: ERROR_CODES.NET_PAYLOAD_TOO_LARGE,
        message: 'Payload too large',
        params: { maxBytes: MAX_BODY_BYTES },
      },
      { status: 413 },
    )
  }

  try {
    const body = (await request.json()) as IncomingLogPayload
    const payload = sanitizePayload(body)

    const logDir = join(process.cwd(), '.log')
    const fileName = getLogFileName(payload.level, payload.timestamp)
    const filePath = join(logDir, fileName)

    await mkdir(logDir, { recursive: true })
    await appendFile(filePath, `${safeStringify(payload)}\n`, 'utf8')

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json(
      {
        code: ERROR_CODES.NET_BAD_REQUEST,
        message: 'Invalid payload',
        params: { resource: 'log' },
      },
      { status: 400 },
    )
  }
}
