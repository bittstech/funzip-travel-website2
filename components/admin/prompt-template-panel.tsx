"use client"

import { useId, useState } from "react"
import { Check, Copy } from "lucide-react"

export function PromptTemplatePanel({
  title,
  description,
  prompt,
}: {
  title: string
  description: string
  prompt: string
}) {
  const promptId = useId()
  const statusId = useId()
  const [copied, setCopied] = useState(false)

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={copyPrompt}
          aria-describedby={statusId}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-semibold transition hover:border-primary hover:text-primary"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p id={statusId} className="sr-only" aria-live="polite">
        {copied ? "Prompt template copied." : "Copy the prompt template."}
      </p>
      <textarea
        id={promptId}
        aria-label={`${title} prompt template`}
        readOnly
        value={prompt}
        rows={12}
        className="mt-4 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </section>
  )
}
