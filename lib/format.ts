/** Format a large dollar number: 391_035_000_000 → "$391.0B" */
export function fmtUSD(n: number | null | undefined): string {
  if (n == null) return 'N/A'
  const abs = Math.abs(n)
  if (abs >= 1e12) return `$${(n / 1e12).toFixed(2).replace(/\.?0+$/, '')}T`
  if (abs >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`
  if (abs >= 1e6)  return `$${(n / 1e6).toFixed(1)}M`
  return `$${n.toLocaleString()}`
}

/** Format EPS: 6.08 → "$6.08" */
export function fmtEPS(n: number | null | undefined): string {
  if (n == null) return 'N/A'
  return `$${Number(n).toFixed(2)}`
}

/** Format margin: 0.462 → "46.2%" */
export function fmtPct(n: number | null | undefined): string {
  if (n == null) return 'N/A'
  return `${(n * 100).toFixed(1)}%`
}

/** YoY growth between two values */
export function yoyGrowth(current: number, previous: number): string {
  if (!previous) return 'N/A'
  const pct = ((current - previous) / Math.abs(previous)) * 100
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}
