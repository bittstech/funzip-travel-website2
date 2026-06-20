"use client"

import { useEffect, useRef, useState } from "react"

const toolbarButtonClass =
  "rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold transition hover:border-primary hover:text-primary"

function cleanEmptyHtml(value: string) {
  const text = value
    .replace(/<br\s*\/?>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/<[^>]*>/g, "")
    .trim()

  return text.length > 0 ? value : ""
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
  const editorRef = useRef<HTMLDivElement>(null)
  const [html, setHtml] = useState(initialValue || "")
  const errorId = `${name}-error`

  useEffect(() => {
    document.execCommand("defaultParagraphSeparator", false, "p")
  }, [])

  function syncValue() {
    setHtml(cleanEmptyHtml(editorRef.current?.innerHTML || ""))
  }

  function runCommand(command: string, value?: string) {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    syncValue()
  }

  function addLink() {
    const url = window.prompt("Paste the link URL")
    if (!url) return
    runCommand("createLink", url)
  }

  return (
    <div>
      <span className="block text-sm font-semibold">{label}</span>
      <div
        className={`mt-2 overflow-hidden rounded-lg border bg-background ${
          error ? "border-destructive" : "border-border"
        }`}
      >
        <div className="flex flex-wrap gap-2 border-b border-border bg-muted/30 p-2">
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => runCommand("formatBlock", "h2")}
          >
            H2
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => runCommand("formatBlock", "h3")}
          >
            H3
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => runCommand("bold")}
          >
            Bold
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => runCommand("italic")}
          >
            Italic
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => runCommand("insertUnorderedList")}
          >
            Bullets
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => runCommand("insertOrderedList")}
          >
            Numbers
          </button>
          <button type="button" className={toolbarButtonClass} onClick={addLink}>
            Link
          </button>
          <button
            type="button"
            className={toolbarButtonClass}
            onClick={() => runCommand("removeFormat")}
          >
            Clear
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onInput={syncValue}
          onBlur={syncValue}
          onPaste={(event) => {
            event.preventDefault()
            const text = event.clipboardData.getData("text/plain")
            document.execCommand("insertText", false, text)
            syncValue()
          }}
          className="min-h-56 w-full max-w-full overflow-x-auto px-3 py-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-primary/20 [&_a]:text-primary [&_a]:underline [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:my-3 [&_ol]:list-decimal [&_p]:my-3 [&_strong]:font-semibold [&_ul]:my-3 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: initialValue || "" }}
        />
      </div>
      <textarea name={name} value={html} readOnly hidden />
      {error ? (
        <p id={errorId} className="mt-1 text-xs font-semibold text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
