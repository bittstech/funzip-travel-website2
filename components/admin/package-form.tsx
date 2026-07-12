"use client"

import { type FormEvent, useActionState, useState } from "react"
import { ImageUploadInput } from "./image-upload-input"
import { PromptTemplatePanel } from "./prompt-template-panel"
import { RichTextEditor } from "./rich-text-editor"
import type { AdminFormState } from "@/app/admin/actions"
import {
  slugify,
  toStringArray,
} from "@/lib/cms/utils"

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
const errorInputClass = "border-destructive focus:border-destructive focus:ring-destructive/20"
const labelClass = "block text-sm font-semibold"
const hintClass = "mt-1 text-xs text-muted-foreground"
const initialFormState: AdminFormState = { ok: false, message: "", fieldErrors: {} }

// Simplified 5-fill prompt — easy to use, easy to understand
const packagePromptTemplate = `You are a Kashmir tour package writer for Funzip Kashmir Tour & Travels.

Fill in the [brackets] and generate a complete package:

- Package type: [family / honeymoon / luxury / adventure / offbeat]
- Route: [e.g. Srinagar → Gulmarg → Pahalgam]
- Duration: [e.g. 5 Nights / 6 Days]
- Starting price (₹): [e.g. 12000]
- Target traveler: [couple / family / group / solo]

Return exactly in this format:

TITLE: (under 65 characters)
SLUG: (url-safe, e.g. srinagar-gulmarg-5n-6d)
SHORT DESCRIPTION: (1 sentence, under 155 characters)
FULL DESCRIPTION: (2–3 paragraphs in Markdown)

INCLUSIONS: (one per line)
- 
- 

EXCLUSIONS: (one per line)
- 
- 

ITINERARY: (one per line, format: Day title | Description)
Day 1 — Arrival in Srinagar | 
Day 2 — Gulmarg | 

FAQS: (one per line, format: Q: question | A: answer)
Q: | A: 
Q: | A: 

GOOD TO KNOW: (one per line)
- 

META TITLE: (under 60 characters)
META DESCRIPTION: (under 155 characters)
KEYWORDS: keyword1, keyword2, keyword3`

type AdminFormAction = (
  state: AdminFormState,
  formData: FormData,
) => AdminFormState | Promise<AdminFormState>

type MediaOption = {
  id: string
  storageUrl: string
  altText: string | null
  originalFileName: string
  type: string
}

function fieldError(state: AdminFormState, name: string) {
  return state.fieldErrors?.[name]
}

function inputStyles(error?: string) {
  return `${inputClass} mt-2 ${error ? errorInputClass : ""}`
}

function FieldError({ name, error }: { name: string; error?: string }) {
  return error ? (
    <p id={`${name}-error`} className="mt-1 text-xs font-semibold text-destructive">
      {error}
    </p>
  ) : null
}

function fieldA11y(name: string, error?: string) {
  return {
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${name}-error` : undefined,
  }
}

function textValue(formData: FormData, name: string) {
  return String(formData.get(name) || "").trim()
}

function validateAbsoluteUrl(
  errors: Record<string, string>,
  formData: FormData,
  name: string,
  label: string,
) {
  const value = textValue(formData, name)
  if (!value) return

  try {
    const url = new URL(value)
    if (!["http:", "https:"].includes(url.protocol)) {
      errors[name] = `${label} must start with http or https.`
    }
  } catch {
    errors[name] = `${label} must be a valid URL.`
  }
}

function validatePackageForm(formData: FormData) {
  const errors: Record<string, string> = {}
  const title = textValue(formData, "title")
  const slug = slugify(textValue(formData, "slug") || title)
  const shortDescription = textValue(formData, "shortDescription")
  const price = textValue(formData, "priceStartingFrom")
  const metaTitle = textValue(formData, "metaTitle")
  const metaDescription = textValue(formData, "metaDescription")

  if (title.length < 3) errors.title = "Title must be at least 3 characters."
  if (slug.length < 3) errors.slug = "Slug needs at least 3 URL-safe characters."
  if (shortDescription.length < 10) {
    errors.shortDescription = "Short description must be at least 10 characters."
  }
  if (price && (!Number.isFinite(Number(price)) || Number(price) <= 0)) {
    errors.priceStartingFrom = "Starting price must be a positive number."
  }
  if (metaTitle.length > 80) {
    errors.metaTitle = "Meta title must be 80 characters or less."
  }
  if (metaDescription.length > 180) {
    errors.metaDescription = "Meta description must be 180 characters or less."
  }

  validateAbsoluteUrl(errors, formData, "itineraryUrl", "Itinerary PDF URL")
  validateAbsoluteUrl(errors, formData, "canonicalUrl", "Canonical URL")

  return errors
}

// ── Simple char counter ──────────────────────────────────────────────────────
function CharCount({ current, max }: { current: number; max: number }) {
  const isOver = current > max
  return (
    <span className={`ml-auto text-xs tabular-nums ${isOver ? "text-destructive" : "text-muted-foreground"}`}>
      {current}/{max}
    </span>
  )
}

// ── Section divider ──────────────────────────────────────────────────────────
function SectionCard({
  title,
  subtitle,
  children,
  defaultOpen = true,
  collapsible = false,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  defaultOpen?: boolean
  collapsible?: boolean
}) {
  if (collapsible) {
    return (
      <details className="group rounded-xl border border-border bg-card" open={defaultOpen}>
        <summary className="flex cursor-pointer select-none list-none items-center justify-between px-5 py-4 [&::-webkit-details-marker]:hidden">
          <div>
            <h2 className="font-heading text-xl font-semibold">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          <svg
            className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="border-t border-border px-5 pb-5 pt-4">{children}</div>
      </details>
    )
  }

  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="font-heading text-xl font-semibold">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="px-5 pb-5 pt-4">{children}</div>
    </section>
  )
}

export function PackageForm({
  action,
  submitLabel,
  media,
  pkg,
}: {
  action: AdminFormAction
  submitLabel: string
  media: MediaOption[]
  pkg?: any
}) {
  const [state, formAction, isPending] = useActionState(action, initialFormState)
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})
  const [clientMessage, setClientMessage] = useState("")

  // Live char counts
  const [shortDescLen, setShortDescLen] = useState((pkg?.shortDescription || "").length)
  const [metaTitleLen, setMetaTitleLen] = useState((pkg?.metaTitle || "").length)
  const [metaDescLen, setMetaDescLen] = useState((pkg?.metaDescription || "").length)

  const selectedGallery = new Set(toStringArray(pkg?.galleryImageIds))

  const displayState = {
    ...state,
    fieldErrors: { ...(state.fieldErrors || {}), ...clientErrors },
  }
  const noticeMessage = clientMessage || state.message

  const titleError = fieldError(displayState, "title")
  const slugError = fieldError(displayState, "slug")
  const shortDescriptionError = fieldError(displayState, "shortDescription")
  const fullDescriptionError = fieldError(displayState, "fullDescription")
  const priceError = fieldError(displayState, "priceStartingFrom")
  const metaTitleError = fieldError(displayState, "metaTitle")
  const metaDescriptionError = fieldError(displayState, "metaDescription")
  const canonicalUrlError = fieldError(displayState, "canonicalUrl")
  const itineraryUrlError = fieldError(displayState, "itineraryUrl")

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const errors = validatePackageForm(new FormData(event.currentTarget))
    if (Object.keys(errors).length === 0) {
      setClientErrors({})
      setClientMessage("")
      return
    }
    event.preventDefault()
    setClientErrors(errors)
    setClientMessage("Please fix the highlighted fields before saving.")
  }

  // Build itinerary default value from JSON
  const itineraryDefault = (Array.isArray(pkg?.itineraryJson) ? pkg.itineraryJson : [])
    .map((item: any) =>
      [item.title, item.description].filter(Boolean).join(" | "),
    )
    .join("\n")

  // Build FAQs default value
  const faqsDefault = (Array.isArray(pkg?.faqsJson) ? pkg.faqsJson : [])
    .map((item: any) => {
      const q = item.question || item.q || ""
      const a = item.answer || item.a || ""
      return `Q: ${q} | A: ${a}`
    })
    .join("\n")

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      {pkg?.id ? <input type="hidden" name="id" value={pkg.id} /> : null}

      {/* ── Main column ─────────────────────────────────────────────────── */}
      <div className="min-w-0 space-y-5">

        {noticeMessage ? (
          <div
            role="alert"
            className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
              state.ok
                ? "border-accent/30 bg-accent/10 text-accent"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {noticeMessage}
          </div>
        ) : null}

        {/* ── 1. Package Basics ─────────────────────────────────────────── */}
        <SectionCard title="Package Basics" subtitle="The essentials — fill these first.">
          <div className="grid gap-4 sm:grid-cols-2">

            <label className={`${labelClass} sm:col-span-2`}>
              Package Title *
              <input
                name="title"
                defaultValue={pkg?.title || ""}
                placeholder="e.g. 5 Nights Srinagar & Gulmarg Family Package"
                className={inputStyles(titleError)}
                {...fieldA11y("title", titleError)}
              />
              <p className={hintClass}>Keep it under 65 characters. Be specific — include destination and duration.</p>
              <FieldError name="title" error={titleError} />
            </label>

            <label className={labelClass}>
              URL Slug *
              <input
                name="slug"
                defaultValue={pkg?.slug || ""}
                placeholder="auto-generated from title"
                className={inputStyles(slugError)}
                {...fieldA11y("slug", slugError)}
              />
              <p className={hintClass}>Auto-fills from title. Example: srinagar-gulmarg-5n-6d</p>
              <FieldError name="slug" error={slugError} />
            </label>

            <label className={labelClass}>
              Location / Destination
              <input
                name="location"
                defaultValue={pkg?.location || ""}
                placeholder="e.g. Srinagar, Gulmarg, Pahalgam"
                className={`${inputClass} mt-2`}
              />
              <p className={hintClass}>Main places covered in this package.</p>
            </label>

            <label className={labelClass}>
              Duration
              <input
                name="duration"
                defaultValue={pkg?.duration || ""}
                placeholder="e.g. 5 Nights / 6 Days"
                className={`${inputClass} mt-2`}
              />
            </label>

            <label className={labelClass}>
              Starting Price (₹)
              <input
                name="priceStartingFrom"
                type="number"
                min={1}
                defaultValue={pkg?.priceStartingFrom || ""}
                placeholder="e.g. 12000"
                className={inputStyles(priceError)}
                {...fieldA11y("priceStartingFrom", priceError)}
              />
              <p className={hintClass}>Shown as "Starting from ₹12,000". Leave blank if not decided.</p>
              <FieldError name="priceStartingFrom" error={priceError} />
            </label>

            <label className={labelClass}>
              Itinerary PDF Link (optional)
              <input
                name="itineraryUrl"
                type="url"
                defaultValue={pkg?.itineraryUrl || ""}
                placeholder="https://your-link.com/itinerary.pdf"
                className={inputStyles(itineraryUrlError)}
                {...fieldA11y("itineraryUrl", itineraryUrlError)}
              />
              <p className={hintClass}>If you have a PDF brochure, paste its public link here.</p>
              <FieldError name="itineraryUrl" error={itineraryUrlError} />
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              <div className="flex items-center justify-between">
                Short Description *
                <CharCount current={shortDescLen} max={155} />
              </div>
              <textarea
                name="shortDescription"
                rows={3}
                defaultValue={pkg?.shortDescription || ""}
                onChange={(e) => setShortDescLen(e.target.value.length)}
                placeholder="A 1-sentence summary. e.g. 5-night Kashmir family trip with houseboat stay, Gulmarg gondola ride, and Pahalgam valley visit."
                className={`${inputStyles(shortDescriptionError)} resize-y`}
                {...fieldA11y("shortDescription", shortDescriptionError)}
              />
              <p className={hintClass}>Shown on the package card. Keep it under 155 characters for best SEO.</p>
              <FieldError name="shortDescription" error={shortDescriptionError} />
            </label>

            <div className="sm:col-span-2">
              <RichTextEditor
                name="fullDescription"
                label="Full Description (optional)"
                initialValue={pkg?.fullDescription || ""}
                error={fullDescriptionError}
              />
              <p className={hintClass}>
                A 2–3 paragraph welcoming overview of the package. Shown on the package detail page under "Overview". You can use the AI prompt (right panel) to generate this.
              </p>
            </div>

          </div>
        </SectionCard>

        {/* ── 2. Trip Details ───────────────────────────────────────────── */}
        <SectionCard
          title="Trip Details"
          subtitle="What travelers will see on the package page. Each line = one bullet point."
          collapsible
          defaultOpen={Boolean(
            toStringArray(pkg?.inclusions).length ||
            toStringArray(pkg?.highlights).length
          )}
        >
          <div className="grid gap-5">

            <label className={labelClass}>
              ✅ What&apos;s Included
              <textarea
                name="inclusions"
                rows={5}
                defaultValue={toStringArray(pkg?.inclusions).join("\n")}
                placeholder={"Hotel accommodation (3-star)\nPrivate cab for all transfers\nDaily breakfast\nSightseeing as per itinerary\nFunzip travel coordinator"}
                className={`${inputClass} mt-2 resize-y font-mono text-xs`}
              />
              <p className={hintClass}>One item per line. These appear as a checklist on the package page.</p>
            </label>

            <label className={labelClass}>
              ❌ What&apos;s Not Included
              <textarea
                name="exclusions"
                rows={4}
                defaultValue={toStringArray(pkg?.exclusions).join("\n")}
                placeholder={"Flights to/from Srinagar\nPersonal expenses\nAdventure activity tickets (gondola, skiing)\nAny meals not mentioned"}
                className={`${inputClass} mt-2 resize-y font-mono text-xs`}
              />
              <p className={hintClass}>One item per line. Helps set clear expectations with travelers.</p>
            </label>

            <label className={labelClass}>
              🌄 Day-wise Itinerary
              <textarea
                name="itinerary"
                rows={8}
                defaultValue={itineraryDefault}
                placeholder={"Day 1 — Arrival in Srinagar | Airport pickup, Dal Lake shikara ride, houseboat check-in.\nDay 2 — Srinagar Local | Mughal Gardens, Hazratbal Mosque, local market walk.\nDay 3 — Gulmarg | Gondola ride (Phase 1 & 2), snow activities, return to Srinagar.\nDay 4 — Pahalgam | Betaab Valley, Aru Valley, Baisaran meadow visit.\nDay 5 — Leisure / Shopping | Free time, souvenir shopping, evening departure prep.\nDay 6 — Checkout | Breakfast, airport drop."}
                className={`${inputClass} mt-2 resize-y font-mono text-xs`}
              />
              <p className={hintClass}>
                Format: <code className="rounded bg-muted px-1">Day title | Brief description</code> — one day per line.
                The pipe ( | ) separates the day name from its description. Leave description blank if not needed.
              </p>
            </label>

            <label className={labelClass}>
              ❓ FAQs
              <textarea
                name="faqs"
                rows={6}
                defaultValue={faqsDefault}
                placeholder={"Q: Is Gulmarg accessible in winter? | A: Yes, Gulmarg remains accessible in winter and is popular for skiing. Roads may close during heavy snowfall.\nQ: Do you arrange airport pickup? | A: Yes, all our packages include private airport pickup and drop from Srinagar airport.\nQ: Can this package be customized? | A: Absolutely. Contact Funzip and we will adjust hotels, duration, and sightseeing as per your needs."}
                className={`${inputClass} mt-2 resize-y font-mono text-xs`}
              />
              <p className={hintClass}>
                Format: <code className="rounded bg-muted px-1">Q: your question | A: your answer</code> — one FAQ per line.
              </p>
            </label>

            <label className={labelClass}>
              💡 Good to Know
              <textarea
                name="mustKnow"
                rows={4}
                defaultValue={toStringArray(pkg?.mustKnow).join("\n")}
                placeholder={"Best time to visit Kashmir is April–June and September–October.\nAdvance booking is recommended for peak season (May–June).\nGondola tickets are not included — buy at the spot or pre-book online.\nHouseboats are on Dal Lake — carry only essentials for your stay."}
                className={`${inputClass} mt-2 resize-y font-mono text-xs`}
              />
              <p className={hintClass}>One tip per line. Practical notes that help travelers prepare.</p>
            </label>

          </div>
        </SectionCard>

        {/* ── 3. SEO ────────────────────────────────────────────────────── */}
        <SectionCard
          title="SEO"
          subtitle="Helps this package appear in Google. Optional but recommended."
          collapsible
          defaultOpen={Boolean(pkg?.metaTitle || pkg?.metaDescription)}
        >
          <div className="grid gap-4">

            <label className={labelClass}>
              <div className="flex items-center justify-between">
                Meta Title
                <CharCount current={metaTitleLen} max={60} />
              </div>
              <input
                name="metaTitle"
                maxLength={80}
                defaultValue={pkg?.metaTitle || ""}
                onChange={(e) => setMetaTitleLen(e.target.value.length)}
                placeholder="e.g. 5 Night Kashmir Family Package | Funzip"
                className={inputStyles(metaTitleError)}
                {...fieldA11y("metaTitle", metaTitleError)}
              />
              <p className={hintClass}>The browser tab title. Under 60 characters is ideal. Leave blank to use the package title.</p>
              <FieldError name="metaTitle" error={metaTitleError} />
            </label>

            <label className={labelClass}>
              <div className="flex items-center justify-between">
                Meta Description
                <CharCount current={metaDescLen} max={155} />
              </div>
              <textarea
                name="metaDescription"
                rows={3}
                maxLength={180}
                defaultValue={pkg?.metaDescription || ""}
                onChange={(e) => setMetaDescLen(e.target.value.length)}
                placeholder="e.g. Book a 5-night Kashmir family package with houseboat, Gulmarg gondola, Pahalgam, hotel, transport, and Funzip support."
                className={`${inputStyles(metaDescriptionError)} resize-y`}
                {...fieldA11y("metaDescription", metaDescriptionError)}
              />
              <p className={hintClass}>The description shown in Google results. Under 155 characters.</p>
              <FieldError name="metaDescription" error={metaDescriptionError} />
            </label>

            <label className={labelClass}>
              Keywords
              <textarea
                name="keywords"
                rows={2}
                defaultValue={toStringArray(pkg?.keywords).join(", ")}
                placeholder="Kashmir family package, Srinagar Gulmarg tour, 5 night Kashmir trip"
                className={`${inputClass} mt-2 resize-y`}
              />
              <p className={hintClass}>Comma-separated. 3–6 keywords are enough.</p>
            </label>

            <label className={labelClass}>
              Canonical URL (advanced)
              <input
                name="canonicalUrl"
                defaultValue={pkg?.canonicalUrl || ""}
                placeholder="Leave blank unless you have a duplicate page elsewhere"
                className={inputStyles(canonicalUrlError)}
                {...fieldA11y("canonicalUrl", canonicalUrlError)}
              />
              <FieldError name="canonicalUrl" error={canonicalUrlError} />
            </label>

          </div>
        </SectionCard>

      </div>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="space-y-5">

        {/* Publish card — always first, most important */}
        <section className="rounded-xl border border-primary/20 bg-card p-5 shadow-sm">
          <h2 className="font-heading text-xl font-semibold">Publish</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={pkg ? Boolean(pkg.isPublished) : true}
                className="h-4 w-4 accent-primary"
              />
              <span>
                <span className="font-semibold">Published</span>
                <span className="block text-xs text-muted-foreground">Visible to visitors on the website</span>
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={pkg ? Boolean(pkg.isFeatured) : true}
                className="h-4 w-4 accent-primary"
              />
              <span>
                <span className="font-semibold">Featured on homepage</span>
                <span className="block text-xs text-muted-foreground">Appears in the homepage packages carousel</span>
              </span>
            </label>
            <button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving…" : submitLabel}
            </button>
          </div>
        </section>

        {/* Cover image */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-xl font-semibold">Cover Image</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The main photo shown on cards and the package page hero.
          </p>
          <div className="mt-4 space-y-4">
            <label className={labelClass}>
              Select from library
              <select
                name="coverImageId"
                defaultValue={pkg?.coverImageId || ""}
                className={`${inputClass} mt-2`}
              >
                <option value="">— No image selected —</option>
                {media.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.altText || item.originalFileName}
                  </option>
                ))}
              </select>
            </label>
            <ImageUploadInput name="coverImage" label="Or upload a new image" />
          </div>
        </section>

        {/* Gallery */}
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-xl font-semibold">Gallery Images</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Extra photos shown in the gallery section of the package detail page.
          </p>
          <div className="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
            {media.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Upload images in the Gallery section first, then come back to select them here.
              </p>
            ) : (
              media.map((item) => (
                <label key={item.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-secondary/50 transition-colors">
                  <input
                    type="checkbox"
                    name="galleryImageIds"
                    value={item.id}
                    defaultChecked={selectedGallery.has(item.id)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="truncate">{item.altText || item.originalFileName}</span>
                </label>
              ))
            )}
          </div>
        </section>

        {/* OG image — collapsed by default */}
        <details className="rounded-xl border border-border bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 [&::-webkit-details-marker]:hidden">
            <div>
              <h2 className="font-heading text-base font-semibold">Social Share Image (OG)</h2>
              <p className="text-xs text-muted-foreground">Optional — defaults to cover image</p>
            </div>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">
            <label className={labelClass}>
              Select from library
              <select
                name="ogImageId"
                defaultValue={pkg?.ogImageId || ""}
                className={`${inputClass} mt-2`}
              >
                <option value="">Use cover image</option>
                {media.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.altText || item.originalFileName}
                  </option>
                ))}
              </select>
            </label>
            <ImageUploadInput name="ogImage" label="Or upload a new OG image" />
          </div>
        </details>

        {/* AI Prompt */}
        <PromptTemplatePanel
          title="AI Package Writer"
          description="Fill the 5 brackets, copy this into ChatGPT or Gemini, then paste the result into the matching fields above."
          prompt={packagePromptTemplate}
        />

      </aside>
    </form>
  )
}
