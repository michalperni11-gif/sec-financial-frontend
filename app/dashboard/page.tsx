'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BarChart } from '@/components/ui/BarChart'
import { Icons } from '@/components/ui/Icons'
import { useToast } from '@/components/ui/Toast'
import { apiFetch, ApiError } from '@/lib/api'

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

interface UsageResponse {
  daily?: { date: string; count: number }[]
  data?: { date: string; count: number }[]
  rows?: { date: string; count: number }[]
  totals?: { last_30d?: number }
}

const TIER_PRICE: Record<string, number> = {
  free: 0,
  basic: 19,
  starter: 49,
  growth: 149,
  pro: 499,
  enterprise: 0,
}

const TIER_LABEL: Record<string, string> = {
  free: 'Free',
  basic: 'Basic',
  starter: 'Starter',
  growth: 'Growth',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

const DAILY_LIMIT: Record<string, number | null> = {
  free: 100,
  basic: null,
  starter: null,
  growth: null,
  pro: null,
  enterprise: null,
}

const RPM: Record<string, number | null> = {
  free: null,
  basic: 500,
  starter: 500,
  growth: 1000,
  pro: 3000,
  enterprise: 5000,
}

function maskKey(key: string, revealed: boolean): string {
  if (revealed) return key
  if (key.length <= 8) return key
  return `${key.slice(0, 8)}${'\u2022'.repeat(20)}${key.slice(-4)}`
}

export default function DashboardPage() {
  const toast = useToast()
  const [user, setUser] = useState<MeResponse | null>(null)
  const [usage, setUsage] = useState<number[]>([])
  const [error, setError] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [confirmRegen, setConfirmRegen] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [resetTime, setResetTime] = useState('')

  useEffect(() => {
    apiFetch<MeResponse>('/auth/me')
      .then(setUser)
      .catch(err => {
        setError(err instanceof ApiError ? err.message : 'Failed to load account.')
      })
    apiFetch<UsageResponse>('/auth/usage')
      .then(d => {
        const rows = d.daily ?? d.data ?? d.rows ?? []
        setUsage(rows.slice(-30).map(r => r.count))
      })
      .catch(() => {
        // silently fall back to empty chart
      })
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setUTCHours(24, 0, 0, 0)
      const ms = tomorrow.getTime() - now.getTime()
      const h = Math.floor(ms / 3600000)
      const m = Math.floor((ms % 3600000) / 60000)
      const s = Math.floor((ms % 60000) / 1000)
      setResetTime(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
      )
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const tier = user?.tier?.toLowerCase() ?? 'free'
  const tierLabel = TIER_LABEL[tier] ?? tier
  const tierPrice = TIER_PRICE[tier] ?? 0
  const dailyLimit = DAILY_LIMIT[tier]
  const rpm = RPM[tier]
  const today = user?.requests_today ?? 0
  const usagePct = dailyLimit ? Math.min(100, (today / dailyLimit) * 100) : Math.min(100, (today / (rpm ?? 1) / 60) * 100)
  const usageLabel = dailyLimit ? `of ${dailyLimit} daily limit` : rpm ? `of ${rpm}/min limit` : 'no limit'

  async function copyKey() {
    if (!user?.api_key) return
    try {
      await navigator.clipboard.writeText(user.api_key)
      toast({ kind: 'success', message: 'API key copied to clipboard' })
    } catch {
      toast({ kind: 'error', message: 'Could not copy — select & copy manually.' })
    }
  }

  async function regen() {
    setRegenerating(true)
    try {
      const data = await apiFetch<{ api_key: string }>('/auth/api-keys/regenerate', { method: 'POST' })
      setUser(prev => (prev ? { ...prev, api_key: data.api_key } : prev))
      setRevealed(true)
      toast({ kind: 'success', message: 'API key regenerated — copy and save it now.' })
    } catch (err) {
      toast({
        kind: 'error',
        message: err instanceof ApiError ? err.message : 'Could not regenerate key.',
      })
    } finally {
      setRegenerating(false)
      setConfirmRegen(false)
    }
  }

  if (error) {
    return (
      <div className="container-x" style={{ paddingTop: 60 }}>
        <div
          className="card"
          style={{
            background: 'oklch(from var(--negative) l c h / 0.08)',
            borderColor: 'oklch(from var(--negative) l c h / 0.3)',
            color: 'var(--negative)',
            fontSize: 14,
          }}
        >
          {error}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Icons.Refresh size={24} className="animate-spin" />
      </div>
    )
  }

  const masked = user.api_key ? maskKey(user.api_key, revealed) : ''
  const total30 = usage.reduce((a, b) => a + b, 0)
  const avg30 = usage.length ? Math.round(total30 / usage.length) : 0

  return (
    <div className="container-x" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div
        className="row"
        style={{ justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}
      >
        <div className="col" style={{ gap: 8 }}>
          <div className="eyebrow">Dashboard</div>
          <h2 style={{ fontSize: 28 }}>Welcome back, {user.name?.split(' ')[0] || 'there'}</h2>
        </div>
        <div className="row" style={{ gap: 12 }}>
          <Link href="/playground" className="btn btn-outline">
            <Icons.Terminal size={15} /> Open playground
          </Link>
          <Link href="/billing" className="btn btn-primary">
            <Icons.Sparkles size={15} /> Upgrade plan
          </Link>
        </div>
      </div>

      {/* Top stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 400px 200px at 100% 0%, var(--accent-soft), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div className="row" style={{ gap: 12, position: 'relative' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icons.Star size={20} />
            </div>
            <div className="col" style={{ flex: 1 }}>
              <div className="row" style={{ gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Current plan</span>
                <span className="badge badge-accent">{tierLabel}</span>
              </div>
              <div className="row" style={{ alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 600 }}>${tierPrice}</span>
                <span style={{ color: 'var(--fg-subtle)', fontSize: 13 }}>
                  {tierPrice === 0 ? '/month' : '/month · active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Requests today</div>
          <div className="row" style={{ alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 600 }} className="mono tabular">
              {today}
            </span>
            <span style={{ color: 'var(--fg-subtle)', fontSize: 12 }}>{usageLabel}</span>
          </div>
          <div
            style={{
              marginTop: 14,
              height: 6,
              background: 'var(--bg-soft)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${usagePct}%`,
                height: '100%',
                background:
                  'linear-gradient(90deg, var(--accent), oklch(from var(--accent) l c calc(h + 60)))',
                borderRadius: 999,
                transition: 'width 0.4s',
              }}
            />
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Counter resets in</div>
          <div className="row" style={{ alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 24, fontWeight: 600 }} className="mono tabular">
              {resetTime}
            </span>
          </div>
          <div className="row" style={{ gap: 8, marginTop: 14, fontSize: 12, color: 'var(--fg-subtle)' }}>
            <Icons.Clock size={13} /> Midnight UTC daily reset
          </div>
        </div>
      </div>

      {/* API Key */}
      <div className="card card-pad-lg" style={{ marginBottom: 16 }}>
        <div
          className="row"
          style={{ justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}
        >
          <div className="col" style={{ gap: 8 }}>
            <h3 style={{ fontSize: 18 }}>Your API key</h3>
            <p style={{ color: 'var(--fg-muted)', fontSize: 13.5 }}>
              Use this in the <span className="mono" style={{ fontSize: 12.5 }}>X-API-Key</span> header or{' '}
              <span className="mono" style={{ fontSize: 12.5 }}>?apikey=</span> query param.
            </p>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => (confirmRegen ? regen() : setConfirmRegen(true))}
            disabled={regenerating || !user.api_key}
          >
            <Icons.Refresh size={14} className={regenerating ? 'animate-spin' : ''} />
            {regenerating ? 'Regenerating…' : confirmRegen ? 'Click again to confirm' : 'Regenerate'}
          </button>
        </div>

        {user.api_key ? (
          <div
            className="row"
            style={{
              gap: 8,
              padding: '12px 16px',
              background: 'var(--bg-elev)',
              border: '1px solid var(--border)',
              borderRadius: 10,
            }}
          >
            <span className="mono" style={{ flex: 1, fontSize: 13, letterSpacing: '0.02em', wordBreak: 'break-all' }}>
              {masked}
            </span>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setRevealed(r => !r)}
              title={revealed ? 'Hide' : 'Reveal'}
            >
              {revealed ? <Icons.EyeOff size={15} /> : <Icons.Eye size={15} />}
            </button>
            <button className="btn btn-ghost btn-icon" onClick={copyKey} title="Copy">
              <Icons.Copy size={15} />
            </button>
          </div>
        ) : (
          <div
            className="card"
            style={{ background: 'var(--bg-elev)', fontSize: 13, color: 'var(--fg-muted)' }}
          >
            No API key yet — please verify your email first.
          </div>
        )}

        {user.api_key && (
          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontSize: 12,
                color: 'var(--fg-subtle)',
                marginBottom: 8,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Quick start — cURL
            </div>
            <pre
              className="mono"
              style={{
                margin: 0,
                padding: '14px 16px',
                background: 'var(--bg-elev)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                fontSize: 12.5,
                overflow: 'auto',
                lineHeight: 1.6,
                color: 'var(--fg)',
              }}
            >
{`# Get MSFT income statement (last 5 years, annual)
curl https://sec-financial-api-production.up.railway.app/v1/company/MSFT/income-statement \\
  -H "X-API-Key: ${revealed ? user.api_key : '<your-api-key>'}" \\
  -G --data-urlencode "period=annual" --data-urlencode "limit=5"`}
            </pre>
          </div>
        )}
      </div>

      {/* Usage chart */}
      <div className="card card-pad-lg" style={{ marginBottom: 16 }}>
        <div
          className="row"
          style={{ justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}
        >
          <div className="col" style={{ gap: 8 }}>
            <h3 style={{ fontSize: 18 }}>Usage · last 30 days</h3>
            <p style={{ color: 'var(--fg-muted)', fontSize: 13.5 }}>
              <span className="mono" style={{ color: 'var(--fg)' }}>
                {total30.toLocaleString('en-US')}
              </span>{' '}
              total requests · avg{' '}
              <span className="mono" style={{ color: 'var(--fg)' }}>
                {avg30}
              </span>
              /day
            </p>
          </div>
          <span className="badge">
            <span className="badge-dot" /> Successful
          </span>
        </div>
        {usage.length > 0 ? (
          <BarChart data={usage} height={170} formatLabel={(v, i) => `${v} reqs · day ${i + 1}`} />
        ) : (
          <div
            style={{
              padding: 40,
              textAlign: 'center',
              color: 'var(--fg-subtle)',
              fontSize: 13,
              border: '1px dashed var(--border)',
              borderRadius: 10,
            }}
          >
            No usage data yet. Make your first API call to see the chart.
          </div>
        )}
        <div
          className="row"
          style={{ marginTop: 8, justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-subtle)' }}
        >
          <span>30 days ago</span>
          <span>15 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <QuickLink icon={Icons.Terminal} title="Try the API" desc="Test endpoints in the playground" href="/playground" />
        <QuickLink icon={Icons.Book} title="Read the docs" desc="Reference, examples, error codes" href="/docs" />
        <QuickLink icon={Icons.TrendingUp} title="Upgrade your plan" desc="More requests, full history" href="/billing" highlight />
      </div>
    </div>
  )
}

interface QuickLinkProps {
  icon: React.ComponentType<{ size?: number }>
  title: string
  desc: string
  href: string
  highlight?: boolean
}

function QuickLink({ icon: Icon, title, desc, href, highlight }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className="card"
      style={{
        cursor: 'pointer',
        borderColor: highlight ? 'var(--accent)' : undefined,
        background: highlight ? 'linear-gradient(135deg, var(--accent-soft), transparent)' : undefined,
        textDecoration: 'none',
        display: 'block',
      }}
    >
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: highlight ? 'var(--accent)' : 'var(--bg-soft)',
            color: highlight ? 'oklch(0.16 0.012 250)' : 'var(--fg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={16} />
        </div>
        <Icons.ArrowUpRight size={16} />
      </div>
      <h4 style={{ marginTop: 16 }}>{title}</h4>
      <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>{desc}</p>
    </Link>
  )
}
