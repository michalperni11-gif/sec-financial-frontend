const FEATURES = [
  {
    icon: '📊',
    title: 'Full EDGAR History',
    description:
      'Up to 30 years of filings for 2,800+ US-listed companies — directly from SEC EDGAR, refreshed weekly.',
  },
  {
    icon: '⚡',
    title: 'Structured Endpoints',
    description:
      'Income statement, balance sheet, cash flow, and key metrics — all normalized and ready to use. No parsing required.',
  },
  {
    icon: '💸',
    title: 'Honest Pricing',
    description:
      'Free tier with 100 req/day. Paid plans start at $5/mo. No contracts, no overage fees, no hidden costs.',
  },
  {
    icon: '🔄',
    title: 'Weekly Refresh',
    description:
      'Data syncs every Sunday. You get fresh filings without building your own EDGAR pipeline.',
  },
]

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-10 text-center text-2xl font-bold text-zinc-100">
        Everything you need, nothing you don't
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-6"
          >
            <div className="mb-3 text-2xl" aria-hidden="true">{f.icon}</div>
            <h3 className="mb-2 font-semibold text-zinc-100">{f.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-500">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
