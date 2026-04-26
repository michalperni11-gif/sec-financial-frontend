import { LegalLayout, LegalSection } from '@/components/layout/LegalLayout'

export const metadata = {
  title: 'Privacy Policy — SECfinAPI',
}

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li style={{ marginBottom: 6 }}>{children}</li>
)

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="April 2026">
      <LegalSection title="1. What we collect">
        <p>We collect the minimum necessary to operate the service:</p>
        <ul style={{ paddingLeft: 20, marginTop: 4 }}>
          <Bullet>Email address and name — to create your account and send you transactional emails.</Bullet>
          <Bullet>API usage counts — to enforce rate limits and show you your usage in the dashboard.</Bullet>
          <Bullet>Payment information — processed by Stripe. We never see or store your card details.</Bullet>
        </ul>
        <p style={{ marginTop: 10 }}>
          We do not collect IP addresses beyond what our hosting provider (Vercel / Railway) logs for standard
          security purposes. We do not use analytics trackers or third-party ad networks.
        </p>
      </LegalSection>

      <LegalSection title="2. How we use it">
        <ul style={{ paddingLeft: 20 }}>
          <Bullet>To authenticate you and deliver your API key.</Bullet>
          <Bullet>
            To send transactional emails (email verification, password reset, billing receipts).
          </Bullet>
          <Bullet>To enforce plan limits and prevent abuse.</Bullet>
        </ul>
        <p style={{ marginTop: 10 }}>
          We do not sell your data. We do not use your email for marketing without explicit opt-in.
        </p>
      </LegalSection>

      <LegalSection title="3. Data retention">
        <p>
          Your account data is retained as long as your account is active. When you delete your account, your
          email, password hash, and API key are permanently deleted. Usage logs are deleted within 90 days.
        </p>
      </LegalSection>

      <LegalSection title="4. Third parties">
        <ul style={{ paddingLeft: 20 }}>
          <Bullet>
            <strong style={{ color: 'var(--fg)' }}>Stripe</strong> — payment processing. Subject to Stripe&apos;s
            privacy policy.
          </Bullet>
          <Bullet>
            <strong style={{ color: 'var(--fg)' }}>Resend</strong> — transactional email delivery. Your email
            address is shared with Resend for this purpose only.
          </Bullet>
          <Bullet>
            <strong style={{ color: 'var(--fg)' }}>Vercel / Railway</strong> — hosting infrastructure. Standard
            server logs may include request metadata.
          </Bullet>
        </ul>
      </LegalSection>

      <LegalSection title="5. Security">
        <p>
          Passwords are hashed with bcrypt and never stored in plain text. API keys are stored as SHA-256 hashes.
          All traffic is encrypted over HTTPS. We do not store payment details.
        </p>
      </LegalSection>

      <LegalSection title="6. Your rights">
        <p>
          You can delete your account at any time from the dashboard settings page. This permanently removes all
          personal data we hold about you. For any other requests, contact us at the email below.
        </p>
      </LegalSection>

      <LegalSection title="7. Contact">
        <p>
          Questions? Email us at{' '}
          <a href="mailto:support@secfinapi.com" style={{ color: 'var(--accent)' }}>
            support@secfinapi.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
