interface UsageBarProps {
  used: number
  limit: number
}

export function UsageBar({ used, limit }: UsageBarProps) {
  const pct = Math.min(100, Math.round((used / limit) * 100))
  const color = pct >= 90 ? 'bg-red-400' : pct >= 70 ? 'bg-yellow-400' : 'bg-cyan-400'

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-500">Today's usage</span>
        <span className="text-xs text-zinc-400">
          {used} / {limit} requests
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-zinc-600">Resets at midnight UTC</p>
    </div>
  )
}
