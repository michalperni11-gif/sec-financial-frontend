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
    a: 'Directly from SEC EDGAR XBRL filings. We pull 10-K and 10-Q submissions, normalize the GAAP concepts into a consistent schema, and serve them through one stable API.',
  },
  {
    q: 'How fresh is the data?',
    a: 'Filings are ingested within hours of being posted to EDGAR. Our scheduler respects the 9 req/sec SEC throttle and runs continuously.',
  },
  {
    q: 'What is DQS?',
    a: 'Data Quality Score \u2014 a 0-100 rating per filing that flags missing concepts, restatements, and unusual reporting choices.',
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
    q: 'What happens if I exceed my rate limit?',
    a: 'You get a 429 response with a Retry-After header. We never silently drop requests or charge overage fees.',
  },
  {
    q: 'Can I use this for commercial products?',
    a: 'Yes, all paid tiers include a commercial license. The Free tier is non-commercial only.',
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
