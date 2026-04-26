import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create your free account',
  description:
    'Free tier — 100 requests/day, no credit card. Get a SECfinAPI key in seconds and query SEC EDGAR financial data.',
  alternates: { canonical: 'https://secfinapi.com/register' },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
