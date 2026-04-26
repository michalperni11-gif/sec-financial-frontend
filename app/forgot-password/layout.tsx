import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Enter your SECfinAPI account email to receive a password reset link.',
  robots: { index: false, follow: true },
}

export default function ForgotLayout({ children }: { children: React.ReactNode }) {
  return children
}
