import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

const ENDPOINTS = [
  { method: 'GET', path: '/company/{ticker}/income-statement', desc: 'Annual/quarterly income statement' },
  { method: 'GET', path: '/company/{ticker}/balance-sheet', desc: 'Balance sheet' },
  { method: 'GET', path: '/company/{ticker}/cash-flow', desc: 'Cash flow statement' },
  { method: 'GET', path: '/company/{ticker}/metrics', desc: 'Key financial ratios' },
  { method: 'GET', path: '/company/{ticker}/info', desc: 'Company metadata' },
  { method: 'GET', path: '/companies', desc: 'List all indexed companies' },
]

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
        <h1 className="mb-2 text-3xl font-black text-zinc-100">Documentation</h1>
        <p className="mb-12 text-zinc-500">Get started with SECbase in minutes.</p>

        {/* Quick start */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Quick start</h2>
          <ol className="flex flex-col gap-4 text-sm text-zinc-400">
            <li>
              <span className="font-semibold text-zinc-200">1. Create a free account</span>
              <br />
              <Link href="/register" className="text-cyan-400 hover:underline">Register here</Link>
              {' '}— no credit card required.
            </li>
            <li>
              <span className="font-semibold text-zinc-200">2. Verify your email</span>
              <br />
              Click the link we send you. Your API key will appear immediately.
            </li>
            <li>
              <span className="font-semibold text-zinc-200">3. Make your first request</span>
              <pre className="mt-2 overflow-x-auto rounded border border-zinc-800 bg-zinc-900 p-4 text-xs text-cyan-400">
{`curl "https://sec-financial-api-production.up.railway.app/company/AAPL/income-statement" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
              </pre>
            </li>
          </ol>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Authentication</h2>
          <p className="mb-3 text-sm text-zinc-400">
            Pass your API key in the <code className="rounded bg-zinc-800 px-1 text-cyan-400">Authorization</code> header:
          </p>
          <pre className="overflow-x-auto rounded border border-zinc-800 bg-zinc-900 p-4 text-xs text-cyan-400">
{`Authorization: Bearer sk_live_your_key_here`}
          </pre>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Endpoints</h2>
          <p className="mb-4 text-sm text-zinc-500">
            Base URL: <code className="text-zinc-300">https://sec-financial-api-production.up.railway.app</code>
          </p>
          <div className="flex flex-col gap-2">
            {ENDPOINTS.map((ep) => (
              <div
                key={ep.path}
                className="flex items-start gap-3 rounded border border-zinc-800 bg-zinc-900 px-4 py-3"
              >
                <span className="mt-0.5 flex-shrink-0 rounded bg-cyan-400/10 px-2 py-0.5 text-xs font-bold text-cyan-400">
                  {ep.method}
                </span>
                <div>
                  <code className="text-xs text-zinc-200">{ep.path}</code>
                  <p className="mt-0.5 text-xs text-zinc-500">{ep.desc}</p>
                </div>
              </div>
            ))}
          </div>
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
                  ['Free', 'S&P 500', '5 years', '100 req/day'],
                  ['Basic', 'S&P 500', '10 years', '500 req/min'],
                  ['Starter', '2,800+ companies', '10 years', '500 req/min'],
                  ['Growth', '2,800+ companies', 'Full', '1,000 req/min'],
                  ['Pro', '2,800+ companies', 'Full', '3,000 req/min'],
                  ['Enterprise', '2,800+ companies', 'Full', 'Unlimited'],
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

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 text-center">
          <p className="mb-3 text-sm text-zinc-400">Ready to get started?</p>
          <Link
            href="/register"
            className="inline-flex rounded bg-cyan-400 px-5 py-2 text-sm font-bold text-black hover:bg-cyan-300 transition-colors"
          >
            Create free account →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
