"use client"

import { useRef } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { gsap, useGSAP } from "./gsap"

const travelerTypes = [
  {
    title: "Honeymooners",
    tagline: "Private shikaras, candlelight dinners, houseboat mornings",
    image: "/images/honeymoon.png",
    alt: "Couple on a private shikara ride at sunset on Dal Lake",
  },
  {
    title: "Families",
    tagline: "Easy pacing, comfort stays, plans elders & kids both love",
    image: "/images/family.png",
    alt: "Family enjoying a Kashmir meadow together",
  },
  {
    title: "Friends & Adventure",
    tagline: "Gondola rides, snow days, treks, and bonfire nights",
    image: "/images/snow-adventure.png",
    alt: "Friends playing in Gulmarg snow",
  },
  {
    title: "Offbeat Explorers",
    tagline: "Gurez, Doodhpathri, village stays — the Kashmir few see",
    image: "/images/gurez.png",
    alt: "Remote Gurez valley with the Kishanganga river",
  },
]

export function TravelerTypes() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tt-head > *", {
          y: 32,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tt-head", start: "top 80%" },
        })
        gsap.from(".tt-card", {
          y: 60,
          opacity: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tt-grid", start: "top 80%" },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="tt-head mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Custom Packages
          </span>
          <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-balance sm:text-5xl lg:text-6xl">
            Built Around the Way <em className="text-accent not-italic">You</em>{" "}
            Travel
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            No fixed menus, no one-size-fits-all tours. Tell us who&apos;s
            coming and what you dream of — a local expert shapes the route,
            stays, pace, and price around you.
          </p>
        </div>

        <div className="tt-grid mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {travelerTypes.map((type) => (
            <a
              key={type.title}
              href="#contact"
              className="tt-card group relative block aspect-[3/4] overflow-hidden rounded-3xl shadow-md transition-shadow hover:shadow-2xl"
            >
              <Image
                src={type.image}
                alt={type.alt}
                fill
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 transition-colors group-hover:from-black/90" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-heading text-2xl font-semibold text-white">
                  {type.title}
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-white/80">
                  {type.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-foreground">
                  <span className="rounded-full bg-primary px-4 py-2 transition-transform group-hover:scale-105">
                    Craft My Trip
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-transform group-hover:translate-x-1">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </span>
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Solo traveler? Group of 20? Something else entirely?{" "}
          <a
            href="#contact"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            We&apos;ll build it for you too →
          </a>
        </p>
      </div>
    </section>
  )
}
