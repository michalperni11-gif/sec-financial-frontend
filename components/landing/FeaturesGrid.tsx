const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'Standardized Concepts',
    desc: '250+ XBRL tag aliases mapped to consistent field names. Revenue is always Revenue — whether Apple files "RevenueFromContractWithCustomer" or an older filer uses "SalesRevenueNet".',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: '10,000+ Companies',
    desc: 'Every US public company that files with the SEC — S&P 500, Russell 3000, and beyond. All sourced directly from EDGAR XBRL filings with no data vendors in the middle.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: '30 Years of History',
    desc: 'Every 10-K and 10-Q ever filed with the SEC, going back to the mid-1990s. Annual, quarterly, and trailing-twelve-month (TTM) views included.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Industry-Aware',
    desc: 'Banks show NIM, efficiency ratio, and loan-to-deposit. REITs show FFO and NOI. Insurers show loss ratio and combined ratio. Industry-specific metrics computed automatically from SIC code.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: '39 Pre-Computed Metrics',
    desc: 'ROIC, debt/EBITDA, FCF margin, interest coverage, receivables turnover, and more — all calculated and ready. No spreadsheet formulas needed.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'Low Cost',
    desc: 'Free tier for 100 req/day. Paid plans from $5/mo. No per-query pricing, no seat licenses, no Bloomberg-style contracts. Built for developers, priced like it.',
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="mb-3 text-4xl font-black text-white">
          Everything you need.<br />
          <span className="text-[#00d47e]">Nothing you don&apos;t.</span>
        </h2>
        <p className="text-sm text-zinc-500">
          Built by developers who were tired of paying $500/mo for data they could get for $10.
        </p>
      </div>

      <div className="grid gap-px bg-white/[0.05] sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group bg-[#111111] p-8 transition-colors hover:bg-[#161616]"
          >
            <div className="mb-4 text-[#00d47e] transition-transform group-hover:scale-110 group-hover:translate-x-0.5 w-fit">
              {f.icon}
            </div>
            <h3 className="mb-2 text-sm font-bold text-white">{f.title}</h3>
            <p className="text-xs leading-relaxed text-zinc-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
