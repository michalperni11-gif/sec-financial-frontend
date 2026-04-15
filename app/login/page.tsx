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
          <div className="flex flex-col gap-2 border border-red-500/30 bg-red-500/10 px-3 py-2.5">
            <div className="flex items-start gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-400">{error}</p>
            </div>
            {unverified && (
              <div className="pl-6.5">
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
