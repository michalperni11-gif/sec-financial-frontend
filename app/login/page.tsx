'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthCard } from '@/components/auth/AuthCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiFetch, ApiError } from '@/lib/api'
import { setToken } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  const emailNotVerified = error.toLowerCase().includes('not verified')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setResendSent(false)
    setLoading(true)
    try {
      const { access_token } = await apiFetch<{ access_token: string; token_type: string }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) }
      )
      setToken(access_token)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResendLoading(true)
    try {
      await apiFetch('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setResendSent(true)
    } catch {
      // silently ignore — backend always returns success to prevent enumeration
      setResendSent(true)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <AuthCard title="Sign in to SECfinAPI">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <div>
            <p className="text-sm text-red-400">{error}</p>
            {emailNotVerified && !resendSent && (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="mt-1 text-sm text-cyan-400 hover:underline disabled:opacity-60"
              >
                {resendLoading ? 'Sending…' : 'Resend verification email'}
              </button>
            )}
            {resendSent && (
              <p className="mt-1 text-sm text-green-400">Verification email sent — check your inbox.</p>
            )}
          </div>
        )}
        <Button type="submit" loading={loading} className="mt-2 w-full">
          Sign in
        </Button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link href="/forgot-password" className="text-zinc-500 hover:text-zinc-300 transition-colors">
          Forgot password?
        </Link>
        <Link href="/register" className="text-cyan-400 hover:underline">
          Create account
        </Link>
      </div>
    </AuthCard>
  )
}
