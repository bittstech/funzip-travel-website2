import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
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
      <section className="relative isolate min-h-[70svh] overflow-hidden bg-black px-4 pb-16 pt-32 text-white sm:px-6 sm:pt-36 lg:px-8">
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
          <h1 className="mt-5 max-w-4xl font-heading text-4xl font-semibold leading-tight sm:text-6xl">
            {pkg.title}
          </h1>
          <p className="mt-5 max-w-2xl break-words text-lg leading-relaxed text-white/90">
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
            {pkg.services.length ? (
              <span className="rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                {pkg.services.length} Included Services
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,360px)]">
          <div className="min-w-0 space-y-12">
            
            {/* Overview Section */}
            {overviewHtml ? (
              <div className="min-w-0">
                <h2 className="font-heading text-3xl font-semibold">Overview</h2>
                <div
                  className="mt-6 max-w-none overflow-x-auto leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:font-heading [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:my-4 [&_ol]:list-decimal [&_p]:my-3 [&_strong]:font-semibold [&_table]:w-full [&_table]:min-w-[36rem] [&_ul]:my-4 [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: overviewHtml }}
                />
              </div>
            ) : null}

            {/* Inclusions Checkmarks (Upfront) */}
            {pkg.inclusions.length > 0 ? (
              <div>
                <h2 className="font-heading text-3xl font-semibold">What&apos;s Included</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {pkg.inclusions.map((inclusion, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 rounded-lg bg-secondary/45 px-4 py-3 text-sm leading-relaxed text-foreground/80"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="min-w-0 font-medium">{inclusion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* The rest of the structured details inside the accordion */}
            <PackageInfoAccordion pkg={pkg} />

            {/* Gallery with Hover States */}
            {pkg.galleryImages.length ? (
              <div>
                <h2 className="font-heading text-3xl font-semibold">
                  Gallery
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {pkg.galleryImages.map((image, imageIndex) => (
                    <div
                      key={`${image.id || image.url}-${imageIndex}`}
                      className="group relative h-64 overflow-hidden rounded-xl bg-muted"
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="font-semibold text-white">{image.title || image.alt}</p>
                        {image.location ? (
                          <p className="text-xs text-white/80">{image.location}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

          </div>

          <aside className="h-fit min-w-0 space-y-6 lg:sticky lg:top-24">
            
            {/* Price & Summary Card */}
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="border-b border-border bg-secondary/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Starting from</p>
                <p className="mt-1 font-heading text-3xl font-semibold text-primary">{pkg.priceLabel}</p>
                <p className="mt-1 text-xs text-muted-foreground">per person (customizable)</p>
              </div>
              <div className="p-5">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {pkg.duration ? (
                    <li className="flex justify-between border-b border-border/50 pb-3">
                      <span>Duration</span>
                      <span className="font-medium text-foreground">{pkg.duration}</span>
                    </li>
                  ) : null}
                  {pkg.location ? (
                    <li className="flex justify-between border-b border-border/50 pb-3">
                      <span>Location</span>
                      <span className="font-medium text-foreground text-right">{pkg.location}</span>
                    </li>
                  ) : null}
                </ul>

                <h3 className="mt-6 font-semibold">Book This Trip</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Share your dates and group size. Funzip will send a custom quote for {pkg.title}.
                </p>
                
                <div className="mt-5 grid gap-3">
                  <a
                    href={`https://wa.me/${settings.whatsappNumber || "910000000000"}`}
                    className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 shadow-sm hover:shadow"
                  >
                    WhatsApp Now
                  </a>
                  <a
                    href={`tel:${(settings.phonePrimary || "+91 00000 00000").replace(/\s/g, "")}`}
                    className="rounded-full border border-border bg-card px-5 py-3 text-center text-sm font-semibold transition hover:bg-secondary/50"
                  >
                    Call Funzip
                  </a>
                </div>
              </div>
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
