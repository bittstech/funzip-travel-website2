"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { Reveal } from "./reveal"

export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -z-10 scale-110">
        <Image
          src="/images/sonmarg.png"
          alt="Sweeping Kashmir valley with mountains"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/45" />
      </motion.div>

      <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-36">
        <Reveal>
          <h2 className="font-heading text-4xl font-semibold leading-[1.1] text-balance text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
            Kashmir is calling. Let Funzip plan it perfectly.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <a
            href="/contact"
            className="mt-9 inline-flex items-center justify-center rounded-full bg-primary px-9 py-4 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/40 transition-transform hover:scale-105"
          >
            Start Planning Now
          </a>
        </Reveal>
      </div>
    </section>
  )
}
