'use client'
import { useEffect, useState } from 'react'
import { apiFetch, ApiError } from '@/lib/api'

interface Invoice {
  id: string
  amount: number
  currency: string
  status: string
  date: number      // Unix timestamp
  pdf: string | null
  description: string | null
}

interface BillingResponse {
  invoices: Invoice[]
  portal_url: string | null
  tier: string
}

const TIER_LABEL: Record<string, string> = {
  free: 'Free',
  basic: 'Basic — $5/mo',
  starter: 'Starter — $8/mo',
  growth: 'Growth — $15/mo',
  pro: 'Pro — $30/mo',
  enterprise: 'Enterprise — $150/mo',
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    paid: 'bg-green-500/15 text-green-400',
    open: 'bg-yellow-500/15 text-yellow-400',
    void: 'bg-zinc-700 text-zinc-500',
    uncollectible: 'bg-red-500/15 text-red-400',
  }
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium capitalize ${colors[status] ?? 'bg-zinc-800 text-zinc-500'}`}>
      {status}
    </span>
  )
}

export default function BillingPage() {
  const [data, setData] = useState<BillingResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch<BillingResponse>('/auth/billing')
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load billing info.'))
  }, [])

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>
  }

  const isLoading = data === null

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Billing</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your subscription and view invoices.</p>
      </div>

      {/* Current plan */}
      <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">Current plan</p>
            <p className="mt-1 text-lg font-semibold text-zinc-100">
              {isLoading ? '—' : (TIER_LABEL[data.tier.toLowerCase()] ?? data.tier)}
            </p>
          </div>
          {!isLoading && data.portal_url ? (
            <a
              href={data.portal_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              Manage subscription
            </a>
          ) : !isLoading && data.tier === 'free' ? (
            <a
              href="/pricing"
              className="rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-cyan-400 transition-colors"
            >
              Upgrade plan
            </a>
          ) : null}
        </div>
      </div>

      {/* Invoice history */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900">
        <div className="border-b border-zinc-800 px-5 py-3">
          <span className="text-xs uppercase tracking-wider text-zinc-500">Invoice history</span>
        </div>

        {isLoading ? (
          <div className="px-5 py-8 text-center text-sm text-zinc-600">Loading…</div>
        ) : data.invoices.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-zinc-500">No invoices yet.</p>
            {data.tier === 'free' && (
              <p className="mt-1 text-xs text-zinc-600">Invoices will appear here once you upgrade to a paid plan.</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {data.invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {inv.currency}{(inv.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {new Date(inv.date * 1000).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                      {inv.description && ` · ${inv.description}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={inv.status} />
                  {inv.pdf && (
                    <a
                      href={inv.pdf}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      aria-label="Download invoice PDF"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
