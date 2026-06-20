import Image from "next/image"
import { Navbar } from "@/components/funzip/navbar"
import { Footer } from "@/components/funzip/footer"
import { FloatingActions } from "@/components/funzip/floating-actions"
import {
  getGalleryImages,
  getPublishedPackages,
  getSiteSettings,
} from "@/lib/cms/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { JsonLd, breadcrumbSchema, gallerySchema } from "@/lib/seo/schema"

export const revalidate = 3600

export async function generateMetadata() {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: "Kashmir Gallery",
    description:
      "View Kashmir travel photos from Funzip, including lakes, gardens, valleys, meadows, snow adventures, and houseboat moments.",
    path: "/gallery",
    image: settings.defaultOgImage,
    settings,
  })
}

export default async function GalleryPage() {
  const [settings, packages, images] = await Promise.all([
    getSiteSettings(),
    getPublishedPackages(),
    getGalleryImages(),
  ])

  return (
    <main>
      <JsonLd
        data={[
          gallerySchema(images),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Gallery", url: "/gallery" },
          ]),
        ]}
      />
      <Navbar />
      <section className="bg-secondary/40 px-5 pb-16 pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Gallery
          </p>
          <h1 className="mt-3 font-heading text-5xl font-semibold">
            Kashmir Travel Gallery
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Browse active gallery images managed from the Funzip CMS.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((item) => (
            <figure key={item.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="relative h-72">
                <Image
                  src={item.image.url}
                  alt={item.altText || item.image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="p-4">
                <p className="font-heading text-xl font-semibold">{item.title}</p>
                {item.location ? (
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Footer settings={settings} packages={packages} />
      <FloatingActions settings={settings} />
    </main>
  )
}
