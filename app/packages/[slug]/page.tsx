import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react"
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
  const whatsapp = settings.whatsappNumber || "910000000000"
  const phone = (settings.phonePrimary || "+91 00000 00000").replace(/\s/g, "")
  const whatsappMessage = encodeURIComponent(
    `Hi Funzip! I'm interested in the "${pkg.title}" package. Can you share the full itinerary and your best price?`,
  )

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

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-black text-white">
        <Image
          src={pkg.coverImage.url}
          alt={pkg.coverImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/45 to-black/40" />
        <div className="relative z-10 mx-auto flex min-h-[72svh] max-w-7xl flex-col justify-end px-4 pb-12 pt-32 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-white/75"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/packages" className="hover:text-white">
              Packages
            </Link>
          </nav>

          <h1 className="mt-4 max-w-4xl font-heading text-4xl font-semibold leading-[1.08] text-balance sm:text-5xl lg:text-6xl">
            {pkg.title}
          </h1>
          <p className="mt-4 max-w-2xl break-words leading-relaxed text-white/85 sm:text-lg">
            {pkg.shortDescription}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold">
            {pkg.duration ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur">
                <Clock className="h-4 w-4 text-primary" />
                {pkg.duration}
              </span>
            ) : null}
            {pkg.location ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur">
                <MapPin className="h-4 w-4 text-primary" />
                {pkg.location}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-lg shadow-primary/30">
              {pkg.priceLabel === "Custom quote"
                ? "Custom quote"
                : `From ${pkg.priceLabel} / person`}
            </span>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:scale-105"
            >
              Get My Custom Quote
            </a>
            <a
              href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" />
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,360px)]">
          <div className="min-w-0 space-y-14">
            {/* Overview */}
            {overviewHtml ? (
              <div className="min-w-0">
                <h2 className="font-heading text-3xl font-semibold">Overview</h2>
                <div
                  className="mt-5 max-w-none overflow-x-auto leading-relaxed text-muted-foreground [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:font-heading [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:my-4 [&_ol]:list-decimal [&_p]:my-3 [&_strong]:font-semibold [&_table]:w-full [&_table]:min-w-[36rem] [&_ul]:my-4 [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: overviewHtml }}
                />
              </div>
            ) : null}

            {/* Day-wise itinerary — front and center */}
            {pkg.itinerary.length > 0 ? (
              <div>
                <h2 className="font-heading text-3xl font-semibold">
                  Day-Wise Itinerary
                </h2>
                <div className="relative mt-6 space-y-8 before:absolute before:inset-y-3 before:left-[19px] before:w-px before:bg-border">
                  {pkg.itinerary.map((day) => (
                    <article key={`day-${day.day}`} className="relative pl-14">
                      <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-semibold text-primary ring-4 ring-background">
                        {day.day}
                      </span>
                      <h3 className="pt-1.5 font-heading text-xl font-semibold leading-snug">
                        {day.title}
                      </h3>
                      {day.description ? (
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {day.description}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Inclusions */}
            {pkg.inclusions.length > 0 ? (
              <div>
                <h2 className="font-heading text-3xl font-semibold">
                  What&apos;s Included
                </h2>
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

            {/* Remaining structured details (exclusions, good-to-know, legacy) */}
            <PackageInfoAccordion pkg={pkg} exclude={["itinerary", "faqs"]} />

            {/* Gallery */}
            {pkg.galleryImages.length ? (
              <div>
                <h2 className="font-heading text-3xl font-semibold">Gallery</h2>
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
                        <p className="font-semibold text-white">{image.alt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* FAQs — visible for travelers and search engines alike */}
            {pkg.faqs.length > 0 ? (
              <div>
                <h2 className="font-heading text-3xl font-semibold">
                  Frequently Asked Questions
                </h2>
                <div className="mt-6 space-y-3">
                  {pkg.faqs.map((faq, index) => (
                    <details
                      key={`${faq.question}-${index}`}
                      className="group rounded-xl border border-border bg-card"
                      open={index === 0}
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                        <span className="min-w-0">{faq.question}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="border-t border-border px-5 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Booking sidebar */}
          <aside className="h-fit min-w-0 space-y-6 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div className="border-b border-border bg-secondary/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Starting from
                </p>
                <p className="mt-1 font-heading text-3xl font-semibold text-primary">
                  {pkg.priceLabel}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  per person · fully customizable
                </p>
              </div>
              <div className="p-5">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {pkg.duration ? (
                    <li className="flex justify-between gap-4 border-b border-border/50 pb-3">
                      <span>Duration</span>
                      <span className="font-medium text-foreground">
                        {pkg.duration}
                      </span>
                    </li>
                  ) : null}
                  {pkg.location ? (
                    <li className="flex justify-between gap-4 border-b border-border/50 pb-3">
                      <span>Route</span>
                      <span className="text-right font-medium text-foreground">
                        {pkg.location}
                      </span>
                    </li>
                  ) : null}
                </ul>

                <ul className="mt-5 space-y-2.5">
                  {[
                    "Planned by native Kashmiri experts",
                    "Direct local price — no middlemen",
                    "24/7 on-trip WhatsApp support",
                  ].map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-xs font-medium text-foreground/80"
                    >
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 grid gap-3">
                  <a
                    href="#contact"
                    className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-transform hover:scale-[1.02]"
                  >
                    Request Callback
                  </a>
                  <a
                    href={`https://wa.me/${whatsapp}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-center text-sm font-semibold transition hover:bg-secondary/50"
                  >
                    <MessageCircle className="h-4 w-4 text-accent" />
                    WhatsApp Now
                  </a>
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-center text-sm font-semibold transition hover:bg-secondary/50"
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    Call Funzip
                  </a>
                </div>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  Free quote within hours · No advance needed to plan
                </p>
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
