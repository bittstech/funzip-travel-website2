"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { CheckCircle2, ChevronDown, FileText, HelpCircle } from "lucide-react"
import type { FaqItem, PackageContentSection, PublicPackage } from "@/lib/cms/types"

type AccordionSection =
  | {
      id: string
      title: string
      countLabel: string
      type: "html"
      html: string
    }
  | {
      id: string
      title: string
      countLabel: string
      type: "lines"
      lines: string[]
    }
  | {
      id: string
      title: string
      countLabel: string
      type: "faqs"
      faqs: FaqItem[]
    }

function sectionId(section: PackageContentSection, index: number) {
  return section.id || `${section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`
}

function buildSections(pkg: PublicPackage, overviewHtml?: string): AccordionSection[] {
  const sections: AccordionSection[] = []
  const sectionIds = new Set<string>()

  function uniqueSectionId(id: string) {
    if (!sectionIds.has(id)) {
      sectionIds.add(id)
      return id
    }

    let index = 2
    let nextId = `${id}-${index}`
    while (sectionIds.has(nextId)) {
      index += 1
      nextId = `${id}-${index}`
    }
    sectionIds.add(nextId)
    return nextId
  }

  if (overviewHtml) {
    sections.push({
      id: uniqueSectionId("overview"),
      title: "Overview",
      countLabel: "Start here",
      type: "html",
      html: overviewHtml,
    })
  }

  for (const [index, section] of pkg.contentSections.entries()) {
    if (!section.title || section.lines.length === 0) continue
    sections.push({
      id: uniqueSectionId(sectionId(section, index)),
      title: section.title,
      countLabel: `${section.lines.length} ${section.lines.length === 1 ? "point" : "points"}`,
      type: "lines",
      lines: section.lines,
    })
  }

  if (pkg.faqs.length > 0) {
    sections.push({
      id: uniqueSectionId("faqs"),
      title: "FAQs",
      countLabel: `${pkg.faqs.length} answers`,
      type: "faqs",
      faqs: pkg.faqs,
    })
  }

  return sections
}

function LinesContent({ lines }: { lines: string[] }) {
  return (
    <ul className="grid gap-3">
      {lines.map((line, index) => (
        <li
          key={`${line}-${index}`}
          className="flex gap-3 rounded-lg bg-secondary/45 px-4 py-3 text-sm leading-relaxed text-foreground/80"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span className="min-w-0">{line}</span>
        </li>
      ))}
    </ul>
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
  overviewHtml,
}: {
  pkg: PublicPackage
  overviewHtml?: string
}) {
  const sections = useMemo(() => buildSections(pkg, overviewHtml), [pkg, overviewHtml])
  const [openId, setOpenId] = useState(sections[0]?.id || "")

  if (sections.length === 0) return null

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Trip Details
          </p>
          <h2 className="mt-2 font-heading text-4xl font-semibold">
            Everything, Neatly Organized
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

      <div className="mt-7 min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
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
                onClick={() => setOpenId(section.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-secondary/45"
              >
                <span className="min-w-0">
                  <span className="font-heading text-2xl font-semibold">
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
                    <div className="min-w-0 px-5 pb-5">
                      {section.type === "html" ? (
                        <div
                          className="max-w-none overflow-x-auto leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:font-heading [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:my-4 [&_ol]:list-decimal [&_p]:my-3 [&_strong]:font-semibold [&_table]:w-full [&_table]:min-w-[36rem] [&_ul]:my-4 [&_ul]:list-disc"
                          dangerouslySetInnerHTML={{ __html: section.html }}
                        />
                      ) : null}
                      {section.type === "lines" ? (
                        <LinesContent lines={section.lines} />
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
