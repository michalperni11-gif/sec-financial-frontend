import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiFetch, ApiError } from '@/lib/api'

function mockFetch(status: number, body: unknown) {
  return vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }))
}

describe('apiFetch', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls the correct URL', async () => {
    mockFetch(200, { data: 'ok' })
    await apiFetch('/health')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/health'),
      expect.any(Object)
    )
  })

  it('returns parsed JSON on success', async () => {
    mockFetch(200, { name: 'Michal' })
    const result = await apiFetch<{ name: string }>('/auth/me')
    expect(result).toEqual({ name: 'Michal' })
  })

  it('includes Authorization header when token exists', async () => {
    localStorage.setItem('secbase_jwt', 'mytoken123')
    mockFetch(200, {})
    await apiFetch('/auth/me')
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer mytoken123')
  })

  it('does not include Authorization header when no token', async () => {
    mockFetch(200, {})
    await apiFetch('/health')
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(options.headers['Authorization']).toBeUndefined()
  })

  it('throws ApiError with backend message on 4xx', async () => {
    mockFetch(409, { detail: 'Email already registered.' })
    await expect(apiFetch('/auth/register')).rejects.toThrow('Email already registered.')
  })

  it('throws ApiError with status code', async () => {
    mockFetch(400, { detail: 'Bad request' })
    const err = await apiFetch('/bad').catch(e => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(400)
  })

  it('clears token and throws ApiError on 401', async () => {
    localStorage.setItem('secbase_jwt', 'expiredtoken')
    mockFetch(401, { detail: 'Unauthorized' })
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })
    const err = await apiFetch('/auth/me').catch(e => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(401)
    expect(localStorage.getItem('secbase_jwt')).toBeNull()
  })

  it('throws ApiError with fallback message on 5xx with no detail or message', async () => {
    mockFetch(500, {})
    await expect(apiFetch('/bad')).rejects.toThrow('Request failed')
  })
})
