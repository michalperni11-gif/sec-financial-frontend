import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 px-6 py-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 flex-wrap">
        <span className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase">SECBASE</span>
        <div className="flex gap-6 text-xs text-zinc-600">
          <Link href="#pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
          <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
          <Link href="/register" className="hover:text-zinc-300 transition-colors">Register</Link>
          <Link href="/login" className="hover:text-zinc-300 transition-colors">Sign in</Link>
        </div>
        <p className="text-xs text-zinc-700 max-w-xs">
          Data from SEC EDGAR. Not affiliated with the U.S. Securities and Exchange Commission.
        </p>
      </div>
    </footer>
  )
}
