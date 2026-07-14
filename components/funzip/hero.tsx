"use client"

import { useRef } from "react"
import Image from "next/image"
import {
  ArrowRight,
  MessageCircle,
  MapPin,
  BadgeIndianRupee,
  Route,
  Headset,
} from "lucide-react"
import { gsap, useGSAP } from "./gsap"
import type { SiteSettingsPublic } from "@/lib/cms/types"
import { fallbackSettings } from "@/lib/cms/fallback-data"

const headlineLines = ["Kashmir, shown by", "the people born here."]

const trustItems = [
  { icon: MapPin, label: "100% Native Kashmiri Team" },
  { icon: BadgeIndianRupee, label: "Best Direct Local Prices" },
  { icon: Route, label: "Custom Trips, Your Pace" },
  { icon: Headset, label: "24/7 On-Trip Support" },
]

export function Hero({
  settings = fallbackSettings,
}: {
  settings?: SiteSettingsPublic
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const whatsapp = settings.whatsappNumber || "910000000000"
  const whatsappMessage = encodeURIComponent(
    "Hi Funzip! I'm planning a Kashmir trip — can you build me a custom itinerary with your best direct price?",
  )

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".hero-img",
          { scale: 1.12 },
          { scale: 1, duration: 3.2, ease: "power2.out" },
        )

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.7, delay: 0.3 })
          .from(
            ".hero-line",
            { yPercent: 110, duration: 1, stagger: 0.14, ease: "power4.out" },
            "-=0.35",
          )
          .from(".hero-sub", { y: 24, opacity: 0, duration: 0.8 }, "-=0.5")
          .from(".hero-ctas", { y: 20, opacity: 0, duration: 0.7 }, "-=0.45")
          .from(".hero-note", { opacity: 0, duration: 0.6 }, "-=0.2")
          .from(
            ".hero-trust-item",
            { y: 18, opacity: 0, duration: 0.55, stagger: 0.08 },
            "-=0.4",
          )

        gsap.to(".hero-img", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="hero-img absolute inset-0">
          <Image
            src="/naweedey-XHG0uFAlEGM-unsplash.jpg"
            alt="Golden-hour view of a Kashmir valley with snow-capped mountains and Dal Lake"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 to-transparent" />
      </div>

      {/* Content — one left axis, vertically centered */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="hero-eyebrow flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary sm:text-sm">
            <span className="h-px w-10 bg-primary" aria-hidden />
            Funzip · Native Kashmiri Hosts
          </p>

          <h1 className="mt-6 font-heading text-5xl font-semibold leading-[1.04] text-white drop-shadow-lg sm:text-6xl md:text-7xl lg:text-8xl">
            {headlineLines.map((line) => (
              <span
                key={line}
                className="block overflow-hidden pb-[0.1em] -mb-[0.1em]"
              >
                <span className="hero-line block will-change-transform">
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-sub mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
            Custom trips for every kind of traveler — planned by native
            experts, priced direct from the source, and hosted with the warmth
            of a Kashmiri home.
          </p>

          {/* Equal-width, equal-height CTA pair on a single grid row */}
          <div className="hero-ctas mt-9 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href="#contact"
              className="group inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/40 transition-transform hover:scale-[1.03]"
            >
              Get My Free Itinerary
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/35 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" />
              Chat With a Local
            </a>
          </div>

          <p className="hero-note mt-5 text-xs text-white/60 sm:text-sm">
            Free plan &amp; quote within hours · No advance needed
          </p>
        </div>
      </div>

      {/* Trust strip — in flow, same container axis */}
      <div className="relative z-10 border-t border-white/15 bg-black/30 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-4 px-4 py-5 sm:px-6 lg:grid-cols-4 lg:gap-x-10 lg:px-8">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="hero-trust-item flex items-center gap-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <item.icon className="h-4 w-4" />
              </span>
              <span className="text-xs font-medium leading-snug text-white/85 sm:text-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
