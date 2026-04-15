import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

export function StatCard({ label, value, sub, accent = false }: StatCardProps) {
  return (
    <div className="border border-white/[0.08] bg-[#1a1a1a] p-5">
      <div className="mb-1 text-xs uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={cn('text-2xl font-bold', accent ? 'text-[#00d47e]' : 'text-zinc-100')}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-zinc-500">{sub}</div>}
    </div>
  )
}
