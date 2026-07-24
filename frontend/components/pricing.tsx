import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to get protected today.",
    features: ["1 medical profile", "3 emergency contacts", "Digital QR card", "Instant scan alerts"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Premium",
    price: "$6",
    period: "/month",
    description: "Advanced protection for individuals on the go.",
    features: [
      "Unlimited emergency contacts",
      "Printable & wallet QR cards",
      "Live location sharing",
      "Priority responder access",
      "Medical document storage",
    ],
    cta: "Start Premium",
    featured: true,
  },
  {
    name: "Family",
    price: "$12",
    period: "/month",
    description: "Keep everyone you love covered under one plan.",
    features: [
      "Up to 6 family profiles",
      "All Premium features",
      "Shared family dashboard",
      "Dependent management",
      "24/7 priority support",
    ],
    cta: "Protect Family",
    featured: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent plans
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Start free. Upgrade any time. Cancel whenever you want.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-8 shadow-sm transition-all ${
                plan.featured
                  ? "border-primary bg-card shadow-xl shadow-primary/10 lg:-translate-y-3"
                  : "border-border bg-card"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              <Button
                className={`mt-6 w-full rounded-full font-semibold ${
                  plan.featured ? "" : "bg-foreground text-background hover:bg-foreground/90"
                }`}
                variant={plan.featured ? "default" : "default"}
              >
                {plan.cta}
              </Button>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
