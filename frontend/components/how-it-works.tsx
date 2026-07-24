import { UserPlus, Contact, QrCode, Siren } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Create Profile",
    description: "Add your medical details, allergies, and conditions in a few guided steps.",
  },
  {
    icon: Contact,
    title: "Add Emergency Contacts",
    description: "Invite the people you trust so they're notified the instant you need help.",
  },
  {
    icon: QrCode,
    title: "Generate QR Card",
    description: "Instantly create a secure QR card to print, save, or keep in your wallet.",
  },
  {
    icon: Siren,
    title: "Emergency Access",
    description: "Responders scan your code and see life-saving info in seconds — no login needed.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Set up once. Protected forever.
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Four simple steps stand between you and complete peace of mind.
          </p>
        </div>

        <div className="relative mt-16">
          {/* connecting line */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />
          <ol className="grid gap-10 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-md">
                  <step.icon className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
