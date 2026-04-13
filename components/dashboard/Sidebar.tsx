'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { clearToken } from '@/lib/auth'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: '⊞' },
  { href: '/docs', label: 'Docs', icon: '📄', external: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    clearToken()
    router.push('/login')
  }

  return (
    <aside className="flex w-56 flex-shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 px-3 py-6">
      <Link href="/" className="mb-8 px-3 text-sm font-black tracking-widest text-cyan-400">
        SECBASE
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) =>
          item.external ? (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                pathname === item.href
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        )}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        <span>→</span>
        Sign out
      </button>
    </aside>
  )
}
