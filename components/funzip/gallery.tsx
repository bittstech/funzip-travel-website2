"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Reveal } from "./reveal"
import type { PublicGalleryImage } from "@/lib/cms/types"
import { fallbackGalleryImages } from "@/lib/cms/fallback-data"

function getSpanClass(i: number, total: number): string {
  // Only apply special spans when there are enough images to fill the layout
  if (total >= 6 && i === 0) return "md:row-span-2"
  if (total >= 6 && i === 5) return "md:row-span-2"
  if (total >= 4 && i === 3) return "md:col-span-2"
  return ""
}

export function Gallery({
  images = fallbackGalleryImages,
}: {
  images?: PublicGalleryImage[]
}) {
  const displayImages = images.slice(0, 8)

  return (
    <section id="gallery" className="relative overflow-hidden bg-secondary/40 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Gallery
          </span>
          <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-balance sm:text-5xl lg:text-6xl">
            Moments From Paradise
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            From peaceful lakes to snow-covered mountains, explore the beauty
            that makes Kashmir unforgettable.
          </p>
        </Reveal>

        {displayImages.length === 0 ? (
          <div className="mt-12 flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 text-center">
            <p className="text-muted-foreground">Gallery images will appear here once added.</p>
          </div>
        ) : (
          <div className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-4">
            {displayImages.map((item, i) => (
              <motion.figure
                key={item.id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
                className={`group relative overflow-hidden rounded-2xl ${getSpanClass(i, displayImages.length)}`}
              >
                <Image
                  src={item.image.url || "/placeholder.svg"}
                  alt={item.altText || item.image.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                {item.title ? (
                  <figcaption className="absolute bottom-4 left-4 right-4 translate-y-1 text-sm font-semibold leading-tight text-white opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 line-clamp-2">
                    {item.title}
                  </figcaption>
                ) : null}
              </motion.figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
