"use client"

import { useMemo, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import type { PackageContentSection } from "@/lib/cms/types"

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"

type SectionDraft = {
  id: string
  title: string
  lines: string[]
}

function createSection(): SectionDraft {
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: "",
    lines: [""],
  }
}

function normalizeInitialSections(
  sections: PackageContentSection[] | undefined,
): SectionDraft[] {
  if (!sections?.length) return [createSection()]

  return sections.map((section, index) => ({
    id: section.id || `section-${index + 1}`,
    title: section.title,
    lines: section.lines.length > 0 ? section.lines : [""],
  }))
}

function cleanSections(sections: SectionDraft[]): PackageContentSection[] {
  return sections
    .map((section) => ({
      id: section.id,
      title: section.title.trim(),
      lines: section.lines.map((line) => line.trim()).filter(Boolean),
    }))
    .filter((section) => section.title && section.lines.length > 0)
}

export function PackageSectionsInput({
  name,
  initialSections,
}: {
  name: string
  initialSections?: PackageContentSection[]
}) {
  const [sections, setSections] = useState<SectionDraft[]>(() =>
    normalizeInitialSections(initialSections),
  )

  const serialized = useMemo(
    () => JSON.stringify(cleanSections(sections)),
    [sections],
  )

  function updateSectionTitle(sectionId: string, title: string) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId ? { ...section, title } : section,
      ),
    )
  }

  function addSection() {
    setSections((current) => [...current, createSection()])
  }

  function removeSection(sectionId: string) {
    setSections((current) => {
      const next = current.filter((section) => section.id !== sectionId)
      return next.length > 0 ? next : [createSection()]
    })
  }

  function updateLine(sectionId: string, lineIndex: number, line: string) {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== sectionId) return section
        return {
          ...section,
          lines: section.lines.map((item, index) =>
            index === lineIndex ? line : item,
          ),
        }
      }),
    )
  }

  function addLine(sectionId: string) {
    setSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? { ...section, lines: [...section.lines, ""] }
          : section,
      ),
    )
  }

  function removeLine(sectionId: string, lineIndex: number) {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== sectionId) return section
        const lines = section.lines.filter((_, index) => index !== lineIndex)
        return { ...section, lines: lines.length > 0 ? lines : [""] }
      }),
    )
  }

  return (
    <div>
      <input type="hidden" name={name} value={serialized} readOnly />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold">
            Display Sections
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a section, then add the lines that should appear inside it on
            the package page.
          </p>
        </div>
        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Add Section
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className="rounded-xl border border-border bg-background/60 p-4"
          >
            <div className="flex items-start gap-3">
              <label className="min-w-0 flex-1 text-sm font-semibold">
                Section {sectionIndex + 1}
                <input
                  value={section.title}
                  onChange={(event) =>
                    updateSectionTitle(section.id, event.target.value)
                  }
                  placeholder="Example: Hotels, Transport, Things to Know"
                  className={`${inputClass} mt-2`}
                />
              </label>
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                aria-label={`Remove section ${sectionIndex + 1}`}
                className="mt-7 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {section.lines.map((line, lineIndex) => (
                <div key={`${section.id}-${lineIndex}`} className="flex gap-2">
                  <input
                    value={line}
                    onChange={(event) =>
                      updateLine(section.id, lineIndex, event.target.value)
                    }
                    placeholder="Add one display line"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeLine(section.id, lineIndex)}
                    aria-label={`Remove line ${lineIndex + 1}`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addLine(section.id)}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition hover:border-primary hover:text-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Line
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
