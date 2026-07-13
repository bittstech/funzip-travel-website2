"use client"

import { useRef } from "react"
import { Star, Quote } from "lucide-react"
import { gsap, useGSAP } from "./gsap"

const stats = [
  { value: 2000, suffix: "+", label: "Guests Hosted" },
  { value: 4.9, suffix: "★", label: "Average Rating", decimals: 1 },
  { value: 100, suffix: "%", label: "Native Kashmiri Team" },
  { value: 25, suffix: "+", label: "Valleys & Destinations" },
]

const testimonials = [
  {
    quote:
      "Our driver knew every family on the route — we were invited in for kahwa twice! It never felt like a package tour. It felt like visiting relatives who happened to live in paradise.",
    name: "Priya & Arjun Mehta",
    detail: "Honeymoon Trip · Mumbai",
  },
  {
    quote:
      "I compared quotes from four agencies. Funzip was the best price AND the only one that changed the plan when my mother found long drives tiring. They rearranged everything overnight, free.",
    name: "Rakesh Sharma",
    detail: "Family Trip with Elders · Delhi",
  },
  {
    quote:
      "They took us to Gurez when everyone else offered the same three towns. A village dinner there was the single best travel experience of my life. You can't buy that — you have to know someone.",
    name: "Sneha Kulkarni",
    detail: "Offbeat Explorer · Pune",
  },
]

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // Counters run for everyone (end state = correct numbers)
      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const target = Number(el.dataset.value || 0)
        const decimals = Number(el.dataset.decimals || 0)
        const suffix = el.dataset.suffix || ""
        const counter = { val: 0 }
        gsap.to(counter, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent =
              counter.val.toLocaleString("en-IN", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              }) + suffix
          },
        })
      })

      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tm-head > *", {
          y: 32,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tm-head", start: "top 82%" },
        })
        gsap.from(".tm-card", {
          y: 48,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tm-grid", start: "top 80%" },
        })
        gsap.from(".stat-item", {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".stat-band", start: "top 85%" },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Stats band */}
        <div className="stat-band grid grid-cols-2 gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-item text-center">
              <span
                className="stat-value block font-heading text-4xl font-semibold text-primary sm:text-5xl"
                data-value={stat.value}
                data-suffix={stat.suffix}
                data-decimals={stat.decimals || 0}
              >
                0{stat.suffix}
              </span>
              <span className="mt-2 block text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="tm-head mx-auto mt-20 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Guest Stories
          </span>
          <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-balance sm:text-5xl">
            What Our Guests Say About Home
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Because that&apos;s what Kashmir becomes once you&apos;ve traveled
            it with the people who live here.
          </p>
        </div>

        <div className="tm-grid mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <figure
              key={item.name}
              className="tm-card flex flex-col rounded-3xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg"
            >
              <Quote className="h-8 w-8 text-primary/30" />
              <div className="mt-3 flex gap-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <span className="block font-semibold">{item.name}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {item.detail}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
