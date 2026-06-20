import type {
  FaqItem,
  ImageRef,
  ItineraryDay,
  PackageContentSection,
} from "./types"

export const DEFAULT_SITE_URL = "https://funzip.travel"

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    DEFAULT_SITE_URL
  )
}

export function absoluteUrl(pathOrUrl: string | null | undefined) {
  if (!pathOrUrl) return getSiteUrl()
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`
  return `${getSiteUrl()}${path}`
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
}

export function asString(value: FormDataEntryValue | null | undefined) {
  return typeof value === "string" ? value.trim() : ""
}

export function nullableString(value: FormDataEntryValue | null | undefined) {
  const text = asString(value)
  return text.length > 0 ? text : null
}

export function asBoolean(value: FormDataEntryValue | null | undefined) {
  return value === "on" || value === "true" || value === "1"
}

export function asOptionalInt(value: FormDataEntryValue | null | undefined) {
  const text = asString(value).replace(/[^\d]/g, "")
  if (!text) return null
  const parsed = Number.parseInt(text, 10)
  return Number.isFinite(parsed) ? parsed : null
}

export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item : String(item ?? "")))
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

export function fieldToStringArray(value: FormDataEntryValue | null | undefined) {
  return toStringArray(asString(value))
}

export function parseContentSections(value: unknown): PackageContentSection[] {
  let input = value

  if (typeof value === "string") {
    const text = value.trim()
    if (!text) return []

    try {
      input = JSON.parse(text)
    } catch {
      return []
    }
  }

  if (!Array.isArray(input)) return []

  const sections: PackageContentSection[] = []

  input.forEach((item, index) => {
    if (!item || typeof item !== "object") return

    const record = item as Record<string, unknown>
    const title = String(record.title ?? "").trim()
    const lines = Array.isArray(record.lines)
      ? record.lines
          .map((line) => String(line ?? "").trim())
          .filter(Boolean)
      : toStringArray(record.lines)

    if (!title || lines.length === 0) return

    sections.push({
      id: String(record.id ?? `section-${index + 1}`).trim(),
      title,
      lines,
    })
  })

  return sections
}

export function fallbackContentSections(input: {
  services?: unknown
  highlights?: unknown
  inclusions?: unknown
  exclusions?: unknown
  mustKnow?: unknown
  itinerary?: unknown
}): PackageContentSection[] {
  const sections: PackageContentSection[] = []
  const groups = [
    ["services", "Services", toStringArray(input.services)],
    ["highlights", "Highlights", toStringArray(input.highlights)],
    ["inclusions", "Inclusions", toStringArray(input.inclusions)],
    ["exclusions", "Exclusions", toStringArray(input.exclusions)],
    ["mustKnow", "Must Know", toStringArray(input.mustKnow)],
  ] as const

  for (const [id, title, lines] of groups) {
    if (lines.length) sections.push({ id, title, lines })
  }

  const itinerary = parseItinerary(input.itinerary)
  if (itinerary.length) {
    sections.push({
      id: "itinerary",
      title: "Itinerary",
      lines: itinerary.map((day) =>
        [day.title, day.description].filter(Boolean).join(" - "),
      ),
    })
  }

  return sections
}

export function parseFaqs(value: unknown): FaqItem[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>
          return {
            question: String(record.question ?? record.q ?? "").trim(),
            answer: String(record.answer ?? record.a ?? "").trim(),
          }
        }
        return null
      })
      .filter((item): item is FaqItem => Boolean(item?.question && item.answer))
  }

  return asString(value as FormDataEntryValue)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [question, ...answerParts] = line.split("|")
      return {
        question: question?.trim() || "",
        answer: answerParts.join("|").trim(),
      }
    })
    .filter((item) => item.question && item.answer)
}

export function parseItinerary(value: unknown): ItineraryDay[] {
  if (Array.isArray(value)) {
    return value
      .map((item, index) => {
        if (item && typeof item === "object") {
          const record = item as Record<string, unknown>
          return {
            day: Number(record.day ?? index + 1),
            title: String(record.title ?? "").trim(),
            description: String(record.description ?? "").trim() || undefined,
          }
        }
        const title = String(item ?? "").trim()
        return title ? { day: index + 1, title } : null
      })
      .filter((item): item is ItineraryDay => Boolean(item?.title))
  }

  return asString(value as FormDataEntryValue)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [title, ...description] = line.split("|")
      return {
        day: index + 1,
        title: title.trim(),
        description: description.join("|").trim() || undefined,
      }
    })
}

export function formatPrice(amount: number | null | undefined) {
  if (!amount) return "Custom quote"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function imageRef(
  asset:
    | {
        id?: string
        storageUrl?: string | null
        altText?: string | null
        width?: number | null
        height?: number | null
      }
    | null
    | undefined,
  fallbackAlt: string,
  fallbackUrl = "/placeholder.jpg",
): ImageRef {
  return {
    id: asset?.id,
    url: asset?.storageUrl || fallbackUrl,
    alt: asset?.altText || fallbackAlt,
    width: asset?.width || 1200,
    height: asset?.height || 800,
  }
}

export function seoTitle(title: string, siteName = "Funzip Kashmir Tour & Travels") {
  const clean = title.trim()
  return clean.includes(siteName) ? clean : `${clean} | ${siteName}`
}

export function shortDescription(text: string, maxLength = 158) {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= maxLength) return clean
  return `${clean.slice(0, maxLength - 1).replace(/\s+\S*$/, "")}.`
}

export function getSeoWarnings(input: {
  slug?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  imageAlt?: string | null
  faqs?: unknown
}) {
  const warnings: string[] = []
  if (!input.metaTitle) warnings.push("Missing meta title")
  if (input.metaTitle && input.metaTitle.length > 60) {
    warnings.push("Meta title is over 60 characters")
  }
  if (!input.metaDescription) warnings.push("Missing meta description")
  if (input.metaDescription && input.metaDescription.length > 160) {
    warnings.push("Meta description is over 160 characters")
  }
  if (input.slug && input.slug.length > 75) warnings.push("Slug is long")
  if (!input.imageAlt) warnings.push("Image alt text is missing")
  if (parseFaqs(input.faqs).length === 0) warnings.push("No visible FAQ added")
  return warnings
}
