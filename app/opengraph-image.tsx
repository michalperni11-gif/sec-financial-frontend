import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SECfinAPI — Affordable SEC Financial Data API'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#111111',
          padding: '72px 80px',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          display: 'flex',
        }} />

        {/* Chart line decoration */}
        <svg
          style={{ position: 'absolute', right: 60, bottom: 80, opacity: 0.15 }}
          width="480" height="260" viewBox="0 0 480 260"
        >
          <polyline
            points="0,200 80,160 160,180 240,100 320,120 400,60 480,80"
            stroke="#00d47e" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"
          />
          <polyline
            points="0,200 80,160 160,180 240,100 320,120 400,60 480,80"
            stroke="#00d47e" strokeWidth="1" fill="none" opacity="0.3"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="#1a1a1a"/>
            <polyline points="4,24 10,14 15,18 21,8 28,16" stroke="#00d47e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <circle cx="28" cy="16" r="2" fill="#00d47e"/>
          </svg>
          <span style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', letterSpacing: '0.05em' }}>
            SECfin<span style={{ color: '#00d47e' }}>API</span>
          </span>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h1 style={{
            fontSize: '64px',
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: 1.1,
            margin: 0,
            marginBottom: '24px',
            maxWidth: '700px',
          }}>
            SEC Financial Data.<br />
            <span style={{ color: '#00d47e' }}>Finally affordable.</span>
          </h1>

          <p style={{
            fontSize: '22px',
            color: '#71717a',
            margin: 0,
            maxWidth: '560px',
            lineHeight: 1.4,
          }}>
            10,000+ companies · 30 years of XBRL data · Income statements, balance sheets, cash flows
          </p>
        </div>

        {/* Bottom stat pills */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '48px' }}>
          {[
            { label: 'Free tier', value: 'S&P 500' },
            { label: 'Starts at', value: '$5/mo' },
            { label: 'History', value: '30 years' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '12px 20px',
            }}>
              <span style={{ fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', marginTop: '2px' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
