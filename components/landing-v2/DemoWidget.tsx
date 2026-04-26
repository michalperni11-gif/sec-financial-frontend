'use client'

import { useEffect, useRef, useState } from 'react'
import { Icons } from '@/components/ui/Icons'
import { fmtUSD } from '@/lib/format'

interface PeriodRow {
  period: string
  revenue?: number
  operatingIncome?: number
  netIncome?: number
  eps?: number
}

interface ApiResponse {
  ticker?: string
  periods?: string[]
  data?: Record<string, Record<string, number>>
  error?: string
}

const SUGGESTED = ['AAPL', 'A', 'AAL', 'ABBV', 'ABNB']

function num(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim()) {
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }
  return undefined
}

function extractRows(payload: ApiResponse): PeriodRow[] {
  const periods = payload.periods
  const data = payload.data
  if (!Array.isArray(periods) || !data || typeof data !== 'object') return []
  // Most recent first → take last 5, then reverse so newest is on top
  const recent = periods.slice(-5).reverse()
  return recent.map(p => ({
    period: p,
    revenue: num(data.Revenue?.[p]),
    operatingIncome: num(data.OperatingIncome?.[p]),
    netIncome: num(data.NetIncome?.[p]),
    eps: num(data.EPSDiluted?.[p] ?? data.EPSBasic?.[p]),
  }))
}

export function DemoWidget() {
  const [ticker, setTicker] = useState('MSFT')
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<PeriodRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ status: number; ms: number; bytes: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const run = async (t?: string) => {
    const target = (t ?? inputRef.current?.value ?? ticker).toUpperCase().trim()
    if (!target) return
    setLoading(true)
    setError(null)
    const start = performance.now()
    try {
      const res = await fetch(`/api/financial-data?ticker=${encodeURIComponent(target)}&endpoint=income-statement`)
      const text = await res.text()
      const ms = Math.round(performance.now() - start)
      const bytes = new TextEncoder().encode(text).length
      const body: ApiResponse = text ? JSON.parse(text) : {}

      if (!res.ok) {
        setError(body.error ?? `Request failed (${res.status})`)
        setRows([])
        setMeta({ status: res.status, ms, bytes })
        return
      }

      const extracted = extractRows(body)
      if (!extracted.length) {
        setError(`No income statement data for ${target}.`)
        setRows([])
      } else {
        setRows(extracted)
      }
      setTicker(target)
      setMeta({ status: res.status, ms, bytes })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Network error')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void run('MSFT')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="container-x" style={{ marginTop: 60, marginBottom: 100 }}>
      <div className="card card-pad-lg" style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 600px 200px at 50% 0%, var(--accent-soft), transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="row"
          style={{ justifyContent: 'space-between', marginBottom: 22, position: 'relative', flexWrap: 'wrap', gap: 12 }}
        >
          <div className="col" style={{ gap: 8 }}>
            <div className="eyebrow">Live demo</div>
            <h3>Try it without signing up</h3>
          </div>
          <div className="badge mono" style={{ fontSize: 11.5 }}>
            GET /v1/company/{ticker.toLowerCase()}/income-statement
          </div>
        </div>

        <div className="row" style={{ gap: 12, marginBottom: 18, position: 'relative' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-subtle)', pointerEvents: 'none', display: 'inline-flex' }}>
              <Icons.Search size={15} />
            </span>
            <input
              ref={inputRef}
              className="input mono"
              defaultValue={ticker}
              placeholder="Ticker (e.g. MSFT, JPM, AAPL)"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  void run((e.target as HTMLInputElement).value)
                }
              }}
              style={{ paddingLeft: 38 }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => void run()} disabled={loading}>
            {loading ? <Icons.Refresh size={15} className="animate-spin" /> : <Icons.Send size={15} />}
            Send request
          </button>
        </div>

        <div
          className="row"
          style={{ gap: 8, marginBottom: 14, fontSize: 12, color: 'var(--fg-subtle)', flexWrap: 'wrap' }}
        >
          <span>Try:</span>
          {SUGGESTED.map(s => (
            <button
              key={s}
              className="mono"
              style={{
                padding: '2px 8px',
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: 'var(--bg-elev)',
                color: 'var(--fg-muted)',
                fontSize: 11.5,
                cursor: 'pointer',
              }}
              onClick={() => {
                if (inputRef.current) inputRef.current.value = s
                void run(s)
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div
            className="card"
            style={{
              background: 'oklch(from var(--negative) l c h / 0.08)',
              borderColor: 'oklch(from var(--negative) l c h / 0.3)',
              padding: 14,
              fontSize: 13.5,
              color: 'var(--negative)',
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {loading ? (
            <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton" style={{ height: 26 }} />
              ))}
            </div>
          ) : rows.length > 0 ? (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Period</th>
                  <th className="num">Revenue</th>
                  <th className="num">Operating Income</th>
                  <th className="num">Net Income</th>
                  <th className="num">EPS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.period}>
                    <td className="tbl-mono">
                      <strong>{r.period.slice(0, 10)}</strong>
                    </td>
                    <td className="num tbl-mono">{r.revenue != null ? fmtUSD(r.revenue) : '—'}</td>
                    <td className="num tbl-mono">{r.operatingIncome != null ? fmtUSD(r.operatingIncome) : '—'}</td>
                    <td className="num tbl-mono">{r.netIncome != null ? fmtUSD(r.netIncome) : '—'}</td>
                    <td className="num tbl-mono">{r.eps != null ? `$${r.eps.toFixed(2)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-subtle)', fontSize: 13 }}>
              No data
            </div>
          )}
        </div>

        {meta && (
          <div
            className="row"
            style={{
              marginTop: 14,
              justifyContent: 'space-between',
              fontSize: 12.5,
              color: 'var(--fg-subtle)',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div className="row" style={{ gap: 10 }}>
              <span className={meta.status >= 200 && meta.status < 300 ? 'badge badge-positive' : 'badge'}>
                <span className="badge-dot" />
                {meta.status} {meta.status >= 200 && meta.status < 300 ? 'OK' : ''}
              </span>
              <span className="mono">{meta.ms}ms</span>
              <span>·</span>
              <span className="mono">{(meta.bytes / 1024).toFixed(1)} KB</span>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <span>Source: SEC EDGAR</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
