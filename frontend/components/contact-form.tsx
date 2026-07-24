"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Send } from "lucide-react"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold text-foreground">Message sent</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thanks for reaching out. Our team will get back to you within one business day.
        </p>
        <Button
          variant="outline"
          className="mt-6 rounded-full bg-transparent"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName">
          <input id="firstName" name="firstName" required className={inputClass} placeholder="Sarah" />
        </Field>
        <Field label="Last name" htmlFor="lastName">
          <input id="lastName" name="lastName" required className={inputClass} placeholder="Jenkins" />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
            placeholder="sarah@example.com"
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Subject" htmlFor="subject">
          <input id="subject" name="subject" required className={inputClass} placeholder="How can we help?" />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message" htmlFor="message">
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className={`${inputClass} resize-none`}
            placeholder="Tell us a bit more about your question..."
          />
        </Field>
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full rounded-full text-base font-semibold shadow-sm">
        Send Message
        <Send className="ml-1 h-4 w-4" />
      </Button>
    </form>
  )
}

const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}
