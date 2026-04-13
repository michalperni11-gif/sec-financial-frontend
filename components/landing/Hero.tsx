import Link from 'next/link'

const STATS = [
  { value: '2,800+', label: 'companies' },
  { value: '30yr', label: 'history' },
  { value: '$5/mo', label: 'starts at' },
  { value: 'REST', label: 'API' },
]

export function Hero() {
  return (
    <section className="flex flex-col items-center px-6 pb-16 pt-32 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs text-cyan-400">
        <span>✦</span>
        <span>30 years of SEC EDGAR data</span>
      </div>

      <h1 className="mb-4 max-w-2xl text-5xl font-black leading-tight tracking-tight text-zinc-100 md:text-6xl">
        Financial data
        <br />
        <span className="text-cyan-400">without the price tag</span>
      </h1>

      <p className="mb-2 text-base text-zinc-500">
        Income · Balance Sheet · Cash Flow · Metrics
      </p>

      <Link
        href="/register"
        className="mt-8 inline-flex items-center gap-2 rounded bg-cyan-400 px-6 py-3 text-sm font-bold text-black hover:bg-cyan-300 transition-colors"
      >
        Start for free →
      </Link>

      {/* Stats bar */}
      <div className="mt-16 flex flex-wrap justify-center gap-10 border-t border-zinc-900 pt-10">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-black text-zinc-100">{s.value}</div>
            <div className="mt-0.5 text-xs text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
