const NEXT_TIER: Record<string, { name: string; price: string; benefit: string }> = {
  free:    { name: 'Basic',      price: '$5/mo',   benefit: '10 years of history + 500 req/min' },
  basic:   { name: 'Starter',   price: '$8/mo',   benefit: '10,000+ companies' },
  starter: { name: 'Growth',    price: '$15/mo',  benefit: 'full history for all companies' },
  growth:  { name: 'Pro',       price: '$30/mo',  benefit: '3,000 req/min' },
  pro:     { name: 'Enterprise',price: '$150/mo', benefit: 'unlimited requests' },
}

export function UpgradeBanner({ tier }: { tier: string }) {
  const next = NEXT_TIER[tier.toLowerCase()]
  if (!next) return null

  return (
    <div className="flex items-center justify-between border border-[#00d47e]/20 bg-[#00d47e]/5 px-5 py-4">
      <p className="text-sm text-zinc-400">
        Upgrade to <span className="font-semibold text-[#00d47e]">{next.name}</span> ({next.price}) — get {next.benefit}
      </p>
      <a
        href="/#pricing"
        className="ml-4 flex-shrink-0 bg-[#00d47e] px-4 py-1.5 text-xs font-bold text-black hover:bg-[#00f090] transition-colors"
      >
        Upgrade
      </a>
    </div>
  )
}
