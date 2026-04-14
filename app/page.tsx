export default function ComingSoon() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#111111] px-6">
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#00d47e">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          <span className="text-xl font-black tracking-wide text-white">
            SECfin<span className="text-[#00d47e]">API</span>
          </span>
        </div>

        <h1 className="mb-4 text-5xl font-black text-white">
          Coming Soon
        </h1>
        <p className="mb-8 max-w-sm text-sm leading-relaxed text-zinc-500">
          Standardized SEC financial data for developers.<br />
          Raw. Fast. Low cost.
        </p>

        <div className="inline-flex items-center gap-2 border border-[#00d47e]/20 bg-[#00d47e]/5 px-4 py-2 text-sm text-[#00d47e]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00d47e]" />
          Launching soon
        </div>

        <p className="mt-8 text-xs text-zinc-700">
          secfinapi.com
        </p>
      </div>
    </div>
  )
}
