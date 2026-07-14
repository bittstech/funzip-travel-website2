"use client"

import { useRef, useState } from "react"
import { Wand2 } from "lucide-react"

export type AiImportMapping = {
  /** Label in the AI output, e.g. "META TITLE" (matched at line start, case-insensitive) */
  label: string
  /** Form field name to fill */
  field: string
}

function normalizeLine(line: string) {
  // Strip markdown bold/heading decoration AIs often add around labels
  return line.replace(/^[#>\s*_-]+/, "").replace(/\*\*/g, "").trim()
}

function parseSections(text: string, labels: string[]) {
  // Longest labels first so "META TITLE" wins over "TITLE"
  const ordered = [...labels].sort((a, b) => b.length - a.length)
  const result: Record<string, string[]> = {}
  let current: string | null = null

  for (const rawLine of text.split(/\r?\n/)) {
    const line = normalizeLine(rawLine)
    const matched = ordered.find((label) =>
      new RegExp(`^${label}\\s*:`, "i").test(line),
    )
    if (matched) {
      current = matched
      result[current] = result[current] || []
      const inline = line.slice(line.indexOf(":") + 1).trim()
      if (inline) result[current].push(inline)
      continue
    }
    if (current) result[current].push(rawLine.replace(/\s+$/, ""))
  }

  const sections: Record<string, string> = {}
  for (const [label, lines] of Object.entries(result)) {
    sections[label] = lines.join("\n").trim()
  }
  return sections
}

/** Set value on a possibly React-controlled input/textarea so state updates too */
function setFieldValue(
  el: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) {
  const proto =
    el instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set
  if (setter) setter.call(el, value)
  else el.value = value
  el.dispatchEvent(new Event("input", { bubbles: true }))
  el.dispatchEvent(new Event("change", { bubbles: true }))
}

export function AiImport({ mappings }: { mappings: AiImportMapping[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState("")
  const [status, setStatus] = useState("")

  function autofill() {
    const form = rootRef.current?.closest("form")
    if (!form || !text.trim()) {
      setStatus("Paste the AI result first.")
      return
    }

    const sections = parseSections(
      text,
      mappings.map((m) => m.label),
    )

    let filled = 0
    const missing: string[] = []
    for (const mapping of mappings) {
      const value = sections[mapping.label]
      if (!value) {
        missing.push(mapping.label)
        continue
      }
      const el = form.elements.namedItem(mapping.field)
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement
      ) {
        setFieldValue(el, value)
        filled++
      }
    }

    setStatus(
      filled
        ? `Filled ${filled} field${filled === 1 ? "" : "s"}.${
            missing.length ? ` Not found in paste: ${missing.join(", ")}.` : ""
          } Review everything, then save.`
        : "Nothing matched. Make sure you pasted the full AI answer (with the LABEL: headings).",
    )
    if (filled) setText("")
  }

  return (
    <div
      ref={rootRef}
      className="rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-5"
    >
      <h2 className="flex items-center gap-2 font-heading text-xl font-semibold">
        <Wand2 className="h-5 w-5 text-primary" />
        Paste AI Result → Auto-Fill
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Copy the prompt below into ChatGPT or Gemini, then paste the full
        answer here. Every field fills itself.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder={"TITLE: ...\nSLUG: ...\nSHORT DESCRIPTION: ...\n(paste the whole AI answer)"}
        className="mt-3 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <button
        type="button"
        onClick={autofill}
        className="mt-3 w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        Auto-Fill Form
      </button>
      {status ? (
        <p aria-live="polite" className="mt-2 text-xs font-medium text-foreground/80">
          {status}
        </p>
      ) : null}
    </div>
  )
}
