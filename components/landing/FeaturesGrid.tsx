const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: 'Full EDGAR History',
    description: 'Up to 30 years of filings for 2,800+ US-listed companies — directly from SEC EDGAR, refreshed weekly.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Structured Endpoints',
    description: 'Income statement, balance sheet, cash flow, and key metrics — all normalized and ready to use. No parsing required.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'Honest Pricing',
    description: 'Free tier with 100 req/day. Paid plans start at $5/mo. No contracts, no overage fees, no hidden costs.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    ),
    title: 'Weekly Refresh',
    description: 'Data syncs every Sunday. You get fresh filings without building your own EDGAR pipeline.',
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
            className="group rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800/60"
          >
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-400 transition-colors group-hover:bg-cyan-400/20">
              {f.icon}
            </div>
            <h3 className="mb-2 font-semibold text-zinc-100">{f.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-500">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
