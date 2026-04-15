import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

const BASE_URL = 'https://sec-financial-api-production.up.railway.app'

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/v1/company/{ticker}/income-statement',
    desc: 'Standardized income statement — Revenue, GrossProfit, EBITDA, NetIncome, EPS, and more.',
    params: [
      { name: 'period', type: 'string', default: 'annual', desc: 'annual | quarterly | ttm | all' },
    ],
  },
  {
    method: 'GET',
    path: '/v1/company/{ticker}/balance-sheet',
    desc: 'Assets, liabilities, and equity for each reporting period.',
    params: [
      { name: 'period', type: 'string', default: 'annual', desc: 'annual | quarterly | ttm | all' },
    ],
  },
  {
    method: 'GET',
    path: '/v1/company/{ticker}/cash-flow',
    desc: 'Operating, investing, and financing cash flows. FreeCashFlow derived automatically.',
    params: [
      { name: 'period', type: 'string', default: 'annual', desc: 'annual | quarterly | ttm | all' },
    ],
  },
  {
    method: 'GET',
    path: '/v1/company/{ticker}/financials',
    desc: 'All three statements in a single response — income, balance sheet, cash flow.',
    params: [
      { name: 'period', type: 'string', default: 'annual', desc: 'annual | quarterly | ttm | all' },
    ],
  },
  {
    method: 'GET',
    path: '/v1/company/{ticker}/metrics',
    desc: '39 pre-computed ratios: margins, ROIC, FCF metrics, leverage, efficiency, and industry-specific metrics (NIM for banks, FFO for REITs, combined ratio for insurers).',
    params: [
      { name: 'period', type: 'string', default: 'annual', desc: 'annual | quarterly | ttm' },
    ],
  },
  {
    method: 'GET',
    path: '/v1/company/{ticker}/info',
    desc: 'Company metadata: CIK, SIC code, industry type, fiscal year end, index membership, last ingested date.',
    params: [],
  },
  {
    method: 'GET',
    path: '/v1/companies',
    desc: 'Paginated list of all indexed companies with search and filter support.',
    params: [
      { name: 'search', type: 'string', default: '', desc: 'Substring match on ticker or company name' },
      { name: 'index', type: 'string', default: '', desc: 'sp500 | russell1000 | russell3000' },
      { name: 'sic', type: 'string', default: '', desc: 'Filter by SIC code (e.g. 6020)' },
      { name: 'limit', type: 'integer', default: '100', desc: '1–1000' },
      { name: 'offset', type: 'integer', default: '0', desc: 'Pagination offset' },
    ],
  },
]

const RESPONSE_EXAMPLE = `{
  "ticker": "AAPL",
  "cik": "0000320193",
  "statement": "income_statement",
  "periods": ["2022-09-24", "2023-09-30", "2024-09-28"],
  "data": {
    "Revenue":         { "2022-09-24": 394328000000, "2023-09-30": 383285000000, "2024-09-28": 391035000000 },
    "GrossProfit":     { "2022-09-24": 170782000000, "2023-09-30": 169148000000, "2024-09-28": 180683000000 },
    "OperatingIncome": { "2022-09-24": 119437000000, "2023-09-30": 114301000000, "2024-09-28": 123216000000 },
    "EBITDA":          { "2022-09-24": 130090000000, "2023-09-30": 125820000000, "2024-09-28": 134661000000 },
    "NetIncome":       { "2022-09-24":  99803000000, "2023-09-30":  96995000000, "2024-09-28":  93736000000 },
    "EPSDiluted":      { "2022-09-24":         6.07, "2023-09-30":         6.13, "2024-09-28":         6.08 }
  },
  "period_metadata": {
    "2024-09-28": { "currency": "USD", "filing_date": "2024-11-01", "form": "10-K", "fiscal_year": "2024" }
  }
}`

const METRICS_EXAMPLE = `{
  "ticker": "AAPL",
  "latest_fiscal_year": "2024-09-28",
  "gross_margin_pct": 46.2,
  "operating_margin_pct": 31.5,
  "net_margin_pct": 23.9,
  "roic": 48.1,
  "debt_to_ebitda": 0.75,
  "net_debt_to_ebitda": 0.53,
  "interest_coverage": 29.4,
  "current_ratio": 0.87,
  "fcf_to_ebitda": 0.81,
  "asset_turnover": 1.07,
  "inventory_turnover": 41.2
}`

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
        <h1 className="mb-2 text-3xl font-black text-zinc-100">Documentation</h1>
        <p className="mb-12 text-zinc-500">Get started with SECfinAPI in minutes.</p>

        {/* Quick start */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Quick start</h2>
          <ol className="flex flex-col gap-4 text-sm text-zinc-400">
            <li>
              <span className="font-semibold text-zinc-200">1. Create a free account</span>
              <br />
              <Link href="/register" className="text-[#00d47e] hover:underline">Register here</Link>
              {' '}— no credit card required.
            </li>
            <li>
              <span className="font-semibold text-zinc-200">2. Verify your email</span>
              <br />
              Click the link we send you. Your API key appears in your dashboard immediately.
            </li>
            <li>
              <span className="font-semibold text-zinc-200">3. Make your first request</span>
              <pre className="mt-2 overflow-x-auto rounded border border-zinc-800 bg-[#0d0d0d] p-4 text-xs text-[#00d47e]">{`curl "${BASE_URL}/v1/company/AAPL/income-statement" \\
  -H "X-API-Key: YOUR_API_KEY"`}</pre>
            </li>
          </ol>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Authentication</h2>
          <p className="mb-3 text-sm text-zinc-400">
            Pass your API key in the <code className="rounded bg-zinc-800 px-1 text-[#00d47e]">X-API-Key</code> header on every request.
            You can also pass it as a query parameter: <code className="rounded bg-zinc-800 px-1 text-[#00d47e]">?apikey=YOUR_KEY</code>.
          </p>
          <pre className="overflow-x-auto rounded border border-zinc-800 bg-[#0d0d0d] p-4 text-xs text-[#00d47e]">{`X-API-Key: sk_live_your_key_here`}</pre>
        </section>

        {/* Response format */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Response format</h2>
          <p className="mb-3 text-sm text-zinc-400">
            Financial statements use a <strong className="text-zinc-200">period-keyed pivot</strong>: each concept maps to an object of{' '}
            <code className="rounded bg-zinc-800 px-1 text-zinc-300">period_end → value</code> pairs.
            All monetary values are in the company&apos;s reporting currency (usually USD), in absolute dollars.
          </p>
          <pre className="overflow-x-auto rounded border border-zinc-800 bg-[#0d0d0d] p-4 text-xs text-[#00d47e] leading-relaxed">{RESPONSE_EXAMPLE}</pre>
          <p className="mt-3 text-xs text-zinc-600">
            <code>period_metadata</code> provides per-period context: currency, SEC filing date, form type, and fiscal year.
          </p>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Endpoints</h2>
          <p className="mb-1 text-sm text-zinc-500">
            Base URL: <code className="text-zinc-300">{BASE_URL}</code>
          </p>
          <p className="mb-6 text-xs text-zinc-600">
            Interactive reference (Swagger UI):{' '}
            <a href={`${BASE_URL}/docs`} target="_blank" rel="noopener noreferrer" className="text-[#00d47e] hover:underline">
              {BASE_URL}/docs
            </a>
          </p>
          <div className="flex flex-col gap-4">
            {ENDPOINTS.map((ep) => (
              <div key={ep.path} className="rounded border border-zinc-800 bg-[#0d0d0d] overflow-hidden">
                <div className="flex items-start gap-3 px-4 py-3">
                  <span className="mt-0.5 flex-shrink-0 rounded bg-[#00d47e]/10 px-2 py-0.5 text-xs font-bold text-[#00d47e]">
                    {ep.method}
                  </span>
                  <div>
                    <code className="text-xs text-zinc-200">{ep.path}</code>
                    <p className="mt-1 text-xs text-zinc-500">{ep.desc}</p>
                  </div>
                </div>
                {ep.params.length > 0 && (
                  <div className="border-t border-zinc-800 px-4 py-2">
                    <div className="flex flex-col gap-1">
                      {ep.params.map((p) => (
                        <div key={p.name} className="flex items-baseline gap-2 text-xs">
                          <code className="w-20 flex-shrink-0 text-zinc-400">{p.name}</code>
                          <span className="text-zinc-700">{p.type}</span>
                          <span className="text-zinc-600 flex-1">{p.desc}</span>
                          {p.default && <span className="text-zinc-700">default: {p.default}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* TTM */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Trailing Twelve Months (TTM)</h2>
          <p className="mb-3 text-sm text-zinc-400">
            Pass <code className="rounded bg-zinc-800 px-1 text-[#00d47e]">?period=ttm</code> to any statement or metrics endpoint
            to get trailing twelve months data — the sum of the 4 most recent quarterly filings (10-Q).
            This gives you the most current picture without waiting for the next annual filing.
          </p>
          <pre className="overflow-x-auto rounded border border-zinc-800 bg-[#0d0d0d] p-4 text-xs text-[#00d47e]">{`curl "${BASE_URL}/v1/company/AAPL/income-statement?period=ttm" \\
  -H "X-API-Key: YOUR_API_KEY"

# Returns a single "TTM" period column with summed quarterly values`}</pre>
        </section>

        {/* Metrics */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Metrics endpoint</h2>
          <p className="mb-3 text-sm text-zinc-400">
            The <code className="rounded bg-zinc-800 px-1 text-zinc-300">/metrics</code> endpoint returns 39 pre-computed ratios.
            Industry-specific fields are populated automatically based on SIC code — non-applicable fields return <code className="rounded bg-zinc-800 px-1 text-zinc-300">null</code>.
          </p>
          <pre className="overflow-x-auto rounded border border-zinc-800 bg-[#0d0d0d] p-4 text-xs text-[#00d47e] leading-relaxed">{METRICS_EXAMPLE}</pre>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {[
              ['General', 'gross/operating/net/ebitda margins, ROE, ROA, ROIC, FCF margin, FCF/EBITDA, debt ratios, current ratio, asset/inventory/receivables/payables turnover, capex intensity, EPS'],
              ['Banks', 'net_interest_margin, efficiency_ratio, loan_to_deposit_ratio, provision_for_credit_losses, tier1_capital_ratio'],
              ['Insurance', 'loss_ratio, combined_ratio'],
              ['REITs', 'funds_from_operations, net_operating_income, noi_margin'],
            ].map(([label, metrics]) => (
              <div key={label} className="rounded border border-zinc-800 bg-[#0d0d0d] p-3">
                <div className="mb-1 text-xs font-bold text-[#00d47e]">{label}</div>
                <div className="text-zinc-600 leading-relaxed">{metrics}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Company search */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Company search & filters</h2>
          <p className="mb-3 text-sm text-zinc-400">
            The <code className="rounded bg-zinc-800 px-1 text-zinc-300">/v1/companies</code> endpoint supports filtering and search:
          </p>
          <pre className="overflow-x-auto rounded border border-zinc-800 bg-[#0d0d0d] p-4 text-xs text-[#00d47e]">{`# All S&P 500 banks
GET /v1/companies?index=sp500&sic=6020

# Search by name
GET /v1/companies?search=apple

# All Russell 3000 companies, paginated
GET /v1/companies?index=russell3000&limit=100&offset=200`}</pre>
        </section>

        {/* Tier limits */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Tier limits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                  <th className="pb-2 pr-4">Tier</th>
                  <th className="pb-2 pr-4">Coverage</th>
                  <th className="pb-2 pr-4">History</th>
                  <th className="pb-2">Rate limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-400">
                {[
                  ['Free',       'S&P 500',         '5 years',  '100 req/day'],
                  ['Basic',      'S&P 500',         '10 years', '500 req/min'],
                  ['Starter',    '10,000+ companies','10 years', '500 req/min'],
                  ['Growth',     '10,000+ companies','Full history','1,000 req/min'],
                  ['Pro',        '10,000+ companies','Full history','3,000 req/min'],
                  ['Enterprise', '10,000+ companies','Full history','Unlimited'],
                ].map(([tier, cov, hist, rate]) => (
                  <tr key={tier}>
                    <td className="py-2 pr-4 font-medium text-zinc-200">{tier}</td>
                    <td className="py-2 pr-4">{cov}</td>
                    <td className="py-2 pr-4">{hist}</td>
                    <td className="py-2">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Error codes */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Error codes</h2>
          <div className="flex flex-col gap-2 text-xs">
            {[
              ['400', 'Bad request — invalid ticker format or parameter value'],
              ['401', 'Missing or invalid API key'],
              ['403', 'Tier does not cover this company (upgrade required)'],
              ['404', 'Company not yet ingested — try POST /v1/ingest/{ticker}'],
              ['422', 'Validation error — check query parameters'],
              ['429', 'Rate limit exceeded'],
              ['503', 'Database busy during ingestion — retry in a moment'],
            ].map(([code, msg]) => (
              <div key={code} className="flex items-baseline gap-3 rounded border border-zinc-800 bg-[#0d0d0d] px-4 py-2">
                <code className="w-10 flex-shrink-0 font-bold text-[#00d47e]">{code}</code>
                <span className="text-zinc-500">{msg}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-lg border border-zinc-800 bg-[#0d0d0d] p-5 text-center">
          <p className="mb-3 text-sm text-zinc-400">Ready to get started?</p>
          <Link
            href="/register"
            className="inline-flex bg-[#00d47e] px-5 py-2 text-sm font-bold text-black hover:bg-[#00f090] transition-colors"
          >
            Create free account →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
