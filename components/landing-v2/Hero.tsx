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
              Live · {companyCount.toLocaleString('en-US')} companies indexed · adding hundreds daily
            </span>
          </div>
          <h1>
            Skip the XBRL.
            <br />
            Query SEC data as <span className="gradient-text">clean JSON.</span>
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.5, color: 'var(--fg-muted)', maxWidth: 660 }}>
            Income statements, balance sheets, cash flow, and 50+ ratios for every US public company. GAAP
            concepts normalized across filers — <span className="mono">Revenue</span> is{' '}
            <span className="mono">Revenue</span>, whether the filer tagged it{' '}
            <span className="mono">SalesRevenueNet</span> or <span className="mono">Revenues</span>.
          </p>
          <div className="row" style={{ gap: 12, marginTop: 8 }}>
            <Link href="/register" className="btn btn-primary btn-lg">
              Get free API key <Icons.ArrowRight size={15} />
            </Link>
            <Link href="/docs" className="btn btn-outline btn-lg">
              Read the docs
            </Link>
          </div>
          <div
            className="row"
            style={{
              gap: 24,
              marginTop: 20,
              fontSize: 13,
              color: 'var(--fg-subtle)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div className="row" style={{ gap: 8 }}>
              <Icons.Check size={14} /> 100 requests/day, free forever
            </div>
            <div className="row" style={{ gap: 8 }}>
              <Icons.Check size={14} /> No credit card
            </div>
            <div className="row" style={{ gap: 8 }}>
              <Icons.Check size={14} /> Working in 60 seconds
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
