import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#111111]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-sm font-bold tracking-wide text-white">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L4 10h6l-2 6 8-10h-6l2-6z" fill="#00d47e"/>
          </svg>
          SECfin<span className="text-[#00d47e]">API</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          <Link href="#features" className="text-xs text-zinc-400 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#explorer" className="text-xs text-zinc-400 hover:text-white transition-colors">
            API Explorer
          </Link>
          <Link href="#pricing" className="text-xs text-zinc-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="text-xs text-zinc-400 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="border border-white/20 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
          >
            Get API Key
          </Link>
        </div>
      </div>
    </nav>
  )
}
