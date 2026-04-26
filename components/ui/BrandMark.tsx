// Single source of truth for the SECfinAPI brand mark.
// Used in TopNav, Footer, AuthShell — anywhere we render the wordmark.

interface BrandMarkProps {
  size?: number
  /** When true, renders a filled cyan glyph (for headers/footer). */
  solid?: boolean
}

export function BrandMark({ size = 26, solid = true }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? 'var(--accent)' : 'none'}
      stroke={solid ? 'none' : 'var(--accent)'}
      strokeWidth="2"
      strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block' }}
      aria-hidden="true"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

export function Wordmark({ size = 26 }: { size?: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        fontSize: 15,
      }}
    >
      <BrandMark size={size} />
      <span>
        SECfin<span style={{ color: 'var(--accent)' }}>API</span>
      </span>
    </span>
  )
}
