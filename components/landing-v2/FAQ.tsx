'use client'

import { useState } from 'react'
import { Icons } from '@/components/ui/Icons'

const FAQ = [
  {
    q: 'Where does the data come from?',
    a: 'Directly from SEC EDGAR XBRL filings. We pull 10-K and 10-Q submissions, normalize the GAAP concepts into a consistent schema, and serve them through one stable API.',
  },
  {
    q: 'How fresh is the data?',
    a: 'Filings are ingested within hours of being posted to EDGAR. Our scheduler respects the 9 req/sec SEC throttle and runs continuously.',
  },
  {
    q: 'What is DQS?',
    a: 'Data Quality Score — a 0–100 rating per filing that flags missing concepts, restatements, and unusual reporting choices. Useful when you need to know whether to trust a number.',
  },
  {
    q: 'Can I cancel anytime?',
    a: "Yes. Subscriptions are month-to-month. Cancel from the billing page and you'll keep access through the end of the current period.",
  },
  {
    q: 'Do you offer annual pricing?',
    a: "Annual plans get two months free. Email us once you're on a paid tier and we'll switch you over.",
  },
  {
    q: 'Is there a webhook / streaming option?',
    a: 'Not yet. Webhooks for new filings are on the roadmap for the Pro tier.',
  },
  {
    q: 'What happens if I exceed my rate limit?',
    a: 'You get a 429 response with a Retry-After header. We never silently drop requests or charge overage fees.',
  },
  {
    q: 'Can I use this for commercial products?',
    a: 'Yes, all paid tiers include a commercial license. The Free tier is non-commercial only.',
  },
]

export function FAQ_Section() {
  const [open, setOpen] = useState<number>(0)
  return (
    <section className="container-x" style={{ marginBottom: 80, maxWidth: 820 }}>
      <div className="col" style={{ alignItems: 'center', textAlign: 'center', gap: 12, marginBottom: 32 }}>
        <div className="eyebrow">FAQ</div>
        <h2>Common questions</h2>
      </div>
      <div className="card" style={{ padding: 0 }}>
        {FAQ.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <button
                className="row"
                style={{
                  padding: '18px 22px',
                  cursor: 'pointer',
                  justifyContent: 'space-between',
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  textAlign: 'left',
                }}
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
              >
                <span style={{ fontWeight: 500, fontSize: 14.5 }}>{item.q}</span>
                <Icons.Plus
                  size={15}
                  className={isOpen ? 'rotate-45' : ''}
                />
              </button>
              <div
                style={{
                  maxHeight: isOpen ? 200 : 0,
                  overflow: 'hidden',
                  transition: 'max-height 0.25s ease, opacity 0.2s',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div style={{ padding: '0 22px 18px', color: 'var(--fg-muted)', fontSize: 13.5, lineHeight: 1.6 }}>
                  {item.a}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <style>{`.rotate-45 { transform: rotate(45deg); transition: transform 0.2s; }`}</style>
    </section>
  )
}
