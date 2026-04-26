'use client'

import Link from 'next/link'
import { useState } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { AuthShell } from '@/components/ui/AuthShell'
import { FormField } from '@/components/ui/FormField'
import { Icons } from '@/components/ui/Icons'
import { useToast } from '@/components/ui/Toast'
import { apiFetch, ApiError } from '@/lib/api'

export default function RegisterPage() {
  const toast = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string; submit?: string }>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: typeof errors = {}
    if (!email.includes('@')) errs.email = 'Enter a valid email'
    if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (confirm !== password) errs.confirm = 'Passwords don\u2019t match'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      setSent(true)
    } catch (err) {
      setErrors({ submit: err instanceof ApiError ? err.message : 'Something went wrong.' })
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResendLoading(true)
    try {
      await apiFetch('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) })
      toast({ kind: 'success', message: 'Verification email re-sent — check your inbox.' })
    } catch {
      toast({ kind: 'error', message: 'Could not resend. Try again shortly.' })
    } finally {
      setResendLoading(false)
    }
  }

  if (sent) {
    return (
      <>
        <TopNav />
        <AuthShell
          title="Check your email"
          subtitle={`We sent a verification link to ${email}. Click it to activate your account.`}
        >
          <div
            style={{
              padding: 16,
              background: 'var(--accent-soft)',
              borderRadius: 10,
              fontSize: 13,
              color: 'var(--fg-muted)',
              marginBottom: 18,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}
          >
            <Icons.Sparkles size={14} />
            <span>Didn&apos;t get it? Check spam, or resend below.</span>
          </div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ width: '100%', marginBottom: 8 }}
            onClick={handleResend}
            disabled={resendLoading}
          >
            {resendLoading && <Icons.Refresh size={14} className="animate-spin" />}
            {resendLoading ? 'Sending…' : 'Resend verification email'}
          </button>
          <Link href="/login" className="btn btn-ghost" style={{ width: '100%' }}>
            Back to sign in
          </Link>
        </AuthShell>
      </>
    )
  }

  return (
    <>
      <TopNav />
      <AuthShell
        title="Create your account"
        subtitle="Free tier — 100 requests/day, no credit card."
        footer={
          <span>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)' }}>
              Sign in
            </Link>
          </span>
        }
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Name">
            <input
              className="input"
              type="text"
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input
              className="input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </FormField>
          <FormField
            label="Password"
            error={errors.password}
            hint={errors.password ? null : 'Min 8 chars, with letter + number'}
          >
            <input
              className="input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </FormField>
          <FormField label="Confirm password" error={errors.confirm}>
            <input
              className="input"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </FormField>

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
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 6 }}
            disabled={loading}
          >
            {loading && <Icons.Refresh size={15} className="animate-spin" />}
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          <p style={{ fontSize: 11, color: 'var(--fg-subtle)', textAlign: 'center', marginTop: 14 }}>
            Rate limit: 5 registrations per hour per IP. By creating an account you agree to our{' '}
            <Link href="/terms" style={{ color: 'var(--fg-muted)' }}>
              Terms
            </Link>
            .
          </p>
        </form>
      </AuthShell>
    </>
  )
}
