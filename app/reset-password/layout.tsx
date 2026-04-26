import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Set a new password',
  robots: { index: false, follow: false },
}

export default function ResetLayout({ children }: { children: React.ReactNode }) {
  return children
}
