const escapeMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;",
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => escapeMap[char])
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/`/g, "&#096;")
}

const allowedHtmlTags = new Set([
  "a",
  "b",
  "br",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "i",
  "li",
  "ol",
  "p",
  "strong",
  "ul",
])

function safeHref(value: string) {
  const href = value.trim()
  return /^(https?:\/\/|mailto:|tel:|\/)/i.test(href) ? href : ""
}

function sanitizeRichHtml(value: string) {
  return value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?([a-z][a-z0-9]*)(\s[^>]*)?>/gi, (match, tag, attrs = "") => {
      const tagName = String(tag).toLowerCase()
      if (!allowedHtmlTags.has(tagName)) return ""
      const outputTagName = tagName === "div" ? "p" : tagName

      if (match.startsWith("</")) {
        return tagName === "br" ? "" : `</${outputTagName}>`
      }

      if (tagName === "br") return "<br>"
      if (tagName !== "a") return `<${outputTagName}>`

      const hrefMatch = String(attrs).match(
        /\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i,
      )
      const href = safeHref(hrefMatch?.[1] || hrefMatch?.[2] || hrefMatch?.[3] || "")
      if (!href) return "<a>"

      return `<a href="${escapeAttribute(href)}" rel="noopener noreferrer nofollow" target="_blank">`
    })
}

function hasRichHtml(value: string) {
  return /<\/?(p|br|strong|em|b|i|ul|ol|li|h1|h2|h3|a|div)(\s|>|\/)/i.test(value)
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      '<a href="$2" rel="noopener noreferrer nofollow" target="_blank">$1</a>',
    )
}

export function markdownToHtml(markdown: string | null | undefined) {
  if (markdown && hasRichHtml(markdown)) return sanitizeRichHtml(markdown)

  const lines = (markdown || "").split(/\r?\n/)
  const html: string[] = []
  let listOpen = false

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      if (listOpen) {
        html.push("</ul>")
        listOpen = false
      }
      continue
    }

    if (line.startsWith("### ")) {
      if (listOpen) {
        html.push("</ul>")
        listOpen = false
      }
      html.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`)
      continue
    }

    if (line.startsWith("## ")) {
      if (listOpen) {
        html.push("</ul>")
        listOpen = false
      }
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`)
      continue
    }

    if (line.startsWith("# ")) {
      if (listOpen) {
        html.push("</ul>")
        listOpen = false
      }
      html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`)
      continue
    }

    if (line.startsWith("- ")) {
      if (!listOpen) {
        html.push("<ul>")
        listOpen = true
      }
      html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`)
      continue
    }

    if (listOpen) {
      html.push("</ul>")
      listOpen = false
    }
    html.push(`<p>${inlineMarkdown(line)}</p>`)
  }

  if (listOpen) html.push("</ul>")
  return html.join("")
}
