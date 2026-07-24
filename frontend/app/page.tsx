import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Stats } from "@/components/stats"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div id="home" className="scroll-mt-20">
          <Hero />
        </div>
        <div id="features" className="scroll-mt-20">
          <Features />
        </div>
        <div id="how-it-works" className="scroll-mt-20">
          <HowItWorks />
        </div>
        <Stats />
        <Testimonials />
        <div id="pricing" className="scroll-mt-20">
          <Pricing />
        </div>
        <CTA />
      </main>
      <div id="contact" className="scroll-mt-20">
        <Footer />
      </div>
    </div>
  )
}
