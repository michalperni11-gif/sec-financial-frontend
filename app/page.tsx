import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { PricingTable } from '@/components/landing/PricingTable'
import { ApiExplorer } from '@/components/landing/ApiExplorer'
import { Footer } from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#111111]">
        <Hero />
        <FeaturesGrid />
        <PricingTable />
        <ApiExplorer />
      </main>
      <Footer />
    </>
  )
}
