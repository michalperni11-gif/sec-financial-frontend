'use client'
import { useEffect, useState } from 'react'
import { apiFetch, ApiError } from '@/lib/api'
import { StatCard } from '@/components/dashboard/StatCard'
import { ApiKeyBox } from '@/components/dashboard/ApiKeyBox'
import { UsageBar } from '@/components/dashboard/UsageBar'
import { UsageChart } from '@/components/dashboard/UsageChart'
import { UpgradeBanner } from '@/components/dashboard/UpgradeBanner'
import { Spinner } from '@/components/ui/Spinner'

interface MeResponse {
  name: string
  email: string
  api_key: string | null
  tier: string
  status: string
  requests_today: number
  created_at: string
  last_used_at: string | null
}

const DAILY_LIMIT: Record<string, number | null> = {
  free: 100,
  basic: null,
  starter: null,
  growth: null,
  pro: null,
  enterprise: null,
}

const TIER_LABEL: Record<string, string> = {
  free: 'Free',
  basic: 'Basic — $5/mo',
  starter: 'Starter — $8/mo',
  growth: 'Growth — $15/mo',
  pro: 'Pro — $30/mo',
  enterprise: 'Enterprise — $150/mo',
}

export default function DashboardPage() {
  const [user, setUser] = useState<MeResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch<MeResponse>('/auth/me')
      .then(setUser)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load account.')
      })
  }, [])

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    )
  }

  const tier = user.tier.toLowerCase()
  const dailyLimit = DAILY_LIMIT[tier] ?? null

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{user.email}</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Plan"
          value={TIER_LABEL[tier] ?? tier}
          accent
        />
        <StatCard
          label="Requests today"
          value={String(user.requests_today)}
          sub={dailyLimit ? `of ${dailyLimit} limit` : 'no daily limit'}
        />
        <StatCard
          label="Key status"
          value={user.status === 'active' ? 'Active' : user.status}
          sub={user.last_used_at ? `Last used ${new Date(user.last_used_at).toLocaleDateString()}` : 'Never used'}
        />
      </div>

      <div className="mb-4">
        {user.api_key ? (
          <ApiKeyBox apiKey={user.api_key} />
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-500">
            No API key yet — please verify your email first.
          </div>
        )}
      </div>

      {dailyLimit !== null && (
        <div className="mb-4">
          <UsageBar used={user.requests_today} limit={dailyLimit} />
        </div>
      )}

      <div className="mb-4">
        <UsageChart />
      </div>

      <UpgradeBanner tier={tier} />
    </div>
  )
}
