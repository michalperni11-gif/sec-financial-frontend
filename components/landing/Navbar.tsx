import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full">
      {/* Thin cyan top line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="border-b border-zinc-900 bg-[#080808]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-sm font-bold tracking-[0.2em] text-cyan-400 uppercase">
            SECBASE
          </Link>
          <div className="flex items-center gap-6">
            <Link href="#pricing" className="text-xs text-zinc-600 hover:text-zinc-200 transition-colors tracking-wider uppercase">
              Pricing
            </Link>
            <Link href="/docs" className="text-xs text-zinc-600 hover:text-zinc-200 transition-colors tracking-wider uppercase">
              Docs
            </Link>
            <Link href="/login" className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-sm bg-cyan-400 px-4 py-2 text-xs font-bold text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_16px_rgba(34,211,238,0.3)]"
            >
              Get API key
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
