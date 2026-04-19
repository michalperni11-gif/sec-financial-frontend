import { getToken, clearToken } from '@/lib/auth'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''
if (!BASE_URL) {
  console.warn('[api] NEXT_PUBLIC_API_URL is not set — API calls will fail')
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  }

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown network error'
    throw new ApiError(0, `Network error: ${msg}`)
  }

  if (res.status === 401) {
    clearToken()
    if (typeof window !== 'undefined') {
      window.location.replace('/login')
    }
    throw new ApiError(401, 'Unauthorized')
  }

  if (res.status === 429) {
    throw new ApiError(429, 'Rate limit exceeded — please try again shortly')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = (body as { detail?: string; message?: string }).detail
      ?? (body as { detail?: string; message?: string }).message
      ?? 'Request failed'
    throw new ApiError(res.status, message)
  }

  return res.json() as Promise<T>
}
