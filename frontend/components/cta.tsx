import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card px-6 py-16 text-center shadow-xl sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 0%, oklch(0.95 0.05 264 / 0.8) 0%, transparent 65%)",
            }}
          />
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Be Prepared Before Emergencies Happen.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Join over 100,000 people who trust SafeCircle to speak for them when every second counts.
          </p>
          <div className="mt-9 flex justify-center">
            <Button size="lg" className="rounded-full px-8 text-base font-semibold shadow-md">
              Create Free Account
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
