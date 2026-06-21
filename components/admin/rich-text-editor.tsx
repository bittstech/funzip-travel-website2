"use client"

import { useMemo, useRef, useState } from "react"
import { markdownToHtml } from "@/lib/cms/markdown"

const toolbarButtonClass =
  "rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold transition hover:border-primary hover:text-primary"

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "")
}

function decodeEntities(value: string) {
  if (typeof window === "undefined") return value
  const textarea = document.createElement("textarea")
  textarea.innerHTML = value
  return textarea.value
}

function htmlToEditableText(value: string) {
  if (!/<[a-z][\s\S]*>/i.test(value)) return value

  const withMarkdownLinks = value.replace(
    /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_match, href, text) => `[${stripTags(String(text)).trim()}](${href})`,
  )

  const editable = withMarkdownLinks
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**")
    .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, "*$2*")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|ul|ol)>/gi, "\n")
    .replace(/<(p|div|ul|ol)[^>]*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()

  return decodeEntities(editable)
}

function wrapSelection(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  before: string,
  after = before,
  fallback = "text",
) {
  const selected = value.slice(selectionStart, selectionEnd) || fallback
  const nextValue =
    value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd)
  const nextStart = selectionStart + before.length
  const nextEnd = nextStart + selected.length

  return { nextValue, nextStart, nextEnd }
}

function insertBlock(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  block: string,
) {
  const before = value.slice(0, selectionStart)
  const after = value.slice(selectionEnd)
  const prefix = before && !before.endsWith("\n") ? "\n" : ""
  const suffix = after && !after.startsWith("\n") ? "\n" : ""
  const nextValue = `${before}${prefix}${block}${suffix}${after}`
  const nextStart = before.length + prefix.length
  const nextEnd = nextStart + block.length

  return { nextValue, nextStart, nextEnd }
}

export function RichTextEditor({
  name,
  label,
  initialValue = "",
  error,
}: {
  name: string
  label: string
  initialValue?: string | null
  error?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState(() => htmlToEditableText(initialValue || ""))
  const errorId = `${name}-error`
  const helpId = `${name}-help`
  const previewHtml = useMemo(() => markdownToHtml(value), [value])

  function updateText(
    nextValue: string,
    selectionStart?: number,
    selectionEnd?: number,
  ) {
    setValue(nextValue)
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus()
      if (
        typeof selectionStart === "number" &&
        typeof selectionEnd === "number"
      ) {
        textareaRef.current?.setSelectionRange(selectionStart, selectionEnd)
      }
    })
  }

  function applyWrap(before: string, after = before, fallback = "text") {
    const textarea = textareaRef.current
    if (!textarea) return

    const next = wrapSelection(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      before,
      after,
      fallback,
    )
    updateText(next.nextValue, next.nextStart, next.nextEnd)
  }

  function applyBlock(block: string) {
    const textarea = textareaRef.current
    if (!textarea) return

    const next = insertBlock(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      block,
    )
    updateText(next.nextValue, next.nextStart, next.nextEnd)
  }

  function addLink() {
    const textarea = textareaRef.current
    if (!textarea) return

    const selected =
      value.slice(textarea.selectionStart, textarea.selectionEnd) || "link text"
    const url = window.prompt("Paste the link URL")
    if (!url) return

    const next = wrapSelection(
      value,
      textarea.selectionStart,
      textarea.selectionEnd,
      "[",
      `](${url})`,
      selected,
    )
    updateText(next.nextValue, next.nextStart, next.nextEnd)
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold">
        {label}
      </label>
      <div
        className={`mt-2 overflow-hidden rounded-lg border bg-background ${
          error ? "border-destructive" : "border-border"
        }`}
      >
        <div className="flex flex-wrap gap-2 border-b border-border bg-muted/30 p-2">
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => applyBlock("## Section title")}
          >
            Heading
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => applyBlock("### Small heading")}
          >
            Subheading
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => applyWrap("**", "**", "important text")}
          >
            Bold
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => applyWrap("*", "*", "highlighted text")}
          >
            Italic
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => applyBlock("- First point\n- Second point")}
          >
            Bullets
          </button>
          <button type="button" className={toolbarButtonClass} onClick={addLink}>
            Link
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => updateText("")}
          >
            Clear
          </button>
        </div>

        <textarea
          ref={textareaRef}
          id={name}
          name={name}
          rows={12}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${helpId} ${errorId}` : helpId}
          placeholder={
            "Write normally. Use blank lines for paragraphs.\n\n## Section title\n- Add bullet points\n**Bold text**"
          }
          className="min-h-72 w-full resize-y bg-background px-3 py-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div
        id={helpId}
        className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"
      >
        <span>
          Use the buttons or type normally. Blank lines become separate paragraphs.
        </span>
        <span>{value.trim().length} characters</span>
      </div>

      {value.trim() ? (
        <details className="mt-3 rounded-lg border border-border bg-secondary/25">
          <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-primary">
            Preview
          </summary>
          <div
            className="border-t border-border px-3 py-3 text-sm leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-heading [&_h3]:text-lg [&_h3]:font-semibold [&_li]:ml-5 [&_p]:my-2 [&_strong]:font-semibold [&_ul]:my-3 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </details>
      ) : null}

      {error ? (
        <p id={errorId} className="mt-1 text-xs font-semibold text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
