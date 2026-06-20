import Image from "next/image"
import { AdminNotice } from "@/components/admin/admin-notice"
import { ImageUploadInput } from "@/components/admin/image-upload-input"
import {
  createHeroSlideAction,
  deleteHeroSlideAction,
  updateHeroSlideAction,
} from "@/app/admin/actions"
import { getPrisma } from "@/lib/cms/prisma"

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
const labelClass = "block text-sm font-semibold"

export default async function AdminHeroPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const [params, slides] = await Promise.all([
    searchParams,
    getPrisma().heroSlide.findMany({
      include: { image: true, mobileImage: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ])

  return (
    <div>
      <AdminNotice params={params} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Homepage
        </p>
        <h1 className="mt-2 font-heading text-4xl font-semibold">
          Hero Images
        </h1>
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-2xl font-semibold">Add Hero Slide</h2>
        <form
          action={createHeroSlideAction}
          className="mt-5 grid gap-4 lg:grid-cols-2"
        >
          <label className={labelClass}>
            Title
            <input name="title" required className={`${inputClass} mt-2`} />
          </label>
          <label className={labelClass}>
            Subtitle
            <input name="subtitle" className={`${inputClass} mt-2`} />
          </label>
          <label className={labelClass}>
            CTA Text
            <input name="ctaText" className={`${inputClass} mt-2`} />
          </label>
          <label className={labelClass}>
            CTA URL
            <input name="ctaUrl" placeholder="/packages" className={`${inputClass} mt-2`} />
          </label>
          <label className={labelClass}>
            Sort Order
            <input name="sortOrder" type="number" defaultValue={0} className={`${inputClass} mt-2`} />
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm font-semibold">
            <input name="isActive" type="checkbox" defaultChecked />
            Active
          </label>
          <ImageUploadInput name="image" label="Desktop Hero Image" required />
          <ImageUploadInput name="mobileImage" label="Optional Mobile Hero Image" />
          <div className="lg:col-span-2">
            <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              Add Slide
            </button>
          </div>
        </form>
      </section>

      <div className="mt-8 grid gap-5">
        {slides.map((slide) => (
          <section key={slide.id} className="rounded-xl border border-border bg-card p-5">
            <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
              <div className="relative h-36 overflow-hidden rounded-lg bg-secondary">
                <Image
                  src={slide.image.storageUrl}
                  alt={slide.image.altText || slide.title}
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <h2 className="font-heading text-2xl font-semibold">
                      {slide.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Sort {slide.sortOrder} · {slide.isActive ? "Active" : "Disabled"}
                    </p>
                  </div>
                  <form action={deleteHeroSlideAction}>
                    <input type="hidden" name="id" value={slide.id} />
                    <button className="rounded-full border border-destructive/30 px-4 py-2 text-sm font-semibold text-destructive">
                      Delete
                    </button>
                  </form>
                </div>

                <details className="mt-5">
                  <summary className="cursor-pointer text-sm font-semibold text-primary">
                    Edit slide
                  </summary>
                  <form
                    action={updateHeroSlideAction}
                    className="mt-4 grid gap-4 lg:grid-cols-2"
                  >
                    <input type="hidden" name="id" value={slide.id} />
                    <label className={labelClass}>
                      Title
                      <input
                        name="title"
                        required
                        defaultValue={slide.title}
                        className={`${inputClass} mt-2`}
                      />
                    </label>
                    <label className={labelClass}>
                      Subtitle
                      <input
                        name="subtitle"
                        defaultValue={slide.subtitle || ""}
                        className={`${inputClass} mt-2`}
                      />
                    </label>
                    <label className={labelClass}>
                      CTA Text
                      <input
                        name="ctaText"
                        defaultValue={slide.ctaText || ""}
                        className={`${inputClass} mt-2`}
                      />
                    </label>
                    <label className={labelClass}>
                      CTA URL
                      <input
                        name="ctaUrl"
                        defaultValue={slide.ctaUrl || ""}
                        className={`${inputClass} mt-2`}
                      />
                    </label>
                    <label className={labelClass}>
                      Sort Order
                      <input
                        name="sortOrder"
                        type="number"
                        defaultValue={slide.sortOrder}
                        className={`${inputClass} mt-2`}
                      />
                    </label>
                    <label className="flex items-end gap-2 pb-2 text-sm font-semibold">
                      <input
                        name="isActive"
                        type="checkbox"
                        defaultChecked={slide.isActive}
                      />
                      Active
                    </label>
                    <ImageUploadInput name="image" label="Replace Desktop Image" />
                    <ImageUploadInput name="mobileImage" label="Replace Mobile Image" />
                    <div className="lg:col-span-2">
                      <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                        Save Slide
                      </button>
                    </div>
                  </form>
                </details>
              </div>
            </div>
          </section>
        ))}
        {slides.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-muted-foreground">
            No hero slides yet.
          </div>
        ) : null}
      </div>
    </div>
  )
}
