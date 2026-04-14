import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { PricingTable } from '@/components/landing/PricingTable'
import { ApiExplorer } from '@/components/landing/ApiExplorer'
import { Footer } from '@/components/landing/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111]">
      <Navbar />
      <div className="pt-14">
        <Hero />
        <PricingTable />
        <ApiExplorer />
        <Footer />
      </div>
    </main>
  )
}
