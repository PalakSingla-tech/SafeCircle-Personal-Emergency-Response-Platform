import Link from "next/link";
import { ShieldPlus, HeartPulse, QrCode, Phone } from "lucide-react";
import "./auth.css";

const features = [
  {
    icon: HeartPulse,
    title: "Medical profile",
    description: "Store allergies, conditions, and medications in one secure place.",
  },
  {
    icon: QrCode,
    title: "Instant QR access",
    description: "First responders scan your card and get critical info immediately.",
  },
  {
    icon: Phone,
    title: "Emergency contacts",
    description: "Your trusted circle is notified the moment help is needed.",
  },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col lg:flex-row">
      {/* Decorative panel — desktop */}
      <div className="relative hidden overflow-hidden bg-primary lg:flex lg:w-[52%] xl:w-1/2 xl:flex-col xl:justify-between">
        {/* Animated gradient mesh */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 20%, oklch(1 0 0 / 0.12) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 85% 75%, oklch(0.7 0.12 200 / 0.15) 0%, transparent 50%)",
          }}
        />

        {/* Grid overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow orbs */}
        <div
          aria-hidden="true"
          className="auth-glow-pulse pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="auth-glow-pulse pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-12 xl:p-16">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white shadow-lg backdrop-blur-sm">
                <ShieldPlus className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                SafeCircle
              </span>
            </Link>
          </div>

          <div className="my-10 space-y-10 xl:my-0">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Trusted by 100,000+ people
              </div>
              <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white xl:text-5xl">
                Your emergency info,
                <br />
                <span className="text-white/75">always within reach.</span>
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">
                Join thousands who trust SafeCircle to keep their medical details
                and emergency contacts accessible when every second counts.
              </p>
            </div>

            <ul className="space-y-3">
              {features.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="group flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/15"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white transition-transform group-hover:scale-105">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-white/60">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 text-xs text-white/35">
            © {new Date().getFullYear()} SafeCircle. All rights reserved.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-1 flex-col">
        {/* Subtle background matching marketing site */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.45]"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.55 0.22 264 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.55 0.22 264 / 0.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 70% at 50% 30%, black 30%, transparent 80%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 80% 0%, oklch(0.55 0.22 264 / 0.1) 0%, transparent 60%), radial-gradient(50% 40% at 10% 100%, oklch(0.7 0.12 200 / 0.08) 0%, transparent 55%)",
          }}
        />

        {/* Mobile header */}
        <div className="relative overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-primary" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative flex items-center justify-between px-6 py-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white shadow-sm backdrop-blur-sm">
                <ShieldPlus className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                SafeCircle
              </span>
            </Link>
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/80">
              Secure sign in
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 lg:py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
