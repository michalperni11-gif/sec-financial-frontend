import Link from 'next/link'

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    coverage: 'S&P 500',
    history: '5 years',
    rateLimit: '100 req/day',
    highlight: false,
  },
  {
    name: 'Basic',
    price: '$5',
    period: '/mo',
    coverage: 'S&P 500',
    history: '10 years',
    rateLimit: '500 req/min',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '$8',
    period: '/mo',
    coverage: '2,800+ companies',
    history: '10 years',
    rateLimit: '500 req/min',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$15',
    period: '/mo',
    coverage: '2,800+ companies',
    history: 'Full history',
    rateLimit: '1,000 req/min',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$30',
    period: '/mo',
    coverage: '2,800+ companies',
    history: 'Full history',
    rateLimit: '3,000 req/min',
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: '$150',
    period: '/mo',
    coverage: '2,800+ companies',
    history: 'Full history',
    rateLimit: 'Unlimited',
    highlight: false,
  },
]

export function PricingTable() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-2 text-center text-2xl font-bold text-zinc-100">
        Simple, transparent pricing
      </h2>
      <p className="mb-10 text-center text-sm text-zinc-500">
        Start free. Upgrade when you need more.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col rounded-lg border p-5 ${
              tier.highlight
                ? 'border-cyan-400 bg-cyan-400/5'
                : 'border-zinc-800 bg-zinc-900'
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-400 px-3 py-0.5 text-xs font-bold text-black">
                Popular
              </div>
            )}
            <div className="mb-4">
              <div className="text-sm font-semibold text-zinc-300">{tier.name}</div>
              <div className="mt-1 text-2xl font-black text-zinc-100">
                {tier.price}
                <span className="text-sm font-normal text-zinc-500">{tier.period}</span>
              </div>
            </div>
            <ul className="mb-6 flex flex-col gap-2 text-xs text-zinc-400">
              <li><span aria-hidden="true">📍</span> {tier.coverage}</li>
              <li><span aria-hidden="true">📅</span> {tier.history}</li>
              <li><span aria-hidden="true">⚡</span> {tier.rateLimit}</li>
            </ul>
            <Link
              href="/register"
              className={`mt-auto rounded py-2 text-center text-xs font-semibold transition-colors ${
                tier.highlight
                  ? 'bg-cyan-400 text-black hover:bg-cyan-300'
                  : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
              }`}
            >
              {tier.name === 'Free' ? 'Start free' : 'Get started'}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
