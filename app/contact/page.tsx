import { Navbar } from "@/components/funzip/navbar"
import { Contact } from "@/components/funzip/contact"
import { Footer } from "@/components/funzip/footer"
import { FloatingActions } from "@/components/funzip/floating-actions"
import { getPublishedPackages, getSiteSettings } from "@/lib/cms/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { JsonLd, breadcrumbSchema, contactSchema } from "@/lib/seo/schema"

export const revalidate = 3600

export async function generateMetadata() {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: "Contact Funzip Kashmir Tour & Travels",
    description:
      "Contact Funzip to plan Kashmir tour packages, honeymoon trips, family holidays, and custom itineraries.",
    path: "/contact",
    image: settings.defaultOgImage,
    settings,
  })
}

export default async function ContactPage() {
  const [settings, packages] = await Promise.all([
    getSiteSettings(),
    getPublishedPackages(),
  ])

  return (
    <main>
      <JsonLd
        data={[
          contactSchema(settings),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Contact", url: "/contact" },
          ]),
        ]}
      />
      <Navbar />
      <section className="bg-secondary/40 px-4 pb-10 pt-32 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Contact
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold sm:text-5xl">
            Plan Your Kashmir Trip
          </h1>
        </div>
      </section>
      <Contact settings={settings} sourcePage="/contact" />
      <Footer settings={settings} packages={packages} />
      <FloatingActions settings={settings} />
    </main>
  )
}
