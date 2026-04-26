import Link from 'next/link'
import { Icons } from '@/components/ui/Icons'

interface Tier {
  name: string
  price: number
  reqDay: string
  reqMin: string
  coverage: string
  history: string
  featured: boolean
}

const TIERS: Tier[] = [
  { name: 'Free', price: 0, reqDay: '100', reqMin: '—', coverage: 'S&P 500', history: '5 years', featured: false },
  { name: 'Basic', price: 19, reqDay: '—', reqMin: '500', coverage: 'S&P 500', history: '10 years', featured: false },
  { name: 'Starter', price: 49, reqDay: '—', reqMin: '500', coverage: 'All US', history: '10 years', featured: true },
  { name: 'Growth', price: 149, reqDay: '—', reqMin: '1,000', coverage: 'All US', history: 'Full', featured: false },
  { name: 'Pro', price: 499, reqDay: '—', reqMin: '3,000', coverage: 'All US', history: 'Full', featured: false },
]

export function Pricing() {
  return (
    <section className="container-x" style={{ marginBottom: 100 }} id="pricing">
      <div
        className="col"
        style={{ alignItems: 'center', textAlign: 'center', gap: 12, marginBottom: 40 }}
      >
        <div className="eyebrow">Pricing</div>
        <h2>Start free. Scale when you need to.</h2>
        <p style={{ color: 'var(--fg-muted)', maxWidth: 540, marginTop: 4 }}>
          Every tier ships with the same data quality. Higher tiers unlock more requests, broader coverage, and longer
          history.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
        {TIERS.map(tier => (
          <div
            key={tier.name}
            className="card card-pad-sm"
            style={{
              position: 'relative',
              borderColor: tier.featured ? 'var(--accent)' : undefined,
              background: tier.featured ? 'linear-gradient(180deg, var(--accent-soft), var(--bg-card))' : undefined,
            }}
          >
            {tier.featured && (
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--accent)',
                  color: 'oklch(0.16 0.012 250)',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 999,
                  letterSpacing: '0.04em',
                }}
              >
                POPULAR
              </div>
            )}
            <div className="col" style={{ gap: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{tier.name}</div>
                <div className="row" style={{ alignItems: 'baseline', gap: 4, marginTop: 6 }}>
                  <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>${tier.price}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>{tier.price === 0 ? '' : '/mo'}</span>
                </div>
              </div>
              <div className="col" style={{ gap: 8, fontSize: 12.5, color: 'var(--fg-muted)' }}>
                <div className="row" style={{ gap: 8 }}>
                  <Icons.Check size={13} />
                  {tier.reqDay !== '—' ? `${tier.reqDay} req/day` : `${tier.reqMin} req/min`}
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <Icons.Check size={13} />
                  {tier.coverage}
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <Icons.Check size={13} />
                  {tier.history}
                </div>
                {tier.price >= 49 && (
                  <div className="row" style={{ gap: 8 }}>
                    <Icons.Check size={13} />
                    All endpoints
                  </div>
                )}
                {tier.price >= 149 && (
                  <div className="row" style={{ gap: 8 }}>
                    <Icons.Check size={13} />
                    Priority support
                  </div>
                )}
              </div>
              <Link
                href="/register"
                className={`btn btn-sm ${tier.featured ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%' }}
              >
                {tier.price === 0 ? 'Start free' : 'Subscribe'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
