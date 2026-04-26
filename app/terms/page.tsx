import { LegalLayout, LegalSection } from '@/components/layout/LegalLayout'

export const metadata = {
  title: 'Terms of Service — SECfinAPI',
}

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li style={{ marginBottom: 6 }}>{children}</li>
)

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="April 2026">
      <LegalSection title="1. The service">
        <p>
          SECfinAPI provides standardized financial data sourced from SEC EDGAR filings via a REST API. We are not
          affiliated with the U.S. Securities and Exchange Commission. Data is provided for informational purposes
          only and does not constitute financial advice.
        </p>
      </LegalSection>

      <LegalSection title="2. Your account">
        <p>
          You must provide a valid email address to create an account. You are responsible for keeping your API key
          confidential. Do not share your key in public repositories or client-side code. If your key is
          compromised, regenerate it immediately from the dashboard.
        </p>
      </LegalSection>

      <LegalSection title="3. Acceptable use">
        <p>You may use the API for any lawful purpose including personal projects, research, and commercial applications. You may not:</p>
        <ul style={{ paddingLeft: 20, marginTop: 4 }}>
          <Bullet>Resell or sublicense raw API access to third parties without written permission.</Bullet>
          <Bullet>Attempt to circumvent rate limits by using multiple accounts.</Bullet>
          <Bullet>Use the API in a way that could damage, disable, or impair the service.</Bullet>
          <Bullet>Scrape or bulk-export data in a way that exceeds your plan limits.</Bullet>
        </ul>
      </LegalSection>

      <LegalSection title="4. Rate limits and plans">
        <p>
          Each plan includes defined request limits. Exceeding your plan limit returns a{' '}
          <span className="mono">429</span> response. Consistent abuse of rate limits may result in account
          suspension. Plan limits are subject to change with 30 days notice.
        </p>
      </LegalSection>

      <LegalSection title="5. Billing">
        <p>
          Paid plans are billed monthly via Stripe. You may cancel at any time from the dashboard — your plan
          remains active until the end of the billing period. We do not offer refunds for partial months. Failed
          payments will result in a grace period before access is restricted.
        </p>
      </LegalSection>

      <LegalSection title="6. Data accuracy">
        <p>
          Financial data is sourced directly from SEC EDGAR filings. We process and standardize it but cannot
          guarantee 100% accuracy. Do not use this data as the sole basis for financial decisions. Always verify
          critical data against primary SEC sources.
        </p>
      </LegalSection>

      <LegalSection title="7. Uptime and availability">
        <p>
          We aim for high availability but do not guarantee any specific uptime SLA on free or basic plans.
          Enterprise plans include an uptime SLA. We are not liable for losses caused by service downtime or data
          unavailability.
        </p>
      </LegalSection>

      <LegalSection title="8. Termination">
        <p>
          We reserve the right to suspend or terminate accounts that violate these terms. You may delete your
          account at any time from the dashboard. Upon termination, your API key is immediately invalidated.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of liability">
        <p>
          The service is provided &quot;as is&quot; without warranty of any kind. To the maximum extent permitted
          by law, SECfinAPI is not liable for any indirect, incidental, or consequential damages arising from your
          use of the service.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Questions about these terms? Email{' '}
          <a href="mailto:support@secfinapi.com" style={{ color: 'var(--accent)' }}>
            support@secfinapi.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
