'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { AuthShell } from '@/components/ui/AuthShell'
import { FormField } from '@/components/ui/FormField'
import { Icons } from '@/components/ui/Icons'
import { useToast } from '@/components/ui/Toast'
import { apiFetch, ApiError } from '@/lib/api'
import { setToken } from '@/lib/auth'

function LoginInner() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/dashboard'
  const wasReset = params.get('reset') === '1'
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; submit?: string }>({})
  const [loading, setLoading] = useState(false)
  const [unverified, setUnverified] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!email.includes('@')) errs.email = 'Enter a valid email'
    if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)
    setUnverified(false)
    try {
      const { access_token } = await apiFetch<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(access_token)
      toast({ kind: 'success', message: 'Signed in' })
      router.push(next)
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Something went wrong.'
      setErrors({ submit: msg })
      if (err instanceof ApiError && err.status === 403) setUnverified(true)
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
      toast({ kind: 'success', message: 'Verification email sent — check your inbox.' })
    } catch {
      toast({ kind: 'error', message: 'Could not resend. Try again shortly.' })
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <AuthShell
      title="Sign in to SECfinAPI"
      subtitle="Welcome back. Enter your credentials."
      footer={
        <span>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--accent)' }}>
            Create one
          </Link>
        </span>
      }
    >
      {wasReset && (
        <div
          className="badge badge-positive"
          style={{ marginBottom: 16, padding: '8px 12px', width: '100%', justifyContent: 'center' }}
        >
          <Icons.Check size={13} /> Password updated — sign in with your new password.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <FormField label="Email" error={errors.email}>
          <input
            className="input"
            type="email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />
        </FormField>
        <FormField label="Password" error={errors.password}>
          <input
            className="input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </FormField>
        <div className="row" style={{ justifyContent: 'flex-end', marginBottom: 16, marginTop: -4 }}>
          <Link
            href="/forgot-password"
            style={{ fontSize: 12.5, color: 'var(--accent)' }}
          >
            Forgot password?
          </Link>
        </div>

        {errors.submit && (
          <div
            className="card"
            style={{
              background: 'oklch(from var(--negative) l c h / 0.08)',
              borderColor: 'oklch(from var(--negative) l c h / 0.3)',
              padding: 12,
              fontSize: 13,
              color: 'var(--negative)',
              marginBottom: 12,
            }}
          >
            {errors.submit}
            {unverified && (
              <div style={{ marginTop: 8 }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleResend}
                  disabled={resendLoading || !email}
                  style={{ padding: '4px 0', color: 'var(--accent)' }}
                >
                  {resendLoading ? 'Sending…' : 'Resend verification email'}
                </button>
              </div>
            )}
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
          {loading && <Icons.Refresh size={15} className="animate-spin" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p style={{ fontSize: 11, color: 'var(--fg-subtle)', textAlign: 'center', marginTop: 14 }}>
          Rate limit: 10 attempts per 15 min
        </p>
      </form>
    </AuthShell>
  )
}

export default function LoginPage() {
  return (
    <>
      <TopNav />
      <Suspense fallback={null}>
        <LoginInner />
      </Suspense>
    </>
  )
}
