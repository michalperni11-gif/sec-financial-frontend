import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export const metadata = {
  title: 'Terms of Service — SECfinAPI',
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-28">
        <h1 className="mb-2 text-3xl font-black text-zinc-100">Terms of Service</h1>
        <p className="mb-10 text-xs text-zinc-500">Last updated: April 2026</p>

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-zinc-400">

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">1. The service</h2>
            <p>SECfinAPI provides standardized financial data sourced from SEC EDGAR filings via a REST API. We are not affiliated with the U.S. Securities and Exchange Commission. Data is provided for informational purposes only and does not constitute financial advice.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">2. Your account</h2>
            <p>You must provide a valid email address to create an account. You are responsible for keeping your API key confidential. Do not share your key in public repositories or client-side code. If your key is compromised, regenerate it immediately from the dashboard.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">3. Acceptable use</h2>
            <p>You may use the API for any lawful purpose including personal projects, research, and commercial applications. You may not:</p>
            <ul className="mt-3 flex flex-col gap-2 pl-4">
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']">Resell or sublicense raw API access to third parties without written permission.</li>
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']">Attempt to circumvent rate limits by using multiple accounts.</li>
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']">Use the API in a way that could damage, disable, or impair the service.</li>
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']">Scrape or bulk-export data in a way that exceeds your plan limits.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">4. Rate limits and plans</h2>
            <p>Each plan includes defined request limits. Exceeding your plan limit returns a 429 response. Consistent abuse of rate limits may result in account suspension. Plan limits are subject to change with 30 days notice.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">5. Billing</h2>
            <p>Paid plans are billed monthly via Stripe. You may cancel at any time from the dashboard — your plan remains active until the end of the billing period. We do not offer refunds for partial months. Failed payments will result in a grace period before access is restricted.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">6. Data accuracy</h2>
            <p>Financial data is sourced directly from SEC EDGAR filings. We process and standardize it but cannot guarantee 100% accuracy. Do not use this data as the sole basis for financial decisions. Always verify critical data against primary SEC sources.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">7. Uptime and availability</h2>
            <p>We aim for high availability but do not guarantee any specific uptime SLA on free or basic plans. Enterprise plans include an uptime SLA. We are not liable for losses caused by service downtime or data unavailability.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">8. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time from the dashboard. Upon termination, your API key is immediately invalidated.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">9. Limitation of liability</h2>
            <p>The service is provided &quot;as is&quot; without warranty of any kind. To the maximum extent permitted by law, SECfinAPI is not liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">10. Contact</h2>
            <p>Questions about these terms? Email <a href="mailto:support@secfinapi.com" className="text-[#00d47e] hover:underline">support@secfinapi.com</a>.</p>
          </section>

        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-8">
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors">← Back to home</Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
