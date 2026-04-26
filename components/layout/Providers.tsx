'use client'

import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
        <CookieBanner />
      </ToastProvider>
    </ThemeProvider>
  )
}
