import { Icons } from '@/components/ui/Icons'

const FEATURES = [
  {
    icon: Icons.Code,
    title: 'No XBRL parsing',
    desc: 'You shouldn\u2019t need to learn xbrli:context, link:loc, or what an instant period is just to get Apple\u2019s revenue. We handle the parsing; you get JSON.',
  },
  {
    icon: Icons.Layers,
    title: 'Concepts that actually match',
    desc: 'Apple tags it RevenueFromContractWithCustomerExcludingAssessedTax. Tesla uses Revenues. We map both to one field, across every company.',
  },
  {
    icon: Icons.Bolt,
    title: 'SEC throttle, handled',
    desc: 'SEC enforces 10 req/sec. Hit it once and you\u2019re banned for 10 minutes. We ingest at the limit so you can call us 1,000 times/min worry-free.',
  },
  {
    icon: Icons.Shield,
    title: 'Quality score on every filing',
    desc: 'Every 10-K and 10-Q gets a 0\u2013100 DQS rating with flags for restatements, missing concepts, and balance-sheet imbalances. Know when to trust a number.',
  },
  {
    icon: Icons.TrendingUp,
    title: '50+ ratios, recomputed',
    desc: 'ROE, ROIC, FCF margin, current ratio, debt/equity \u2014 all derived per filing from the standardized concepts. No spreadsheet glue required.',
  },
  {
    icon: Icons.Sparkles,
    title: 'Free tier, forever',
    desc: '100 requests/day on the house. Build a prototype, run a backtest, or just kick the tires. No card, no trial period, no surprises.',
  },
]

export function Features() {
  return (
    <section className="container-x" style={{ marginBottom: 100 }}>
      <div
        className="col"
        style={{ alignItems: 'center', textAlign: 'center', gap: 12, marginBottom: 40 }}
      >
        <div className="eyebrow">Why developers pick us</div>
        <h2>SEC EDGAR data shouldn&rsquo;t be this painful</h2>
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
