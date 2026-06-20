"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { MapPin, Route, Hotel, MessageCircle } from "lucide-react"
import type { PublicHeroSlide } from "@/lib/cms/types"
import { fallbackHeroSlides } from "@/lib/cms/fallback-data"

const trustItems = [
  { icon: MapPin, label: "Local Travel Experts" },
  { icon: Route, label: "Custom Itineraries" },
  { icon: Hotel, label: "Hotel + Transport + Sightseeing" },
  { icon: MessageCircle, label: "Quick WhatsApp Support" },
]

export function Hero({ slides = fallbackHeroSlides }: { slides?: PublicHeroSlide[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const slide = slides[0] || fallbackHeroSlides[0]
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} id="home" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      {/* Parallax background */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src={slide.mobileImage?.url || slide.image.url}
          alt={slide.mobileImage?.alt || slide.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/65" />
      </motion.div>

      {/* Floating clouds */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="animate-float-cloud absolute left-[8%] top-[18%] h-24 w-56 rounded-full bg-white/20 blur-3xl" />
        <div className="animate-float-cloud absolute right-[12%] top-[30%] h-20 w-72 rounded-full bg-white/15 blur-3xl [animation-delay:3s]" />
        <div className="animate-float-cloud absolute left-[30%] top-[10%] h-16 w-48 rounded-full bg-white/10 blur-3xl [animation-delay:6s]" />
      </div>

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-5 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md"
        >
          Kashmir Tour Specialists
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-5xl font-semibold leading-[1.05] text-balance text-white drop-shadow-lg sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {slide.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/90 sm:text-lg md:text-xl"
        >
          {slide.subtitle ||
            "Handcrafted Kashmir tour packages for families, couples, honeymooners, and adventure travelers."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href={slide.ctaUrl || "/packages"}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/40 transition-transform hover:scale-105 sm:w-auto"
          >
            {slide.ctaText || "Explore Packages"}
          </a>
          <a
            href="/contact"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:w-auto"
          >
            Plan My Kashmir Trip
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-4 text-center backdrop-blur-md"
            >
              <item.icon className="h-5 w-5 text-primary-foreground" />
              <span className="text-xs font-medium leading-tight text-white/90">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/50 p-1.5">
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-white"
          />
        </div>
      </motion.div>
    </section>
  )
}
