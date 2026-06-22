import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/funzip/navbar"
import { Footer } from "@/components/funzip/footer"
import { FloatingActions } from "@/components/funzip/floating-actions"
import { Contact } from "@/components/funzip/contact"
import { getPublishedPackages, getSiteSettings } from "@/lib/cms/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  JsonLd,
  breadcrumbSchema,
  packageCollectionSchema,
} from "@/lib/seo/schema"

export const revalidate = 3600

export async function generateMetadata() {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: "Kashmir Tour Packages",
    description:
      "Explore published Kashmir tour packages from Funzip, including family, honeymoon, luxury, and offbeat itineraries.",
    path: "/packages",
    image: settings.defaultOgImage,
    settings,
  })
}

export default async function PackagesPage() {
  const [settings, packages] = await Promise.all([
    getSiteSettings(),
    getPublishedPackages(),
  ])
  const heroImage = packages[0]?.coverImage || {
    url: settings.defaultOgImage || "/images/hero-kashmir.png",
    alt: "Kashmir tour packages",
  }

  return (
    <main>
      <JsonLd
        data={[
          packageCollectionSchema(packages),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Packages", url: "/packages" },
          ]),
        ]}
      />
      <Navbar />
      <section className="relative isolate min-h-[52svh] overflow-hidden bg-black px-4 pb-16 pt-32 text-white sm:px-6 sm:pt-36 lg:px-8">
        <Image
          src={heroImage.url}
          alt={heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/65 via-black/45 to-black/80" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
            Curated Journeys
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight sm:text-5xl">
            Kashmir Tour Packages
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Choose a published itinerary or ask Funzip to customize hotels,
            transport, sightseeing, and pacing around your travel dates.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <article
              key={pkg.id}
              className="group min-w-0 overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={pkg.coverImage.url}
                  alt={pkg.coverImage.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {pkg.duration || pkg.location || "Kashmir"}
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold leading-tight">
                  {pkg.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pkg.shortDescription}
                </p>
                <div className="mt-5 flex flex-col gap-4 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
                  <span className="text-sm font-semibold">{pkg.priceLabel}</span>
                  <Link
                    href={`/packages/${pkg.slug}`}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Contact settings={settings} sourcePage="/packages" />
      <Footer settings={settings} packages={packages} />
      <FloatingActions settings={settings} />
    </main>
  )
}
