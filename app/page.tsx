import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { ApiExplorer } from '@/components/landing/ApiExplorer'
import { PricingTable } from '@/components/landing/PricingTable'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ApiExplorer />
        <PricingTable />
      </main>
      <Footer />
    </>
  )
}
