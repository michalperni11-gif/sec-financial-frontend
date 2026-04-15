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
  const [unverified, setUnverified] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setUnverified(false)
    setResendMsg('')
    setLoading(true)
    try {
      const { access_token } = await apiFetch<{ access_token: string; token_type: string }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) }
      )
      setToken(access_token)
      router.push('/dashboard')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Something went wrong.'
      setError(msg)
      // Show resend link when backend says email is not verified
      if (err instanceof ApiError && err.status === 403) {
        setUnverified(true)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResendLoading(true)
    setResendMsg('')
    try {
      await apiFetch('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setResendMsg('Verification email sent — check your inbox.')
    } catch {
      setResendMsg('Could not resend. Try again shortly.')
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
            {unverified && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-sm text-[#00d47e] hover:underline disabled:opacity-50"
                >
                  {resendLoading ? 'Sending…' : 'Resend verification email'}
                </button>
                {resendMsg && <p className="mt-1 text-xs text-zinc-400">{resendMsg}</p>}
              </div>
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
        <Link href="/register" className="text-[#00d47e] hover:underline">
          Create account
        </Link>
      </div>
    </AuthCard>
  )
}
