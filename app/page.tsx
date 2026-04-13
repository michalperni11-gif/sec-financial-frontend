import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { PricingTable } from '@/components/landing/PricingTable'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturesGrid />
        <PricingTable />
      </main>
      <Footer />
    </>
  )
}
