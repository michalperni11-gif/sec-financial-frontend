import { TopNav } from '@/components/layout/TopNav'
import { StructuredData } from '@/components/seo/StructuredData'
import { Hero } from '@/components/landing-v2/Hero'
import { DemoWidget } from '@/components/landing-v2/DemoWidget'
import { Features } from '@/components/landing-v2/Features'
import { Pricing } from '@/components/landing-v2/Pricing'
import { FAQ_Section } from '@/components/landing-v2/FAQ'
import { Footer } from '@/components/landing-v2/Footer'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://sec-financial-api-production.up.railway.app'

interface Stats {
  companies: number
  facts: number
}

async function fetchStats(): Promise<Stats> {
  const adminKey = process.env.SECBASE_ADMIN_KEY
  if (!adminKey) {
    return { companies: 10000, facts: 0 }
  }
  try {
    const res = await fetch(`${BASE}/admin/status`, {
      headers: { 'X-Admin-Key': adminKey },
      next: { revalidate: 300 },
    })
    if (!res.ok) return { companies: 10000, facts: 0 }
    const data = await res.json()
    return {
      companies: data.db?.total_companies ?? 10000,
      facts: data.db?.total_facts ?? 0,
    }
  } catch {
    return { companies: 10000, facts: 0 }
  }
}

export default async function HomePage() {
  const stats = await fetchStats()

  return (
    <>
      <StructuredData />
      <TopNav />
      <main>
        <Hero companyCount={stats.companies} />
        <DemoWidget />
        <Features />
        <Pricing />
        <FAQ_Section />
      </main>
      <Footer />
    </>
  )
}
