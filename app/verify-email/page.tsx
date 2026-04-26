'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { AuthShell } from '@/components/ui/AuthShell'
import { Icons } from '@/components/ui/Icons'
import { useToast } from '@/components/ui/Toast'
import { apiFetch, ApiError } from '@/lib/api'
import { setToken } from '@/lib/auth'

type State = 'loading' | 'success' | 'error' | 'missing'

interface VerifyResponse {
  message: string
  api_key: string
  tier: string
  access_token: string
}

function VerifyEmailContent() {
  const params = useSearchParams()
  const router = useRouter()
  const toast = useToast()
  const token = params.get('token')
  const [state, setState] = useState<State>(token ? 'loading' : 'missing')
  const [apiKey, setApiKey] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!token) return
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/verify-email')
    }
    apiFetch<VerifyResponse>(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(data => {
        setApiKey(data.api_key)
        if (data.access_token) setToken(data.access_token)
        setState('success')
      })
      .catch(err => {
        setErrorMsg(err instanceof ApiError ? err.message : 'Verification failed.')
        setState('error')
      })
  }, [token])

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      toast({ kind: 'success', message: 'API key copied to clipboard' })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ kind: 'error', message: 'Could not copy — select & copy manually.' })
    }
  }

  if (state === 'loading') {
    return (
      <AuthShell title="Verifying…" subtitle="Hang tight, we're checking your token.">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <Icons.Refresh size={32} className="animate-spin" />
        </div>
      </AuthShell>
    )
  }

  if (state === 'success') {
    const masked = revealed ? apiKey : `${apiKey.slice(0, 12)}${'\u2022'.repeat(20)}${apiKey.slice(-4)}`
    return (
      <AuthShell title="Email verified \u2713" subtitle="Your account is active. Save your API key now \u2014 it won't be shown again.">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--accent-soft)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
            }}
          >
            <Icons.Check size={28} />
          </div>
        </div>
        <div
          className="row"
          style={{
            gap: 8,
            padding: '12px 16px',
            background: 'var(--bg-elev)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          <span className="mono" style={{ flex: 1, fontSize: 12, wordBreak: 'break-all', letterSpacing: '0.02em' }}>
            {masked}
          </span>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setRevealed(r => !r)}
            title={revealed ? 'Hide' : 'Reveal'}
          >
            {revealed ? <Icons.EyeOff size={15} /> : <Icons.Eye size={15} />}
          </button>
          <button className="btn btn-ghost btn-icon" onClick={copyKey} title="Copy">
            {copied ? <Icons.Check size={15} /> : <Icons.Copy size={15} />}
          </button>
        </div>
        <button
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
          onClick={() => router.push('/dashboard')}
        >
          Go to dashboard <Icons.ArrowRight size={15} />
        </button>
      </AuthShell>
    )
  }

  if (state === 'error') {
    return (
      <AuthShell title="Verification failed" subtitle={errorMsg}>
        <Link href="/register" className="btn btn-outline" style={{ width: '100%' }}>
          Register again
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Invalid link" subtitle="This verification link is missing a token. Please use the link from your email.">
      <Link href="/register" className="btn btn-outline" style={{ width: '100%' }}>
        Register
      </Link>
    </AuthShell>
  )
}

export default function VerifyEmailPage() {
  return (
    <>
      <TopNav />
      <Suspense fallback={null}>
        <VerifyEmailContent />
      </Suspense>
    </>
  )
}
