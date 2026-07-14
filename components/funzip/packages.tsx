"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Phone } from "lucide-react"
import { gsap, useGSAP } from "./gsap"
import type { ImageRef, PublicPackage, SiteSettingsPublic } from "@/lib/cms/types"
import { fallbackPackages, fallbackSettings } from "@/lib/cms/fallback-data"

function CardImageCarousel({
  images,
  slug,
  title,
}: {
  images: ImageRef[]
  slug: string
  title: string
}) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const image = images[Math.min(index, count - 1)]

  return (
    <div className="group/img relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
      <Image
        src={image.url || "/placeholder.svg"}
        alt={image.alt || title}
        fill
        sizes="288px"
        className="object-cover transition-transform duration-500 group-hover/img:scale-105"
      />

      {/* Whole image links to the package */}
      <Link
        href={`/packages/${slug}`}
        aria-label={`View ${title}`}
        className="absolute inset-0 z-[1]"
      />

      {count > 1 ? (
        <>
          {index > 0 ? (
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="absolute left-2 top-1/2 z-[2] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition-opacity sm:opacity-0 sm:group-hover/img:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : null}
          {index < count - 1 ? (
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setIndex((i) => Math.min(count - 1, i + 1))}
              className="absolute right-2 top-1/2 z-[2] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition-opacity sm:opacity-0 sm:group-hover/img:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}

          <div className="absolute inset-x-0 bottom-2.5 z-[2] flex items-center justify-center gap-1.5">
            {images.map((img, i) => (
              <button
                key={img.url + i}
                type="button"
                aria-label={`Photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

export function Packages({
  packages = fallbackPackages,
  settings = fallbackSettings,
}: {
  packages?: PublicPackage[]
  settings?: SiteSettingsPublic
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const phone = (settings.phonePrimary || "+91 00000 00000").replace(/\s/g, "")

  const scrollBy = (dir: number) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" })
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pkg-head > *", {
          y: 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pkg-head", start: "top 82%" },
        })
        gsap.from(".pkg-card", {
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pkg-row", start: "top 82%" },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="packages"
      className="relative overflow-hidden py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header: title left, View All right */}
        <div className="pkg-head flex items-end justify-between gap-4">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Curated Journeys
            </span>
            <h2 className="mt-2 font-heading text-4xl font-semibold leading-tight text-balance sm:text-5xl">
              Kashmir Packages
            </h2>
          </div>
          <Link
            href="/packages"
            className="group flex shrink-0 items-center gap-2 text-sm font-semibold text-primary"
          >
            View All
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        {/* Card row */}
        <div className="pkg-row relative mt-8">
          {packages.length === 0 ? (
            <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-border bg-card/50">
              <p className="text-muted-foreground">
                No packages available at the moment.
              </p>
            </div>
          ) : (
            <>
              <div
                ref={scrollerRef}
                className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
              >
                {packages.map((pkg, i) => {
                  const images = [pkg.coverImage, ...pkg.galleryImages].slice(0, 5)

                  return (
                    <article
                      key={`${pkg.id || pkg.slug}-${i}`}
                      className="pkg-card w-[min(78vw,17.5rem)] shrink-0 snap-start"
                    >
                      <CardImageCarousel
                        images={images}
                        slug={pkg.slug}
                        title={pkg.title}
                      />

                      <p className="mt-3 text-xs font-medium text-muted-foreground">
                        {pkg.duration || "Custom duration"}
                        {pkg.location ? ` · ${pkg.location}` : ""}
                      </p>

                      <Link href={`/packages/${pkg.slug}`}>
                        <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors hover:text-primary">
                          {pkg.title}
                        </h3>
                      </Link>

                      <p className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">
                        Starting from
                      </p>
                      <p className="text-xl font-bold text-foreground">
                        {pkg.priceLabel}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          /person
                        </span>
                      </p>

                      <div className="mt-3 flex gap-2">
                        <a
                          href={`tel:${phone}`}
                          aria-label={`Call about ${pkg.title}`}
                          className="flex h-11 w-12 shrink-0 items-center justify-center rounded-xl border border-primary text-primary transition-colors hover:bg-primary/10"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                        <a
                          href="#contact"
                          className="flex h-11 flex-1 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-transform hover:scale-[1.02]"
                        >
                          Request Callback
                        </a>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* Floating carousel arrows */}
              <button
                type="button"
                aria-label="Previous packages"
                onClick={() => scrollBy(-1)}
                className="absolute -left-3 top-[30%] z-[2] hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-colors hover:bg-primary hover:text-primary-foreground sm:flex"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next packages"
                onClick={() => scrollBy(1)}
                className="absolute -right-3 top-[30%] z-[2] hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg transition-colors hover:bg-primary hover:text-primary-foreground sm:flex"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
