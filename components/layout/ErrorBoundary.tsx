'use client'

import { Component, type ReactNode } from 'react'
import { Icons } from '@/components/ui/Icons'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <div className="card card-pad-lg" style={{ maxWidth: 500 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: 'oklch(from var(--negative) l c h / 0.12)',
              color: 'var(--negative)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <Icons.X size={20} />
          </div>
          <h3>Something went wrong</h3>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14, margin: '10px 0 18px' }}>
            An unexpected error occurred. The team has been notified.
          </p>
          <pre
            className="mono"
            style={{
              padding: 12,
              background: 'var(--bg-soft)',
              borderRadius: 8,
              fontSize: 11.5,
              color: 'var(--fg-muted)',
              overflow: 'auto',
              marginBottom: 18,
            }}
          >
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={this.reset}>
              Try again
            </button>
            <a
              className="btn btn-ghost btn-sm"
              href="https://github.com/michalperni11-gif/sec-financial-api/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report issue
            </a>
          </div>
        </div>
      </div>
    )
  }
}
