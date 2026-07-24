import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "When my son had an allergic reaction at school, the staff scanned his SafeCircle card and knew exactly what to do. It genuinely saved precious minutes.",
    name: "Maria Alvarez",
    role: "Parent of two",
    avatar: "/avatar-1.png",
  },
  {
    quote:
      "As someone with a chronic condition, I finally feel safe traveling alone. My medical info is always one scan away, wherever I am.",
    name: "James Whitfield",
    role: "Frequent traveler",
    avatar: "/avatar-2.png",
  },
  {
    quote:
      "In the ER, seconds matter. Patients arriving with a SafeCircle card give us instant, accurate history — it's a real difference maker.",
    name: "Dr. Alan Pierce",
    role: "Emergency Physician",
    avatar: "/avatar-3.png",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Testimonials</p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by families and trusted by professionals
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <img
                  src={t.avatar || "/placeholder.svg"}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
