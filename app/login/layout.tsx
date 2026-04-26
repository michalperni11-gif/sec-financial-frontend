import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your SECfinAPI account to access your API key, dashboard, and usage.',
  alternates: { canonical: 'https://secfinapi.com/login' },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
