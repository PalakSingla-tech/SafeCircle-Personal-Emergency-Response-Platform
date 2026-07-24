import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { Mail, MessageCircle, Phone, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact SafeCircle — We're Here to Help",
  description:
    "Get in touch with the SafeCircle team. Questions about medical profiles, QR emergency cards, or your account? We'd love to help.",
}

const details = [
  { icon: Mail, label: "Email", value: "support@safecircle.com" },
  { icon: Phone, label: "Phone", value: "+1 (800) 555-0142" },
  { icon: MessageCircle, label: "Live chat", value: "Available in-app, 24/7" },
  { icon: Clock, label: "Response time", value: "Within 1 business day" },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 sm:pt-32">
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Contact</p>
            <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              We&apos;re here when you need us
            </h1>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Have a question about your medical profile, QR card, or plan? Send us a message and our team
              will get back to you quickly.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="flex flex-col gap-4">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <d.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {d.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
