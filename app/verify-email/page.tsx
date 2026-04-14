'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthCard } from '@/components/auth/AuthCard'
import { Spinner } from '@/components/ui/Spinner'
import { apiFetch, ApiError } from '@/lib/api'
import { setToken } from '@/lib/auth'

type State = 'loading' | 'success' | 'error' | 'missing'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [state, setState] = useState<State>(token ? 'loading' : 'missing')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) return
    apiFetch<{ message: string; api_key: string; tier: string; access_token: string }>(
      `/auth/verify-email?token=${encodeURIComponent(token)}`
    )
      .then((data) => {
        // Auto-login: store JWT and redirect to dashboard
        if (data.access_token) {
          setToken(data.access_token)
          router.replace('/dashboard')
        } else {
          setState('success')
        }
      })
      .catch((err) => {
        setErrorMsg(err instanceof ApiError ? err.message : 'Verification failed.')
        setState('error')
      })
  }, [token, router])

  if (state === 'loading') {
    return (
      <AuthCard title="Verifying your email…">
        <div className="flex justify-center py-6"><Spinner /></div>
      </AuthCard>
    )
  }

  if (state === 'success') {
    return (
      <AuthCard title="Email verified ✓">
        <p className="mb-4 text-sm text-zinc-400">Your account is active. Redirecting to dashboard…</p>
        <div className="flex justify-center"><Spinner /></div>
      </AuthCard>
    )
  }

  if (state === 'error') {
    const alreadyVerified = errorMsg.toLowerCase().includes('already') || errorMsg.toLowerCase().includes('invalid')
    return (
      <AuthCard title="Verification failed">
        <p className="mb-4 text-sm text-red-400">{errorMsg}</p>
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="block w-full rounded bg-cyan-400 py-2 text-center text-sm font-bold text-black hover:bg-cyan-300 transition-colors"
          >
            {alreadyVerified ? 'Go to sign in' : 'Sign in'}
          </Link>
          {!alreadyVerified && (
            <Link href="/register" className="text-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              Register again
            </Link>
          )}
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Invalid link">
      <p className="mb-4 text-sm text-zinc-400">This verification link is missing a token. Please use the link from your email.</p>
      <Link href="/login" className="text-sm text-cyan-400 hover:underline">Go to sign in</Link>
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
