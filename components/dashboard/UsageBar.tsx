interface UsageBarProps {
  used: number
  limit: number
}

export function UsageBar({ used, limit }: UsageBarProps) {
  const pct = Math.min(100, Math.round((used / limit) * 100))
  const color = pct >= 90 ? 'bg-red-400' : pct >= 70 ? 'bg-yellow-400' : 'bg-[#00d47e]'

  return (
    <div className="border border-white/[0.08] bg-[#1a1a1a] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-500">Today&apos;s usage</span>
        <span className="text-xs text-zinc-400">
          {used} / {limit} requests
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden bg-white/[0.06]">
        <div
          className={`h-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-zinc-500">Resets at midnight UTC</p>
    </div>
  )
}
