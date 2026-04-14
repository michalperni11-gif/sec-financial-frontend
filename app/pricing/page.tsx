import type { Metadata } from 'next'
import Link from 'next/link'
import { PricingTable } from '@/components/landing/PricingTable'

export const metadata: Metadata = {
  title: 'Pricing — SECfinAPI',
  description: 'Simple, transparent pricing. Free tier available. No hidden fees. SEC financial data API starting at $5/mo.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="border-b border-zinc-800/50 px-6 py-4">
        <Link href="/" className="text-sm font-black tracking-widest text-zinc-400 hover:text-zinc-200 transition-colors">
          ← SECfin<span className="text-[#00d47e]">API</span>
        </Link>
      </div>
      <PricingTable />
    </div>
  )
}
