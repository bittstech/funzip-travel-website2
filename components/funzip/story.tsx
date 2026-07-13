"use client"

import { useRef } from "react"
import Image from "next/image"
import { Home, IndianRupee, HeartHandshake, Compass } from "lucide-react"
import { gsap, useGSAP } from "./gsap"

const pillars = [
  {
    icon: Home,
    title: "Born Here, Not Posted Here",
    description:
      "We grew up in these valleys. The shortcuts, the quiet viewpoints, the right season for every place — we know Kashmir the way you know your hometown.",
  },
  {
    icon: IndianRupee,
    title: "Best Price, Straight From the Source",
    description:
      "No middlemen, no agency markups. You pay direct local rates for hotels, houseboats, and cabs — and see exactly what's included.",
  },
  {
    icon: HeartHandshake,
    title: "Friends in Every Valley",
    description:
      "Drivers, houseboat owners, pony-wallahs, shopkeepers — our people are everywhere you'll go, so you're always among friends, never among strangers.",
  },
  {
    icon: Compass,
    title: "Every Corner, Not Just the Circuit",
    description:
      "Beyond Gulmarg and Pahalgam lie Gurez, Doodhpathri, Yusmarg, and villages tourists never see. We take you where brochures can't.",
  },
]

export function Story() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".story-head > *", {
          y: 36,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".story-head",
            start: "top 78%",
          },
        })

        gsap.from(".story-pillar", {
          y: 44,
          opacity: 0,
          duration: 0.75,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".story-pillars",
            start: "top 80%",
          },
        })

        // Photo stack drifts at different speeds
        gsap.to(".story-img-main", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: ".story-visual",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })
        gsap.to(".story-img-float", {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: ".story-visual",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })

        gsap.from(".story-quote", {
          opacity: 0,
          y: 30,
          scale: 0.98,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".story-quote",
            start: "top 85%",
          },
        })
      })
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="relative overflow-hidden bg-secondary/40 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Photo stack */}
          <div className="story-visual relative mx-auto w-full max-w-xl">
            <div className="story-img-main relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
              <Image
                src="/images/houseboat.png"
                alt="Traditional houseboat on Dal Lake, Srinagar"
                fill
                sizes="(min-width: 1024px) 560px, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-md">
                <p className="font-heading text-xl font-semibold italic text-white">
                  “Mehmaan-Nawazi”
                </p>
                <p className="mt-1 text-xs leading-relaxed text-white/85">
                  The Kashmiri art of honouring a guest — the belief every
                  Funzip trip is built on.
                </p>
              </div>
            </div>
            <div className="story-img-float absolute -right-4 -top-10 hidden w-44 overflow-hidden rounded-3xl border-4 border-background shadow-xl sm:block lg:-right-10 lg:w-56">
              <div className="relative aspect-square">
                <Image
                  src="/images/gardens.png"
                  alt="Mughal gardens of Kashmir in bloom"
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="story-img-float absolute -bottom-8 -left-4 hidden w-40 overflow-hidden rounded-3xl border-4 border-background shadow-xl sm:block lg:-left-10 lg:w-52">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/gurez.png"
                  alt="Untouched Gurez valley framed by Habba Khatoon peak"
                  fill
                  sizes="208px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Copy + pillars */}
          <div>
            <div className="story-head">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Why Travel With Funzip
              </span>
              <h2 className="mt-3 font-heading text-4xl font-semibold leading-[1.1] text-balance sm:text-5xl">
                You arrive as a traveler.
                <br />
                <span className="text-accent">You leave as family.</span>
              </h2>
              <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
                In a Kashmiri home, a guest is a blessing — never a
                transaction. We are natives of this valley, and we built Funzip
                so you could experience Kashmir the way our own guests do:
                welcomed with kahwa, guided by people who belong here, and
                looked after at every turn.
              </p>
            </div>

            <div className="story-pillars mt-10 grid gap-6 sm:grid-cols-2">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="story-pillar rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <pillar.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-semibold leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <blockquote className="story-quote mx-auto mt-16 max-w-3xl text-center lg:mt-24">
          <p className="font-heading text-2xl font-medium italic leading-snug text-balance text-foreground/90 sm:text-3xl">
            “We don't have customers at Funzip. We have guests — and in
            Kashmir, a guest is treated like God's own.”
          </p>
          <footer className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            — The Funzip Family, Srinagar
          </footer>
        </blockquote>
      </div>
    </section>
  )
}
