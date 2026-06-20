import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/funzip/navbar"
import { Footer } from "@/components/funzip/footer"
import { FloatingActions } from "@/components/funzip/floating-actions"
import { Contact } from "@/components/funzip/contact"
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
      <section className="relative min-h-[70svh] overflow-hidden px-5 pb-16 pt-36 text-white lg:px-8">
        <Image
          src={pkg.coverImage.url}
          alt={pkg.coverImage.alt}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />
        <div className="mx-auto max-w-5xl">
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
            {pkg.fullDescription ? (
              <div>
                <h2 className="font-heading text-3xl font-semibold">
                  Overview
                </h2>
                <div
                  className="mt-4 max-w-none leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:font-heading [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:my-4 [&_ol]:list-decimal [&_p]:my-3 [&_strong]:font-semibold [&_ul]:my-4 [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(pkg.fullDescription) }}
                />
              </div>
            ) : null}

            {pkg.services.length ? (
              <div>
                <h2 className="font-heading text-3xl font-semibold">
                  Services
                </h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pkg.services.map((service) => (
                    <div
                      key={service}
                      className="rounded-xl border border-border bg-card p-4 text-sm font-semibold"
                    >
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {pkg.highlights.length ? (
              <div>
                <h2 className="font-heading text-3xl font-semibold">
                  Highlights
                </h2>
                <ul className="mt-5 grid gap-3">
                  {pkg.highlights.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {pkg.itinerary.length || pkg.itineraryUrl ? (
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="font-heading text-3xl font-semibold">
                    Itinerary
                  </h2>
                  {pkg.itineraryUrl ? (
                    <a
                      href={pkg.itineraryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-fit rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary"
                    >
                      View PDF Itinerary
                    </a>
                  ) : null}
                </div>
                {pkg.itinerary.length ? (
                  <div className="mt-5 space-y-4">
                    {pkg.itinerary.map((day) => (
                      <article key={day.day} className="rounded-xl border border-border bg-card p-5">
                        <p className="text-sm font-semibold text-primary">
                          Day {day.day}
                        </p>
                        <h3 className="mt-1 font-heading text-2xl font-semibold">
                          {day.title}
                        </h3>
                        {day.description ? (
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {day.description}
                          </p>
                        ) : null}
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            {pkg.mustKnow.length ? (
              <div>
                <h2 className="font-heading text-3xl font-semibold">
                  Know Before Going for {pkg.title}
                </h2>
                <div className="mt-5 rounded-xl border border-border bg-card p-5">
                  <h3 className="font-heading text-2xl font-semibold">
                    Must Know
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {pkg.mustKnow.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-heading text-2xl font-semibold">
                  Inclusions
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {pkg.inclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-heading text-2xl font-semibold">
                  Exclusions
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {pkg.exclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

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

            {pkg.faqs.length ? (
              <div>
                <h2 className="font-heading text-3xl font-semibold">FAQs</h2>
                <div className="mt-5 space-y-4">
                  {pkg.faqs.map((faq) => (
                    <article key={faq.question} className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-semibold">{faq.question}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </article>
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
