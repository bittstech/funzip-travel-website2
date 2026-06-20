"use client"

import { type FormEvent, useActionState, useState } from "react"
import { ImageUploadInput } from "./image-upload-input"
import { PackageSectionsInput } from "./package-sections-input"
import { RichTextEditor } from "./rich-text-editor"
import type { AdminFormState } from "@/app/admin/actions"
import {
  parseContentSections,
  parseItinerary,
  slugify,
  toStringArray,
} from "@/lib/cms/utils"

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
const errorInputClass = "border-destructive focus:border-destructive focus:ring-destructive/20"
const labelClass = "block text-sm font-semibold"
const initialFormState: AdminFormState = { ok: false, message: "", fieldErrors: {} }

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

function packageSectionsFromPackage(pkg: any) {
  const savedSections = parseContentSections(pkg?.contentSections)
  if (savedSections.length > 0) return savedSections

  const fallbackSections = [
    {
      id: "services",
      title: "Services",
      lines: toStringArray(pkg?.services),
    },
    {
      id: "highlights",
      title: "Highlights",
      lines: toStringArray(pkg?.highlights),
    },
    {
      id: "inclusions",
      title: "Inclusions",
      lines: toStringArray(pkg?.inclusions),
    },
    {
      id: "exclusions",
      title: "Exclusions",
      lines: toStringArray(pkg?.exclusions),
    },
    {
      id: "must-know",
      title: "Must Know",
      lines: toStringArray(pkg?.mustKnow),
    },
    {
      id: "itinerary",
      title: "Itinerary",
      lines: parseItinerary(pkg?.itineraryJson).map((day) =>
        [day.title, day.description].filter(Boolean).join(" - "),
      ),
    },
  ]

  return fallbackSections.filter((section) => section.lines.length > 0)
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
  const itineraryUrlError = fieldError(displayState, "itineraryUrl")
  const priceError = fieldError(displayState, "priceStartingFrom")
  const metaTitleError = fieldError(displayState, "metaTitle")
  const metaDescriptionError = fieldError(displayState, "metaDescription")
  const canonicalUrlError = fieldError(displayState, "canonicalUrl")

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

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      {pkg?.id ? <input type="hidden" name="id" value={pkg.id} /> : null}

      <div className="min-w-0 space-y-5">
        {noticeMessage ? (
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {noticeMessage}
          </div>
        ) : null}

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-2xl font-semibold">Package Details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Title
              <input
                name="title"
                defaultValue={pkg?.title || ""}
                className={inputStyles(titleError)}
                {...fieldA11y("title", titleError)}
              />
              <FieldError name="title" error={titleError} />
            </label>
            <label className={labelClass}>
              Slug
              <input
                name="slug"
                defaultValue={pkg?.slug || ""}
                placeholder="auto-generated from title"
                className={inputStyles(slugError)}
                {...fieldA11y("slug", slugError)}
              />
              <FieldError name="slug" error={slugError} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Short Description
              <textarea
                name="shortDescription"
                rows={3}
                defaultValue={pkg?.shortDescription || ""}
                className={`${inputStyles(shortDescriptionError)} resize-y`}
                {...fieldA11y("shortDescription", shortDescriptionError)}
              />
              <FieldError name="shortDescription" error={shortDescriptionError} />
            </label>
            <div className="sm:col-span-2">
              <RichTextEditor
                name="fullDescription"
                label="Full Description"
                initialValue={pkg?.fullDescription || ""}
                error={fullDescriptionError}
              />
            </div>
            <label className={labelClass}>
              Destination / Location
              <input
                name="location"
                defaultValue={pkg?.location || ""}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className={labelClass}>
              Duration
              <input
                name="duration"
                defaultValue={pkg?.duration || ""}
                placeholder="5 Nights / 6 Days"
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className={labelClass}>
              Starting Price
              <input
                name="priceStartingFrom"
                type="number"
                min={1}
                defaultValue={pkg?.priceStartingFrom || ""}
                className={inputStyles(priceError)}
                {...fieldA11y("priceStartingFrom", priceError)}
              />
              <FieldError name="priceStartingFrom" error={priceError} />
            </label>
            <label className={labelClass}>
              Itinerary PDF URL
              <input
                name="itineraryUrl"
                type="url"
                defaultValue={pkg?.itineraryUrl || ""}
                placeholder="https://funzip.in/packages/premium-kashmir.pdf"
                className={inputStyles(itineraryUrlError)}
                {...fieldA11y("itineraryUrl", itineraryUrlError)}
              />
              <FieldError name="itineraryUrl" error={itineraryUrlError} />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <PackageSectionsInput
            name="contentSections"
            initialSections={packageSectionsFromPackage(pkg)}
          />
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <details>
            <summary className="cursor-pointer font-heading text-2xl font-semibold">
              Optional Structured Extras
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">
              These fields are optional. Use them when you want separate SEO or
              itinerary data in addition to the display sections above.
            </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Services
              <textarea
                name="services"
                rows={5}
                defaultValue={toStringArray(pkg?.services).join("\n")}
                placeholder={"Sightseeing\nTransportation\nSupport\nMeals\nHotel"}
                className={`${inputClass} mt-2 resize-y`}
              />
            </label>
            <label className={labelClass}>
              Highlights
              <textarea
                name="highlights"
                rows={5}
                defaultValue={toStringArray(pkg?.highlights).join("\n")}
                placeholder="One highlight per line"
                className={`${inputClass} mt-2 resize-y`}
              />
            </label>
            <label className={labelClass}>
              Inclusions
              <textarea
                name="inclusions"
                rows={6}
                defaultValue={toStringArray(pkg?.inclusions).join("\n")}
                placeholder="One inclusion per line"
                className={`${inputClass} mt-2 resize-y`}
              />
            </label>
            <label className={labelClass}>
              Exclusions
              <textarea
                name="exclusions"
                rows={6}
                defaultValue={toStringArray(pkg?.exclusions).join("\n")}
                placeholder="One exclusion per line"
                className={`${inputClass} mt-2 resize-y`}
              />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Must Know / Things to Know Before Booking
              <textarea
                name="mustKnow"
                rows={5}
                defaultValue={toStringArray(pkg?.mustKnow).join("\n")}
                placeholder="One note per line"
                className={`${inputClass} mt-2 resize-y`}
              />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Day-wise Itinerary
              <textarea
                name="itinerary"
                rows={7}
                defaultValue={(Array.isArray(pkg?.itineraryJson)
                  ? pkg.itineraryJson
                  : []
                )
                  .map((item: any) =>
                    [item.title, item.description].filter(Boolean).join(" | "),
                  )
                  .join("\n")}
                placeholder="Day title | Optional description"
                className={`${inputClass} mt-2 resize-y`}
              />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              FAQs
              <textarea
                name="faqs"
                rows={6}
                defaultValue={(Array.isArray(pkg?.faqsJson) ? pkg.faqsJson : [])
                  .map((item: any) =>
                    [item.question || item.q, item.answer || item.a]
                      .filter(Boolean)
                      .join(" | "),
                  )
                  .join("\n")}
                placeholder="Question | Answer"
                className={`${inputClass} mt-2 resize-y`}
              />
            </label>
          </div>
          </details>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-2xl font-semibold">SEO</h2>
          <div className="mt-5 grid gap-4">
            <label className={labelClass}>
              Meta Title
              <input
                name="metaTitle"
                maxLength={80}
                defaultValue={pkg?.metaTitle || ""}
                className={inputStyles(metaTitleError)}
                {...fieldA11y("metaTitle", metaTitleError)}
              />
              <FieldError name="metaTitle" error={metaTitleError} />
            </label>
            <label className={labelClass}>
              Meta Description
              <textarea
                name="metaDescription"
                rows={3}
                maxLength={180}
                defaultValue={pkg?.metaDescription || ""}
                className={`${inputStyles(metaDescriptionError)} resize-y`}
                {...fieldA11y("metaDescription", metaDescriptionError)}
              />
              <FieldError name="metaDescription" error={metaDescriptionError} />
            </label>
            <label className={labelClass}>
              Canonical URL
              <input
                name="canonicalUrl"
                defaultValue={pkg?.canonicalUrl || ""}
                className={inputStyles(canonicalUrlError)}
                {...fieldA11y("canonicalUrl", canonicalUrlError)}
              />
              <FieldError name="canonicalUrl" error={canonicalUrlError} />
            </label>
            <label className={labelClass}>
              Keywords
              <textarea
                name="keywords"
                rows={3}
                defaultValue={toStringArray(pkg?.keywords).join(", ")}
                placeholder="Comma-separated keywords"
                className={`${inputClass} mt-2 resize-y`}
              />
            </label>
          </div>
        </section>
      </div>

      <aside className="space-y-5">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-2xl font-semibold">Publish</h2>
          <div className="mt-5 space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={pkg ? Boolean(pkg.isPublished) : true}
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={pkg ? Boolean(pkg.isFeatured) : true}
              />
              Featured on homepage
            </label>
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving..." : submitLabel}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-2xl font-semibold">Images</h2>
          <div className="mt-5 space-y-4">
            <label className={labelClass}>
              Existing Cover Image
              <select
                name="coverImageId"
                defaultValue={pkg?.coverImageId || ""}
                className={`${inputClass} mt-2`}
              >
                <option value="">No existing image</option>
                {media.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.altText || item.originalFileName}
                  </option>
                ))}
              </select>
            </label>
            <ImageUploadInput name="coverImage" label="Upload New Cover" />
            <label className={labelClass}>
              Existing OG Image
              <select
                name="ogImageId"
                defaultValue={pkg?.ogImageId || ""}
                className={`${inputClass} mt-2`}
              >
                <option value="">Use cover/default</option>
                {media.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.altText || item.originalFileName}
                  </option>
                ))}
              </select>
            </label>
            <ImageUploadInput name="ogImage" label="Upload New OG Image" />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-2xl font-semibold">Gallery Images</h2>
          <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-2">
            {media.map((item) => (
              <label key={item.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="galleryImageIds"
                  value={item.id}
                  defaultChecked={selectedGallery.has(item.id)}
                />
                <span className="truncate">
                  {item.altText || item.originalFileName}
                </span>
              </label>
            ))}
            {media.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Upload images from Gallery first, or use the cover upload.
              </p>
            ) : null}
          </div>
        </section>
      </aside>
    </form>
  )
}
