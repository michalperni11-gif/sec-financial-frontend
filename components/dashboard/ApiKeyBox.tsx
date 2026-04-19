'use client'
import { useState } from 'react'
import { apiFetch, ApiError } from '@/lib/api'

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
)

interface Props {
  apiKey: string
}

export function ApiKeyBox({ apiKey }: Props) {
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState(false)

  const displayKey = newKey ?? apiKey

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(displayKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  async function handleRegenerate() {
    if (!confirming) {
      setConfirming(true)
      return
    }
    setConfirming(false)
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch<{ api_key: string; tier: string }>('/auth/api-keys/regenerate', { method: 'POST' })
      setNewKey(res.api_key)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Regeneration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-white/[0.08] bg-[#1a1a1a] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-500">API Key</span>
        {newKey && (
          <span className="text-xs text-amber-400">Save this key — it won&apos;t be shown again</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <code className="flex-1 overflow-hidden text-ellipsis border border-white/[0.06] bg-[#111111] px-3 py-2 text-xs font-mono text-[#00d47e]">
          {displayKey}
        </code>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 border border-white/[0.08] px-3 py-2 text-xs text-zinc-500 hover:border-white/20 hover:text-zinc-300 transition-colors"
          aria-label="Copy API key"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        {!newKey && (
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className={`flex items-center gap-1.5 border px-3 py-2 text-xs transition-colors disabled:opacity-50 ${
              confirming
                ? 'border-red-800 bg-red-950 text-red-400 hover:bg-red-900'
                : 'border-white/[0.08] text-zinc-500 hover:border-white/20 hover:text-zinc-300'
            }`}
            aria-label="Regenerate API key"
          >
            <RefreshIcon />
            {loading ? 'Generating…' : confirming ? 'Confirm — old key dies' : 'Regenerate'}
          </button>
        )}
      </div>

      {!newKey && (
        <p className="mt-2 text-xs text-zinc-500">
          Full key shown once on registration and in your welcome email.
          {confirming && (
            <button onClick={() => setConfirming(false)} className="ml-2 text-zinc-500 underline">Cancel</button>
          )}
        </p>
      )}

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  )
}
