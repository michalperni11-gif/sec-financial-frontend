interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

export function StatCard({ label, value, sub, accent = false }: StatCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-1 text-xs uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`text-2xl font-bold ${accent ? 'text-cyan-400' : 'text-zinc-100'}`}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-zinc-600">{sub}</div>}
    </div>
  )
}
