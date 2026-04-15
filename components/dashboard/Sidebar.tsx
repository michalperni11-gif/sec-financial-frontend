'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { clearToken } from '@/lib/auth'

const NAV = [
  {
    href: '/dashboard',
    label: 'Overview',
    external: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: '/docs',
    label: 'Docs',
    external: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
]

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    clearToken()
    router.push('/login')
  }

  return (
    <aside className="flex w-56 flex-shrink-0 flex-col border-r border-white/[0.06] bg-[#0d0d0d] px-3 py-6">
      <Link href="/" className="mb-8 px-3 text-sm font-black tracking-widest text-white">
        SECfin<span className="text-[#00d47e]">API</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) =>
          item.external ? (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200 transition-colors"
            >
              {item.icon}
              {item.label}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                pathname === item.href
                  ? 'bg-white/[0.06] text-zinc-100'
                  : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        )}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <LogoutIcon />
        Sign out
      </button>
    </aside>
  )
}
