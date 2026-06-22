"use client"

import { useActionState } from "react"
import { Phone, MessageCircle, Mail, MapPin, Send } from "lucide-react"
import { Reveal } from "./reveal"
import { createLeadAction, type LeadFormState } from "@/app/actions"
import type { SiteSettingsPublic } from "@/lib/cms/types"
import { fallbackSettings } from "@/lib/cms/fallback-data"

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

const initialState: LeadFormState = {
  ok: false,
  message: "",
}

export function Contact({
  settings = fallbackSettings,
  sourcePage = "/",
}: {
  settings?: SiteSettingsPublic
  sourcePage?: string
}) {
  const [state, formAction, pending] = useActionState(
    createLeadAction,
    initialState,
  )
  const phone = settings.phonePrimary || "+91 00000 00000"
  const whatsapp = settings.whatsappNumber || "910000000000"

  return (
    <section id="contact" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary/70 via-card to-background shadow-xl sm:rounded-[2rem]">
            <div className="grid min-w-0 lg:grid-cols-2">
              <div className="flex min-w-0 flex-col justify-between gap-8 p-5 sm:p-8 lg:p-12">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    Let&apos;s Plan Together
                  </span>
                  <h2 className="mt-3 font-heading text-3xl font-semibold leading-tight text-balance sm:text-5xl">
                    Ready to Plan Your Kashmir Trip?
                  </h2>
                  <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                    Tell us your travel dates, number of people, and dream
                    destinations. Our team will create a personalized Kashmir
                    itinerary for you.
                  </p>
                </div>

                <ul className="flex flex-col gap-4">
                  <li className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 text-sm font-medium text-foreground">
                      {phone}
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 text-sm font-medium text-foreground">
                      WhatsApp: {phone}
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 text-sm font-medium text-foreground">
                      {settings.email || "hello@funzip.travel"}
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 text-sm font-medium text-foreground">
                      {settings.address || "Kashmir, India"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="min-w-0 bg-card/60 p-5 backdrop-blur sm:p-8 lg:p-12">
                {state.ok ? (
                  <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Send className="h-7 w-7" />
                    </span>
                    <h3 className="font-heading text-2xl font-semibold">
                      Thank you!
                    </h3>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      {state.message}
                    </p>
                  </div>
                ) : (
                  <form action={formAction} className="flex flex-col gap-4">
                    <input type="hidden" name="sourcePage" value={sourcePage} />
                    <input type="hidden" name="sourceType" value="contact_form" />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        required
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        aria-label="Full Name"
                        className={inputClass}
                      />
                      <input
                        required
                        name="phone"
                        type="tel"
                        placeholder="Phone Number"
                        aria-label="Phone Number"
                        className={inputClass}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        name="travelMonth"
                        type="text"
                        placeholder="Travel Month"
                        aria-label="Travel Month"
                        className={inputClass}
                      />
                      <input
                        name="numberOfPeople"
                        type="number"
                        min={1}
                        placeholder="Number of People"
                        aria-label="Number of People"
                        className={inputClass}
                      />
                    </div>
                    <input
                      name="travelLocation"
                      type="text"
                      placeholder="Preferred Destination"
                      aria-label="Preferred Destination"
                      className={inputClass}
                    />
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Message"
                      aria-label="Message"
                      className={`${inputClass} resize-none`}
                    />

                    {state.message && !state.ok ? (
                      <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                        {state.message}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={pending}
                      className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70"
                    >
                      {pending ? "Sending..." : "Get Free Quote"}
                      <Send className="h-4 w-4" />
                    </button>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <a
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat on WhatsApp
                      </a>
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                      >
                        <Phone className="h-4 w-4" />
                        Call Now
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
