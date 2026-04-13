import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <span className="text-sm font-black tracking-widest text-cyan-400">SECBASE</span>
        <div className="flex gap-6 text-sm text-zinc-500">
          <Link href="#pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
          <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
          <Link href="/register" className="hover:text-zinc-300 transition-colors">Register</Link>
          <Link href="/login" className="hover:text-zinc-300 transition-colors">Sign in</Link>
        </div>
        <p className="max-w-md text-xs text-zinc-600">
          Financial data sourced from SEC EDGAR. SECbase is not affiliated with the U.S. Securities and Exchange Commission.
        </p>
      </div>
    </footer>
  )
}
