import Link from 'next/link'
import { Icons } from '@/components/ui/Icons'

const COLS = [
  { title: 'Product', items: [['Pricing', '/#pricing'], ['Docs', '/docs'], ['Changelog', '/docs#changelog'], ['Status', '/'] ] },
  { title: 'Resources', items: [['API reference', '/docs'], ['Quick start', '/docs#quick-start'], ['Examples', '/docs'], ['Postman', '/docs']] },
  { title: 'Company', items: [['About', '/'], ['Blog', '/'], ['Contact', '/'], ['Brand', '/']] },
  { title: 'Legal', items: [['Terms', '/terms'], ['Privacy', '/privacy'], ['DPA', '/'], ['Security', '/']] },
] as const

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 0 60px', marginTop: 40 }}>
      <div className="container-x">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 30 }}>
          <div className="col" style={{ gap: 12, maxWidth: 320 }}>
            <Link href="/" className="row brand" style={{ gap: 8 }}>
              <span className="brand-mark" />
              <span>
                SECfin<span style={{ color: 'var(--accent)' }}>API</span>
              </span>
            </Link>
            <p style={{ color: 'var(--fg-subtle)', fontSize: 13 }}>
              SEC EDGAR financial data, normalized and served via REST. Built by ex-quants for builders.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, auto))', gap: 60, fontSize: 13 }}>
            {COLS.map(col => (
              <div key={col.title} className="col" style={{ gap: 8 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 12,
                    color: 'var(--fg)',
                    marginBottom: 4,
                    letterSpacing: '0.02em',
                  }}
                >
                  {col.title}
                </div>
                {col.items.map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    style={{ color: 'var(--fg-muted)', cursor: 'pointer' }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          className="row"
          style={{
            justifyContent: 'space-between',
            marginTop: 40,
            paddingTop: 22,
            borderTop: '1px solid var(--border)',
            fontSize: 12,
            color: 'var(--fg-subtle)',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>© {new Date().getFullYear()} secfinapi. All rights reserved.</div>
          <div className="row" style={{ gap: 12 }}>
            <a
              href="https://github.com/michalperni11-gif/sec-financial-api"
              target="_blank"
              rel="noopener noreferrer"
              className="row"
              style={{ gap: 6 }}
            >
              <Icons.Github size={14} /> GitHub
            </a>
            <span>·</span>
            <span className="badge badge-positive">
              <span className="badge-dot" /> All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
