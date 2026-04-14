'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#111111]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-sm font-bold tracking-wide text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#00d47e">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          SECfin<span className="text-[#00d47e]">API</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-xs text-zinc-400 transition-colors hover:text-white">Features</Link>
          <Link href="#explorer" className="text-xs text-zinc-400 transition-colors hover:text-white">API Explorer</Link>
          <Link href="#pricing"  className="text-xs text-zinc-400 transition-colors hover:text-white">Pricing</Link>
          <Link href="/docs"     className="text-xs text-zinc-400 transition-colors hover:text-white">Docs</Link>
          <Link href="/login"    className="text-xs text-zinc-400 transition-colors hover:text-white">Sign in</Link>
          <Link
            href="/register"
            className="border border-white/20 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
          >
            Get API Key
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col items-center justify-center gap-1.5 p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px w-5 bg-zinc-400 transition-all ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
          <span className={`block h-px w-5 bg-zinc-400 transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-5 bg-zinc-400 transition-all ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/[0.06] bg-[#111111] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="#features" onClick={() => setOpen(false)} className="text-sm text-zinc-400 hover:text-white">Features</Link>
            <Link href="#explorer" onClick={() => setOpen(false)} className="text-sm text-zinc-400 hover:text-white">API Explorer</Link>
            <Link href="#pricing"  onClick={() => setOpen(false)} className="text-sm text-zinc-400 hover:text-white">Pricing</Link>
            <Link href="/docs"     onClick={() => setOpen(false)} className="text-sm text-zinc-400 hover:text-white">Docs</Link>
            <Link href="/login"    onClick={() => setOpen(false)} className="text-sm text-zinc-400 hover:text-white">Sign in</Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="inline-block border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white/40"
            >
              Get API Key
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
