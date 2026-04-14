import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/[0.06] bg-[#0d0d0d] px-6 pt-10 pb-8">
      <div className="mx-auto max-w-6xl">

        {/* Top row — logo + nav */}
        <div className="flex flex-wrap items-start justify-between gap-8 pb-8 border-b border-white/[0.06]">
          <div>
            <Link href="/" className="flex items-center gap-2 text-sm font-bold text-white">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L4 10h6l-2 6 8-10h-6l2-6z" fill="#00d47e"/>
              </svg>
              SECfin<span className="text-[#00d47e]">API</span>
            </Link>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-zinc-600">
              Standardized SEC EDGAR financial data for developers. Raw. Fast. Low cost.
            </p>
          </div>

          <div className="flex gap-10 text-xs text-zinc-500">
            <div className="flex flex-col gap-2.5">
              <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">Product</span>
              <Link href="#features"  className="hover:text-zinc-200 transition-colors">Features</Link>
              <Link href="#pricing"   className="hover:text-zinc-200 transition-colors">Pricing</Link>
              <Link href="/docs"      className="hover:text-zinc-200 transition-colors">Documentation</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">Account</span>
              <Link href="/register"  className="hover:text-zinc-200 transition-colors">Register</Link>
              <Link href="/login"     className="hover:text-zinc-200 transition-colors">Sign in</Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px]">Legal</span>
              <Link href="/terms"     className="hover:text-zinc-200 transition-colors">Terms of Service</Link>
              <Link href="/privacy"   className="hover:text-zinc-200 transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom row — copyright + disclaimers */}
        <div className="pt-6 flex flex-col gap-3">
          <p className="text-xs text-zinc-600">
            © {year} SECfinAPI. All rights reserved.
          </p>
          <p className="text-xs leading-relaxed text-zinc-700 max-w-3xl">
            Financial data is sourced from SEC EDGAR, a service of the U.S. Securities and Exchange Commission.
            SECfinAPI is an independent data service and is <strong className="text-zinc-600">not affiliated with, endorsed by, or
            connected to the U.S. Securities and Exchange Commission (SEC)</strong> in any way.
            "SEC" and "EDGAR" are trademarks of the U.S. Securities and Exchange Commission.
          </p>
          <p className="text-xs leading-relaxed text-zinc-700 max-w-3xl">
            <strong className="text-zinc-600">Not financial advice.</strong> All data provided through the SECfinAPI platform is
            for informational and educational purposes only. It does not constitute financial, investment, legal, or tax advice.
            Past financial performance is not indicative of future results. Always consult a qualified financial professional
            before making investment decisions.
          </p>
          <p className="text-xs text-zinc-700">
            Data accuracy is not guaranteed. While we strive to provide accurate and up-to-date information,
            SECfinAPI makes no representations or warranties regarding the completeness, accuracy, or timeliness of the data.
          </p>
        </div>

      </div>
    </footer>
  )
}
