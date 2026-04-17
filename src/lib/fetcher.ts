type QueryPrimitive = string | number | boolean

type QueryParams = Record<string, QueryPrimitive | null | undefined>

type RequestOptions = {
  params?: QueryParams
  headers?: HeadersInit
  body?: unknown
  timeout?: number
  signal?: AbortSignal
}

const DEFAULT_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 10_000
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

function resolveBaseUrl() {
  if (!BASE_URL) {
    return typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  }

  try {
    const url = new URL(BASE_URL)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Invalid API URL protocol')
    }
    return url.origin
  } catch {
    throw new Error('NEXT_PUBLIC_API_URL must be an absolute http(s) URL')
  }
}

export class FetchError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(message)
    this.name = 'FetchError'
  }
}

function buildUrl(path: string, params?: QueryParams) {
  const base = resolveBaseUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${base}${normalizedPath}`)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}

function getAuthHeader() {
  if (typeof window === 'undefined') {
    return {}
  }

  const token = localStorage.getItem('access_token')
  if (!token) {
    return {}
  }

  return { Authorization: `Bearer ${token}` }
}

async function parseResponseBody(response: Response) {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text || undefined
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController()
  const timeoutMs = options.timeout ?? DEFAULT_TIMEOUT
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

  try {
    const headers = new Headers(options.headers)
    headers.set('Accept', 'application/json')

    if (!isFormData && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    const authHeader = getAuthHeader()
    if (authHeader.Authorization) {
      headers.set('Authorization', authHeader.Authorization)
    }

    const response = await fetch(buildUrl(path, options.params), {
      method,
      headers,
      credentials: 'same-origin',
      cache: method === 'GET' ? 'default' : 'no-store',
      body:
        options.body === undefined || options.body === null
          ? undefined
          : isFormData
            ? (options.body as FormData)
            : JSON.stringify(options.body),
      signal: options.signal ?? controller.signal,
    })

    const body = await parseResponseBody(response)

    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }

    if (!response.ok) {
      throw new FetchError(`Request failed with status ${response.status}`, response.status, body)
    }

    return body as T
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new FetchError('Request timeout', 408)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

const fetcher = {
  get<T>(path: string, options?: Omit<RequestOptions, 'body'>) {
    return request<T>('GET', path, options)
  },
  post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) {
    return request<T>('POST', path, { ...options, body })
  },
  put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) {
    return request<T>('PUT', path, { ...options, body })
  },
  delete<T>(path: string, options?: Omit<RequestOptions, 'body'>) {
    return request<T>('DELETE', path, options)
  },
}

export default fetcher
