import Link from 'next/link'
import { Icons } from '@/components/ui/Icons'

interface HeroProps {
  companyCount: number
}

export function Hero({ companyCount }: HeroProps) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', paddingTop: 80, paddingBottom: 40 }}>
      <div
        className="glow"
        style={{ top: -100, left: '20%', width: 600, height: 400, background: 'var(--accent)', opacity: 0.18 }}
      />
      <div
        className="glow"
        style={{
          top: 60,
          right: '10%',
          width: 400,
          height: 300,
          background: 'oklch(from var(--accent) calc(l - 0.1) c calc(h + 60))',
          opacity: 0.15,
        }}
      />

      <div className="container-x" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="col"
          style={{ alignItems: 'center', textAlign: 'center', maxWidth: 880, margin: '0 auto', gap: 24 }}
        >
          <div className="badge badge-accent">
            <span className="badge-dot" />
            <span>
              API v1 · live & ingesting · {companyCount.toLocaleString('en-US')} companies
            </span>
          </div>
          <h1>
            Standardized SEC
            <br />
            financial data — <span className="gradient-text">one API.</span>
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.5, color: 'var(--fg-muted)', maxWidth: 640 }}>
            Income statements, balance sheets, cash flow + 50 ratios for 10,000+ US public companies. Cleaned,
            normalized, ready to query.
          </p>
          <div className="row" style={{ gap: 12, marginTop: 8 }}>
            <Link href="/register" className="btn btn-primary btn-lg">
              Get free API key <Icons.ArrowRight size={15} />
            </Link>
            <Link href="/docs" className="btn btn-outline btn-lg">
              View docs
            </Link>
          </div>
          <div className="row" style={{ gap: 24, marginTop: 20, fontSize: 13, color: 'var(--fg-subtle)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div className="row" style={{ gap: 8 }}>
              <Icons.Check size={14} />
              No credit card
            </div>
            <div className="row" style={{ gap: 8 }}>
              <Icons.Check size={14} />
              100 free req/day
            </div>
            <div className="row" style={{ gap: 8 }}>
              <Icons.Check size={14} />
              S&amp;P 500 included
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
