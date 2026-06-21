"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Plus } from "lucide-react"
import { Reveal } from "./reveal"
import { faqs } from "./data"

export function Faqs() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faqs" className="relative bg-secondary/40 py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-8">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Good To Know
          </span>
          <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-balance sm:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Everything you need to know before booking your Kashmir trip with
            Funzip. Still curious? Reach out anytime.
          </p>
        </Reveal>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <Reveal key={`${faq.q}-${i}`} delay={i * 0.04}>
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-foreground">{faq.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
