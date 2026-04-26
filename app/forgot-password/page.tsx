'use client'

import Link from 'next/link'
import { useState } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { AuthShell } from '@/components/ui/AuthShell'
import { FormField } from '@/components/ui/FormField'
import { Icons } from '@/components/ui/Icons'
import { apiFetch, ApiError } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <>
        <TopNav />
        <AuthShell
          title="Check your email"
          subtitle="If an account exists for that email, you'll get a reset link."
        >
          <Link href="/login" className="btn btn-outline" style={{ width: '100%' }}>
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
        title="Reset password"
        subtitle="Enter your email — we'll send a reset link."
        footer={
          <Link href="/login" style={{ color: 'var(--accent)' }}>
            ← Back to sign in
          </Link>
        }
      >
        <form onSubmit={handleSubmit}>
          <FormField label="Email">
            <input
              className="input"
              type="email"
              autoFocus
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </FormField>
          {error && (
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
              {error}
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading && <Icons.Refresh size={15} className="animate-spin" />}
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      </AuthShell>
    </>
  )
}
