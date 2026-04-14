import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — SECfinAPI',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#111111] px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          ← Back to home
        </Link>

        <h1 className="mb-2 text-3xl font-black text-white">Terms of Service</h1>
        <p className="mb-10 text-xs text-zinc-500">Last updated: April 2025</p>

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-zinc-400">

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">1. Acceptance of Terms</h2>
            <p>By accessing or using SECfinAPI (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">2. Description of Service</h2>
            <p>SECfinAPI provides programmatic access to standardized financial data sourced from SEC EDGAR. The Service is intended for developers, researchers, and businesses who require structured financial data for software applications, analysis, and research purposes.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">3. Not Financial Advice</h2>
            <p>All data provided through SECfinAPI is for informational and educational purposes only. Nothing in the Service constitutes financial, investment, legal, or tax advice. You should not rely on the data to make investment decisions. Always consult a qualified financial professional before making any investment decisions.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">4. No Affiliation with the SEC</h2>
            <p>SECfinAPI is an independent data service and is not affiliated with, endorsed by, sponsored by, or connected to the U.S. Securities and Exchange Commission (SEC) in any way. Data is retrieved from SEC EDGAR, which is a publicly available service of the SEC.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">5. API Usage and Permitted Use</h2>
            <p className="mb-2">You may use the API only for lawful purposes. You agree not to:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 text-zinc-500">
              <li>Resell or redistribute raw API data without a commercial licence agreement</li>
              <li>Use the Service to build a competing API or data redistribution platform</li>
              <li>Attempt to circumvent rate limits or access controls</li>
              <li>Use the Service in any way that violates applicable laws or regulations</li>
              <li>Scrape, harvest, or extract data beyond what your subscription plan allows</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">6. API Keys and Account Security</h2>
            <p>You are responsible for keeping your API key confidential. Do not share your API key publicly (e.g. in public repositories). You are responsible for all usage under your account. Notify us immediately if you suspect unauthorised use of your key.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">7. Data Accuracy</h2>
            <p>We strive to provide accurate and up-to-date data sourced from SEC EDGAR. However, SECfinAPI makes no representations or warranties, express or implied, as to the accuracy, completeness, timeliness, or reliability of any data. We are not liable for any errors, omissions, or decisions made based on the data.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">8. Payments and Subscriptions</h2>
            <p>Paid plans are billed monthly. All payments are processed securely via Stripe. Subscriptions renew automatically unless cancelled. Refunds are provided at our discretion within 7 days of payment for issues directly caused by service unavailability.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">9. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, SECfinAPI and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service, including any financial losses resulting from data inaccuracies.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">10. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time if you violate these Terms. You may cancel your subscription at any time through your account dashboard.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">11. Changes to Terms</h2>
            <p>We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms. We will notify users of material changes via email where possible.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">12. Governing Law</h2>
            <p>These Terms are governed by applicable law. Disputes shall be resolved through binding arbitration or in the courts of the jurisdiction where SECfinAPI operates, as applicable.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">13. Contact</h2>
            <p>For questions about these Terms, contact us at <span className="text-zinc-300">support@secfinapi.com</span>.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
