'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthCard } from '@/components/auth/AuthCard'
import { Spinner } from '@/components/ui/Spinner'
import { apiFetch, ApiError } from '@/lib/api'
import { setToken } from '@/lib/auth'

type State = 'loading' | 'success' | 'error' | 'missing'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }
  return (
    <button
      onClick={copy}
      className="mt-2 w-full rounded border border-zinc-700 py-1.5 text-xs text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
    >
      {copied ? '✓ Copied' : 'Copy key'}
    </button>
  )
}

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [state, setState] = useState<State>(token ? 'loading' : 'missing')
  const [apiKey, setApiKey] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) return
    // Strip token from URL immediately — prevents it appearing in Vercel logs,
    // browser history, and referrer headers.
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/verify-email')
    }
    apiFetch<{ message: string; api_key: string; tier: string; access_token: string }>(
      `/auth/verify-email?token=${encodeURIComponent(token)}`
    )
      .then((data) => {
        setApiKey(data.api_key)
        // Auto-login: backend issues a JWT on verify so the user lands
        // directly in the dashboard without a separate login step.
        if (data.access_token) {
          setToken(data.access_token)
        }
        setState('success')
      })
      .catch((err) => {
        setErrorMsg(err instanceof ApiError ? err.message : 'Verification failed.')
        setState('error')
      })
  }, [token])

  if (state === 'loading') {
    return (
      <AuthCard title="Verifying your email...">
        <div className="flex justify-center py-6"><Spinner /></div>
      </AuthCard>
    )
  }

  if (state === 'success') {
    return (
      <AuthCard title="Email verified ✓">
        <p className="mb-3 text-sm text-zinc-400">Your account is active. Save your free API key — it won&apos;t be shown again after you leave this page.</p>
        <code className="block rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-cyan-400 break-all">
          {apiKey}
        </code>
        <CopyButton text={apiKey} />
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 block w-full rounded bg-cyan-400 py-2 text-center text-sm font-bold text-black hover:bg-cyan-300 transition-colors"
        >
          Go to dashboard →
        </button>
      </AuthCard>
    )
  }

  if (state === 'error') {
    return (
      <AuthCard title="Verification failed">
        <p className="mb-4 text-sm text-red-400">{errorMsg}</p>
        <Link href="/register" className="text-sm text-cyan-400 hover:underline">Register again</Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Invalid link">
      <p className="text-sm text-zinc-400">This verification link is missing a token. Please use the link from your email.</p>
    </AuthCard>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner /></div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
