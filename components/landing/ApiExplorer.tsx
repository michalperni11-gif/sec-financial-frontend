'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Config ───────────────────────────────────────────────────────────────────

const TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'JPM']

const ENDPOINTS = [
  { id: 'income-statement', label: 'Income Stmt'   },
  { id: 'balance-sheet',    label: 'Balance Sheet' },
  { id: 'cash-flow',        label: 'Cash Flow'     },
  { id: 'metrics',          label: 'Metrics'       },
] as const

type EndpointId = typeof ENDPOINTS[number]['id']

// ─── Static fallback data (used when API key not configured) ──────────────────

const STATIC: Record<string, Record<EndpointId, object>> = {
  AAPL: {
    'income-statement': { ticker: 'AAPL', company: 'Apple Inc.', period: 'annual', data: [{ fiscal_year: 2025, revenue: 416161000000, gross_profit: 195201000000, operating_income: 142428000000, net_income: 113611000000, eps_basic: 7.49, eps_diluted: 7.46 }, { fiscal_year: 2024, revenue: 391035000000, gross_profit: 180683000000, operating_income: 123216000000, net_income: 93736000000, eps_basic: 6.11, eps_diluted: 6.08 }] },
    'balance-sheet':    { ticker: 'AAPL', company: 'Apple Inc.', period: 'annual', data: [{ fiscal_year: 2024, total_assets: 364980000000, total_liabilities: 308030000000, total_equity: 56950000000, cash_and_equivalents: 29965000000, total_debt: 101304000000 }] },
    'cash-flow':        { ticker: 'AAPL', company: 'Apple Inc.', period: 'annual', data: [{ fiscal_year: 2024, operating_cash_flow: 118254000000, capital_expenditures: -9447000000, free_cash_flow: 108807000000, dividends_paid: -15234000000, share_buybacks: -94949000000 }] },
    'metrics':          { ticker: 'AAPL', company: 'Apple Inc.', data: { pe_ratio: 31.2, price_to_book: 50.4, price_to_sales: 8.9, debt_to_equity: 1.78, return_on_equity: 1.62, return_on_assets: 0.25, gross_margin: 0.462, net_margin: 0.239, current_ratio: 0.87 } },
  },
  MSFT: {
    'income-statement': { ticker: 'MSFT', company: 'Microsoft Corporation', period: 'annual', data: [{ fiscal_year: 2024, revenue: 245122000000, gross_profit: 171008000000, operating_income: 109433000000, net_income: 88136000000, eps_basic: 11.86, eps_diluted: 11.80 }] },
    'balance-sheet':    { ticker: 'MSFT', company: 'Microsoft Corporation', period: 'annual', data: [{ fiscal_year: 2024, total_assets: 512163000000, total_liabilities: 243686000000, total_equity: 268477000000, cash_and_equivalents: 18315000000, total_debt: 79688000000 }] },
    'cash-flow':        { ticker: 'MSFT', company: 'Microsoft Corporation', period: 'annual', data: [{ fiscal_year: 2024, operating_cash_flow: 118548000000, capital_expenditures: -44482000000, free_cash_flow: 74066000000, dividends_paid: -21771000000, share_buybacks: -17337000000 }] },
    'metrics':          { ticker: 'MSFT', company: 'Microsoft Corporation', data: { pe_ratio: 37.8, price_to_book: 14.2, price_to_sales: 13.4, debt_to_equity: 0.30, return_on_equity: 0.39, return_on_assets: 0.18, gross_margin: 0.698, net_margin: 0.360, current_ratio: 1.27 } },
  },
  GOOGL: { 'income-statement': { ticker: 'GOOGL', company: 'Alphabet Inc.', period: 'annual', data: [{ fiscal_year: 2024, revenue: 350018000000, gross_profit: 210352000000, operating_income: 112348000000, net_income: 94083000000, eps_basic: 7.52, eps_diluted: 7.50 }] }, 'balance-sheet': { ticker: 'GOOGL', company: 'Alphabet Inc.', period: 'annual', data: [{ fiscal_year: 2024, total_assets: 450264000000, total_liabilities: 119000000000, total_equity: 331264000000, cash_and_equivalents: 93234000000, total_debt: 28742000000 }] }, 'cash-flow': { ticker: 'GOOGL', company: 'Alphabet Inc.', period: 'annual', data: [{ fiscal_year: 2024, operating_cash_flow: 125299000000, capital_expenditures: -52548000000, free_cash_flow: 72751000000, dividends_paid: 0, share_buybacks: -62220000000 }] }, 'metrics': { ticker: 'GOOGL', company: 'Alphabet Inc.', data: { pe_ratio: 25.4, price_to_book: 7.2, price_to_sales: 6.7, debt_to_equity: 0.09, return_on_equity: 0.32, return_on_assets: 0.21, gross_margin: 0.601, net_margin: 0.269, current_ratio: 2.07 } } },
  AMZN: { 'income-statement': { ticker: 'AMZN', company: 'Amazon.com, Inc.', period: 'annual', data: [{ fiscal_year: 2024, revenue: 637959000000, gross_profit: 296699000000, operating_income: 68592000000, net_income: 59248000000, eps_basic: 5.53, eps_diluted: 5.51 }] }, 'balance-sheet': { ticker: 'AMZN', company: 'Amazon.com, Inc.', period: 'annual', data: [{ fiscal_year: 2024, total_assets: 624894000000, total_liabilities: 383788000000, total_equity: 241106000000, cash_and_equivalents: 101200000000, total_debt: 67108000000 }] }, 'cash-flow': { ticker: 'AMZN', company: 'Amazon.com, Inc.', period: 'annual', data: [{ fiscal_year: 2024, operating_cash_flow: 115877000000, capital_expenditures: -83587000000, free_cash_flow: 32290000000, dividends_paid: 0, share_buybacks: 0 }] }, 'metrics': { ticker: 'AMZN', company: 'Amazon.com, Inc.', data: { pe_ratio: 44.1, price_to_book: 9.8, price_to_sales: 3.6, debt_to_equity: 0.28, return_on_equity: 0.27, return_on_assets: 0.09, gross_margin: 0.465, net_margin: 0.093, current_ratio: 1.12 } } },
  NVDA: { 'income-statement': { ticker: 'NVDA', company: 'NVIDIA Corporation', period: 'annual', data: [{ fiscal_year: 2025, revenue: 130497000000, gross_profit: 97269000000, operating_income: 81567000000, net_income: 72880000000, eps_basic: 2.94, eps_diluted: 2.94 }] }, 'balance-sheet': { ticker: 'NVDA', company: 'NVIDIA Corporation', period: 'annual', data: [{ fiscal_year: 2025, total_assets: 111601000000, total_liabilities: 30041000000, total_equity: 81560000000, cash_and_equivalents: 8589000000, total_debt: 8461000000 }] }, 'cash-flow': { ticker: 'NVDA', company: 'NVIDIA Corporation', period: 'annual', data: [{ fiscal_year: 2025, operating_cash_flow: 64089000000, capital_expenditures: -1077000000, free_cash_flow: 63012000000, dividends_paid: -246000000, share_buybacks: -33726000000 }] }, 'metrics': { ticker: 'NVDA', company: 'NVIDIA Corporation', data: { pe_ratio: 38.2, price_to_book: 23.1, price_to_sales: 18.4, debt_to_equity: 0.10, return_on_equity: 1.19, return_on_assets: 0.78, gross_margin: 0.745, net_margin: 0.559, current_ratio: 4.17 } } },
  META: { 'income-statement': { ticker: 'META', company: 'Meta Platforms, Inc.', period: 'annual', data: [{ fiscal_year: 2024, revenue: 164501000000, gross_profit: 131247000000, operating_income: 69381000000, net_income: 62360000000, eps_basic: 23.86, eps_diluted: 23.54 }] }, 'balance-sheet': { ticker: 'META', company: 'Meta Platforms, Inc.', period: 'annual', data: [{ fiscal_year: 2024, total_assets: 276054000000, total_liabilities: 72835000000, total_equity: 203219000000, cash_and_equivalents: 77814000000, total_debt: 28825000000 }] }, 'cash-flow': { ticker: 'META', company: 'Meta Platforms, Inc.', period: 'annual', data: [{ fiscal_year: 2024, operating_cash_flow: 91016000000, capital_expenditures: -37669000000, free_cash_flow: 53347000000, dividends_paid: -1549000000, share_buybacks: -32226000000 }] }, 'metrics': { ticker: 'META', company: 'Meta Platforms, Inc.', data: { pe_ratio: 26.3, price_to_book: 8.7, price_to_sales: 9.4, debt_to_equity: 0.14, return_on_equity: 0.38, return_on_assets: 0.25, gross_margin: 0.798, net_margin: 0.379, current_ratio: 2.86 } } },
  TSLA: { 'income-statement': { ticker: 'TSLA', company: 'Tesla, Inc.', period: 'annual', data: [{ fiscal_year: 2024, revenue: 97690000000, gross_profit: 17073000000, operating_income: 7074000000, net_income: 7091000000, eps_basic: 2.04, eps_diluted: 2.03 }] }, 'balance-sheet': { ticker: 'TSLA', company: 'Tesla, Inc.', period: 'annual', data: [{ fiscal_year: 2024, total_assets: 122070000000, total_liabilities: 47310000000, total_equity: 74760000000, cash_and_equivalents: 36565000000, total_debt: 5965000000 }] }, 'cash-flow': { ticker: 'TSLA', company: 'Tesla, Inc.', period: 'annual', data: [{ fiscal_year: 2024, operating_cash_flow: 14923000000, capital_expenditures: -11045000000, free_cash_flow: 3878000000, dividends_paid: 0, share_buybacks: -2667000000 }] }, 'metrics': { ticker: 'TSLA', company: 'Tesla, Inc.', data: { pe_ratio: 88.4, price_to_book: 11.2, price_to_sales: 8.1, debt_to_equity: 0.08, return_on_equity: 0.10, return_on_assets: 0.06, gross_margin: 0.175, net_margin: 0.073, current_ratio: 1.84 } } },
  JPM: { 'income-statement': { ticker: 'JPM', company: 'JPMorgan Chase & Co.', period: 'annual', data: [{ fiscal_year: 2024, revenue: 171015000000, gross_profit: null, operating_income: 76501000000, net_income: 58471000000, eps_basic: 19.75, eps_diluted: 19.62 }] }, 'balance-sheet': { ticker: 'JPM', company: 'JPMorgan Chase & Co.', period: 'annual', data: [{ fiscal_year: 2024, total_assets: 4000000000000, total_liabilities: 3680000000000, total_equity: 320000000000, cash_and_equivalents: 558000000000, total_debt: 350000000000 }] }, 'cash-flow': { ticker: 'JPM', company: 'JPMorgan Chase & Co.', period: 'annual', data: [{ fiscal_year: 2024, operating_cash_flow: 77000000000, capital_expenditures: -8400000000, free_cash_flow: 68600000000, dividends_paid: -13800000000, share_buybacks: -12000000000 }] }, 'metrics': { ticker: 'JPM', company: 'JPMorgan Chase & Co.', data: { pe_ratio: 12.8, price_to_book: 2.1, price_to_sales: 3.7, debt_to_equity: 1.09, return_on_equity: 0.17, return_on_assets: 0.013, gross_margin: null, net_margin: 0.342, current_ratio: null } } },
}

function getStaticData(ticker: string, endpoint: EndpointId): object {
  return (STATIC[ticker] ?? STATIC['AAPL'])[endpoint]
}

// ─── JSON token renderer ──────────────────────────────────────────────────────

type TokenType = 'key' | 'string' | 'number' | 'null' | 'bool' | 'punct'
type Token = { type: TokenType; value: string }

const TOKEN_COLORS: Record<TokenType, string> = {
  key:    '#67e8f9',
  string: '#6ee7b7',
  number: '#fcd34d',
  bool:   '#c084fc',
  null:   '#71717a',
  punct:  '#a1a1aa',
}

function tokenizeJson(json: string): Token[] {
  const tokens: Token[] = []
  const pattern = /("(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|[{}[\],:])/g
  let cursor = 0
  let match = pattern.exec(json)

  while (match !== null) {
    if (match.index > cursor) {
      tokens.push({ type: 'punct', value: json.slice(cursor, match.index) })
    }
    const m = match[0]
    let type: TokenType = 'punct'
    if (m.startsWith('"'))                    type = m.endsWith(':') ? 'key' : 'string'
    else if (m === 'null')                    type = 'null'
    else if (m === 'true' || m === 'false')   type = 'bool'
    else if (/^-?\d/.test(m))                 type = 'number'
    tokens.push({ type, value: m })
    cursor = pattern.lastIndex
    match = pattern.exec(json)
  }
  if (cursor < json.length) tokens.push({ type: 'punct', value: json.slice(cursor) })
  return tokens
}

function JsonView({ data }: { data: object }) {
  const tokens = tokenizeJson(JSON.stringify(data, null, 2))
  return (
    <pre className="text-xs leading-[1.75] font-mono whitespace-pre">
      {tokens.map((t, i) => (
        <span key={i} style={{ color: TOKEN_COLORS[t.type] }}>{t.value}</span>
      ))}
    </pre>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ApiExplorer() {
  const [ticker,   setTicker]   = useState<string>('AAPL')
  const [endpoint, setEndpoint] = useState<EndpointId>('income-statement')
  const [data,     setData]     = useState<object>(() => getStaticData('AAPL', 'income-statement'))
  const [loading,  setLoading]  = useState(false)
  const [isLive,   setIsLive]   = useState(false)

  const fetchData = useCallback(async (t: string, ep: EndpointId) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/financial-data?ticker=${t}&endpoint=${ep}`)
      if (res.ok) {
        const json = await res.json()
        if (!json.error) {
          setData(json)
          setIsLive(true)
          return
        }
      }
    } catch {
      // ignore — fall through to static
    }
    setData(getStaticData(t, ep))
    setIsLive(false)
    setLoading(false)
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [data])

  const handleTicker = (t: string) => {
    setTicker(t)
    fetchData(t, endpoint)
  }

  const handleEndpoint = (ep: EndpointId) => {
    setEndpoint(ep)
    fetchData(ticker, ep)
  }

  const path = `/company/${ticker}/${endpoint}`

  return (
    <section id="explorer" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10">
        <h2 className="mb-2 text-3xl font-black text-white">Interactive API Explorer</h2>
        <p className="text-sm text-zinc-500">
          Select a ticker to see real API responses. Clean, standardized JSON that just works.
        </p>
      </div>

      <div className="overflow-hidden border border-white/[0.08] bg-[#171717]">

        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#131313] px-5 py-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-zinc-500">GET</span>
            <code className="font-mono text-[#00d47e]">{path}</code>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {loading ? (
              <span className="text-zinc-500">fetching…</span>
            ) : (
              <>
                <span className={`h-1.5 w-1.5 rounded-full ${isLive ? 'live-dot bg-[#00d47e]' : 'bg-zinc-600'}`} />
                <span className={isLive ? 'text-[#00d47e]' : 'text-zinc-500'}>
                  {isLive ? '200 OK · live' : '200 OK · demo'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr]">

          {/* Sidebar */}
          <div className="border-b border-white/[0.06] lg:border-b-0 lg:border-r lg:border-white/[0.06]">
            <div className="border-b border-white/[0.06] p-3">
              <div className="mb-2 px-2 text-xs uppercase tracking-widest text-zinc-600">Endpoint</div>
              <div className="flex flex-col gap-0.5">
                {ENDPOINTS.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => handleEndpoint(ep.id)}
                    className={`rounded-sm px-3 py-2 text-left text-xs font-medium transition-colors ${
                      endpoint === ep.id
                        ? 'bg-[#00d47e]/10 text-[#00d47e]'
                        : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300'
                    }`}
                  >
                    {ep.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3">
              <div className="mb-2 px-2 text-xs uppercase tracking-widest text-zinc-600">Ticker</div>
              <div className="flex flex-col gap-0.5">
                {TICKERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTicker(t)}
                    className={`rounded-sm px-3 py-2 text-left text-xs font-bold tracking-wider transition-colors ${
                      ticker === t
                        ? 'bg-[#00d47e]/10 text-[#00d47e]'
                        : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* JSON view */}
          <div className={`max-h-[440px] overflow-auto p-6 transition-opacity duration-150 ${loading ? 'opacity-40' : 'opacity-100'}`}>
            <JsonView data={data} />
          </div>
        </div>
      </div>
    </section>
  )
}
