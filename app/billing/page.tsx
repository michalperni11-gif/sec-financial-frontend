'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Icons } from '@/components/ui/Icons'
import { useToast } from '@/components/ui/Toast'
import { apiFetch, ApiError } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface MeResponse {
  email: string
  tier: string
}

interface BillingResponse {
  tier: string
  status?: string
  next_renewal_at?: string | null
  payment_method_last4?: string | null
  invoices?: { date: string; amount: number; description: string; status: string; pdf_url?: string }[]
}

interface Tier {
  name: string
  price: number
  reqMin: string
  coverage: string
  history: string
  featured: boolean
  key: string
}

const PAID_TIERS: Tier[] = [
  { key: 'basic', name: 'Basic', price: 19, reqMin: '500', coverage: 'S&P 500', history: '10 years', featured: false },
  { key: 'starter', name: 'Starter', price: 49, reqMin: '500', coverage: 'All US', history: '10 years', featured: true },
  { key: 'growth', name: 'Growth', price: 149, reqMin: '1,000', coverage: 'All US', history: 'Full', featured: false },
  { key: 'pro', name: 'Pro', price: 499, reqMin: '3,000', coverage: 'All US', history: 'Full', featured: false },
]

export default function BillingPage() {
  const router = useRouter()
  const toast = useToast()
  const [me, setMe] = useState<MeResponse | null>(null)
  const [billing, setBilling] = useState<BillingResponse | null>(null)
  const [switching, setSwitching] = useState<string | null>(null)

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?next=/billing')
      return
    }
    apiFetch<MeResponse>('/auth/me').then(setMe).catch(() => null)
    apiFetch<BillingResponse>('/auth/billing')
      .then(setBilling)
      .catch(() => {
        // billing endpoint may not exist yet — fall back to defaults
        setBilling({ tier: 'free' })
      })
  }, [router])

  async function switchPlan(tierKey: string) {
    setSwitching(tierKey)
    try {
      const data = await apiFetch<{ checkout_url: string }>('/auth/checkout', {
        method: 'POST',
        body: JSON.stringify({ tier: tierKey }),
      })
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      }
    } catch (err) {
      toast({
        kind: 'error',
        message: err instanceof ApiError ? err.message : 'Could not start checkout.',
      })
      setSwitching(null)
    }
  }

  const tier = (me?.tier || billing?.tier || 'free').toLowerCase()
  const currentTier = PAID_TIERS.find(t => t.key === tier)
  const currentPrice = currentTier?.price ?? 0
  const isFree = tier === 'free'

  return (
    <>
      <TopNav />
      <div className="container-x" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div
          className="row"
          style={{ justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}
        >
          <div className="col" style={{ gap: 8 }}>
            <div className="eyebrow">Billing</div>
            <h2 style={{ fontSize: 28 }}>Plans &amp; billing</h2>
          </div>
        </div>

        {/* Current plan */}
        <div
          className="card card-pad-lg"
          style={{ marginBottom: 16, position: 'relative', overflow: 'hidden' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 500px 200px at 0% 0%, var(--accent-soft), transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div
              className="row"
              style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}
            >
              <div className="col" style={{ gap: 12 }}>
                <div className="row" style={{ gap: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Current plan</span>
                  <span className="badge badge-accent">{currentTier?.name ?? 'Free'}</span>
                </div>
                <div className="row" style={{ alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em' }}>
                    ${currentPrice}
                  </span>
                  <span style={{ color: 'var(--fg-subtle)', fontSize: 14 }}>
                    {isFree ? '/month' : '/month · billed monthly'}
                  </span>
                </div>
                {!isFree && billing?.next_renewal_at && (
                  <div className="row" style={{ gap: 16, fontSize: 13, color: 'var(--fg-muted)', flexWrap: 'wrap' }}>
                    <span>
                      Renews{' '}
                      <strong style={{ color: 'var(--fg)' }}>
                        {new Date(billing.next_renewal_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </strong>
                    </span>
                    {billing.payment_method_last4 && (
                      <>
                        <span>·</span>
                        <span>
                          Card ending in <span className="mono">{billing.payment_method_last4}</span>
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
              {!isFree && (
                <div className="row" style={{ gap: 8 }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => toast({ kind: 'info', message: 'Opening Stripe portal…' })}
                  >
                    <Icons.CreditCard size={14} /> Manage payment
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--negative)' }}
                    onClick={() => toast({ kind: 'info', message: 'Cancellation flow opens in Stripe portal' })}
                  >
                    Cancel subscription
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tier grid */}
        <h4 style={{ marginBottom: 14, marginTop: 8 }}>{isFree ? 'Choose a plan' : 'Switch or upgrade'}</h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            marginBottom: 24,
          }}
        >
          {PAID_TIERS.map(t => {
            const isCurrent = t.key === tier
            return (
              <div
                key={t.key}
                className="card"
                style={{
                  position: 'relative',
                  borderColor: t.featured ? 'var(--accent)' : isCurrent ? 'var(--border-strong)' : undefined,
                  background: t.featured
                    ? 'linear-gradient(180deg, var(--accent-soft), var(--bg-card))'
                    : undefined,
                }}
              >
                {t.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--accent)',
                      color: 'oklch(0.16 0.012 250)',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: 999,
                      letterSpacing: '0.04em',
                    }}
                  >
                    POPULAR
                  </div>
                )}
                <div className="col" style={{ gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                    <div className="row" style={{ alignItems: 'baseline', gap: 4, marginTop: 6 }}>
                      <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>${t.price}</span>
                      <span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>/mo</span>
                    </div>
                  </div>
                  <div className="col" style={{ gap: 8, fontSize: 12.5, color: 'var(--fg-muted)' }}>
                    <div className="row" style={{ gap: 8 }}>
                      <Icons.Check size={13} /> {t.reqMin} req/min
                    </div>
                    <div className="row" style={{ gap: 8 }}>
                      <Icons.Check size={13} /> {t.coverage}
                    </div>
                    <div className="row" style={{ gap: 8 }}>
                      <Icons.Check size={13} /> {t.history}
                    </div>
                    {t.price >= 149 && (
                      <div className="row" style={{ gap: 8 }}>
                        <Icons.Check size={13} /> Priority support
                      </div>
                    )}
                  </div>
                  {isCurrent ? (
                    <button
                      className="btn btn-outline btn-sm"
                      disabled
                      style={{ width: '100%', opacity: 0.6 }}
                    >
                      Current plan
                    </button>
                  ) : (
                    <button
                      className={`btn btn-sm ${t.featured ? 'btn-primary' : 'btn-outline'}`}
                      style={{ width: '100%' }}
                      onClick={() => switchPlan(t.key)}
                      disabled={switching !== null}
                    >
                      {switching === t.key && <Icons.Refresh size={13} className="animate-spin" />}
                      {switching === t.key ? 'Loading…' : isFree ? 'Subscribe' : t.price > currentPrice ? 'Upgrade' : 'Switch'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Invoices */}
        <h4 style={{ marginBottom: 14 }}>Invoice history</h4>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {billing?.invoices && billing.invoices.length > 0 ? (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th className="num">Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {billing.invoices.map((inv, i) => (
                  <tr key={i}>
                    <td className="tbl-mono">{inv.date}</td>
                    <td>{inv.description}</td>
                    <td className="num tbl-mono">${inv.amount.toFixed(2)}</td>
                    <td>
                      <span className="badge badge-positive">
                        <span className="badge-dot" /> {inv.status}
                      </span>
                    </td>
                    <td className="num">
                      {inv.pdf_url && (
                        <a
                          href={inv.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--accent)', fontSize: 12.5 }}
                        >
                          Download PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--fg-subtle)', fontSize: 13 }}>
              No invoices yet. Subscribe to a paid plan to see your billing history here.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
