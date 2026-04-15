'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AuthCard } from '@/components/auth/AuthCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiFetch, ApiError } from '@/lib/api'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResendLoading(true)
    setResendMsg('')
    try {
      await apiFetch('/auth/resend-verification', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setResendMsg('Sent! Check your inbox.')
    } catch {
      setResendMsg('Could not resend. Try again shortly.')
    } finally {
      setResendLoading(false)
    }
  }

  if (success) {
    return (
      <AuthCard title="Check your email">
        <p className="text-sm text-zinc-400">
          We sent a verification link to <span className="text-zinc-200">{email}</span>.
          Click the link to activate your account and get your free API key.
        </p>
        <div className="mt-5 border-t border-zinc-800 pt-4">
          <p className="text-xs text-zinc-500 mb-2">Didn&apos;t receive it?</p>
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-[#00d47e] hover:underline disabled:opacity-50"
          >
            {resendLoading ? 'Sending…' : 'Resend verification email'}
          </button>
          {resendMsg && <p className="mt-1 text-xs text-zinc-400">{resendMsg}</p>}
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          Already verified?{' '}
          <Link href="/login" className="text-[#00d47e] hover:underline">
            Sign in
          </Link>
        </p>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Create your account" subtitle="Free tier — no credit card required">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        {error && (
          <div className="flex items-start gap-2.5 border border-red-500/30 bg-red-500/10 px-3 py-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        <Button type="submit" loading={loading} className="mt-2 w-full">
          Create account
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="text-[#00d47e] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}
