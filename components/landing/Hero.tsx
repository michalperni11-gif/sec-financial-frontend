import Link from 'next/link'

const STATS = [
  { value: '2,800+', label: 'companies' },
  { value: '30yr',   label: 'history' },
  { value: '$5/mo',  label: 'starts at' },
  { value: 'REST',   label: 'API' },
]

const TERMINAL_LINES = [
  { type: 'cmd',    text: 'GET /company/AAPL/income-statement' },
  { type: 'header', text: 'Authorization: Bearer sk_live_···' },
  { type: 'blank',  text: '' },
  { type: 'status', text: '200 OK  ·  87ms' },
  { type: 'blank',  text: '' },
  { type: 'json',   text: '{' },
  { type: 'key',    text: '  "ticker":       "AAPL",' },
  { type: 'key',    text: '  "fiscal_year":  2024,' },
  { type: 'key',    text: '  "revenue":      391035000000,' },
  { type: 'key',    text: '  "gross_profit": 180683000000,' },
  { type: 'key',    text: '  "net_income":   93736000000,' },
  { type: 'key',    text: '  "eps_basic":    6.08' },
  { type: 'json',   text: '}' },
]

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-16 pt-32 lg:grid-cols-2 lg:items-center lg:gap-16">
      {/* Left: headline + CTA */}
      <div>
        <div className="animate-fade-up animate-delay-1 mb-6 inline-flex items-center gap-2 rounded-sm border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-cyan-400 tracking-widest uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 glow-cyan inline-block" />
          30 years of SEC EDGAR data
        </div>

        <h1 className="animate-fade-up animate-delay-2 mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-zinc-50 lg:text-5xl">
          Financial data<br />
          <span className="text-cyan-400 glow-cyan">without the<br />price tag</span>
        </h1>

        <p className="animate-fade-up animate-delay-3 mb-8 text-sm leading-relaxed text-zinc-500">
          Income · Balance Sheet · Cash Flow · Metrics<br />
          2,800+ companies · Full EDGAR history · REST API
        </p>

        <div className="animate-fade-up animate-delay-4 flex flex-wrap items-center gap-4">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-sm bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)]"
          >
            Start for free
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <Link href="/docs" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            View docs →
          </Link>
        </div>

        {/* Stats */}
        <div className="animate-fade-up animate-delay-5 mt-12 flex flex-wrap gap-8 border-t border-zinc-800/60 pt-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-xl font-bold text-zinc-100 tabular-nums">{s.value}</div>
              <div className="mt-0.5 text-xs text-zinc-600 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: terminal window */}
      <div className="animate-slide-right animate-delay-3 hidden lg:block">
        <div className="rounded-md border border-zinc-800 bg-zinc-950/80 glow-border-cyan backdrop-blur-sm overflow-hidden">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <span className="ml-3 text-xs text-zinc-600 tracking-wider">SECbase API</span>
          </div>
          {/* Terminal content */}
          <div className="p-5 font-mono text-xs leading-relaxed">
            {TERMINAL_LINES.map((line, i) => (
              <div
                key={i}
                className="animate-fade-in"
                style={{ animationDelay: `${0.8 + i * 0.06}s`, animationFillMode: 'both' }}
              >
                {line.type === 'cmd' && (
                  <div className="text-cyan-400">
                    <span className="text-zinc-600">$ curl </span>{line.text}
                  </div>
                )}
                {line.type === 'header' && (
                  <div className="text-zinc-600 ml-5">{line.text}</div>
                )}
                {line.type === 'status' && (
                  <div className="text-green-400">{line.text}</div>
                )}
                {line.type === 'blank' && <div className="h-3" />}
                {line.type === 'json' && (
                  <div className="text-zinc-300">{line.text}</div>
                )}
                {line.type === 'key' && (
                  <div>
                    <span className="text-zinc-500">{line.text.split(':')[0]}:</span>
                    <span className="text-cyan-300">{line.text.split(':').slice(1).join(':')}</span>
                  </div>
                )}
              </div>
            ))}
            {/* Blinking cursor */}
            <div className="mt-2 flex items-center gap-1 text-zinc-600">
              <span>$</span>
              <span className="cursor-blink inline-block h-3.5 w-0.5 bg-cyan-400 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
