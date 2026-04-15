import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export const metadata = {
  title: 'Privacy Policy — SECfinAPI',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-28">
        <h1 className="mb-2 text-3xl font-black text-zinc-100">Privacy Policy</h1>
        <p className="mb-10 text-xs text-zinc-500">Last updated: April 2026</p>

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-zinc-400">

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">1. What we collect</h2>
            <p>We collect the minimum necessary to operate the service:</p>
            <ul className="mt-3 flex flex-col gap-2 pl-4">
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']">Email address and name — to create your account and send you transactional emails.</li>
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']">API usage counts — to enforce rate limits and show you your usage in the dashboard.</li>
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']">Payment information — processed by Stripe. We never see or store your card details.</li>
            </ul>
            <p className="mt-3">We do not collect IP addresses beyond what our hosting provider (Vercel / Railway) logs for standard security purposes. We do not use analytics trackers or third-party ad networks.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">2. How we use it</h2>
            <ul className="flex flex-col gap-2 pl-4">
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']">To authenticate you and deliver your API key.</li>
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']">To send transactional emails (email verification, password reset, billing receipts).</li>
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']">To enforce plan limits and prevent abuse.</li>
            </ul>
            <p className="mt-3">We do not sell your data. We do not use your email for marketing without explicit opt-in.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">3. Data retention</h2>
            <p>Your account data is retained as long as your account is active. When you delete your account, your email, password hash, and API key are permanently deleted. Usage logs are deleted within 90 days.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">4. Third parties</h2>
            <ul className="flex flex-col gap-2 pl-4">
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']"><strong className="text-zinc-300">Stripe</strong> — payment processing. Subject to Stripe&apos;s privacy policy.</li>
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']"><strong className="text-zinc-300">Resend</strong> — transactional email delivery. Your email address is shared with Resend for this purpose only.</li>
              <li className="before:mr-2 before:text-[#00d47e] before:content-['–']"><strong className="text-zinc-300">Vercel / Railway</strong> — hosting infrastructure. Standard server logs may include request metadata.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">5. Security</h2>
            <p>Passwords are hashed with bcrypt and never stored in plain text. API keys are stored as SHA-256 hashes. All traffic is encrypted over HTTPS. We do not store payment details.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">6. Your rights</h2>
            <p>You can delete your account at any time from the dashboard settings page. This permanently removes all personal data we hold about you. For any other requests, contact us at the email below.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-100">7. Contact</h2>
            <p>Questions? Email us at <a href="mailto:support@secfinapi.com" className="text-[#00d47e] hover:underline">support@secfinapi.com</a>.</p>
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
