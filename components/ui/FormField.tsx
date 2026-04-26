import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  error?: string | null
  hint?: string | null
  children: ReactNode
}

export function FormField({ label, error, hint, children }: FormFieldProps) {
  return (
    <div className="col" style={{ gap: 8, marginBottom: 14 }}>
      <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-muted)' }}>{label}</label>
      {children}
      {hint && !error && <span style={{ fontSize: 11.5, color: 'var(--fg-subtle)' }}>{hint}</span>}
      {error && <span style={{ fontSize: 11.5, color: 'var(--negative)' }}>{error}</span>}
    </div>
  )
}
