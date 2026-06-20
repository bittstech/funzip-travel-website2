"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowLeft, ArrowRight, Clock, Check } from "lucide-react"
import { Reveal } from "./reveal"
import type { PublicPackage } from "@/lib/cms/types"
import { fallbackPackages } from "@/lib/cms/fallback-data"

export function Packages({ packages = fallbackPackages }: { packages?: PublicPackage[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    const el = scrollerRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: dir * amount, behavior: "smooth" })
  }

  return (
    <section id="packages" className="relative overflow-hidden py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Curated Journeys
            </span>
            <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-balance sm:text-5xl lg:text-6xl">
              Kashmir Packages Made For You
            </h2>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Handcrafted itineraries with hotels, transport, and sightseeing
              included. Slide through and find the journey that calls you.
            </p>
          </Reveal>

          <div className="hidden gap-3 md:flex">
            <button
              type="button"
              aria-label="Previous packages"
              onClick={() => scrollBy(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next packages"
              onClick={() => scrollBy(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 lg:px-8"
      >
        {packages.map((pkg, i) => (
          <motion.article
            key={pkg.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
            className="group flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:w-[340px]"
          >
            <div className="relative h-52 overflow-hidden">
              <Image
                src={pkg.coverImage.url || "/placeholder.svg"}
                alt={pkg.coverImage.alt}
                fill
                sizes="(min-width: 1024px) 340px, 300px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                {pkg.priceLabel}
              </span>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                <Clock className="h-3.5 w-3.5" />
                {pkg.duration}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-heading text-2xl font-semibold leading-tight">
                {pkg.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {pkg.shortDescription}
              </p>

              <ul className="mt-4 flex flex-col gap-2">
                {(pkg.inclusions.length ? pkg.inclusions : ["Hotels", "Transport", "Sightseeing"])
                  .slice(0, 3)
                  .map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 text-sm text-foreground/80"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Check className="h-3 w-3" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-1 items-end gap-3">
                <Link
                  href={`/packages/${pkg.slug}`}
                  className="flex-1 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
                >
                  View Details
                </Link>
                <a
                  href="/contact"
                  className="flex-1 rounded-full border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Get Quote
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
