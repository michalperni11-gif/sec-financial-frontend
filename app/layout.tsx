import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'SECbase — Affordable SEC Financial Data API',
  description:
    '30 years of SEC EDGAR data. 2,800+ companies. Income statements, balance sheets, cash flows. Starts at $5/mo.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="bg-[#0a0a0a] font-sans text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  )
}
