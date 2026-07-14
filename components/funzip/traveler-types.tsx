"use client"

import { useRef } from "react"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { gsap, useGSAP } from "./gsap"

const travelerTypes = [
  {
    title: "Honeymooners",
    tagline:
      "Private shikaras at sunset, candlelight dinners on a houseboat, mornings wrapped in mountain mist.",
    chips: ["Private Shikara", "Houseboat Stay", "Candlelight Dinner"],
    image: "/images/honeymoon.png",
    alt: "Couple on a private shikara ride at sunset on Dal Lake",
  },
  {
    title: "Families",
    tagline:
      "Easy pacing, comfortable stays, and plans that keep grandparents and kids equally delighted.",
    chips: ["Comfort Hotels", "Gentle Pacing", "Kid & Elder Friendly"],
    image: "/images/family.png",
    alt: "Family enjoying a Kashmir meadow together",
  },
  {
    title: "Friends & Adventure",
    tagline:
      "Gondola rides above the clouds, snow days in Gulmarg, river rafting, and bonfire nights.",
    chips: ["Gulmarg Gondola", "Snow Days", "Rafting & Treks"],
    image: "/images/snow-adventure.png",
    alt: "Friends playing in Gulmarg snow",
  },
  {
    title: "Offbeat Explorers",
    tagline:
      "Gurez, Doodhpathri, Yusmarg, village stays — the Kashmir that never makes it to brochures.",
    chips: ["Gurez Valley", "Village Stays", "Hidden Trails"],
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

        const steps = gsap.utils.toArray<HTMLElement>(".tt-step")
        const cards = gsap.utils.toArray<HTMLElement>(".tt-card")
        const veils = gsap.utils.toArray<HTMLElement>(".tt-veil")

        steps.forEach((step, i) => {
          if (i === 0) return
          // Incoming card settles flat as it slides up over the deck
          gsap.fromTo(
            cards[i],
            { scale: 0.95, rotate: i % 2 === 0 ? 2.5 : -2.5 },
            {
              scale: 1,
              rotate: 0,
              ease: "none",
              scrollTrigger: {
                trigger: step,
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            },
          )
          // The card underneath recedes and dims while being covered
          gsap.to(cards[i - 1], {
            scale: 0.93,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: step,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          })
          gsap.to(veils[i - 1], {
            opacity: 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: step,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          })
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative py-20 lg:pt-28 lg:pb-10">
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
            No fixed menus, no one-size-fits-all tours. Keep scrolling — one of
            these decks is yours, and a local expert shapes it around you.
          </p>
        </div>
      </div>

      {/* Sticky card deck: each step pins while the next stacks on top */}
      <div className="tt-deck relative mt-6">
        {travelerTypes.map((type, i) => (
          <div
            key={type.title}
            className="tt-step sticky top-0 flex h-[100svh] items-center justify-center"
            style={{ zIndex: i + 1 }}
          >
            <article
              className="tt-card relative h-[72svh] max-h-[680px] w-[min(92vw,64rem)] overflow-hidden rounded-[2rem] shadow-2xl will-change-transform"
              style={{ marginTop: i * 16 }}
            >
              <Image
                src={type.image}
                alt={type.alt}
                fill
                sizes="(min-width: 1024px) 1024px, 92vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/15" />

              {/* Ghost index */}
              <span
                aria-hidden
                className="absolute right-6 top-4 font-heading text-7xl font-semibold text-white/20 sm:right-10 sm:text-8xl"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  {String(i + 1).padStart(2, "0")} / 04 · Custom Package
                </span>
                <h3 className="mt-2 font-heading text-3xl font-semibold text-white sm:text-5xl">
                  {type.title}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
                  {type.tagline}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {type.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <a
                  href="#contact"
                  className="group mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
                >
                  Craft My {type.title === "Families" ? "Family " : ""}Trip
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              {/* Dimming veil, driven by GSAP while the next card covers this one */}
              <div className="tt-veil pointer-events-none absolute inset-0 bg-black opacity-0" />
            </article>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Solo traveler? Group of 20? Something else entirely?{" "}
        <a
          href="#contact"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          We&apos;ll build it for you too →
        </a>
      </p>
    </section>
  )
}
