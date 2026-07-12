"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { CheckCircle2, ChevronDown, FileText, HelpCircle, XCircle, Info, MapPin } from "lucide-react"
import type { FaqItem, ItineraryDay, PublicPackage } from "@/lib/cms/types"

type AccordionSection =
  | {
      id: string
      title: string
      countLabel: string
      type: "lines"
      lines: string[]
      icon?: "check" | "cross" | "info"
    }
  | {
      id: string
      title: string
      countLabel: string
      type: "itinerary"
      days: ItineraryDay[]
    }
  | {
      id: string
      title: string
      countLabel: string
      type: "faqs"
      faqs: FaqItem[]
    }

function buildSections(pkg: PublicPackage): AccordionSection[] {
  const sections: AccordionSection[] = []

  if (pkg.itinerary && pkg.itinerary.length > 0) {
    sections.push({
      id: "itinerary",
      title: "Itinerary",
      countLabel: `${pkg.itinerary.length} days`,
      type: "itinerary",
      days: pkg.itinerary,
    })
  }

  // We skip inclusions because it is displayed upfront in the detail page now

  if (pkg.exclusions && pkg.exclusions.length > 0) {
    sections.push({
      id: "exclusions",
      title: "What's Not Included",
      countLabel: `${pkg.exclusions.length} points`,
      type: "lines",
      lines: pkg.exclusions,
      icon: "cross"
    })
  }

  if (pkg.mustKnow && pkg.mustKnow.length > 0) {
    sections.push({
      id: "must-know",
      title: "Good to Know",
      countLabel: `${pkg.mustKnow.length} notes`,
      type: "lines",
      lines: pkg.mustKnow,
      icon: "info"
    })
  }

  if (pkg.faqs && pkg.faqs.length > 0) {
    sections.push({
      id: "faqs",
      title: "FAQs",
      countLabel: `${pkg.faqs.length} answers`,
      type: "faqs",
      faqs: pkg.faqs,
    })
  }

  // Fallback for old content sections if they still exist for backward compatibility
  // Only add if they are not the standard ones we just handled
  if (pkg.contentSections && pkg.contentSections.length > 0) {
    const handledTitles = ["inclusions", "exclusions", "must know", "good to know", "itinerary", "faqs", "highlights"]
    for (const [index, section] of pkg.contentSections.entries()) {
      if (!section.title || section.lines.length === 0) continue
      if (handledTitles.includes(section.title.toLowerCase())) continue
      
      sections.push({
        id: section.id || `legacy-section-${index}`,
        title: section.title,
        countLabel: `${section.lines.length} points`,
        type: "lines",
        lines: section.lines,
        icon: "check"
      })
    }
  }

  return sections
}

function LinesContent({ lines, icon = "check" }: { lines: string[], icon?: "check" | "cross" | "info" }) {
  return (
    <ul className="grid gap-3">
      {lines.map((line, index) => (
        <li
          key={`${line}-${index}`}
          className="flex gap-3 rounded-lg bg-secondary/45 px-4 py-3 text-sm leading-relaxed text-foreground/80"
        >
          {icon === "check" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          ) : icon === "cross" ? (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          ) : (
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          )}
          <span className="min-w-0">{line}</span>
        </li>
      ))}
    </ul>
  )
}

function ItineraryContent({ days }: { days: ItineraryDay[] }) {
  return (
    <div className="relative space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-border">
      {days.map((day) => (
        <article key={`day-${day.day}`} className="relative pl-8">
          <span className="absolute left-0 top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-background ring-4 ring-card">
            <span className="h-2 w-2 rounded-full bg-primary" />
          </span>
          <h3 className="font-semibold leading-relaxed">
            <span className="text-primary mr-2">Day {day.day}</span>
            {day.title}
          </h3>
          {day.description ? (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {day.description}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  )
}

function FaqContent({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div className="grid gap-3">
      {faqs.map((faq, index) => (
        <article key={`${faq.question}-${index}`} className="rounded-lg bg-secondary/45 p-4">
          <h3 className="flex min-w-0 items-start gap-2 font-semibold">
            <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="min-w-0">{faq.question}</span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {faq.answer}
          </p>
        </article>
      ))}
    </div>
  )
}

export function PackageInfoAccordion({
  pkg,
}: {
  pkg: PublicPackage
}) {
  const sections = useMemo(() => buildSections(pkg), [pkg])
  const [openId, setOpenId] = useState(sections[0]?.id || "")

  if (sections.length === 0) return null

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-heading text-3xl font-semibold">
            Trip Details
          </h2>
        </div>
        {pkg.itineraryUrl ? (
          <a
            href={pkg.itineraryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary"
          >
            <FileText className="h-4 w-4" />
            View PDF Itinerary
          </a>
        ) : null}
      </div>

      <div className="mt-6 min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {sections.map((section, index) => {
          const isOpen = openId === section.id

          return (
            <div
              key={section.id}
              className={index === 0 ? "" : "border-t border-border"}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? "" : section.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-secondary/45"
              >
                <span className="min-w-0">
                  <span className="font-heading text-xl font-semibold">
                    {section.title}
                  </span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {section.countLabel}
                  </span>
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="min-w-0 px-5 pb-5 pt-2">
                      {section.type === "lines" ? (
                        <LinesContent lines={section.lines} icon={section.icon} />
                      ) : null}
                      {section.type === "itinerary" ? (
                        <ItineraryContent days={section.days} />
                      ) : null}
                      {section.type === "faqs" ? (
                        <FaqContent faqs={section.faqs} />
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
