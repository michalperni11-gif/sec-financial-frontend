import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'SECfinAPI — Standardized SEC financial data, one API',
  description:
    'Income statements, balance sheets, cash flow + 50 ratios for 10,000+ US public companies. Cleaned, normalized, ready to query.',
  metadataBase: new URL('https://secfinapi.com'),
  openGraph: {
    title: 'SECfinAPI — Standardized SEC financial data, one API',
    description:
      'Income statements, balance sheets, cash flow + 50 ratios for 10,000+ US public companies.',
    url: 'https://secfinapi.com',
    siteName: 'SECfinAPI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SECfinAPI — SEC financial data, one API',
    description:
      'Income statements, balance sheets, cash flow + 50 ratios for 10,000+ US public companies.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="app-bg antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
