'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AuthCard } from '@/components/auth/AuthCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { apiFetch, ApiError } from '@/lib/api'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Strip token from URL on mount — prevents it appearing in Vercel logs and browser history.
  useEffect(() => {
    if (token && typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/reset-password')
    }
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, new_password: password }),
      })
      router.push('/login?reset=1')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <AuthCard title="Invalid link">
        <p className="text-sm text-zinc-400">This reset link is missing a token. Please use the link from your email.</p>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Set new password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input id="password" label="New password" type="password" placeholder="Min. 8 characters"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input id="confirm" label="Confirm password" type="password" placeholder="Repeat password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        {error && (
          <div className="flex items-start gap-2.5 border border-red-500/30 bg-red-500/10 px-3 py-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        <Button type="submit" loading={loading} className="mt-2 w-full">Update password</Button>
      </form>
    </AuthCard>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner /></div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
