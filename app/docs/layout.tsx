import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation',
  description:
    'SECfinAPI reference: endpoints, authentication, rate limits, error codes, and code examples in Python, JavaScript, and cURL.',
  alternates: { canonical: 'https://secfinapi.com/docs' },
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
