import Link from 'next/link'

const NEXT_TIER: Record<string, { name: string; price: string; benefit: string }> = {
  free: { name: 'Basic', price: '$5/mo', benefit: '10 years of history + 500 req/min' },
  basic: { name: 'Starter', price: '$8/mo', benefit: 'full 2,800+ companies' },
  starter: { name: 'Growth', price: '$15/mo', benefit: 'full history for all companies' },
  growth: { name: 'Pro', price: '$30/mo', benefit: '3,000 req/min' },
  pro: { name: 'Enterprise', price: '$150/mo', benefit: 'unlimited requests' },
}

export function UpgradeBanner({ tier }: { tier: string }) {
  const next = NEXT_TIER[tier.toLowerCase()]
  if (!next) return null

  return (
    <div className="flex items-center justify-between rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-5 py-4">
      <p className="text-sm text-zinc-400">
        Upgrade to <span className="font-semibold text-cyan-400">{next.name}</span> ({next.price}) — get {next.benefit}
      </p>
      <Link
        href="#pricing"
        className="ml-4 flex-shrink-0 rounded bg-cyan-400 px-4 py-1.5 text-xs font-bold text-black hover:bg-cyan-300 transition-colors"
      >
        Upgrade
      </Link>
    </div>
  )
}
