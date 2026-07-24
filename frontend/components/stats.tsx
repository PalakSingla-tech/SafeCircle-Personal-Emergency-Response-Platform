const stats = [
  { value: "100K+", label: "Active Users" },
  { value: "20K+", label: "QR Scans" },
  { value: "500+", label: "Partner Hospitals" },
  { value: "99.9%", label: "Availability" },
]

export function Stats() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-primary px-6 py-12 shadow-xl shadow-primary/20 sm:px-12">
          <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
                  {stat.value}
                </dd>
                <p className="mt-2 text-sm font-medium text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
