'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { FormField } from '@/components/ui/FormField'
import { Icons } from '@/components/ui/Icons'
import { useToast } from '@/components/ui/Toast'
import { apiFetch, ApiError } from '@/lib/api'
import { clearToken, getToken } from '@/lib/auth'

interface MeResponse {
  name: string
  email: string
  created_at: string
}

export default function AccountPage() {
  const router = useRouter()
  const toast = useToast()
  const [user, setUser] = useState<MeResponse | null>(null)
  const [cur, setCur] = useState('')
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [delModal, setDelModal] = useState(false)
  const [delEmail, setDelEmail] = useState('')
  const [delLoading, setDelLoading] = useState(false)

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?next=/account')
      return
    }
    apiFetch<MeResponse>('/auth/me')
      .then(setUser)
      .catch(() => toast({ kind: 'error', message: 'Failed to load account.' }))
  }, [router, toast])

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (pw.length < 8 || pw !== confirm) return
    setPwLoading(true)
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ current_password: cur, new_password: pw }),
      })
      toast({ kind: 'success', message: 'Password updated' })
      setCur('')
      setPw('')
      setConfirm('')
    } catch (err) {
      toast({
        kind: 'error',
        message: err instanceof ApiError ? err.message : 'Could not update password.',
      })
    } finally {
      setPwLoading(false)
    }
  }

  async function deleteAccount() {
    if (!user || delEmail !== user.email) return
    setDelLoading(true)
    try {
      await apiFetch('/auth/account', { method: 'DELETE' })
      clearToken()
      toast({ kind: 'success', message: 'Account deleted' })
      router.push('/')
    } catch (err) {
      toast({
        kind: 'error',
        message: err instanceof ApiError ? err.message : 'Could not delete account.',
      })
      setDelLoading(false)
    }
  }

  if (!user) {
    return (
      <>
        <TopNav />
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <Icons.Refresh size={24} className="animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <TopNav />
      <div className="container-x" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 760 }}>
        <div className="eyebrow">Account</div>
        <h2 style={{ fontSize: 28, marginTop: 8, marginBottom: 24 }}>Account settings</h2>

        <div className="card card-pad-lg" style={{ marginBottom: 16 }}>
          <h4 style={{ marginBottom: 16 }}>Profile</h4>
          <div className="col" style={{ gap: 12 }}>
            <FormField label="Email">
              <input className="input" value={user.email} readOnly disabled style={{ opacity: 0.7 }} />
            </FormField>
            <div className="row" style={{ gap: 24, fontSize: 13, color: 'var(--fg-muted)', flexWrap: 'wrap' }}>
              <span>
                Member since{' '}
                <strong style={{ color: 'var(--fg)' }}>
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </strong>
              </span>
            </div>
          </div>
        </div>

        <div className="card card-pad-lg" style={{ marginBottom: 16 }}>
          <h4 style={{ marginBottom: 16 }}>Change password</h4>
          <form onSubmit={changePassword}>
            <FormField label="Current password">
              <input
                className="input"
                type="password"
                value={cur}
                onChange={e => setCur(e.target.value)}
                required
              />
            </FormField>
            <FormField label="New password" hint="Min 8 chars, with letter + number">
              <input
                className="input"
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                required
                minLength={8}
              />
            </FormField>
            <FormField
              label="Confirm new password"
              error={confirm && confirm !== pw ? 'Doesn\u2019t match' : null}
            >
              <input
                className="input"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </FormField>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!cur || pw.length < 8 || pw !== confirm || pwLoading}
            >
              {pwLoading && <Icons.Refresh size={14} className="animate-spin" />}
              {pwLoading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>

        <div
          className="card card-pad-lg"
          style={{
            borderColor: 'oklch(from var(--negative) l c h / 0.4)',
            background: 'oklch(from var(--negative) l c h / 0.04)',
          }}
        >
          <h4 style={{ marginBottom: 8, color: 'var(--negative)' }}>Danger zone</h4>
          <p style={{ fontSize: 13.5, color: 'var(--fg-muted)', marginBottom: 16 }}>
            Deleting your account is permanent. All API keys are revoked immediately and historical usage data is
            purged within 30 days.
          </p>
          <button
            className="btn btn-outline btn-sm"
            style={{ borderColor: 'var(--negative)', color: 'var(--negative)' }}
            onClick={() => setDelModal(true)}
          >
            Delete account
          </button>
        </div>

        {delModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'oklch(0 0 0 / 0.55)',
              zIndex: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
            onClick={() => !delLoading && setDelModal(false)}
          >
            <div
              className="card card-pad-lg"
              style={{ maxWidth: 460, width: '100%', boxShadow: 'var(--shadow-lg)' }}
              onClick={e => e.stopPropagation()}
            >
              <h4 style={{ marginBottom: 8, color: 'var(--negative)' }}>Delete account?</h4>
              <p style={{ fontSize: 13.5, color: 'var(--fg-muted)', marginBottom: 18 }}>
                This will revoke all API keys and cancel your subscription. To confirm, type your email:
              </p>
              <input
                className="input mono"
                placeholder={user.email}
                value={delEmail}
                onChange={e => setDelEmail(e.target.value)}
                style={{ marginBottom: 18 }}
                autoFocus
              />
              <div className="row" style={{ gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" onClick={() => setDelModal(false)} disabled={delLoading}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  disabled={delEmail !== user.email || delLoading}
                  style={delEmail === user.email ? { background: 'var(--negative)', color: 'white' } : undefined}
                  onClick={deleteAccount}
                >
                  {delLoading && <Icons.Refresh size={14} className="animate-spin" />}
                  {delLoading ? 'Deleting…' : 'Delete account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
