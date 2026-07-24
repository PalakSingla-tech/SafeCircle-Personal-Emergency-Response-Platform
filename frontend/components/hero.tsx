import { Button } from "@/components/ui/button"
import { ArrowRight, Play, ShieldCheck, HeartPulse, Droplet, Phone, QrCode, Activity } from "lucide-react"

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-28">
      {/* grid + glow background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.55 0.22 264 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.55 0.22 264 / 0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 80%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 45% at 78% 5%, oklch(0.6 0.18 264 / 0.18) 0%, transparent 60%), radial-gradient(45% 40% at 12% 8%, oklch(0.7 0.12 200 / 0.14) 0%, transparent 55%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="text-center lg:text-left">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur lg:mx-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Trusted personal emergency network
          </div>

          <h1 className="mt-6 text-balance font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.75rem]">
            Your Emergency Info,{" "}
            <span className="relative whitespace-nowrap text-primary">
              Available
              <svg
                aria-hidden="true"
                viewBox="0 0 300 12"
                className="absolute -bottom-1 left-0 h-2 w-full text-primary/30"
                preserveAspectRatio="none"
              >
                <path d="M2 9 C 75 2, 225 2, 298 9" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>{" "}
            When You Can&apos;t Speak.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0">
            SafeCircle instantly provides life-saving medical information and emergency contacts using a
            secure QR code — accessible by first responders the moment it matters most.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <Button size="lg" className="w-full rounded-full px-7 text-base font-semibold shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] sm:w-auto">
              Get Started
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-full border-border bg-card px-7 text-base font-semibold sm:w-auto"
            >
              <Play className="mr-1 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground lg:justify-start">
            <div className="flex -space-x-2">
              {["/avatar-1.png", "/avatar-2.png", "/avatar-3.png"].map((src) => (
                <img
                  key={src}
                  src={src || "/placeholder.svg"}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <span>
              <span className="font-semibold text-foreground">100,000+</span> people protected
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <ProfileMockup />
        </div>
      </div>
    </section>
  )
}

function ProfileMockup() {
  return (
    <div className="relative">
      {/* glow */}
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-primary/10 blur-3xl" />

      {/* main card */}
      <div className="relative rounded-[2rem] border border-border bg-card p-5 shadow-2xl shadow-primary/10">
        {/* header */}
        <div className="flex items-center justify-between rounded-2xl bg-primary p-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-foreground/15">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-primary-foreground/70">
                Medical ID
              </p>
              <p className="font-display text-lg font-bold leading-tight">Sarah Jenkins</p>
            </div>
          </div>
          <span className="rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[11px] font-semibold">
            Active
          </span>
        </div>

        {/* vitals */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Vital icon={Droplet} label="Blood" value="O+" tone="destructive" />
          <Vital icon={HeartPulse} label="Pulse" value="72 bpm" tone="primary" />
          <Vital icon={Activity} label="Status" value="Stable" tone="chart" />
        </div>

        {/* allergies */}
        <div className="mt-3 rounded-2xl border border-border bg-muted/50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Allergies
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Penicillin", "Peanuts", "Latex"].map((a) => (
              <span
                key={a}
                className="rounded-full border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"
              >
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* contact + QR */}
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Emergency Contact
              </p>
              <p className="text-sm font-semibold text-foreground">David Jenkins · Spouse</p>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
            <QrCode className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* floating scan chip */}
      <div className="absolute -left-4 top-24 hidden rounded-2xl border border-border bg-card/90 px-3 py-2 shadow-xl backdrop-blur sm:flex sm:items-center sm:gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chart-4 opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-chart-4" />
        </span>
        <span className="text-xs font-semibold text-foreground">Scanned by responder</span>
      </div>

      {/* floating alert chip */}
      <div className="absolute -right-3 bottom-16 hidden rounded-2xl border border-border bg-card/90 px-3 py-2 shadow-xl backdrop-blur sm:flex sm:items-center sm:gap-2">
        <BellDot />
        <span className="text-xs font-semibold text-foreground">Circle notified</span>
      </div>
    </div>
  )
}

function Vital({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType
  label: string
  value: string
  tone: "primary" | "destructive" | "chart"
}) {
  const tones = {
    primary: "bg-accent text-primary",
    destructive: "bg-destructive/10 text-destructive",
    chart: "bg-chart-4/15 text-chart-4",
  }
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-2 text-sm font-bold text-foreground">{value}</p>
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  )
}

function BellDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
    </span>
  )
}
