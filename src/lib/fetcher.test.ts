import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const ORIGINAL_ENV = process.env

describe('fetcher', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_API_URL: '',
      NEXT_PUBLIC_API_TIMEOUT: '10000',
    }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('builds request URL from runtime origin fallback', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const { default: fetcher } = await import('./fetcher')
    await fetcher.get('/categories', { params: { status: 'active' } })

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost/categories?status=active',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('throws FetchError for non-2xx responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: 'failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const { default: fetcher } = await import('./fetcher')

    await expect(fetcher.get('/categories')).rejects.toMatchObject({
      name: 'FetchError',
      status: 500,
    })
  })

  it('maps abort timeout to FetchError 408', async () => {
    process.env.NEXT_PUBLIC_API_TIMEOUT = '5'

    const fetchMock = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'))
        })
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const { default: fetcher } = await import('./fetcher')

    await expect(fetcher.get('/categories')).rejects.toMatchObject({
      name: 'FetchError',
      status: 408,
      message: 'Request timeout',
    })
  })
})
