import Link from 'next/link'
import { fmtUSD, fmtEPS, fmtPct, yoyGrowth } from '@/lib/format'

// ─── Types ────────────────────────────────────────────────────────────────────

interface IncomeRow {
  fiscal_year: number
  revenue?: number
  gross_profit?: number
  net_income?: number
  eps_basic?: number
  eps_diluted?: number
}

interface BackendResponse {
  periods?: string[]
  data?: Record<string, Record<string, number | null>>
}

// ─── Static fallback (shown when API key not configured) ──────────────────────

const FALLBACK: IncomeRow[] = [
  { fiscal_year: 2025, revenue: 416161000000, gross_profit: 195201000000, net_income: 113611000000, eps_basic: 7.49 },
  { fiscal_year: 2024, revenue: 391035000000, gross_profit: 180683000000, net_income: 93736000000,  eps_basic: 6.11 },
  { fiscal_year: 2023, revenue: 383285000000, gross_profit: 169148000000, net_income: 96995000000,  eps_basic: 6.16 },
  { fiscal_year: 2022, revenue: 394328000000, gross_profit: 170782000000, net_income: 99803000000,  eps_basic: 6.11 },
  { fiscal_year: 2021, revenue: 365817000000, gross_profit: 152836000000, net_income: 94680000000,  eps_basic: 5.61 },
]

// ─── Data fetch ───────────────────────────────────────────────────────────────

async function fetchIncome(): Promise<{ rows: IncomeRow[]; live: boolean }> {
  const key = process.env.SECBASE_DEMO_KEY
  if (!key) return { rows: FALLBACK, live: false }

  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'https://sec-financial-api-production.up.railway.app'
    const res  = await fetch(`${base}/v1/company/AAPL/income-statement`, {
      headers: { 'X-API-Key': key },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return { rows: FALLBACK, live: false }

    const json: BackendResponse = await res.json()
    const periods = json.periods ?? []
    const metrics = json.data ?? {}

    const rows: IncomeRow[] = periods.map((period) => ({
      fiscal_year: new Date(period).getFullYear(),
      revenue:     metrics['Revenue']?.[period]     ?? undefined,
      gross_profit: metrics['GrossProfit']?.[period] ?? undefined,
      net_income:  metrics['NetIncome']?.[period]   ?? undefined,
      eps_basic:   metrics['EPSBasic']?.[period]    ?? undefined,
      eps_diluted: metrics['EPSDiluted']?.[period]  ?? undefined,
    }))
      .filter((r) => r.revenue != null)
      .sort((a, b) => b.fiscal_year - a.fiscal_year)
      .slice(0, 5)

    return rows.length > 0 ? { rows, live: true } : { rows: FALLBACK, live: false }
  } catch {
    return { rows: FALLBACK, live: false }
  }
}

// ─── Stats row ────────────────────────────────────────────────────────────────

const STATS = [
  {
    value: '10,000+',
    label: 'Companies',
    sub: 'Full market coverage',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
  },
  {
    value: '30 Years',
    label: 'Historical Data',
    sub: 'Full EDGAR archive',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    value: 'Direct',
    label: 'REST API',
    sub: 'JSON, no parsing needed',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export async function Hero() {
  const { rows, live } = await fetchIncome()

  const latest  = rows[0]
  const prev    = rows[1]

  // Derived mini-metrics from income statement (no real-time price data needed)
  const grossMargin = latest?.gross_profit && latest?.revenue
    ? fmtPct(latest.gross_profit / latest.revenue)
    : 'N/A'
  const netMargin = latest?.net_income && latest?.revenue
    ? fmtPct(latest.net_income / latest.revenue)
    : 'N/A'
  const revenueGrowth = latest?.revenue && prev?.revenue
    ? yoyGrowth(latest.revenue, prev.revenue)
    : 'N/A'
  const growthUp = revenueGrowth.startsWith('+')

  const miniMetrics = [
    { label: 'Gross Margin',   value: grossMargin,   change: null },
    { label: 'Net Margin',     value: netMargin,     change: null },
    { label: 'Rev Growth YoY', value: revenueGrowth, change: revenueGrowth, up: growthUp },
  ]

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-32">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

        {/* ── Left ──────────────────────────────────── */}
        <div>
          <h1 className="animate-fade-up animate-delay-1 mb-6 text-5xl font-black leading-[1.05] tracking-tight text-white lg:text-6xl">
            Raw SEC Data.<br />
            No Fluff.<br />
            <span className="text-[#00d47e] glow-green">Low Cost.</span>
          </h1>

          <p className="animate-fade-up animate-delay-2 mb-8 max-w-sm text-sm leading-relaxed text-zinc-500">
            Standardized financial facts for developers who care about
            speed, not expensive terminals.
          </p>

          <div className="animate-fade-up animate-delay-3 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 bg-[#00d47e] px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-[#00f090] hover:shadow-[0_0_28px_rgba(0,212,126,0.4)]"
            >
              Start Free Trial
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <Link
              href="/docs"
              className="border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-300 transition-all hover:border-white/30 hover:text-white"
            >
              View Documentation
            </Link>
          </div>
        </div>

        {/* ── Right — live AAPL data table ─────────── */}
        <div className="animate-slide-right animate-delay-3 hidden lg:block">
          <div className="border border-white/[0.08] bg-[#1a1a1a] overflow-hidden">

            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#141414] px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black tracking-wider text-white">AAPL</span>
                <span className="text-xs text-zinc-500">Apple Inc.</span>
                <span className="border border-[#00d47e]/20 bg-[#00d47e]/8 px-1.5 py-0.5 text-xs font-medium text-[#00d47e] tracking-wider">
                  INCOME STMT
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${live ? 'live-dot bg-[#00d47e]' : 'bg-zinc-500'}`} />
                <span className="text-xs text-zinc-500 tracking-wider">{live ? 'LIVE' : 'CACHED'}</span>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.05] bg-[#161616]">
                  <th className="px-4 py-2.5 text-left font-medium uppercase tracking-widest text-zinc-500">Period</th>
                  <th className="px-3 py-2.5 text-right font-medium uppercase tracking-widest text-zinc-500">Revenue</th>
                  <th className="px-3 py-2.5 text-right font-medium uppercase tracking-widest text-zinc-500">Gross</th>
                  <th className="px-3 py-2.5 text-right font-medium uppercase tracking-widest text-zinc-500">Net Inc.</th>
                  <th className="px-3 py-2.5 text-right font-medium uppercase tracking-widest text-zinc-500">EPS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const prevRow = rows[i + 1]
                  const epsUp   = prevRow?.eps_basic != null && row.eps_basic != null
                    ? row.eps_basic >= prevRow.eps_basic
                    : true
                  return (
                    <tr
                      key={row.fiscal_year}
                      className="animate-fade-in border-b border-white/[0.04] transition-colors hover:bg-white/[0.03]"
                      style={{ animationDelay: `${0.4 + i * 0.08}s`, animationFillMode: 'both' }}
                    >
                      <td className="px-4 py-2.5 font-medium text-zinc-400">FY {row.fiscal_year}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-zinc-200">{fmtUSD(row.revenue)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-zinc-400">{fmtUSD(row.gross_profit)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-[#00d47e]">{fmtUSD(row.net_income)}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums">
                        <span className={epsUp ? 'text-[#00d47e]' : 'text-red-400'}>
                          {fmtEPS(row.eps_basic)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/[0.05] bg-[#141414] px-4 py-2">
              <span className="text-xs text-zinc-500">Source: SEC EDGAR · Updated weekly</span>
              <code className="text-xs text-[#00d47e]/60">GET /v1/company/AAPL/income-statement</code>
            </div>
          </div>

          {/* Mini metric cards — derived from income statement */}
          <div className="mt-1.5 grid grid-cols-3 gap-px bg-white/[0.05]">
            {miniMetrics.map((m) => (
              <div key={m.label} className="bg-[#1a1a1a] px-3 py-3 transition-colors hover:bg-[#1e1e1e]">
                <div className="mb-1 text-xs uppercase tracking-widest text-zinc-500">{m.label}</div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-sm font-bold tabular-nums ${
                    m.change
                      ? m.up ? 'text-[#00d47e]' : 'text-red-400'
                      : 'text-white'
                  }`}>
                    {m.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Stats row ───────────────────────────────── */}
      <div
        className="animate-fade-up animate-delay-5 mt-16 grid grid-cols-1 gap-px bg-white/[0.05] sm:grid-cols-3"
      >
        {STATS.map((s) => (
          <div key={s.label} className="flex items-start gap-4 bg-[#111111] p-6 transition-colors hover:bg-[#161616]">
            <div className="mt-0.5 text-[#00d47e]">{s.icon}</div>
            <div>
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="mt-0.5 text-sm font-semibold text-zinc-300">{s.label}</div>
              <div className="mt-0.5 text-xs text-zinc-500">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
