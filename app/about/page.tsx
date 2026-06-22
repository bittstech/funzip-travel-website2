import Image from "next/image"
import { Navbar } from "@/components/funzip/navbar"
import { Footer } from "@/components/funzip/footer"
import { FloatingActions } from "@/components/funzip/floating-actions"
import { getPublishedPackages, getSiteSettings } from "@/lib/cms/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { JsonLd, breadcrumbSchema, organizationSchema } from "@/lib/seo/schema"

export const revalidate = 3600

export async function generateMetadata() {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: "About Funzip Kashmir Tour & Travels",
    description:
      "Funzip Kashmir Tour & Travels is a local Kashmir travel team creating custom packages for families, couples, honeymooners, and adventure travelers.",
    path: "/about",
    image: settings.defaultOgImage,
    settings,
  })
}

export default async function AboutPage() {
  const [settings, packages] = await Promise.all([
    getSiteSettings(),
    getPublishedPackages(),
  ])

  return (
    <main>
      <JsonLd
        data={[
          organizationSchema(settings),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
          ]),
        ]}
      />
      <Navbar />
      <section className="grid min-h-[80svh] items-center gap-10 px-5 pb-16 pt-32 lg:grid-cols-2 lg:px-8">
        <div className="mx-auto max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            About Funzip
          </p>
          <h1 className="mt-3 font-heading text-5xl font-semibold leading-tight">
            Local Kashmir travel specialists for thoughtful, comfortable trips.
          </h1>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Funzip Kashmir Tour & Travels creates handcrafted Kashmir journeys
            with hotels, transport, sightseeing, and practical local support.
            We help you plan a smooth, comfortable trip with clear inclusions,
            reliable guidance, and itineraries shaped around your travel style.
          </p>
        </div>
        <div className="relative mx-auto h-[420px] w-full max-w-xl overflow-hidden rounded-2xl">
          <Image
            src="/images/dal-lake.png"
            alt="Dal Lake in Kashmir"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>
      <Footer settings={settings} packages={packages} />
      <FloatingActions settings={settings} />
    </main>
  )
}
