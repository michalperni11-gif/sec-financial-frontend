import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — SECfinAPI',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#111111] px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          ← Back to home
        </Link>

        <h1 className="mb-2 text-3xl font-black text-white">Privacy Policy</h1>
        <p className="mb-10 text-xs text-zinc-500">Last updated: April 2025</p>

        <div className="flex flex-col gap-8 text-sm leading-relaxed text-zinc-400">

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">1. Overview</h2>
            <p>SECfinAPI (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This policy explains what data we collect, how we use it, and your rights regarding your personal information.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">2. Information We Collect</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-zinc-500">
              <li><strong className="text-zinc-400">Account data:</strong> Email address and name when you register.</li>
              <li><strong className="text-zinc-400">Usage data:</strong> API request counts, timestamps, and endpoint usage — used for rate limiting and billing.</li>
              <li><strong className="text-zinc-400">Payment data:</strong> Billing is handled entirely by Stripe. We do not store credit card numbers or payment details.</li>
              <li><strong className="text-zinc-400">Log data:</strong> Server logs including IP address, request path, and response codes for security and debugging purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-zinc-500">
              <li>To provide and maintain the Service</li>
              <li>To authenticate your account and validate your API key</li>
              <li>To enforce rate limits and plan restrictions</li>
              <li>To send transactional emails (account verification, password reset)</li>
              <li>To detect and prevent abuse or fraud</li>
            </ul>
            <p className="mt-3">We do not sell your personal data to third parties. We do not use your data for advertising.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">4. Third-Party Services</h2>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-zinc-500">
              <li><strong className="text-zinc-400">Stripe</strong> — payment processing. Subject to <a href="https://stripe.com/privacy" className="text-zinc-300 underline" target="_blank" rel="noopener noreferrer">Stripe&apos;s Privacy Policy</a>.</li>
              <li><strong className="text-zinc-400">Resend</strong> — transactional email delivery.</li>
              <li><strong className="text-zinc-400">Railway / Vercel</strong> — cloud hosting. Your data is stored on servers in the EU/US depending on configuration.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">5. Data Retention</h2>
            <p>We retain your account data for as long as your account is active. Usage logs are retained for up to 90 days. You may request deletion of your account and associated data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">6. Cookies</h2>
            <p>We do not use tracking cookies or analytics cookies. We use a session token stored in your browser&apos;s localStorage solely for authentication purposes. This token is not shared with third parties.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">7. Your Rights</h2>
            <p className="mb-2">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1.5 text-zinc-500">
              <li>Right to access the personal data we hold about you</li>
              <li>Right to correct inaccurate data</li>
              <li>Right to deletion (&quot;right to be forgotten&quot;)</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <span className="text-zinc-300">support@secfinapi.com</span>.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">8. Security</h2>
            <p>We use industry-standard security measures including HTTPS, hashed passwords, and API key hashing. No method of transmission over the internet is 100% secure, but we take reasonable steps to protect your data.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">9. Children&apos;s Privacy</h2>
            <p>The Service is not directed at children under 16. We do not knowingly collect personal data from children under 16. If you believe we have collected such data, contact us immediately.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">10. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify registered users of material changes via email. The &quot;Last updated&quot; date at the top of this page reflects the most recent revision.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-bold text-zinc-200">11. Contact</h2>
            <p>For privacy-related questions or requests, contact us at <span className="text-zinc-300">support@secfinapi.com</span>.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
