import Link from 'next/link'

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    rateLimit: '100 req/day',
    highlight: false,
    features: [
      'S&P 500 coverage',
      '5 years history',
      '5 endpoints',
      'Community support',
    ],
  },
  {
    name: 'Basic',
    price: '$5',
    period: '/mo',
    rateLimit: '500 req/min',
    highlight: false,
    features: [
      'S&P 500 coverage',
      '10 years history',
      '5 endpoints',
      'Email support',
    ],
  },
  {
    name: 'Starter',
    price: '$8',
    period: '/mo',
    rateLimit: '500 req/min',
    highlight: false,
    features: [
      '2,800+ companies',
      '10 years history',
      '5 endpoints',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: '$15',
    period: '/mo',
    rateLimit: '1,000 req/min',
    highlight: true,
    features: [
      '2,800+ companies',
      'Full history',
      '5 endpoints',
      'Priority support',
      'Historical data',
    ],
  },
  {
    name: 'Pro',
    price: '$30',
    period: '/mo',
    rateLimit: '3,000 req/min',
    highlight: false,
    features: [
      '2,800+ companies',
      'Full history',
      '5 endpoints',
      'Dedicated support',
      '25+ years archive',
      'Bulk downloads',
    ],
  },
  {
    name: 'Enterprise',
    price: '$150',
    period: '/mo',
    rateLimit: 'Unlimited',
    highlight: false,
    features: [
      '2,800+ companies',
      'Full history',
      'Unlimited requests',
      '24/7 support',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
]

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function PricingTable() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="mb-3 text-4xl font-black text-white">Simple, Transparent Pricing</h2>
        <p className="text-sm text-zinc-500">No hidden fees. No enterprise sales calls for pricing info.</p>
      </div>

      {/* Cards — 3 col on md, 6 col on xl */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col border p-5 transition-all duration-200 ${
              tier.highlight
                ? 'border-[#00d47e]/40 bg-[#00d47e]/5 hover:border-[#00d47e]/60'
                : 'border-white/[0.08] bg-[#1a1a1a] hover:border-white/[0.15] hover:bg-[#1e1e1e]'
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#00d47e] px-2.5 py-0.5 text-xs font-bold text-black">
                Popular
              </div>
            )}

            {/* Price */}
            <div className="mb-5">
              <div className={`mb-1 text-xs font-bold uppercase tracking-widest ${tier.highlight ? 'text-[#00d47e]' : 'text-zinc-500'}`}>
                {tier.name}
              </div>
              <div className={`text-3xl font-black tabular-nums leading-none ${tier.highlight ? 'text-[#00d47e]' : 'text-white'}`}>
                {tier.price}
              </div>
              <div className="mt-1 text-xs text-zinc-400">{tier.period}</div>
              <div className="mt-1.5 text-xs text-zinc-500">{tier.rateLimit}</div>
            </div>

            {/* Features */}
            <ul className="mb-6 flex flex-col gap-2 text-xs">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-zinc-400">
                  <span className={`mt-0.5 shrink-0 ${tier.highlight ? 'text-[#00d47e]' : 'text-zinc-400'}`}>
                    <CheckIcon />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/register"
              className={`mt-auto block w-full py-2 text-center text-xs font-bold transition-all ${
                tier.highlight
                  ? 'bg-[#00d47e] text-black hover:bg-[#00f090] hover:shadow-[0_0_18px_rgba(0,212,126,0.35)]'
                  : tier.name === 'Free'
                    ? 'border border-white/15 text-zinc-400 hover:border-white/25 hover:text-white'
                    : 'border border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300'
              }`}
            >
              {tier.name === 'Free' ? 'Start free' : 'Subscribe'}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
