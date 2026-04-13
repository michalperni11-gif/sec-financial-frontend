import { describe, it, expect, beforeEach } from 'vitest'
import { getToken, setToken, clearToken } from '@/lib/auth'

describe('auth token helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no token is stored', () => {
    expect(getToken()).toBeNull()
  })

  it('stores and retrieves a token', () => {
    setToken('test_token_abc123')
    expect(getToken()).toBe('test_token_abc123')
  })

  it('overwrites an existing token', () => {
    setToken('old_token')
    setToken('new_token')
    expect(getToken()).toBe('new_token')
  })

  it('clears the token', () => {
    setToken('test_token_abc123')
    clearToken()
    expect(getToken()).toBeNull()
  })
})
