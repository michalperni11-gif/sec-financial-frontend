'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { AuthShell } from '@/components/ui/AuthShell'
import { FormField } from '@/components/ui/FormField'
import { Icons } from '@/components/ui/Icons'
import { useToast } from '@/components/ui/Toast'
import { apiFetch, ApiError } from '@/lib/api'

function ResetPasswordContent() {
  const params = useSearchParams()
  const router = useRouter()
  const toast = useToast()
  const token = params.get('token')
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/reset-password')
    }
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (pw.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (pw !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, new_password: pw }),
      })
      toast({ kind: 'success', message: 'Password updated' })
      router.push('/login?reset=1')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <AuthShell title="Invalid link" subtitle="This reset link is missing a token. Use the link from your email.">
        <Link href="/forgot-password" className="btn btn-outline" style={{ width: '100%' }}>
          Request a new reset link
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Set new password" subtitle="Choose something at least 8 characters.">
      <form onSubmit={handleSubmit}>
        <FormField label="New password">
          <input
            className="input"
            type="password"
            autoFocus
            required
            minLength={8}
            value={pw}
            onChange={e => setPw(e.target.value)}
          />
        </FormField>
        <FormField
          label="Confirm password"
          error={confirm && confirm !== pw ? 'Passwords don\u2019t match' : null}
        >
          <input
            className="input"
            type="password"
            required
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
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
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  )
}

export default function ResetPasswordPage() {
  return (
    <>
      <TopNav />
      <Suspense fallback={null}>
        <ResetPasswordContent />
      </Suspense>
    </>
  )
}
