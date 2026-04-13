import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-900 bg-[#0a0a0a]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-black tracking-widest text-cyan-400">
          SECBASE
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#pricing" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
            Pricing
          </Link>
          <Link href="/docs" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
            Docs
          </Link>
          <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded bg-cyan-400 px-3 py-1.5 text-sm font-bold text-black hover:bg-cyan-300 transition-colors"
          >
            Get API key
          </Link>
        </div>
      </div>
    </nav>
  )
}
