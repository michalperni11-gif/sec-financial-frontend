import { Icons } from '@/components/ui/Icons'

const FEATURES = [
  {
    icon: Icons.Layers,
    title: 'Standardized concepts',
    desc: 'GAAP tags normalized across filers. Revenue is Revenue, whether the filer used SalesRevenueNet or Revenues.',
  },
  {
    icon: Icons.Clock,
    title: '10+ years of history',
    desc: 'Backfilled to 2014 for all S&P 500. Full SEC history available on Growth and Pro.',
  },
  {
    icon: Icons.Bolt,
    title: '9 req/sec ingest',
    desc: "We respect the SEC throttle so you don't have to. New filings ingested within hours of posting.",
  },
  {
    icon: Icons.Shield,
    title: 'DQS scoring',
    desc: 'Every filing gets a 0–100 quality score that flags missing concepts and restatements before you trust them.',
  },
  {
    icon: Icons.Code,
    title: 'JSON + REST',
    desc: 'No XBRL parsing, no SDK lock-in. Just predictable JSON over HTTP with stable schemas.',
  },
  {
    icon: Icons.Sparkles,
    title: 'Free tier forever',
    desc: '100 requests/day on the house. Build, prototype, evaluate — no credit card required.',
  },
]

export function Features() {
  return (
    <section className="container-x" style={{ marginBottom: 100 }}>
      <div
        className="col"
        style={{ alignItems: 'center', textAlign: 'center', gap: 12, marginBottom: 40 }}
      >
        <div className="eyebrow">What you get</div>
        <h2>Everything financial data should be</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {FEATURES.map(f => {
          const Icon = f.icon
          return (
            <div key={f.title} className="card">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Icon size={18} />
              </div>
              <h4 style={{ marginBottom: 6 }}>{f.title}</h4>
              <p style={{ fontSize: 13.5, color: 'var(--fg-muted)', lineHeight: 1.55 }}>{f.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
