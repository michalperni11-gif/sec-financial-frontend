const FEATURES = [
  {
    label: '01',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: 'Full EDGAR History',
    description: 'Up to 30 years of filings for 2,800+ US-listed companies. Directly from SEC EDGAR, refreshed weekly.',
  },
  {
    label: '02',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Structured Endpoints',
    description: 'Income statement, balance sheet, cash flow, metrics — normalized and ready. No parsing required.',
  },
  {
    label: '03',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'Honest Pricing',
    description: 'Free tier, 100 req/day. Paid plans from $5/mo. No contracts, no overage fees, no hidden costs.',
  },
  {
    label: '04',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    ),
    title: 'Weekly Refresh',
    description: 'Data syncs every Sunday. Get fresh EDGAR filings without building your own pipeline.',
  },
]

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 flex items-end justify-between border-b border-zinc-800/60 pb-6">
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
          What you get
        </h2>
        <span className="text-xs text-zinc-600 uppercase tracking-widest">v1.0</span>
      </div>
      <div className="grid gap-px bg-zinc-800/40 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group relative bg-[#080808] p-6 transition-colors hover:bg-zinc-900/60"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-zinc-800 text-cyan-400/70 group-hover:border-cyan-400/30 group-hover:text-cyan-400 transition-colors">
                {f.icon}
              </div>
              <span className="text-xs text-zinc-700 tabular-nums">{f.label}</span>
            </div>
            <h3 className="mb-2 text-sm font-semibold text-zinc-100">{f.title}</h3>
            <p className="text-xs leading-relaxed text-zinc-500">{f.description}</p>
            {/* Bottom accent line on hover */}
            <div className="absolute bottom-0 left-0 h-px w-0 bg-cyan-400/50 transition-all duration-300 group-hover:w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}
