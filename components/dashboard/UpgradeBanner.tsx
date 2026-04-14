'use client'
import { useState } from 'react'
import { apiFetch, ApiError } from '@/lib/api'

const NEXT_TIER: Record<string, { id: string; name: string; price: string; benefit: string }> = {
  free:    { id: 'basic',      name: 'Basic',      price: '$5/mo',   benefit: '10 years of history + 500 req/min' },
  basic:   { id: 'starter',   name: 'Starter',    price: '$8/mo',   benefit: 'full 10,000+ companies' },
  starter: { id: 'growth',    name: 'Growth',     price: '$15/mo',  benefit: 'full history for all companies' },
  growth:  { id: 'pro',       name: 'Pro',        price: '$30/mo',  benefit: '3,000 req/min' },
  pro:     { id: 'enterprise',name: 'Enterprise', price: '$150/mo', benefit: 'unlimited requests' },
}

export function UpgradeBanner({ tier }: { tier: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const next = NEXT_TIER[tier.toLowerCase()]
  if (!next) return null

  async function handleUpgrade() {
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch<{ checkout_url: string }>('/auth/checkout', {
        method: 'POST',
        body: JSON.stringify({ tier: next.id }),
      })
      window.location.href = res.checkout_url
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to start checkout. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-5 py-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          Upgrade to <span className="font-semibold text-cyan-400">{next.name}</span> ({next.price}) — get {next.benefit}
        </p>
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="ml-4 flex-shrink-0 rounded bg-cyan-400 px-4 py-1.5 text-xs font-bold text-black hover:bg-cyan-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading…' : 'Upgrade'}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  )
}
