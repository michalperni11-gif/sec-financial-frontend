'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TopNav } from '@/components/layout/TopNav'
import { Icons } from '@/components/ui/Icons'
import { useToast } from '@/components/ui/Toast'
import { apiFetch, ApiError } from '@/lib/api'
import { getToken } from '@/lib/auth'

interface Endpoint {
  method: 'GET'
  path: string
  desc: string
  tier: string
  hasTicker: boolean
  hasPeriod: boolean
}

const ENDPOINT_GROUPS: { group: string; items: Endpoint[] }[] = [
  {
    group: 'Company',
    items: [
      { method: 'GET', path: '/v1/company/{ticker}/info', desc: 'Basic company metadata', tier: 'Free', hasTicker: true, hasPeriod: false },
      { method: 'GET', path: '/v1/company/{ticker}/financials', desc: 'All statements bundled', tier: 'Free', hasTicker: true, hasPeriod: true },
      { method: 'GET', path: '/v1/company/{ticker}/income-statement', desc: 'Income statement', tier: 'Free', hasTicker: true, hasPeriod: true },
      { method: 'GET', path: '/v1/company/{ticker}/balance-sheet', desc: 'Balance sheet', tier: 'Free', hasTicker: true, hasPeriod: true },
      { method: 'GET', path: '/v1/company/{ticker}/cash-flow', desc: 'Cash flow statement', tier: 'Free', hasTicker: true, hasPeriod: true },
      { method: 'GET', path: '/v1/company/{ticker}/metrics', desc: '50 ratios + DQS score', tier: 'Starter', hasTicker: true, hasPeriod: false },
    ],
  },
  {
    group: 'Listings',
    items: [{ method: 'GET', path: '/v1/companies', desc: 'Paginated company list', tier: 'Free', hasTicker: false, hasPeriod: false }],
  },
  {
    group: 'System',
    items: [{ method: 'GET', path: '/health', desc: 'API health check', tier: 'Free', hasTicker: false, hasPeriod: false }],
  },
]

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://sec-financial-api-production.up.railway.app'

export default function PlaygroundPage() {
  const router = useRouter()
  const toast = useToast()
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [endpoint, setEndpoint] = useState<Endpoint>(ENDPOINT_GROUPS[0].items[2])
  const [ticker, setTicker] = useState('MSFT')
  const [tickerSearch, setTickerSearch] = useState('')
  const [tickerOpen, setTickerOpen] = useState(false)
  const [companies, setCompanies] = useState<{ ticker: string; name: string }[]>([])
  const [period, setPeriod] = useState('annual')
  const [limit, setLimit] = useState('5')
  const [cutoff, setCutoff] = useState('')
  const [tab, setTab] = useState<'pretty' | 'raw' | 'table' | 'curl'>('pretty')
  const [response, setResponse] = useState<unknown>(null)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)
  const [responseSize, setResponseSize] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const tickerInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?next=/playground')
      return
    }
    apiFetch<{ api_key: string | null }>('/auth/me')
      .then(d => setApiKey(d.api_key))
      .catch(() => null)
    // Load company list for autocomplete
    apiFetch<{ results?: { ticker: string; name: string }[]; data?: { ticker: string; name: string }[] }>(
      '/v1/companies?limit=200',
    )
      .then(d => setCompanies(d.results ?? d.data ?? []))
      .catch(() => null)
  }, [router])

  const filteredCompanies = useMemo(() => {
    const q = tickerSearch.toLowerCase()
    if (!q) return companies.slice(0, 8)
    return companies
      .filter(c => c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
      .slice(0, 8)
  }, [companies, tickerSearch])

  const realPath = endpoint.path.replace('{ticker}', ticker.toLowerCase())
  const queryParts: string[] = []
  if (endpoint.hasPeriod && period) queryParts.push(`period=${period}`)
  if (endpoint.hasTicker && limit) queryParts.push(`limit=${limit}`)
  if (endpoint.hasTicker && cutoff) queryParts.push(`cutoff_date=${cutoff}`)
  const fullUrl = `${BASE}${realPath}${queryParts.length ? '?' + queryParts.join('&') : ''}`
  const curlCmd = `curl ${fullUrl} \\\n  -H "X-API-Key: ${apiKey ?? '<your-api-key>'}"`

  const send = async () => {
    if (!apiKey && endpoint.path !== '/health') {
      toast({ kind: 'error', message: 'No API key — verify your email first.' })
      return
    }
    setLoading(true)
    setError('')
    const start = performance.now()
    try {
      const res = await fetch(fullUrl, {
        headers: apiKey ? { 'X-API-Key': apiKey } : undefined,
      })
      const text = await res.text()
      const ms = Math.round(performance.now() - start)
      const size = new TextEncoder().encode(text).length
      setResponseTime(ms)
      setResponseSize(size)
      setStatusCode(res.status)
      try {
        setResponse(JSON.parse(text))
      } catch {
        setResponse(text)
      }
      if (!res.ok) {
        if (res.status === 403) {
          toast({ kind: 'warn', message: `Tier upgrade required for ${endpoint.path}` })
        } else if (res.status === 429) {
          toast({ kind: 'warn', message: 'Rate limit hit — slow down' })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
      setStatusCode(0)
      setResponse({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  // Auto-fire first request when API key loads
  useEffect(() => {
    if (apiKey) void send()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey])

  const copyCurl = async () => {
    try {
      await navigator.clipboard.writeText(curlCmd)
      toast({ kind: 'success', message: 'cURL copied' })
    } catch {
      toast({ kind: 'error', message: 'Could not copy' })
    }
  }

  return (
    <>
      <TopNav />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 260px) 1fr',
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            borderRight: '1px solid var(--border)',
            padding: '20px 16px',
            overflowY: 'auto',
            position: 'sticky',
            top: 60,
            maxHeight: 'calc(100vh - 60px)',
          }}
        >
          <div className="eyebrow" style={{ marginBottom: 12, padding: '0 8px' }}>
            Endpoints
          </div>
          {ENDPOINT_GROUPS.map(g => (
            <div key={g.group} style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--fg-subtle)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '0 8px',
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                {g.group}
              </div>
              {g.items.map(item => {
                const active = endpoint.path === item.path
                const display = item.path.startsWith('/v1/company/{ticker}/')
                  ? item.path.replace('/v1/company/{ticker}/', '')
                  : item.path
                return (
                  <button
                    key={item.path}
                    className="row"
                    style={{
                      gap: 8,
                      padding: '7px 8px',
                      borderRadius: 7,
                      cursor: 'pointer',
                      background: active ? 'var(--accent-soft)' : 'transparent',
                      color: active ? 'var(--accent)' : 'var(--fg-muted)',
                      fontSize: 12.5,
                      width: '100%',
                      border: 'none',
                      textAlign: 'left',
                    }}
                    onClick={() => setEndpoint(item)}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 9.5,
                        fontWeight: 600,
                        padding: '2px 5px',
                        borderRadius: 4,
                        background: active ? 'var(--accent)' : 'var(--bg-soft)',
                        color: active ? 'oklch(0.16 0.012 250)' : 'var(--fg-subtle)',
                      }}
                    >
                      {item.method}
                    </span>
                    <span
                      className="mono"
                      style={{
                        fontSize: 12,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                      }}
                    >
                      {display}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Main */}
        <div
          style={{
            padding: 24,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {/* Request builder */}
          <div className="card">
            <div className="row" style={{ gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <span
                className="badge mono"
                style={{
                  fontWeight: 600,
                  fontSize: 10.5,
                  color: 'var(--accent)',
                  borderColor: 'oklch(from var(--accent) l c h / 0.3)',
                  background: 'var(--accent-soft)',
                }}
              >
                {endpoint.method}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 13.5,
                  color: 'var(--fg-muted)',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {fullUrl}
              </span>
              <span className="badge" style={{ fontSize: 11 }}>
                {endpoint.tier}+
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 18 }}>{endpoint.desc}</p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 12,
                marginBottom: 14,
              }}
            >
              {endpoint.hasTicker && (
                <div style={{ position: 'relative' }}>
                  <ParamLabel>Ticker</ParamLabel>
                  <div
                    className="input row"
                    style={{ padding: 0, alignItems: 'stretch', gap: 4 }}
                  >
                    <input
                      ref={tickerInputRef}
                      className="mono"
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        padding: '10px 14px',
                        outline: 'none',
                        color: 'inherit',
                        fontSize: 13,
                      }}
                      value={ticker}
                      onChange={e => {
                        setTicker(e.target.value.toUpperCase())
                        setTickerSearch(e.target.value)
                        setTickerOpen(true)
                      }}
                      onFocus={() => setTickerOpen(true)}
                      onBlur={() => window.setTimeout(() => setTickerOpen(false), 150)}
                      placeholder="MSFT"
                    />
                    <span style={{ alignSelf: 'center', marginRight: 12, color: 'var(--fg-subtle)' }}>
                      <Icons.ChevronDown size={14} />
                    </span>
                  </div>
                  {tickerOpen && filteredCompanies.length > 0 && (
                    <div
                      className="card"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: 4,
                        padding: 4,
                        zIndex: 20,
                        maxHeight: 280,
                        overflowY: 'auto',
                        boxShadow: 'var(--shadow)',
                      }}
                    >
                      {filteredCompanies.map(c => (
                        <button
                          key={c.ticker}
                          className="row"
                          style={{
                            gap: 12,
                            padding: '8px 10px',
                            borderRadius: 7,
                            cursor: 'pointer',
                            width: '100%',
                            border: 'none',
                            background: 'transparent',
                            color: 'inherit',
                            textAlign: 'left',
                          }}
                          onMouseDown={e => {
                            e.preventDefault()
                            setTicker(c.ticker)
                            setTickerSearch('')
                            setTickerOpen(false)
                          }}
                        >
                          <span className="mono" style={{ fontWeight: 600, fontSize: 12.5, width: 60 }}>
                            {c.ticker}
                          </span>
                          <span
                            style={{
                              fontSize: 12.5,
                              color: 'var(--fg-muted)',
                              flex: 1,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {c.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {endpoint.hasPeriod && (
                <div>
                  <ParamLabel>Period</ParamLabel>
                  <select
                    className="input mono"
                    style={{ fontSize: 13 }}
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                  >
                    <option value="annual">Annual</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              )}
              {endpoint.hasTicker && (
                <>
                  <div>
                    <ParamLabel>Limit</ParamLabel>
                    <input
                      className="input mono"
                      style={{ fontSize: 13 }}
                      value={limit}
                      onChange={e => setLimit(e.target.value)}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <ParamLabel>Cutoff date</ParamLabel>
                    <input
                      className="input mono"
                      style={{ fontSize: 13 }}
                      value={cutoff}
                      onChange={e => setCutoff(e.target.value)}
                      placeholder="2025-12-31"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={send} disabled={loading}>
                {loading ? <Icons.Refresh size={15} className="animate-spin" /> : <Icons.Send size={15} />}
                {loading ? 'Sending…' : 'Send request'}
              </button>
              <button className="btn btn-outline btn-sm" onClick={copyCurl}>
                <Icons.Copy size={14} /> Copy as cURL
              </button>
            </div>
          </div>

          {/* Response */}
          <div
            className="card"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden',
              minHeight: 320,
            }}
          >
            <div
              className="row"
              style={{
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
                padding: '0 18px',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div className="row">
                {(['pretty', 'raw', 'table', 'curl'] as const).map(k => {
                  const labels = { pretty: 'Pretty JSON', raw: 'Raw', table: 'Table', curl: 'cURL' }
                  return (
                    <button
                      key={k}
                      onClick={() => setTab(k)}
                      style={{
                        padding: '14px 16px',
                        cursor: 'pointer',
                        fontSize: 13,
                        background: 'transparent',
                        border: 'none',
                        color: tab === k ? 'var(--fg)' : 'var(--fg-muted)',
                        borderBottom: tab === k ? '2px solid var(--accent)' : '2px solid transparent',
                        fontWeight: tab === k ? 500 : 400,
                      }}
                    >
                      {labels[k]}
                    </button>
                  )
                })}
              </div>
              <div className="row" style={{ gap: 12, fontSize: 12, color: 'var(--fg-subtle)', padding: '12px 0' }}>
                {statusCode !== null && (
                  <span
                    className={statusCode >= 200 && statusCode < 300 ? 'badge badge-positive' : 'badge'}
                    style={statusCode >= 400 ? { color: 'var(--negative)' } : undefined}
                  >
                    <span className="badge-dot" /> {statusCode || 'ERR'} {statusCode >= 200 && statusCode < 300 ? 'OK' : ''}
                  </span>
                )}
                {responseTime !== null && <span className="mono">{responseTime}ms</span>}
                {responseSize !== null && (
                  <span className="mono">{(responseSize / 1024).toFixed(1)} KB</span>
                )}
              </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: 18 }}>
              {loading && (
                <div className="col" style={{ gap: 12 }}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="skeleton" style={{ height: 18, width: `${100 - i * 8}%` }} />
                  ))}
                </div>
              )}
              {!loading && error && (
                <div style={{ color: 'var(--negative)', fontSize: 13 }}>{error}</div>
              )}
              {!loading && response !== null && tab === 'pretty' && <PrettyJson data={response} />}
              {!loading && response !== null && tab === 'raw' && (
                <pre
                  className="mono"
                  style={{
                    margin: 0,
                    fontSize: 12,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    color: 'var(--fg-muted)',
                  }}
                >
                  {JSON.stringify(response)}
                </pre>
              )}
              {!loading && response !== null && tab === 'table' && <ResponseTable data={response} />}
              {!loading && tab === 'curl' && (
                <pre
                  className="mono"
                  style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: 'var(--fg)' }}
                >
                  <span style={{ color: 'var(--fg-subtle)' }}># Reproduce this request</span>
                  {'\n'}
                  {curlCmd}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function ParamLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontSize: 11,
        color: 'var(--fg-subtle)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        display: 'block',
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  )
}

function PrettyJson({ data }: { data: unknown }) {
  const render = (v: unknown): React.ReactNode => {
    if (v === null) return <span style={{ color: 'var(--fg-subtle)' }}>null</span>
    if (typeof v === 'string') return <span style={{ color: 'var(--positive)' }}>&quot;{v}&quot;</span>
    if (typeof v === 'number') return <span style={{ color: 'var(--accent)' }}>{v}</span>
    if (typeof v === 'boolean') return <span style={{ color: 'var(--warn)' }}>{String(v)}</span>
    if (Array.isArray(v)) {
      if (v.length === 0) return <span>[]</span>
      return (
        <span>
          [
          {v.map((item, i) => (
            <div key={i} style={{ paddingLeft: 18 }}>
              {render(item)}
              {i < v.length - 1 ? ',' : ''}
            </div>
          ))}
          ]
        </span>
      )
    }
    if (typeof v === 'object') {
      const o = v as Record<string, unknown>
      const keys = Object.keys(o)
      if (keys.length === 0) return <span>{'{}'}</span>
      return (
        <span>
          {'{'}
          {keys.map((k, i) => (
            <div key={k} style={{ paddingLeft: 18 }}>
              <span style={{ color: 'oklch(from var(--accent) l calc(c * 0.6) calc(h - 60))' }}>
                &quot;{k}&quot;
              </span>
              <span style={{ color: 'var(--fg-subtle)' }}>: </span>
              {render(o[k])}
              {i < keys.length - 1 ? ',' : ''}
            </div>
          ))}
          {'}'}
        </span>
      )
    }
    return String(v)
  }
  return (
    <pre
      className="mono"
      style={{ margin: 0, fontSize: 12.5, lineHeight: 1.65, color: 'var(--fg)' }}
    >
      {render(data)}
    </pre>
  )
}

function ResponseTable({ data }: { data: unknown }) {
  if (typeof data !== 'object' || data === null) {
    return <pre className="mono" style={{ fontSize: 13 }}>{String(data)}</pre>
  }
  const obj = data as Record<string, unknown>
  let rows: Record<string, unknown>[] | null = null
  let title = 'Items'
  if (Array.isArray(data)) {
    rows = data as Record<string, unknown>[]
  } else if (Array.isArray(obj.data)) {
    rows = obj.data as Record<string, unknown>[]
    title = 'Data'
  } else if (Array.isArray(obj.results)) {
    rows = obj.results as Record<string, unknown>[]
    title = 'Results'
  } else if (Array.isArray(obj.income)) {
    rows = obj.income as Record<string, unknown>[]
    title = 'Income statement'
  }

  if (!rows || rows.length === 0) {
    const entries = Object.entries(obj)
    return (
      <table className="tbl">
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([k, v]) => (
            <tr key={k}>
              <td className="tbl-mono" style={{ color: 'var(--fg-muted)' }}>
                {k}
              </td>
              <td className="tbl-mono">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const cols = Object.keys(rows[0])
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--fg-subtle)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        {title} · {rows.length} rows
      </div>
      <table className="tbl">
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c} className={typeof rows![0][c] === 'number' ? 'num' : ''}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {cols.map(c => (
                <td key={c} className={`tbl-mono ${typeof r[c] === 'number' ? 'num' : ''}`}>
                  {typeof r[c] === 'number' && Math.abs(r[c] as number) > 100
                    ? (r[c] as number).toLocaleString('en-US')
                    : typeof r[c] === 'object'
                      ? JSON.stringify(r[c])
                      : String(r[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
