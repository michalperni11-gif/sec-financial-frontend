import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-white">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L4 10h6l-2 6 8-10h-6l2-6z" fill="#00d47e"/>
          </svg>
          SECfin<span className="text-[#00d47e]">API</span>
        </Link>

        <div className="flex gap-6 text-xs text-zinc-600">
          <Link href="#pricing"  className="hover:text-zinc-300 transition-colors">Pricing</Link>
          <Link href="/docs"     className="hover:text-zinc-300 transition-colors">Docs</Link>
          <Link href="/register" className="hover:text-zinc-300 transition-colors">Register</Link>
          <Link href="/login"    className="hover:text-zinc-300 transition-colors">Sign in</Link>
        </div>

        <p className="text-xs text-zinc-700">
          Data sourced from SEC EDGAR. Not affiliated with the U.S. Securities and Exchange Commission.
        </p>
      </div>
    </footer>
  )
}
