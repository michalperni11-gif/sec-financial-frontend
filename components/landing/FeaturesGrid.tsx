const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'Standardized Concepts',
    desc: 'Every company uses different XBRL tags. We map 1,000+ raw SEC tags to clean, consistent field names — Revenue is always Revenue.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    title: '2,800+ Companies',
    desc: 'Full S&P 500, Russell 1000, and Russell 3000 coverage. All sourced directly from SEC EDGAR filings — no data vendors in the middle.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: '30 Years of History',
    desc: 'Income statements, balance sheets, and cash flows going back to the mid-1990s. Every 10-K and 10-Q ever filed with the SEC.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: 'Simple REST API',
    desc: 'One endpoint per statement. Clean JSON response. No SDKs required — if you can curl it, you can use it. Built for developers.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Weekly Refresh',
    desc: 'Data updated weekly as new SEC filings come in. New 10-Ks and 10-Qs are ingested automatically — no manual syncing needed.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    title: 'Low Cost',
    desc: 'Free tier for 100 req/day. Paid plans start at $5/mo. No per-query pricing, no seat licenses, no Bloomberg-style contracts.',
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
