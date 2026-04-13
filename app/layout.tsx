import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'SECbase — Affordable SEC Financial Data API',
  description:
    '30 years of SEC EDGAR data. 2,800+ companies. Income statements, balance sheets, cash flows. Starts at $5/mo.',
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
