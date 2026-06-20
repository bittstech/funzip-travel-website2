"use client"

import { useActionState } from "react"
import { ImageUploadInput } from "./image-upload-input"
import { RichTextEditor } from "./rich-text-editor"
import type { AdminFormState } from "@/app/admin/actions"
import { toStringArray } from "@/lib/cms/utils"

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

export function BlogForm({
  action,
  submitLabel,
  media,
  blog,
}: {
  action: AdminFormAction
  submitLabel: string
  media: MediaOption[]
  blog?: any
}) {
  const [state, formAction, isPending] = useActionState(action, initialFormState)

  const titleError = fieldError(state, "title")
  const slugError = fieldError(state, "slug")
  const excerptError = fieldError(state, "excerpt")
  const contentError = fieldError(state, "content")
  const metaTitleError = fieldError(state, "metaTitle")
  const metaDescriptionError = fieldError(state, "metaDescription")
  const canonicalUrlError = fieldError(state, "canonicalUrl")

  return (
    <form action={formAction} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      {blog?.id ? <input type="hidden" name="id" value={blog.id} /> : null}

      <div className="min-w-0 space-y-5">
        {state.message ? (
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {state.message}
          </div>
        ) : null}

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-2xl font-semibold">Blog Details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Title
              <input
                name="title"
                defaultValue={blog?.title || ""}
                className={inputStyles(titleError)}
                {...fieldA11y("title", titleError)}
              />
              <FieldError name="title" error={titleError} />
            </label>
            <label className={labelClass}>
              Slug
              <input
                name="slug"
                defaultValue={blog?.slug || ""}
                placeholder="auto-generated from title"
                className={inputStyles(slugError)}
                {...fieldA11y("slug", slugError)}
              />
              <FieldError name="slug" error={slugError} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Excerpt
              <textarea
                name="excerpt"
                rows={3}
                defaultValue={blog?.excerpt || ""}
                className={`${inputStyles(excerptError)} resize-y`}
                {...fieldA11y("excerpt", excerptError)}
              />
              <FieldError name="excerpt" error={excerptError} />
            </label>
            <div className="sm:col-span-2">
              <RichTextEditor
                name="content"
                label="Content"
                initialValue={blog?.content || ""}
                error={contentError}
              />
            </div>
            <label className={labelClass}>
              Author
              <input
                name="authorName"
                defaultValue={blog?.authorName || "Funzip Travel Team"}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className={labelClass}>
              Category
              <input
                name="category"
                defaultValue={blog?.category || ""}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              Tags
              <textarea
                name="tags"
                rows={3}
                defaultValue={toStringArray(blog?.tags).join(", ")}
                placeholder="Comma-separated tags"
                className={`${inputClass} mt-2 resize-y`}
              />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              FAQs
              <textarea
                name="faqs"
                rows={5}
                defaultValue={(Array.isArray(blog?.faqsJson) ? blog.faqsJson : [])
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
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-heading text-2xl font-semibold">SEO</h2>
          <div className="mt-5 grid gap-4">
            <label className={labelClass}>
              Meta Title
              <input
                name="metaTitle"
                maxLength={80}
                defaultValue={blog?.metaTitle || ""}
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
                defaultValue={blog?.metaDescription || ""}
                className={`${inputStyles(metaDescriptionError)} resize-y`}
                {...fieldA11y("metaDescription", metaDescriptionError)}
              />
              <FieldError name="metaDescription" error={metaDescriptionError} />
            </label>
            <label className={labelClass}>
              Canonical URL
              <input
                name="canonicalUrl"
                defaultValue={blog?.canonicalUrl || ""}
                className={inputStyles(canonicalUrlError)}
                {...fieldA11y("canonicalUrl", canonicalUrlError)}
              />
              <FieldError name="canonicalUrl" error={canonicalUrlError} />
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
                defaultChecked={Boolean(blog?.isPublished)}
              />
              Published
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
                defaultValue={blog?.coverImageId || ""}
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
                defaultValue={blog?.ogImageId || ""}
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
      </aside>
    </form>
  )
}
