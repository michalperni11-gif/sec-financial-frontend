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
  title: {
    default: 'SECfinAPI — Standardized SEC financial data, one API',
    template: '%s · SECfinAPI',
  },
  description:
    'Skip the XBRL. Query SEC EDGAR data as clean JSON \u2014 income statements, balance sheets, cash flow, and 50+ ratios for every US public company. GAAP concepts normalized across filers. Free tier, 100 requests/day, no card.',
  metadataBase: new URL('https://secfinapi.com'),
  applicationName: 'SECfinAPI',
  authors: [{ name: 'SECfinAPI' }],
  creator: 'SECfinAPI',
  publisher: 'SECfinAPI',
  keywords: [
    'SEC EDGAR API',
    'financial data API',
    'XBRL',
    'income statement API',
    'balance sheet API',
    'cash flow API',
    'GAAP',
    '10-K',
    '10-Q',
    'fundamentals API',
    'stock financial data',
    'company financials JSON',
    'financial ratios API',
    'fintech developer tools',
  ],
  alternates: {
    canonical: 'https://secfinapi.com',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://secfinapi.com',
    siteName: 'SECfinAPI',
    title: 'SECfinAPI \u2014 Skip the XBRL. Query SEC data as clean JSON.',
    description:
      'Income statements, balance sheets, cash flow, and 50+ ratios for every US public company. GAAP normalized across filers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SECfinAPI \u2014 Skip the XBRL.',
    description:
      'Query SEC EDGAR data as clean JSON. Standardized concepts across every filer. Free tier, no card.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  category: 'technology',
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
