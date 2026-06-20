import Image from "next/image"
import { AdminNotice } from "@/components/admin/admin-notice"
import { ImageUploadInput } from "@/components/admin/image-upload-input"
import {
  createGalleryImageAction,
  deleteGalleryImageAction,
  updateGalleryImageAction,
} from "@/app/admin/actions"
import { getPrisma } from "@/lib/cms/prisma"

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
const labelClass = "block text-sm font-semibold"

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const [params, images] = await Promise.all([
    searchParams,
    getPrisma().galleryImage.findMany({
      include: { image: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ])

  return (
    <div>
      <AdminNotice params={params} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Media
        </p>
        <h1 className="mt-2 font-heading text-4xl font-semibold">Gallery</h1>
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card p-5">
        <h2 className="font-heading text-2xl font-semibold">Upload Image</h2>
        <form
          action={createGalleryImageAction}
          className="mt-5 grid gap-4 lg:grid-cols-2"
        >
          <label className={labelClass}>
            Title
            <input name="title" className={`${inputClass} mt-2`} />
          </label>
          <label className={labelClass}>
            Location
            <input name="location" className={`${inputClass} mt-2`} />
          </label>
          <label className={labelClass}>
            Alt Text
            <input name="altText" className={`${inputClass} mt-2`} />
          </label>
          <label className={labelClass}>
            Sort Order
            <input name="sortOrder" type="number" defaultValue={0} className={`${inputClass} mt-2`} />
          </label>
          <ImageUploadInput name="image" label="Gallery Image" required />
          <label className="flex items-end gap-2 pb-2 text-sm font-semibold">
            <input name="isActive" type="checkbox" defaultChecked />
            Active
          </label>
          <div className="lg:col-span-2">
            <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              Add Image
            </button>
          </div>
        </form>
      </section>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {images.map((item) => (
          <section key={item.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative h-52 bg-secondary">
              <Image
                src={item.image.storageUrl}
                alt={item.altText || item.image.altText || item.title || "Gallery image"}
                fill
                sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <form action={updateGalleryImageAction} className="space-y-3 p-4">
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="imageId" value={item.imageId} />
              <label className={labelClass}>
                Title
                <input
                  name="title"
                  defaultValue={item.title || ""}
                  className={`${inputClass} mt-2`}
                />
              </label>
              <label className={labelClass}>
                Location
                <input
                  name="location"
                  defaultValue={item.location || ""}
                  className={`${inputClass} mt-2`}
                />
              </label>
              <label className={labelClass}>
                Alt Text
                <input
                  name="altText"
                  defaultValue={item.altText || item.image.altText || ""}
                  className={`${inputClass} mt-2`}
                />
              </label>
              <label className={labelClass}>
                Sort Order
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={item.sortOrder}
                  className={`${inputClass} mt-2`}
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input
                  name="isActive"
                  type="checkbox"
                  defaultChecked={item.isActive}
                />
                Active
              </label>
              <div className="flex gap-2">
                <button className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                  Save
                </button>
              </div>
            </form>
            <form action={deleteGalleryImageAction} className="px-4 pb-4">
              <input type="hidden" name="id" value={item.id} />
              <button className="w-full rounded-full border border-destructive/30 px-4 py-2.5 text-sm font-semibold text-destructive">
                Remove from Gallery
              </button>
            </form>
          </section>
        ))}
      </div>
      {images.length === 0 ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-8 text-muted-foreground">
          No gallery images yet.
        </div>
      ) : null}
    </div>
  )
}
