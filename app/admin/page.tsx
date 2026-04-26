'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Icons } from '@/components/ui/Icons'
import { useToast } from '@/components/ui/Toast'
import { getToken } from '@/lib/auth'

interface AdminStatus {
  db?: { total_companies?: number; total_facts?: number; last_ingested_at?: string | null }
  background_job?: {
    running?: boolean
    label?: string
    progress?: string
    errors?: number
    skipped?: number
    source?: string
  }
  scheduler?: { enabled?: boolean }
  backup?: {
    last_backup_at?: string | null
    gz_size_mb?: number | null
    gz_bak_exists?: boolean
    gz_bak_size_mb?: number | null
    gz_bak2_exists?: boolean
    gz_bak2_size_mb?: number | null
  }
  memory_mb?: number
}

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://sec-financial-api-production.up.railway.app'
const ADMIN_KEY_STORAGE = 'secfin_admin_key'

async function adminFetch<T>(path: string, key: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'X-Admin-Key': key,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) throw new Error(`${res.status} ${await res.text().catch(() => '')}`)
  return res.json() as Promise<T>
}

function fmtBytes(mb?: number | null): string {
  if (mb == null) return '—'
  if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`
  if (mb < 1024) return `${mb.toFixed(1)} MB`
  return `${(mb / 1024).toFixed(2)} GB`
}

function fmtAge(iso?: string | null): string {
  if (!iso) return '—'
  const ms = Date.now() - new Date(iso).getTime()
  const m = Math.floor(ms / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function AdminPage() {
  const router = useRouter()
  const toast = useToast()
  const [adminKey, setAdminKey] = useState('')
  const [keyInput, setKeyInput] = useState('')
  const [status, setStatus] = useState<AdminStatus | null>(null)
  const [error, setError] = useState('')
  const [singleTicker, setSingleTicker] = useState('')
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?next=/admin')
      return
    }
    try {
      const saved = localStorage.getItem(ADMIN_KEY_STORAGE)
      if (saved) {
        setAdminKey(saved)
        setKeyInput(saved)
      }
    } catch {
      // ignore
    }
  }, [router])

  useEffect(() => {
    if (!adminKey) return
    let active = true
    const fetchStatus = () => {
      adminFetch<AdminStatus>('/admin/status', adminKey)
        .then(s => {
          if (!active) return
          setStatus(s)
          setError('')
        })
        .catch(err => {
          if (!active) return
          setError(String(err.message || err))
        })
    }
    fetchStatus()
    const id = window.setInterval(fetchStatus, 5000)
    return () => {
      active = false
      window.clearInterval(id)
    }
  }, [adminKey])

  const saveKey = () => {
    if (!keyInput.trim()) return
    setAdminKey(keyInput.trim())
    try {
      localStorage.setItem(ADMIN_KEY_STORAGE, keyInput.trim())
    } catch {
      // ignore
    }
  }

  const trigger = async (path: string, label: string) => {
    if (!adminKey || running) return
    setRunning(true)
    try {
      await adminFetch(path, adminKey, { method: 'POST' })
      toast({ kind: 'info', message: `${label} started` })
    } catch (err) {
      toast({ kind: 'error', message: err instanceof Error ? err.message : 'Failed' })
    } finally {
      setRunning(false)
    }
  }

  if (!adminKey) {
    return (
      <>
        <TopNav />
        <div className="container-x" style={{ paddingTop: 60, maxWidth: 480 }}>
          <div className="card card-pad-lg">
            <div className="eyebrow">Admin</div>
            <h3 style={{ marginTop: 8, marginBottom: 14 }}>Enter admin key</h3>
            <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 18 }}>
              Required to call <span className="mono">/admin/*</span> endpoints. Stored in localStorage on this
              device only.
            </p>
            <input
              className="input mono"
              type="password"
              placeholder="X-Admin-Key"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveKey()}
              autoFocus
            />
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 12 }}
              onClick={saveKey}
              disabled={!keyInput.trim()}
            >
              Continue
            </button>
          </div>
        </div>
      </>
    )
  }

  const job = status?.background_job
  const db = status?.db
  const backup = status?.backup
  const isRunning = job?.running ?? false

  return (
    <>
      <TopNav />
      <div className="container-x" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div
          className="row"
          style={{ justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}
        >
          <div className="col" style={{ gap: 8 }}>
            <div className="eyebrow">Admin · X-Admin-Key required</div>
            <h2 style={{ fontSize: 28 }}>System operations</h2>
          </div>
          <div className="row" style={{ gap: 8 }}>
            {status?.scheduler?.enabled && (
              <span className="badge badge-positive">
                <span className="badge-dot" />
                Scheduler running
              </span>
            )}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                try {
                  localStorage.removeItem(ADMIN_KEY_STORAGE)
                } catch {
                  // ignore
                }
                setAdminKey('')
              }}
            >
              Forget key
            </button>
          </div>
        </div>

        {error && (
          <div
            className="card"
            style={{
              background: 'oklch(from var(--negative) l c h / 0.08)',
              borderColor: 'oklch(from var(--negative) l c h / 0.3)',
              color: 'var(--negative)',
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* Status grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 14,
            marginBottom: 16,
          }}
        >
          <StatCard label="Companies" value={(db?.total_companies ?? 0).toLocaleString('en-US')} />
          <StatCard label="Facts" value={(db?.total_facts ?? 0).toLocaleString('en-US')} />
          <StatCard label="Last ingest" value={fmtAge(db?.last_ingested_at)} />
          <StatCard label="Memory" value={status?.memory_mb ? `${Math.round(status.memory_mb)} MB` : '—'} />
          <StatCard label="Backup" value={fmtBytes(backup?.gz_size_mb)} sub={fmtAge(backup?.last_backup_at)} />
        </div>

        {/* Ingest panel */}
        <div className="card card-pad-lg" style={{ marginBottom: 16 }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <h4>Trigger ingest</h4>
            {isRunning && (
              <span className="mono" style={{ fontSize: 12, color: 'var(--accent)' }}>
                Running · polling /admin/status every 5s
              </span>
            )}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 10,
              marginBottom: 14,
            }}
          >
            {[
              ['/admin/ingest/sp500', 'S&P 500', '503 companies'],
              ['/admin/ingest/russell1000', 'Russell 1000', '1,000 companies'],
              ['/admin/ingest/russell3000', 'Russell 3000', '3,000 companies'],
              ['/admin/ingest/all', 'All US', '10,000+ companies'],
            ].map(([path, label, sub]) => (
              <button
                key={path}
                className="btn btn-outline"
                disabled={isRunning || running}
                onClick={() => trigger(path, label)}
                style={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: 14,
                  gap: 4,
                  height: 'auto',
                }}
              >
                <span style={{ fontWeight: 500, fontSize: 13 }}>{label}</span>
                <span style={{ fontSize: 11.5, color: 'var(--fg-subtle)' }}>{sub}</span>
              </button>
            ))}
          </div>
          <div className="row" style={{ gap: 8 }}>
            <input
              className="input mono"
              style={{ flex: 1, fontSize: 13 }}
              value={singleTicker}
              onChange={e => setSingleTicker(e.target.value.toUpperCase())}
              placeholder="Single ticker (e.g. MSFT)"
            />
            <button
              className="btn btn-primary"
              disabled={!singleTicker || isRunning || running}
              onClick={() => trigger(`/admin/ingest/${singleTicker}`, singleTicker)}
            >
              <Icons.Send size={14} /> Ingest
            </button>
          </div>

          {isRunning && job && (
            <div style={{ marginTop: 18 }}>
              <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12.5, color: 'var(--fg-muted)' }}>
                  {job.label} · {job.progress}
                </span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>
                  {job.errors ?? 0} errors · {job.skipped ?? 0} skipped
                </span>
              </div>
              <ProgressBar progress={job.progress} />
            </div>
          )}
        </div>

        {/* Backups */}
        <div className="card card-pad-lg">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <h4>Backups</h4>
            <span style={{ fontSize: 12.5, color: 'var(--fg-subtle)' }} className="mono">
              {backup?.last_backup_at ? `Last: ${new Date(backup.last_backup_at).toUTCString().slice(0, 25)}` : 'No backup yet'}
            </span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 12,
              marginBottom: 14,
            }}
          >
            <BackupRow label="Primary (.gz)" size={fmtBytes(backup?.gz_size_mb)} age={fmtAge(backup?.last_backup_at)} />
            <BackupRow
              label="Mirror (.bak)"
              size={backup?.gz_bak_exists ? fmtBytes(backup?.gz_bak_size_mb) : '—'}
              age=""
            />
            <BackupRow
              label="Mirror (.bak2)"
              size={backup?.gz_bak2_exists ? fmtBytes(backup?.gz_bak2_size_mb) : '—'}
              age=""
            />
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => trigger('/admin/backup?force=true', 'Force backup')}
              disabled={running}
            >
              <Icons.Refresh size={13} /> Force backup
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => trigger('/admin/cleanup-old-backups', 'Cleanup')}
              disabled={running}
            >
              Cleanup old backups
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card card-pad-sm">
      <div
        style={{
          fontSize: 11.5,
          color: 'var(--fg-subtle)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }} className="mono tabular">
        {value}
      </div>
      {sub && <div style={{ fontSize: 11.5, color: 'var(--fg-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function BackupRow({ label, size, age }: { label: string; size: string; age: string }) {
  return (
    <div style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 10 }}>
      <div style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginBottom: 4 }}>{label}</div>
      <div className="mono" style={{ fontSize: 16, fontWeight: 500 }}>
        {size}
      </div>
      {age && <div style={{ fontSize: 11.5, color: 'var(--fg-subtle)', marginTop: 2 }}>{age}</div>}
    </div>
  )
}

function ProgressBar({ progress }: { progress?: string }) {
  if (!progress || !progress.includes('/')) return null
  const [done, total] = progress.split('/').map(s => Number(s.trim()))
  const pct = total > 0 ? Math.min(100, (done / total) * 100) : 0
  return (
    <div style={{ height: 6, background: 'var(--bg-soft)', borderRadius: 999, overflow: 'hidden' }}>
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background:
            'linear-gradient(90deg, var(--accent), oklch(from var(--accent) l c calc(h + 60)))',
          transition: 'width 0.5s',
        }}
      />
    </div>
  )
}
