'use client'

import { useState } from 'react'
import { Icons } from '@/components/ui/Icons'

const FAQ = [
  {
    q: 'Where does the data come from?',
    a: 'Direct from SEC EDGAR XBRL filings \u2014 10-K, 10-Q, 20-F, 40-F. We parse the raw XBRL, map every filer\u2019s GAAP tags to one consistent schema, and expose it as JSON.',
  },
  {
    q: 'How fresh is the data?',
    a: 'New filings show up within hours of being posted on EDGAR. Our background ingest runs continuously at SEC\u2019s 9 req/sec ceiling, plus a full refresh every Sunday at 02:00 UTC.',
  },
  {
    q: 'What is DQS?',
    a: 'Data Quality Score \u2014 a 0\u2013100 rating attached to every filing. Flags include restatements, missing concepts, balance-sheet imbalance (assets \u2260 liabilities + equity), and unusual reporting choices. Use it to decide when to trust a number programmatically.',
  },
  {
    q: 'How is data normalized across filers?',
    a: 'We maintain a TAG_MAP that collapses synonymous GAAP concepts to canonical names. Apple\u2019s RevenueFromContractWithCustomerExcludingAssessedTax, Tesla\u2019s Revenues, and other variants all become Revenue. Same goes for OperatingIncome, NetIncome, EPS, and 100+ other concepts.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Subscriptions are month-to-month via Stripe. Cancel from /billing and you keep access through the end of the current period. No partial-month refunds.',
  },
  {
    q: 'What happens if I exceed my rate limit?',
    a: 'You get a 429 response with a Retry-After header (in seconds). We never silently drop requests or charge overage fees \u2014 just back off and retry.',
  },
  {
    q: 'Webhooks or streaming?',
    a: 'Not yet. Webhooks for new filings are on the roadmap for Pro. For now, poll /v1/company/{ticker}/info \u2014 it returns last_ingested_at.',
  },
  {
    q: 'Can I use this commercially?',
    a: 'Yes, all paid tiers include a commercial license. Free tier is non-commercial \u2014 personal projects, research, evaluation only.',
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
