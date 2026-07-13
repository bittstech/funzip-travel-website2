"use client"

import { useRef } from "react"
import { MessageSquareText, PencilRuler, Plane, ArrowRight } from "lucide-react"
import { gsap, useGSAP } from "./gsap"

const steps = [
  {
    icon: MessageSquareText,
    step: "01",
    title: "Tell Us Your Dream Trip",
    description:
      "Two minutes on WhatsApp or the form below — your dates, who's coming, and what Kashmir means to you.",
  },
  {
    icon: PencilRuler,
    step: "02",
    title: "A Native Expert Crafts It",
    description:
      "Within hours you get a custom itinerary at direct local prices — every hotel, cab, and experience listed, nothing hidden.",
  },
  {
    icon: Plane,
    step: "03",
    title: "Land as Our Guest",
    description:
      "From airport pickup to farewell kahwa, our local family looks after you — with 24/7 on-trip support a call away.",
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".hiw-head > *", {
          y: 32,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hiw-head", start: "top 80%" },
        })
        gsap.from(".hiw-step", {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hiw-steps", start: "top 78%" },
        })
        gsap.fromTo(
          ".hiw-line",
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            ease: "none",
            scrollTrigger: {
              trigger: ".hiw-steps",
              start: "top 70%",
              end: "bottom 60%",
              scrub: true,
            },
          },
        )
        gsap.from(".hiw-cta", {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hiw-cta", start: "top 88%" },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-foreground py-20 text-background lg:py-28"
    >
      {/* Soft glow accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="hiw-head mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Effortless Planning
          </span>
          <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-balance sm:text-5xl">
            Your Kashmir Trip in Three Simple Steps
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-background/70">
            No endless calls, no confusing quotes. Planning with a local should
            feel as easy as texting a friend — because that&apos;s what it is.
          </p>
        </div>

        <div className="hiw-steps relative mt-14">
          {/* Progress line (desktop) */}
          <div className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-background/15 lg:block">
            <div className="hiw-line h-full w-full bg-primary" />
          </div>

          <div className="grid gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map((item) => (
              <div key={item.step} className="hiw-step relative text-center">
                <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="mt-4 block font-heading text-sm font-semibold tracking-[0.3em] text-primary">
                  STEP {item.step}
                </span>
                <h3 className="mt-2 font-heading text-2xl font-semibold">
                  {item.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-background/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="hiw-cta mt-14 flex flex-col items-center gap-3">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:scale-105"
          >
            Start Step One — It&apos;s Free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <p className="text-xs text-background/60">
            We usually reply within minutes during the day.
          </p>
        </div>
      </div>
    </section>
  )
}
