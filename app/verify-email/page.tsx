'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AuthCard } from '@/components/auth/AuthCard'
import { Spinner } from '@/components/ui/Spinner'
import { apiFetch, ApiError } from '@/lib/api'

type State = 'loading' | 'success' | 'error' | 'missing'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState<State>(token ? 'loading' : 'missing')
  const [apiKey, setApiKey] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) return
    apiFetch<{ message: string; api_key: string; tier: string }>(
      `/auth/verify-email?token=${encodeURIComponent(token)}`
    )
      .then((data) => {
        setApiKey(data.api_key)
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
        <p className="mb-4 text-sm text-zinc-400">Your account is active. Here is your free API key:</p>
        <code className="block rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-cyan-400 break-all">
          {apiKey}
        </code>
        <Link
          href="/login"
          className="mt-6 block w-full rounded bg-cyan-400 py-2 text-center text-sm font-bold text-black hover:bg-cyan-300 transition-colors"
        >
          Sign in to dashboard →
        </Link>
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
