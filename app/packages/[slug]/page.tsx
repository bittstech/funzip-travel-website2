import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/funzip/navbar"
import { Footer } from "@/components/funzip/footer"
import { FloatingActions } from "@/components/funzip/floating-actions"
import { Contact } from "@/components/funzip/contact"
import { PackageInfoAccordion } from "@/components/funzip/package-info-accordion"
import {
  getPackageBySlug,
  getPublishedPackages,
  getSiteSettings,
} from "@/lib/cms/queries"
import { markdownToHtml } from "@/lib/cms/markdown"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  packageSchema,
} from "@/lib/seo/schema"

export const revalidate = 3600

export async function generateStaticParams() {
  const packages = await getPublishedPackages()
  return packages.map((pkg) => ({ slug: pkg.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const [{ slug }, settings] = await Promise.all([params, getSiteSettings()])
  const pkg = await getPackageBySlug(slug)
  if (!pkg) return {}

  return buildMetadata({
    title: pkg.metaTitle || pkg.title,
    description: pkg.metaDescription || pkg.shortDescription,
    path: `/packages/${pkg.slug}`,
    image: pkg.ogImage || pkg.coverImage,
    canonical: pkg.canonicalUrl,
    keywords: pkg.keywords,
    settings,
  })
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [settings, packages, pkg] = await Promise.all([
    getSiteSettings(),
    getPublishedPackages(),
    getPackageBySlug(slug),
  ])

  if (!pkg) notFound()
  const overviewHtml = pkg.fullDescription
    ? markdownToHtml(pkg.fullDescription)
    : undefined

  return (
    <main>
      <JsonLd
        data={[
          packageSchema(pkg),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Packages", url: "/packages" },
            { name: pkg.title, url: `/packages/${pkg.slug}` },
          ]),
          faqSchema(pkg.faqs),
        ].filter(Boolean) as any}
      />
      <Navbar />
      <section className="relative isolate min-h-[70svh] overflow-hidden bg-black px-5 pb-16 pt-36 text-white lg:px-8">
        <Image
          src={pkg.coverImage.url}
          alt={pkg.coverImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <Link href="/packages" className="text-sm font-semibold text-white/85">
            Packages
          </Link>
          <h1 className="mt-5 max-w-4xl font-heading text-5xl font-semibold leading-tight sm:text-6xl">
            {pkg.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
            {pkg.shortDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
            {pkg.duration ? (
              <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                {pkg.duration}
              </span>
            ) : null}
            {pkg.location ? (
              <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                {pkg.location}
              </span>
            ) : null}
            <span className="rounded-full bg-primary px-4 py-2 text-primary-foreground">
              {pkg.priceLabel}
            </span>
          </div>
          {pkg.services.length ? (
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-white/90">
              {pkg.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur"
                >
                  {service}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            <PackageInfoAccordion pkg={pkg} overviewHtml={overviewHtml} />

            {pkg.galleryImages.length ? (
              <div>
                <h2 className="font-heading text-3xl font-semibold">
                  Gallery
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {pkg.galleryImages.map((image) => (
                    <div key={image.id || image.url} className="relative h-64 overflow-hidden rounded-xl">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

          </div>

          <aside className="h-fit rounded-xl border border-border bg-card p-5 lg:sticky lg:top-24">
            <h2 className="font-heading text-2xl font-semibold">
              Book This Trip
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Share your dates and group size. Funzip will send a custom quote
              for {pkg.title}.
            </p>
            <div className="mt-5 grid gap-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber || "910000000000"}`}
                className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                WhatsApp Now
              </a>
              <a
                href={`tel:${(settings.phonePrimary || "+91 00000 00000").replace(/\s/g, "")}`}
                className="rounded-full border border-border px-5 py-3 text-center text-sm font-semibold"
              >
                Call Funzip
              </a>
            </div>
          </aside>
        </div>
      </section>

      <Contact settings={settings} sourcePage={`/packages/${pkg.slug}`} />
      <Footer settings={settings} packages={packages} />
      <FloatingActions settings={settings} />
    </main>
  )
}
