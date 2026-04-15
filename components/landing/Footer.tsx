import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-sm font-bold text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#00d47e">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              SECfin<span className="text-[#00d47e]">API</span>
            </Link>
            <p className="mt-3 max-w-[220px] text-xs leading-relaxed text-zinc-400">
              Standardized SEC EDGAR financial data for developers.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12 text-xs">
            <div className="flex flex-col gap-3">
              <span className="font-semibold uppercase tracking-widest text-zinc-500">Product</span>
              <Link href="#features"  className="text-zinc-400 transition-colors hover:text-zinc-300">Features</Link>
              <Link href="#pricing"   className="text-zinc-400 transition-colors hover:text-zinc-300">Pricing</Link>
              <Link href="#explorer"  className="text-zinc-400 transition-colors hover:text-zinc-300">API Explorer</Link>
              <Link href="/docs"      className="text-zinc-400 transition-colors hover:text-zinc-300">Docs</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-semibold uppercase tracking-widest text-zinc-500">Account</span>
              <Link href="/register"  className="text-zinc-400 transition-colors hover:text-zinc-300">Register</Link>
              <Link href="/login"     className="text-zinc-400 transition-colors hover:text-zinc-300">Sign in</Link>
              <Link href="/dashboard" className="text-zinc-400 transition-colors hover:text-zinc-300">Dashboard</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-semibold uppercase tracking-widest text-zinc-500">Legal</span>
              <Link href="/privacy"   className="text-zinc-400 transition-colors hover:text-zinc-300">Privacy</Link>
              <Link href="/terms"     className="text-zinc-400 transition-colors hover:text-zinc-300">Terms</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} SECfinAPI. Data sourced from SEC EDGAR.
          </p>
          <p className="text-xs text-zinc-500">
            Not affiliated with the U.S. Securities and Exchange Commission.
          </p>
        </div>
      </div>
    </footer>
  )
}
