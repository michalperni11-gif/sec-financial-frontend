import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SECfinAPI — Standardized SEC financial data, one API'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background:
            'radial-gradient(ellipse 1200px 600px at 50% -10%, rgba(34, 197, 230, 0.18), transparent 60%), #0a0d12',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#22c5e6">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em' }}>
            SECfin<span style={{ color: '#22c5e6' }}>API</span>
          </span>
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: 28,
          }}
        >
          Standardized SEC financial data — one API.
        </div>

        <div style={{ fontSize: 26, color: '#94a3b8', lineHeight: 1.4, maxWidth: 1000 }}>
          Income statements, balance sheets, cash flow + 50 ratios for 10,000+ US public companies. Cleaned,
          normalized, ready to query.
        </div>

        <div
          style={{
            display: 'flex',
            gap: 32,
            marginTop: 'auto',
            fontSize: 20,
            color: '#cbd5e1',
            alignItems: 'center',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, background: '#22c5e6', borderRadius: 999 }} />
            Live API · 10,000+ companies
          </span>
          <span>·</span>
          <span>secfinapi.com</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
