import Link from 'next/link'
import type { ReactNode } from 'react'
import { TopNav } from '@/components/layout/TopNav'
import { Footer } from '@/components/landing-v2/Footer'

interface LegalLayoutProps {
  title: string
  updated: string
  children: ReactNode
}

export function LegalLayout({ title, updated, children }: LegalLayoutProps) {
  return (
    <>
      <TopNav />
      <main
        className="container-x"
        style={{ maxWidth: 760, padding: '60px 28px 80px' }}
      >
        <div className="eyebrow">Legal</div>
        <h1 style={{ fontSize: 40, marginTop: 8, marginBottom: 8 }}>{title}</h1>
        <p style={{ color: 'var(--fg-subtle)', fontSize: 13, marginBottom: 40 }}>
          Last updated: {updated}
        </p>

        <div
          className="col"
          style={{ gap: 32, fontSize: 14.5, lineHeight: 1.65, color: 'var(--fg-muted)' }}
        >
          {children}
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid var(--border)',
          }}
        >
          <Link
            href="/"
            style={{ color: 'var(--fg-subtle)', fontSize: 13 }}
          >
            ← Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="col" style={{ gap: 12 }}>
      <h2 style={{ fontSize: 18, color: 'var(--fg)' }}>{title}</h2>
      {children}
    </section>
  )
}
