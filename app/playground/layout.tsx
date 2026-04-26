import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Playground',
  description: 'Try SECfinAPI endpoints in your browser. Pretty JSON, table view, cURL — no setup required.',
  alternates: { canonical: 'https://secfinapi.com/playground' },
  robots: { index: false, follow: true },
}

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return children
}
