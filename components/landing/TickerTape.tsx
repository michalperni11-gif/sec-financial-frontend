const TICKERS = [
  { sym: 'AAPL',  price: '189.42', change: '+1.24%', up: true },
  { sym: 'MSFT',  price: '412.87', change: '-0.38%', up: false },
  { sym: 'GOOGL', price: '175.60', change: '+0.82%', up: true },
  { sym: 'AMZN',  price: '195.43', change: '+2.14%', up: true },
  { sym: 'NVDA',  price: '875.32', change: '+3.56%', up: true },
  { sym: 'META',  price: '519.80', change: '-1.02%', up: false },
  { sym: 'TSLA',  price: '248.15', change: '+0.67%', up: true },
  { sym: 'JPM',   price: '198.76', change: '+0.43%', up: true },
  { sym: 'BRK.B', price: '382.40', change: '-0.18%', up: false },
  { sym: 'UNH',   price: '492.30', change: '+0.89%', up: true },
  { sym: 'XOM',   price: '118.45', change: '-0.52%', up: false },
  { sym: 'V',     price: '276.83', change: '+0.61%', up: true },
  { sym: 'JNJ',   price: '148.32', change: '+0.31%', up: true },
  { sym: 'WMT',   price: '67.14',  change: '+0.44%', up: true },
  { sym: 'PG',    price: '162.40', change: '-0.22%', up: false },
]

export function TickerTape() {
  // Duplicate for seamless infinite scroll
  const items = [...TICKERS, ...TICKERS]

  return (
    <div className="overflow-hidden border-b border-zinc-800/60 bg-[#0c0f14]/98 py-1.5">
      <div className="ticker-track flex whitespace-nowrap">
        {items.map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 px-5 text-xs"
          >
            <span className="font-bold text-zinc-200 tracking-wider">{t.sym}</span>
            <span className="text-zinc-500 tabular-nums">{t.price}</span>
            <span className={`tabular-nums font-medium ${t.up ? 'text-emerald-400' : 'text-red-400'}`}>
              {t.change}
            </span>
            <span className="text-zinc-800 select-none">│</span>
          </span>
        ))}
      </div>
    </div>
  )
}
