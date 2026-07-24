import {
  HeartPulse,
  Phone,
  QrCode,
  BellRing,
  Users,
  MapPin,
  Lock,
  Hospital,
} from "lucide-react"

const features = [
  {
    icon: HeartPulse,
    title: "Medical Profile",
    description: "Store allergies, conditions, medications, and blood type in one secure, always-updated place.",
    tone: "primary",
  },
  {
    icon: Phone,
    title: "Emergency Contacts",
    description: "Keep your trusted people one tap away so responders can reach loved ones instantly.",
    tone: "chart",
  },
  {
    icon: QrCode,
    title: "QR Emergency Card",
    description: "A printable, wallet-ready QR card that unlocks your critical info in seconds.",
    tone: "primary",
  },
  {
    icon: BellRing,
    title: "Instant Alerts",
    description: "Notify your entire circle automatically the moment your card is scanned.",
    tone: "destructive",
  },
  {
    icon: Users,
    title: "Family Management",
    description: "Manage profiles for children, parents, and dependents from a single account.",
    tone: "chart",
  },
  {
    icon: MapPin,
    title: "Live Location Sharing",
    description: "Share your real-time location with contacts during an active emergency.",
    tone: "primary",
  },
  {
    icon: Lock,
    title: "Privacy & Security",
    description: "End-to-end encryption keeps your data private until it is truly needed.",
    tone: "primary",
  },
  {
    icon: Hospital,
    title: "Hospital Ready",
    description: "Formatted for first responders and ER staff to read at a glance.",
    tone: "destructive",
  },
] as const

const toneStyles = {
  primary: "bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  destructive: "bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-primary-foreground",
  chart: "bg-chart-4/15 text-chart-4 group-hover:bg-chart-4 group-hover:text-primary-foreground",
}

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need in a crisis, ready before it happens
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            A complete emergency toolkit designed to speak for you when you can&apos;t.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${toneStyles[feature.tone]}`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
