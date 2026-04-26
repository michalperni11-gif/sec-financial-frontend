'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from '@/components/ui/ThemeProvider'
import { Icons } from '@/components/ui/Icons'
import { BrandMark } from '@/components/ui/BrandMark'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/docs', label: 'Docs' },
  { href: '/dashboard', label: 'Dashboard' },
] as const

export function TopNav() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    try {
      setAuthed(Boolean(localStorage.getItem('secbase_jwt')))
    } catch {
      // ignore
    }
  }, [pathname])

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="brand">
            <BrandMark size={22} />
            <span>
              SECfin<span style={{ color: 'var(--accent)' }}>API</span>
            </span>
          </Link>

          <div className="nav-links nav-desktop">
            {NAV_LINKS.map(link => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${active ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          <div className="nav-spacer" />

          <div className="nav-actions nav-desktop">
            <button
              className="btn btn-icon btn-ghost"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            >
              {theme === 'dark' ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
            </button>
            {authed ? (
              <Link href="/dashboard" className="btn btn-outline btn-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">
                  Sign in
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Get free key
                </Link>
              </>
            )}
          </div>

          <button
            className="btn btn-icon btn-ghost nav-mobile"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Icons.Menu size={18} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'oklch(0 0 0 / 0.6)',
            zIndex: 50,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(320px, 85vw)',
              background: 'var(--bg-card)',
              borderLeft: '1px solid var(--border)',
              padding: '20px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Link href="/" className="brand" onClick={() => setMobileOpen(false)}>
                <BrandMark size={22} />
                <span>
                  SECfin<span style={{ color: 'var(--accent)' }}>API</span>
                </span>
              </Link>
              <button
                className="btn btn-icon btn-ghost"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <Icons.X size={18} />
              </button>
            </div>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{ fontSize: 15, padding: '10px 12px' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0', paddingTop: 12 }}>
              {authed ? (
                <Link href="/dashboard" className="btn btn-outline" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Link href="/login" className="btn btn-outline" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                  <Link href="/register" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>
                    Get free key
                  </Link>
                </div>
              )}
            </div>
            <button
              className="btn btn-ghost"
              onClick={() => {
                toggleTheme()
                setMobileOpen(false)
              }}
              style={{ marginTop: 'auto' }}
            >
              {theme === 'dark' ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
