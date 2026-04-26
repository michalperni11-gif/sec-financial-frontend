import type { ReactNode } from 'react'

interface AuthShellProps {
  title: string
  subtitle?: string
  footer?: ReactNode
  children: ReactNode
}

export function AuthShell({ title, subtitle, footer, children }: AuthShellProps) {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div className="card card-pad-lg" style={{ position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse 400px 200px at 50% 0%, var(--accent-soft), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
            <div className="col" style={{ gap: 8, marginBottom: 24 }}>
              <h3 style={{ fontSize: 22 }}>{title}</h3>
              {subtitle && <p style={{ fontSize: 13.5, color: 'var(--fg-muted)' }}>{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
        {footer && (
          <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--fg-muted)' }}>{footer}</div>
        )}
      </div>
    </div>
  )
}
