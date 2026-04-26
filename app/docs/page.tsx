'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TopNav } from '@/components/layout/TopNav'
import { Icons } from '@/components/ui/Icons'
import { useToast } from '@/components/ui/Toast'

const DOCS_NAV = [
  { id: 'quickstart', label: 'Quick start', group: 'Getting started' },
  { id: 'auth', label: 'Authentication', group: 'Getting started' },
  { id: 'ratelimits', label: 'Rate limits', group: 'Getting started' },
  { id: 'ep-info', label: '/v1/company/{ticker}/info', group: 'Endpoints', mono: true },
  { id: 'ep-financials', label: '/v1/company/{ticker}/financials', group: 'Endpoints', mono: true },
  { id: 'ep-income', label: '/v1/company/{ticker}/income-statement', group: 'Endpoints', mono: true },
  { id: 'ep-balance', label: '/v1/company/{ticker}/balance-sheet', group: 'Endpoints', mono: true },
  { id: 'ep-cash', label: '/v1/company/{ticker}/cash-flow', group: 'Endpoints', mono: true },
  { id: 'ep-metrics', label: '/v1/company/{ticker}/metrics', group: 'Endpoints', mono: true },
  { id: 'ep-list', label: '/v1/companies', group: 'Endpoints', mono: true },
  { id: 'errors', label: 'Error codes', group: 'Reference' },
  { id: 'tiers', label: 'Tier comparison', group: 'Reference' },
  { id: 'changelog', label: 'Changelog', group: 'Reference' },
]

const CODE_PY = `import requests

r = requests.get(
    "https://sec-financial-api-production.up.railway.app/v1/company/MSFT/income-statement",
    headers={"X-API-Key": "sk_live_…"},
    params={"period": "annual", "limit": 5},
)
print(r.json())`

const CODE_JS = `const r = await fetch(
  "https://sec-financial-api-production.up.railway.app/v1/company/MSFT/income-statement?period=annual&limit=5",
  { headers: { "X-API-Key": "sk_live_…" } }
);
console.log(await r.json());`

const CODE_CURL = `curl https://sec-financial-api-production.up.railway.app/v1/company/MSFT/income-statement \\
  -H "X-API-Key: sk_live_…" \\
  -G --data-urlencode "period=annual" --data-urlencode "limit=5"`

function CodeTabs() {
  const toast = useToast()
  const [tab, setTab] = useState<'python' | 'js' | 'curl'>('python')
  const code = tab === 'python' ? CODE_PY : tab === 'js' ? CODE_JS : CODE_CURL

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast({ kind: 'success', message: 'Copied' })
    } catch {
      toast({ kind: 'error', message: 'Could not copy' })
    }
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div
        className="row"
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '0 14px',
          justifyContent: 'space-between',
        }}
      >
        <div className="row">
          {(['python', 'js', 'curl'] as const).map(k => {
            const labels = { python: 'Python', js: 'JavaScript', curl: 'cURL' }
            return (
              <button
                key={k}
                onClick={() => setTab(k)}
                style={{
                  padding: '12px 14px',
                  cursor: 'pointer',
                  fontSize: 13,
                  border: 'none',
                  background: 'transparent',
                  color: tab === k ? 'var(--fg)' : 'var(--fg-muted)',
                  borderBottom: tab === k ? '2px solid var(--accent)' : '2px solid transparent',
                }}
              >
                {labels[k]}
              </button>
            )
          })}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={copy}>
          <Icons.Copy size={13} /> Copy
        </button>
      </div>
      <pre
        className="mono"
        style={{
          margin: 0,
          padding: 16,
          fontSize: 12.5,
          lineHeight: 1.65,
          color: 'var(--fg)',
          overflow: 'auto',
        }}
      >
        {code}
      </pre>
    </div>
  )
}

function DocPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="eyebrow">{eyebrow}</div>
      <h2 style={{ fontSize: 32 }}>{title}</h2>
      {children}
    </div>
  )
}

function DocQuickstart() {
  return (
    <DocPage eyebrow="Getting started" title="Quick start">
      <p style={{ color: 'var(--fg-muted)', fontSize: 15, lineHeight: 1.6 }}>
        Get from zero to your first request in under a minute. The API serves standardized SEC EDGAR data — no XBRL
        parsing required on your side.
      </p>
      <div className="card">
        <h4 style={{ marginBottom: 12 }}>1. Create an account</h4>
        <p style={{ color: 'var(--fg-muted)', fontSize: 14, marginBottom: 14 }}>
          Free tier — 100 requests/day, no credit card.{' '}
          <Link href="/register" style={{ color: 'var(--accent)' }}>
            Sign up →
          </Link>
        </p>
      </div>
      <h4 style={{ marginTop: 16 }}>2. Make your first request</h4>
      <CodeTabs />
      <h4 style={{ marginTop: 16 }}>3. Inspect the response</h4>
      <p style={{ color: 'var(--fg-muted)', fontSize: 14 }}>
        You&apos;ll get a JSON object with normalized GAAP fields. Every numeric field is in USD millions unless
        otherwise noted.
      </p>
    </DocPage>
  )
}

function DocAuth() {
  return (
    <DocPage eyebrow="Getting started" title="Authentication">
      <p style={{ color: 'var(--fg-muted)', fontSize: 15, lineHeight: 1.6 }}>
        Two auth modes: <span className="mono">X-API-Key</span> header for server-to-server, JWT bearer for
        user-scoped requests from your dashboard UI.
      </p>
      <div className="card">
        <h4 style={{ marginBottom: 12 }}>API key (recommended)</h4>
        <CodeTabs />
      </div>
      <div className="card">
        <h4 style={{ marginBottom: 12 }}>JWT Bearer</h4>
        <p style={{ color: 'var(--fg-muted)', fontSize: 13.5 }}>
          POST <span className="mono">/auth/login</span> returns a JWT. Pass it in the{' '}
          <span className="mono">Authorization: Bearer …</span> header. JWTs expire after 24h.
        </p>
      </div>
    </DocPage>
  )
}

function DocRateLimits() {
  return (
    <DocPage eyebrow="Getting started" title="Rate limits">
      <p style={{ color: 'var(--fg-muted)', fontSize: 15, lineHeight: 1.6 }}>
        Limits are per-API-key. Exceeding returns <span className="mono">429 Too Many Requests</span> with a{' '}
        <span className="mono">Retry-After</span> header in seconds.
      </p>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Tier</th>
              <th className="num">Per minute</th>
              <th className="num">Per day</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Free</td>
              <td className="num tbl-mono">—</td>
              <td className="num tbl-mono">100</td>
            </tr>
            <tr>
              <td>Basic</td>
              <td className="num tbl-mono">500</td>
              <td className="num tbl-mono">unlimited</td>
            </tr>
            <tr>
              <td>Starter</td>
              <td className="num tbl-mono">500</td>
              <td className="num tbl-mono">unlimited</td>
            </tr>
            <tr>
              <td>Growth</td>
              <td className="num tbl-mono">1,000</td>
              <td className="num tbl-mono">unlimited</td>
            </tr>
            <tr>
              <td>Pro</td>
              <td className="num tbl-mono">3,000</td>
              <td className="num tbl-mono">unlimited</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DocPage>
  )
}

function DocEndpoint({ id }: { id: string }) {
  const path = DOCS_NAV.find(d => d.id === id)?.label || ''
  return (
    <DocPage eyebrow="Endpoints" title={path}>
      <div className="row" style={{ gap: 8, marginTop: -8 }}>
        <span
          className="badge mono"
          style={{
            color: 'var(--accent)',
            borderColor: 'oklch(from var(--accent) l c h / 0.3)',
            background: 'var(--accent-soft)',
            fontWeight: 600,
          }}
        >
          GET
        </span>
        <span className="badge">Free tier</span>
      </div>
      <p style={{ color: 'var(--fg-muted)', fontSize: 15, lineHeight: 1.6 }}>
        Returns the requested statement for the given ticker. Data is normalized across filers and indexed by
        fiscal period.
      </p>
      <h4>Parameters</h4>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>In</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tbl-mono">ticker</td>
              <td>path</td>
              <td className="tbl-mono">string</td>
              <td>Ticker symbol (e.g. MSFT)</td>
            </tr>
            <tr>
              <td className="tbl-mono">period</td>
              <td>query</td>
              <td className="tbl-mono">enum</td>
              <td>
                <span className="mono">annual</span> or <span className="mono">quarterly</span> · default annual
              </td>
            </tr>
            <tr>
              <td className="tbl-mono">limit</td>
              <td>query</td>
              <td className="tbl-mono">int</td>
              <td>Number of periods to return · default 5</td>
            </tr>
            <tr>
              <td className="tbl-mono">cutoff_date</td>
              <td>query</td>
              <td className="tbl-mono">date</td>
              <td>ISO date — only return periods on or before this date</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h4>Example request</h4>
      <CodeTabs />
      <Link href="/playground" className="btn btn-outline" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
        <Icons.Terminal size={14} /> Try in playground
      </Link>
    </DocPage>
  )
}

function DocErrors() {
  return (
    <DocPage eyebrow="Reference" title="Error codes">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th className="tbl-mono">Code</th>
              <th>Meaning</th>
              <th>What to do</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="tbl-mono">400</td>
              <td>Bad request</td>
              <td>Check params — see error message body.</td>
            </tr>
            <tr>
              <td className="tbl-mono">401</td>
              <td>Missing or invalid auth</td>
              <td>Verify X-API-Key or refresh JWT.</td>
            </tr>
            <tr>
              <td className="tbl-mono">403</td>
              <td>Tier doesn&apos;t include this</td>
              <td>Upgrade plan or use a covered ticker.</td>
            </tr>
            <tr>
              <td className="tbl-mono">404</td>
              <td>Ticker not found</td>
              <td>Try /v1/companies?search=…</td>
            </tr>
            <tr>
              <td className="tbl-mono">429</td>
              <td>Rate limit hit</td>
              <td>Backoff using Retry-After header.</td>
            </tr>
            <tr>
              <td className="tbl-mono">5xx</td>
              <td>Our problem</td>
              <td>Retry with exponential backoff.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DocPage>
  )
}

function DocTiers() {
  const tiers = [
    { name: 'Free', price: 0, reqDay: '100', reqMin: '—', coverage: 'S&P 500', history: '5 years', featured: false },
    { name: 'Basic', price: 19, reqDay: '—', reqMin: '500', coverage: 'S&P 500', history: '10 years', featured: false },
    { name: 'Starter', price: 49, reqDay: '—', reqMin: '500', coverage: 'All US', history: '10 years', featured: true },
    { name: 'Growth', price: 149, reqDay: '—', reqMin: '1,000', coverage: 'All US', history: 'Full', featured: false },
    { name: 'Pro', price: 499, reqDay: '—', reqMin: '3,000', coverage: 'All US', history: 'Full', featured: false },
  ]
  return (
    <DocPage eyebrow="Reference" title="Tier comparison">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Price</th>
              <th className="num">Req/Day</th>
              <th className="num">Req/Min</th>
              <th>Coverage</th>
              <th>History</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map(t => (
              <tr key={t.name}>
                <td>
                  <strong>{t.name}</strong>
                  {t.featured && (
                    <span className="badge badge-accent" style={{ marginLeft: 8, fontSize: 10 }}>
                      POPULAR
                    </span>
                  )}
                </td>
                <td className="tbl-mono">
                  ${t.price}
                  {t.price > 0 ? '/mo' : ''}
                </td>
                <td className="num tbl-mono">{t.reqDay}</td>
                <td className="num tbl-mono">{t.reqMin}</td>
                <td>{t.coverage}</td>
                <td>{t.history}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DocPage>
  )
}

function DocChangelog() {
  const items = [
    { date: '2026-04-26', tag: 'feature', title: 'Backup system rewritten', body: 'sqlite3.backup() now used for atomic, WAL-inclusive snapshots. No more lost data on container restart.' },
    { date: '2026-04-22', tag: 'feature', title: 'DQS scoring v2', body: 'Now flags restatements and concept-coverage gaps separately.' },
    { date: '2026-04-08', tag: 'feature', title: 'Quarterly data backfilled', body: 'All S&P 500 quarterly statements back to 2014.' },
  ]
  return (
    <DocPage eyebrow="Reference" title="Changelog">
      <div className="col" style={{ gap: 16 }}>
        {items.map((it, i) => (
          <div key={i} className="card">
            <div className="row" style={{ gap: 12, marginBottom: 8 }}>
              <span className="mono" style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>
                {it.date}
              </span>
              <span
                className="badge"
                style={{ textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.06em' }}
              >
                {it.tag}
              </span>
            </div>
            <h4 style={{ marginBottom: 4 }}>{it.title}</h4>
            <p style={{ color: 'var(--fg-muted)', fontSize: 13.5 }}>{it.body}</p>
          </div>
        ))}
      </div>
    </DocPage>
  )
}

export default function DocsPage() {
  const [active, setActive] = useState('quickstart')
  const [search, setSearch] = useState('')
  const [cmdK, setCmdK] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdK(true)
      } else if (e.key === 'Escape') {
        setCmdK(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const groups: Record<string, typeof DOCS_NAV> = {}
  DOCS_NAV.forEach(item => {
    if (!groups[item.group]) groups[item.group] = []
    groups[item.group].push(item)
  })

  const filtered = DOCS_NAV.filter(i => i.label.toLowerCase().includes(search.toLowerCase()))

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
          <button
            className="row input"
            style={{
              gap: 8,
              textAlign: 'left',
              color: 'var(--fg-subtle)',
              fontSize: 13,
              cursor: 'pointer',
              marginBottom: 18,
            }}
            onClick={() => setCmdK(true)}
          >
            <Icons.Search size={14} />
            <span style={{ flex: 1 }}>Search docs</span>
            <span
              className="mono"
              style={{
                fontSize: 10.5,
                padding: '2px 6px',
                border: '1px solid var(--border)',
                borderRadius: 4,
              }}
            >
              ⌘K
            </span>
          </button>
          {Object.entries(groups).map(([g, items]) => (
            <div key={g} style={{ marginBottom: 18 }}>
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
                {g}
              </div>
              {items.map(i => (
                <button
                  key={i.id}
                  onClick={() => setActive(i.id)}
                  style={{
                    padding: '7px 10px',
                    borderRadius: 7,
                    cursor: 'pointer',
                    fontSize: i.mono ? 11.5 : 13,
                    color: active === i.id ? 'var(--accent)' : 'var(--fg-muted)',
                    background: active === i.id ? 'var(--accent-soft)' : 'transparent',
                    fontFamily: i.mono ? 'var(--font-mono)' : 'inherit',
                    width: '100%',
                    border: 'none',
                    textAlign: 'left',
                  }}
                >
                  {i.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div style={{ padding: '32px 40px', maxWidth: 880, overflow: 'auto' }}>
          {active === 'quickstart' && <DocQuickstart />}
          {active === 'auth' && <DocAuth />}
          {active === 'ratelimits' && <DocRateLimits />}
          {active.startsWith('ep-') && <DocEndpoint id={active} />}
          {active === 'errors' && <DocErrors />}
          {active === 'tiers' && <DocTiers />}
          {active === 'changelog' && <DocChangelog />}
        </div>
      </div>

      {cmdK && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'oklch(0 0 0 / 0.5)',
            zIndex: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '15vh',
          }}
          onClick={() => setCmdK(false)}
        >
          <div
            className="card"
            style={{
              width: 540,
              maxWidth: '90vw',
              maxHeight: '60vh',
              padding: 0,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="row"
              style={{ gap: 8, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}
            >
              <Icons.Search size={15} />
              <input
                className="mono"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'inherit',
                  fontSize: 14,
                }}
                placeholder="Search endpoints, guides…"
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span
                className="mono"
                style={{
                  fontSize: 10.5,
                  padding: '2px 6px',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  color: 'var(--fg-subtle)',
                }}
              >
                ESC
              </span>
            </div>
            <div style={{ maxHeight: 360, overflowY: 'auto', padding: 6 }}>
              {filtered.map(i => (
                <button
                  key={i.id}
                  className="row"
                  style={{
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 7,
                    cursor: 'pointer',
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    color: 'inherit',
                    textAlign: 'left',
                  }}
                  onClick={() => {
                    setActive(i.id)
                    setCmdK(false)
                    setSearch('')
                  }}
                >
                  <Icons.FileText size={14} />
                  <span style={{ fontFamily: i.mono ? 'var(--font-mono)' : 'inherit', fontSize: 13 }}>
                    {i.label}
                  </span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{i.group}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
