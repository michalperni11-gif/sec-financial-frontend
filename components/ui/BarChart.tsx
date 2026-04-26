'use client'

import { useState } from 'react'

interface BarChartProps {
  data: number[]
  height?: number
  formatLabel?: (value: number, index: number) => string
}

export function BarChart({ data, height = 160, formatLabel }: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...data, 1)
  const w = 1000 // viewBox width — scales to container
  const gap = 4
  const barW = (w - gap * (data.length - 1)) / data.length

  return (
    <div style={{ position: 'relative' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${w} ${height}`}
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="bc-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.16 220)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="oklch(0.55 0.18 240)" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {data.map((v, i) => {
          const h = (v / max) * (height - 16)
          const x = i * (barW + gap)
          const y = height - h
          const isHover = hover === i
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                fill="url(#bc-grad)"
                opacity={isHover ? 1 : 0.85}
                rx={3}
              />
              <rect
                x={x - 1}
                y={0}
                width={barW + 2}
                height={height}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          )
        })}
      </svg>
      {hover !== null && (
        <div
          style={{
            position: 'absolute',
            top: -8,
            left: `${((hover + 0.5) / data.length) * 100}%`,
            transform: 'translate(-50%, -100%)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-strong)',
            padding: '6px 10px',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--fg)',
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow)',
            pointerEvents: 'none',
          }}
        >
          {formatLabel ? formatLabel(data[hover], hover) : data[hover]}
        </div>
      )}
    </div>
  )
}
