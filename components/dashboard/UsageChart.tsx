'use client'
import { useEffect, useState } from 'react'
import { apiFetch, ApiError } from '@/lib/api'

interface DayUsage {
  date: string
  count: number
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function UsageChart() {
  const [data, setData] = useState<DayUsage[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch<{ usage: DayUsage[] }>('/auth/usage')
      .then((r) => setData(r.usage))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load usage.'))
  }, [])

  if (error || !data || data.length === 0) return null

  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const total = data.reduce((sum, d) => sum + d.count, 0)

  // Show last 14 days
  const visible = data.slice(-14)

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-500">Requests — last 30 days</span>
        <span className="text-sm font-semibold text-zinc-300">{total.toLocaleString()} total</span>
      </div>

      <div className="flex h-28 items-end gap-px">
        {visible.map((day) => {
          const pct = maxCount > 0 ? (day.count / maxCount) * 100 : 0
          const isToday = day.date === new Date().toISOString().slice(0, 10)
          return (
            <div key={day.date} className="group relative flex h-full flex-1 flex-col items-center justify-end">
              <div
                className={`w-full rounded-sm transition-all ${
                  isToday ? 'bg-cyan-500' : 'bg-zinc-700 group-hover:bg-zinc-500'
                }`}
                style={{ height: `${Math.max(pct, day.count > 0 ? 4 : 1)}%` }}
              />
              {/* Tooltip */}
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 flex-col items-center group-hover:flex">
                <div className="whitespace-nowrap rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-center shadow-lg">
                  <p className="text-xs font-semibold text-zinc-100">{day.count.toLocaleString()} req</p>
                  <p className="text-[10px] text-zinc-500">{formatDate(day.date)}</p>
                </div>
                <div className="h-1.5 w-px bg-zinc-700" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-zinc-600">
        <span>{formatDate(visible[0]?.date ?? '')}</span>
        <span>Today</span>
      </div>
    </div>
  )
}
