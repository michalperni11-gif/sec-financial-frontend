import Link from 'next/link'
import { BrandMark } from '@/components/ui/BrandMark'

const COLS = [
  { title: 'Product', items: [['Pricing', '/#pricing'], ['Docs', '/docs'], ['Playground', '/playground']] },
  { title: 'Resources', items: [['API reference', '/docs'], ['Quick start', '/docs'], ['Changelog', '/docs']] },
  { title: 'Company', items: [['Contact', 'mailto:support@secfinapi.com']] },
  { title: 'Legal', items: [['Terms', '/terms'], ['Privacy', '/privacy']] },
] as const

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 0 60px', marginTop: 40 }}>
      <div className="container-x">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 1.2fr) repeat(4, minmax(110px, 1fr))',
            gap: 40,
            alignItems: 'flex-start',
          }}
          className="footer-grid"
        >
          <div className="col" style={{ gap: 12 }}>
            <Link href="/" className="row brand" style={{ gap: 8 }}>
              <BrandMark size={22} />
              <span>
                SECfin<span style={{ color: 'var(--accent)' }}>API</span>
              </span>
            </Link>
            <p style={{ color: 'var(--fg-subtle)', fontSize: 13, lineHeight: 1.55 }}>
              SEC EDGAR financial data, normalized and served via REST. Built by ex-quants for builders.
            </p>
          </div>
          {COLS.map(col => (
            <div key={col.title} className="col" style={{ gap: 8, fontSize: 13 }}>
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
              {col.items.map(([label, href]) =>
                href.startsWith('mailto:') || href.startsWith('http') ? (
                  <a key={label} href={href} style={{ color: 'var(--fg-muted)' }}>
                    {label}
                  </a>
                ) : (
                  <Link key={label} href={href} style={{ color: 'var(--fg-muted)' }}>
                    {label}
                  </Link>
                ),
              )}
            </div>
          ))}
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
          <div>© {new Date().getFullYear()} SECfinAPI. All rights reserved.</div>
          <span className="badge badge-positive">
            <span className="badge-dot" /> All systems operational
          </span>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </footer>
  )
}
