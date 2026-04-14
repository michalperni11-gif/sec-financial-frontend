import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'SECfinAPI — Affordable SEC Financial Data API',
  description:
    '30 years of SEC EDGAR data. 10,000+ companies. Income statements, balance sheets, cash flows. Starts at $5/mo.',
  metadataBase: new URL('https://secfinapi.com'),
  openGraph: {
    title: 'SECfinAPI — Affordable SEC Financial Data API',
    description: '30 years of SEC EDGAR data. 10,000+ companies. Income statements, balance sheets, cash flows. Starts at $5/mo.',
    url: 'https://secfinapi.com',
    siteName: 'SECfinAPI',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'SECfinAPI' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SECfinAPI — Affordable SEC Financial Data API',
    description: '30 years of SEC EDGAR data. 10,000+ companies. Income statements, balance sheets, cash flows.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} scroll-smooth`}>
      <body className="bg-[#111111] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  )
}
