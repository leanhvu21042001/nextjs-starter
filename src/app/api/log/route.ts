import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { z } from 'zod'

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
const MAX_META_BYTES = 16 * 1024

const logPayloadSchema = z.object({
  level: z.enum(['debug', 'info', 'warn', 'error']).optional(),
  message: z.string().trim().min(1).max(2000).optional(),
  timestamp: z.iso.datetime().optional(),
  env: z.string().max(50).optional(),
  runtime: z.enum(['server', 'client']).optional(),
  meta: z.unknown().optional(),
})

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
  const parsed = logPayloadSchema.safeParse(payload)
  const data = parsed.success ? parsed.data : {}
  const timestamp = data.timestamp ?? new Date().toISOString()
  const metaRaw = data.meta
  let meta: unknown = undefined

  if (metaRaw !== undefined) {
    const serializedMeta = safeStringify(metaRaw)
    meta =
      Buffer.byteLength(serializedMeta, 'utf8') > MAX_META_BYTES
        ? '[TRUNCATED_META]'
        : JSON.parse(serializedMeta)
  }

  return {
    level: (data.level ?? 'info') as LogLevel,
    message: data.message ?? 'Unknown message',
    timestamp,
    env: data.env ?? 'unknown',
    runtime: data.runtime ?? 'server',
    meta,
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

  try {
    const rawBody = await request.text()
    const bodySize = Buffer.byteLength(rawBody, 'utf8')
    if (bodySize > MAX_BODY_BYTES) {
      return NextResponse.json(
        {
          code: ERROR_CODES.NET_PAYLOAD_TOO_LARGE,
          message: 'Payload too large',
          params: { maxBytes: MAX_BODY_BYTES },
        },
        { status: 413 },
      )
    }

    const body = JSON.parse(rawBody) as IncomingLogPayload
    const payload = sanitizePayload(body)

    const logDir = join(process.cwd(), '.log')
    const fileName = getLogFileName(payload.level, payload.timestamp)
    const filePath = join(logDir, fileName)

    try {
      await mkdir(logDir, { recursive: true })
      await appendFile(filePath, `${safeStringify(payload)}\n`, 'utf8')
    } catch {
      // Never let logging failures break application flow.
    }

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
