import Script from 'next/script'

// JSON-LD structured data — Organization + SoftwareApplication + FAQPage.
// Helps Google surface FAQ rich-results in SERP and understand the offering.
// next/script renders this in the document head with the right type attribute.

const ORG = {
  '@type': 'Organization',
  '@id': 'https://secfinapi.com/#org',
  name: 'SECfinAPI',
  url: 'https://secfinapi.com',
  logo: 'https://secfinapi.com/icon.svg',
  email: 'support@secfinapi.com',
  description: 'REST API for standardized SEC EDGAR financial data.',
  sameAs: [],
}

const SOFTWARE = {
  '@type': 'SoftwareApplication',
  '@id': 'https://secfinapi.com/#app',
  name: 'SECfinAPI',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: 'https://secfinapi.com',
  description:
    'REST API serving standardized SEC EDGAR financials: income statements, balance sheets, cash flow, and 50 financial ratios for 10,000+ US public companies.',
  offers: [
    { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD', description: '100 requests/day, S&P 500 only' },
    { '@type': 'Offer', name: 'Basic', price: '19', priceCurrency: 'USD', description: '500 req/min, S&P 500, 10y history' },
    { '@type': 'Offer', name: 'Starter', price: '49', priceCurrency: 'USD', description: '500 req/min, all US, 10y history' },
    { '@type': 'Offer', name: 'Growth', price: '149', priceCurrency: 'USD', description: '1,000 req/min, all US, full history' },
    { '@type': 'Offer', name: 'Pro', price: '499', priceCurrency: 'USD', description: '3,000 req/min, all US, full history' },
  ],
  publisher: { '@id': 'https://secfinapi.com/#org' },
}

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Where does the data come from?',
    a: 'Direct from SEC EDGAR XBRL filings (10-K, 10-Q, 20-F, 40-F). We parse the raw XBRL, map every filer\u2019s GAAP tags to one consistent schema, and expose it as JSON.',
  },
  {
    q: 'How fresh is the data?',
    a: 'New filings show up within hours of being posted on EDGAR. Background ingest runs continuously at SEC\u2019s 9 req/sec ceiling, with a full refresh every Sunday at 02:00 UTC.',
  },
  {
    q: 'What is DQS?',
    a: 'Data Quality Score \u2014 a 0-100 rating per filing with flags for restatements, missing concepts, balance-sheet imbalance, and unusual reporting. Use it to decide programmatically when to trust a number.',
  },
  {
    q: 'How is the data normalized across filers?',
    a: 'A maintained TAG_MAP collapses synonymous GAAP concepts. Apple\u2019s RevenueFromContractWithCustomerExcludingAssessedTax, Tesla\u2019s Revenues, and other variants all become Revenue.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Subscriptions are month-to-month via Stripe. Cancel from the billing page and keep access through the end of the current period.',
  },
  {
    q: 'What happens if I exceed my rate limit?',
    a: 'You get a 429 response with a Retry-After header. No silent drops, no overage charges.',
  },
  {
    q: 'Can I use this commercially?',
    a: 'Yes on paid tiers. Free tier is non-commercial \u2014 personal projects, research, evaluation only.',
  },
]

const FAQ = {
  '@type': 'FAQPage',
  '@id': 'https://secfinapi.com/#faq',
  mainEntity: FAQ_ITEMS.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

const GRAPH = {
  '@context': 'https://schema.org',
  '@graph': [ORG, SOFTWARE, FAQ],
}

// next/script with type="application/ld+json" + children renders the JSON
// inside a <script> tag. No dangerouslySetInnerHTML needed: Next handles
// the inline body. Strategy 'afterInteractive' keeps it out of the
// critical-render path while still being indexed by crawlers.
export function StructuredData() {
  return (
    <Script id="seo-jsonld" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(GRAPH)}
    </Script>
  )
}
